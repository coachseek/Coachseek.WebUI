angular
.module('booking', [ 'booking.controllers' ])
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('booking', {
    url: "/booking",
    templateUrl: "booking/partials/layout.html",
    controller: 'bookingCtrl',
    data: {
      requireLogin: true
    }
  })
  .state('booking.location', {
    url: "/location",
    templateUrl: "booking/partials/booking.location.view.html",
    data: {
      requireLogin: true
    }
  })
  .state('booking.services', {
    url: "/services",
    templateUrl: "booking/partials/booking.services.view.html",
    data: {
      requireLogin: true
    }
  })
  .state('booking.details', {
    url: "/details",
    templateUrl: "booking/partials/booking.details.view.html",
    data: {
      requireLogin: true
    }
  })
  .state('booking.confirmation', {
    url: "/confirmation",
    templateUrl: "booking/partials/booking.confirmation.view.html",
    data: {
      requireLogin: true
    }
  });

  $urlRouterProvider.otherwise('/booking/session');
}]);
