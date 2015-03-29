angular.module('booking',
    [
        'booking.controllers',
        'booking.directives',
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
            });
    }]);
