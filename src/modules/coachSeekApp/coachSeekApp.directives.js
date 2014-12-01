angular.module('coachSeekApp.directives', [])
	.directive('activityIndicator', function(){
		return {
			replace: true,
			templateUrl: 'coachSeekApp/partials/activityIndicator.html'
		}
	});