angular.module('booking.controllers', [])
  .controller('bookingCtrl', ['$scope', '$location', '$q', 'coachSeekAPIService', function ($scope, $location, $q, coachSeekAPIService) {

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

    $scope.selectSession = function (session) {
      $location.path('/booking/register');
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
