angular.module('businessSetup',
    [
        'businessSetup.controllers',
        'businessSetup.directives'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('newUserSetup', {
                url: "/new-user-setup",
                templateUrl: "businessSetup/partials/businessRegistrationView.html",
                controller: 'businessRegistrationCtrl',
                data: {
                    requireLogin: false,
                    sessionType: 'app'
                }
            })
            .state('businessSetup', {
                url: "/business-setup",
                templateUrl: "businessSetup/partials/businessSetup.html"
            })
            .state('businessSetup.business', {
                url: "/business",
                views: {
                    "list-item-view": { 
                        templateUrl: "businessSetup/partials/businessView.html",
                        controller: 'businessCtrl'
                    }
                },
                data: {
                    requireLogin: true,
                    sessionType: 'app'
                }
            })
            .state('businessSetup.locations', {
                url: "/locations",
                views: {
                    "list-item-view": { 
                        templateUrl: "businessSetup/partials/locationsView.html",
                        controller: 'locationsCtrl'
                    }
                },
                data: {
                    requireLogin: true,
                    sessionType: 'app'
                }
            })
            .state('businessSetup.coachList', {
                url: "/coach-list",
                views: {
                    "list-item-view": { 
                        templateUrl: "businessSetup/partials/coachesView.html",
                        controller: 'coachesCtrl'
                    }
                },
                data: {
                    requireLogin: true,
                    sessionType: 'app'
                }
            })
            .state('businessSetup.services', {
                url: "/services",
                views: {
                    "list-item-view": { 
                        templateUrl: "businessSetup/partials/servicesView.html",
                        controller: "servicesCtrl"
                     }
                },
                data: {
                    requireLogin: true,
                    sessionType: 'app'
                }
            })
            .state('businessSetup.services.newItem', {
                url: "/new-item",
                data: {
                    newService: true,
                    requireLogin: true,
                    sessionType: 'app'
                },
                views: {
                    "list-item-view": { 
                        templateUrl: "businessSetup/partials/servicesView.html",
                        controller: "servicesCtrl"
                     }
                }
            });
    }]);