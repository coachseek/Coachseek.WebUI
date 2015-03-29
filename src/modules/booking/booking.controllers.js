angular.module('booking.controllers', [])
  .controller('bookingCtrl', ['$scope', '$location', '$q', 'coachSeekAPIService', function ($scope, $location, $q, coachSeekAPIService) {

    var savedCustomer = localStorage.getItem('customer');

    $scope.booking = {
      session: null,
      customer: savedCustomer ? JSON.parse(savedCustomer) : null,
      enquiry: null
    };

    $scope.step = 'select';
    $scope.navigate = {
      to: function (step) {
        var whiteList = ['select', 'booking', 'enquiry', 'register', 'confirm'];

        if (!_.contains(whiteList, step)) {
          throw new Error(step + ' is not a valid step.');
        }

        $scope.step = step;
      },
      back: function () {
        if (_.contains(['booking', 'enquiry'], $scope.step)) {
          return $scope.step = 'select';
        }

        if ($scope.step === 'register') {
          if ($scope.booking.session !== null) {
            return $scope.step = 'booking';
          }

          return $scope.step = 'enquiry';
        }

        if ($scope.step === 'confirm') {
          $scope.step = 'select';
        }
      },
      forward: function () {
        if (_.contains(['booking', 'enquiry'], $scope.step)) {
          if ($scope.booking.customer !== null) {
            return $scope.step = 'confirm';
          }

          return $scope.step = 'register';
        }

        if ($scope.step === 'register') {
          return $scope.step = 'confirm';
        }
      }
    };

    var startBookingLoading = function(){
        if(!$scope.bookingLoading){
            $scope.bookingLoading = true;
        }
    };

    var stopBookingLoading = function(view, $element){
        $scope.bookingLoading = false;
    };

    var filterSessions = function () {
      var params = {
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment().add(1, 'month').format('YYYY-MM-DD'),
        locationId: $scope.location || undefined,
        serviceId: $scope.service || undefined,
        section: 'Sessions'
      };

      return coachSeekAPIService.get(params).$promise;
    };

    $scope.filterSessions = function () {
      filterSessions().then(function (sessions) {
        $scope.sessions = sessions;
      });
    };

    startBookingLoading();
    $q.all({
            locations: coachSeekAPIService.get({section: 'Locations'}).$promise,
            services: coachSeekAPIService.get({section: 'Services'}).$promise,
            sessions: filterSessions()
        })
        .then(function(response) {
            $scope.locations = response.locations;
            $scope.services  = response.services;
            $scope.sessions = response.sessions;
        },function(error){
            $scope.handleErrors(error);
            stopBookingLoading();
        });
  }])
  .controller('registerCtrl', ['$scope', '$location', '$q', 'coachSeekAPIService', function ($scope, $location, $q, coachSeekAPIService) {
    $scope.cancel = function () {
      $location.path('/booking');
    };


  }]);
