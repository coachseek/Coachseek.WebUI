angular.module('businessSetup',
	[
		'businessSetup.controllers',
        'businessSetup.directives',
		'businessSetup.services'
	])
	.config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            .state('businessSetup', {
                abstract: true,
                url: "/business-setup",
                templateUrl: "businessSetup/partials/businessSetup.html",
            })
            .state('businessSetup.locations', {
                url: "/locations",
                views: {
                    "list-item-view": { 
                        templateUrl: "businessSetup/partials/locationsView.html",
                        controller: 'locationsCtrl'
                    }
                }
            })
            .state('businessSetup.coachList', {
                url: "/coach-list",
                views: {
                    "list-item-view": { 
                        templateUrl: "businessSetup/partials/coachesView.html",
                        controller: 'coachesCtrl'
                    }
                }
            })
            .state('businessSetup.services', {
                url: "/services",
                views: {
                    "list-item-view": { 
                        templateUrl: "businessSetup/partials/servicesView.html",
                        controller: "servicesCtrl"
                     }
                }
            }).state('businessSetup.scheduling', {
                url: "/scheduling",
                views: {
                    "list-item-view": { 
                        templateUrl: "businessSetup/partials/schedulingView.html",
                        controller: "schedulingCtrl"
                     }
                }
            });


    }]);