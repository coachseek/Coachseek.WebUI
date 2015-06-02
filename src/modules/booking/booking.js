angular.module('booking', [
        'booking.controllers',
        'booking.directives',
        'booking.services'
    ])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state('bookingAdmin', {
                url: "/booking-admin",
                templateUrl: "booking/partials/bookingAdminView.html",
                controller: 'bookingAdminCtrl',
                data: {
                    requireLogin: true
                }
            })
            .state('booking', {
                url: "/booking",
                abstract: true,
                templateUrl: "booking/partials/booking.html",
                controller: 'bookingCtrl'
            })
            .state('booking.selection', {
                url: "/selection",
                views: {
                    "booking-view": { 
                        templateUrl: "booking/partials/bookingSelectionView.html",
                        controller: 'bookingSelectionCtrl'
                    }
                },
                data: {
                    requireLogin: false,
                    requireBusinessDomain: true
                }
            })
            .state('booking.details', {
                url: "/details",
                views: {
                    "booking-view": { 
                        templateUrl: "booking/partials/bookingCustomerDetailsView.html",
                        controller: 'bookingCustomerDetailsCtrl'
                    }
                },
                data: {
                    requireLogin: false,
                    requireBusinessDomain: true
                }
            })
            .state('booking.payment', {
                url: "/payment",
                views: {
                    "booking-view": { 
                        templateUrl: "booking/partials/bookingPaymentView.html",
                        controller: 'bookingPaymentCtrl'
                    }
                },
                data: {
                    requireLogin: false,
                    requireBusinessDomain: true
                }
            })
            .state('booking.confirmation', {
                url: "/confirmation",
                views: {
                    "booking-view": { 
                        templateUrl: "booking/partials/bookingConfirmationView.html",
                        controller: 'bookingConfirmationCtrl'
                    }
                },
                data: {
                    requireLogin: false,
                    requireBusinessDomain: true
                }
            });
    }]);