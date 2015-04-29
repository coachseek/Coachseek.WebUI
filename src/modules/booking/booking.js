angular
.module('booking', [ 'booking.controllers' ])
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('booking', {
        url: "/booking",
        templateUrl: "booking/partials/booking.html",
        controller: 'bookingCtrl',
        data: {
            requireLogin: true
        }
    })
    .state('booking.location', {
        url: "/location",
        templateUrl: "booking/partials/bookingLocationView.html",
        data: {
            requireLogin: true
        }
    })
    .state('booking.services', {
        url: "/services",
        templateUrl: "booking/partials/bookingServicesView.html",
        data: {
            requireLogin: true
        }
    })
    .state('booking.details', {
        url: "/details",
        templateUrl: "booking/partials/bookingDetailsView.html",
        data: {
            requireLogin: true
        }
    })
    .state('booking.confirmation', {
        url: "/confirmation",
        templateUrl: "booking/partials/bookingConfirmationView.html",
        data: {
            requireLogin: true
        }
    });

    $urlRouterProvider.otherwise('/booking/session');
}]);
