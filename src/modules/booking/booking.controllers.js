angular
.module('booking.controllers', [])
.controller('bookingCtrl', ['$scope', '$location', '$q', '$state', 'coachSeekAPIService',
function ($scope, $location, $q, $state, coachSeekAPIService) {
  var savedCustomer = localStorage.getItem('customer');

  $state.go('booking.location');
  $scope.booking = {
    customer: savedCustomer ? JSON.parse(savedCustomer) : null,
    sessions: [],
    enquiry: false
  };

  $scope.filters = {
    location: "",
    service: "",
    course: null
  };

  $scope.selectLocation = function () {
    $state.go('booking.services');
  };

  $scope.selectService = function () {
    $scope.serviceDescription = _($scope.services)
    .find(function (service) {
      return service.id === $scope.filters.service;
    })['description'];

    $scope.filterSessions();
  };

  $scope.selectCourse = function (course) {
    $scope.filters.course = course;
  };

  $scope.selectSession = function (session) {
    session.selected = !session.selected;
    if (session.selected) {
      $scope.booking.sessions.push(session.id);
    } else {
      $scope.booking.sessions = _.without($scope.booking.sessions, session.id);
    }
  };

  $scope.selectFullCourse = function (course) {
    course.selected = !course.selected;
    if (course.selected) {
      $scope.booking.sessions = [course.id];
    } else {
      $scope.booking.sessions = [];
    }
  };

  $scope.backToLocation = function ($event) {
    $event.preventDefault();

    $scope.filters.service = '';
    $scope.filters.course = null;

    $state.go('booking.location');
  };

  $scope.bookSessions = function () {
    $scope.booking.sessions = $scope.filters.course.sessions.filter(function (session) {
      return session.selected === true;
    });

    $state.go('booking.details');
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

  $scope.filterSessions = function () {
    $scope.booking.enquiry = false;
    $scope.filters.course = null;
    $scope.courses = [];
    filterSessions($scope.filters).then(function (sessions) {
      var courses = _.groupBy(sessions, function (session) {
        return session.parentId || session.id;
      });

      $scope.courses = Object.keys(courses).map(function (parentId) {
        var course = courses[parentId][0];
        return {
          id: parentId,
          selected: false,
          type: courses[parentId].length === 1 ? 'single-session' : 'multi-session',
          name: course.service.name,
          duration: course.timing.duration,
          location: course.location.name,
          color: course.presentation.colour,
          sessions: courses[parentId].map(function (session) {
            var current = session;
            current.selected = false;
            current.timing.date = moment(current.timing.startDate, 'YYYY-MM-DD').format('dddd Do MMMM'),
            current.timing.hour = {
              start: moment(current.timing.startTime, "HH:mm").format('HH:mm a'),
              end: moment(current.timing.startTime, "HH:mm").add(current.timing.duration, 'minutes').format('HH:mm a')
            };

            return current;
          })
        };
      });
    });
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
