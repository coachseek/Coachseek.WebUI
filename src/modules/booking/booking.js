angular.module('booking',
    [
        'booking.controllers'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('booking', {
                url: "/booking",
                templateUrl: "booking/partials/bookingView.html",
                controller: 'bookingCtrl',
                data: {
                    requireLogin: true
                }
            })
            .state('register', {
              url: "/booking/register",
              templateUrl: "booking/partials/customerView.html",
              controller: "registerCtrl",
              data: {
                requireLogin: true
              }
            });
    }]);
