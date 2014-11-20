angular.module('workingHours.directives', [])
	.directive('timeSlot', function(){
		return {
			replace: true,
			templateUrl: 'workingHours/partials/timeSlot.html'
		}
	}).directive('coachListNav', function(){
		return {
			replace: false,
			templateUrl: 'workingHours/partials/coachListNav.html'
		}		
	});