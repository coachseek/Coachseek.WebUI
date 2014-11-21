angular.module('workingHours.directives', [])
	.directive('timeSlot', function(){
		return {
			replace: true,
			templateUrl: 'workingHours/partials/timeSlot.html'
		}
	});