angular.module('workingHours',
	[
		'toggle-switch',
		'workingHours.controllers',
		'workingHours.directives'
	])
	.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/registration/coach-list', {
        	templateUrl: 'workingHours/partials/coachListView.html',
        	controller: 'coachListCtrl'
        });
    }]).constant('timepickerConfig', {
	  hourStep: 1,
	  minuteStep: 15,
	  showMeridian: false
	});