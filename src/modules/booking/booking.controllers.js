angular
.module('booking.controllers', [])
.controller('bookingCtrl', ['$scope', '$location', '$q', '$state', 'coachSeekAPIService',
function ($scope, $location, $q, $state, coachSeekAPIService) {
  var savedCustomer = localStorage.getItem('customer');
  $state.go('booking.course');
  $scope.booking = {
    customer: savedCustomer ? JSON.parse(savedCustomer) : null,
    sessions: [],
    enquiry: false
  };

  $scope.course = null;

  $scope.filters = {
    location: "",
    service: ""
  };

  $q.all({
    locations: coachSeekAPIService.get({section: 'Locations'}).$promise,
    services: coachSeekAPIService.get({section: 'Services'}).$promise
  })
  .then(function (response) {
    $scope.locations = response.locations;
    if (response.locations.length === 1) {
      $scope.filters.location = response.locations[0].id;
    }

    $scope.services  = response.services;
    if (response.services.length === 1) {
      $scope.filters.service = response.services[0].id;
    }
  },function (error) {
    $scope.handleErrors(error);
  });

  var filterSessions = function (filters) {
    var params = {
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().add(12, 'week').format('YYYY-MM-DD'),
      locationId: filters.location || undefined,
      serviceId: filters.service || undefined,
      section: 'Sessions'
    };

    return coachSeekAPIService.get(params).$promise;
  };

  $scope.filterSessions = function (filters) {
    $scope.booking.enquiry = false;
    filterSessions(filters).then(function (sessions) {
      var courses = _.groupBy(sessions, function (session) {
        return session.parentId;
      });

      $scope.courses = Object.keys(courses).map(function (parentId) {
        var course = courses[parentId][0];
        return {
          id: parentId,
          name: course.service.name,
          duration: course.timing.duration,
          location: course.location.name,
          color: course.presentation.colour,
          sessions: courses[parentId]
        };
      });
    });
  };

  $scope.selectCourse = function (course) {
    $scope.course = course;
    $state.go('booking.session');
  };

  $scope.bookCourse = function (course) {
    course.type = 'course';
    $scope.booking.sessions = [course];
    if ($scope.booking.customer) {
      $state.go('booking.confirm');
    } else {
      $state.go('booking.register');
    }
  };

  $scope.bookSessions = function (sessions) {
    $scope.booking.sessions = sessions
      .filter(function (session) { return session.selected === true; })
      .map(function (session) {
        session.type = 'session';
        return session;
      });

    if ($scope.booking.customer) {
      $state.go('booking.confirm');
    } else {
      $state.go('booking.register');
    }
  };

  $scope.selectEnquiry = function ($event) {
    $event.preventDefault();
    $scope.booking.enquiry = true;
    $scope.booking.sessions = [];
    $state.go('booking.register');
  }

  $scope.cancel = function () {
    $scope.booking.sessions = [];
    $scope.booking.enquiry = false;
    $scope.course = null;
    $scope.filterSessions($scope.filters);
    $state.go('booking.course');
  };

  $scope.confirmBooking = function (booking) {
    coachSeekAPIService
      .update({ section: 'Customers' }, booking.customer).$promise
      .then(function (customer) {
        if (booking.customer.remember === true) {
          localStorage.setItem('customer', JSON.stringify(customer));
        }

        var bookingList = booking.sessions
          .map(function (session) { return { id: session.id }; })
          .forEach(function (session) {
            var data = {
              customer: customer,
              session: session
            };

            return coachSeekAPIService.update({ section: 'Bookings' }, data).$promise;
          });

        $q.all(bookingList).then(function (booking) {
          console.log('your booking has been taken into consideration...');
          console.log(booking);
        });
      });
  };

  $scope.register = function (customer) {

    $state.go('booking.confirm');
  };
}]);
