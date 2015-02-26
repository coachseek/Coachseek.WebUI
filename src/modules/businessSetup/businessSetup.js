angular.module('businessSetup',
	[
		'businessSetup.controllers',
        'businessSetup.directives',
		'businessSetup.services'
	])
	.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
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
                    requireLogin: true
                }
            })
            .state('businessSetup.business.newUser', {
                url: "/new-user",
                views: {
                    "list-item-view": { 
                        templateUrl: "businessSetup/partials/businessView.html",
                        controller: 'businessCtrl'
                    }
                },
                data: {
                    requireLogin: false
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
                    requireLogin: true
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
                    requireLogin: true
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
                    requireLogin: true
                }
            })
            .state('businessSetup.services.newItem', {
                url: "/new-item",
                data: {
                    newService: true,
                    requireLogin: true
                },
                views: {
                    "list-item-view": { 
                        templateUrl: "businessSetup/partials/servicesView.html",
                        controller: "servicesCtrl"
                     }
                }
            });
    }]);