angular.module('businessSetup',
	[
		'businessSetup.controllers',
		'businessSetup.directives',

        'toggle-switch'
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
            });


    }]).constant('timepickerConfig', {
        hourStep: 1,
        minuteStep: 15,
        showMeridian: false
	});