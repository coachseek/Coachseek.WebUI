angular.module('booking', [ 'booking.controllers' ])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state('booking', {
                url: "/booking",
                templateUrl: "booking/partials/booking.html",
                controller: 'bookingCtrl'
            })
            .state('booking.location', {
                url: "/location",
                views: {
                    "list-item-view": { 
                        templateUrl: "booking/partials/bookingLocationView.html",
                        controller: 'bookingLocationCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            })
            .state('booking.services', {
                url: "/services",
                views: {
                    "list-item-view": { 
                        templateUrl: "booking/partials/bookingServicesView.html",
                        controller: 'bookingServicesCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            })
            .state('booking.details', {
                url: "/details",
                views: {
                    "list-item-view": { 
                        templateUrl: "booking/partials/bookingDetailsView.html",
                        controller: 'bookingDetailsCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            })
            .state('booking.payment', {
                url: "/payment",
                views: {
                    "list-item-view": { 
                        templateUrl: "booking/partials/bookingPaymentView.html",
                        controller: 'bookingPaymentCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            })
            .state('booking.confirmation', {
                url: "/confirmation",
                views: {
                    "list-item-view": { 
                        templateUrl: "booking/partials/bookingConfirmationView.html",
                        controller: 'bookingConfirmationCtrl'
                    }
                },
                data: {
                    requireLogin: true
                }
            });
    }]);