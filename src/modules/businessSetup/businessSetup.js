angular.module('businessSetup',
	[
		'businessSetup.controllers',
		'businessSetup.directives',

        'toggle-switch'
	])
	.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/business-setup/coach-list', {
        	templateUrl: 'businessSetup/partials/coachListView.html',
        	controller: 'coachListCtrl'
        }).when('/business-setup/coach-services', {
            templateUrl: 'businessSetup/partials/coachServices.html',
            controller: 'coachServicesCtrl'
        }).when('/business-setup/locations', {
            templateUrl: 'businessSetup/partials/locations.html',
            controller: 'locationsCtrl'
        });
    }]).constant('timepickerConfig', {
        hourStep: 1,
        minuteStep: 15,
        showMeridian: false
	});