angular.module('workingHours',
	              [
	              	'toggle-switch',
	                'workingHours.controllers',
	                'workingHours.directives',
	              ])
	.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/registration/coach-list/:businessId', {templateUrl: 'workingHours/partials/coachListView.html', controller: 'coachListCtrl'});
        $routeProvider.when('/registration/coach-list/:businessId/:id', {templateUrl: 'workingHours/partials/coachEditView.html', controller: 'coachEditCtrl'});
    }]).constant('timepickerConfig', {
	  hourStep: 1,
	  minuteStep: 15,
	  showMeridian: false
	});