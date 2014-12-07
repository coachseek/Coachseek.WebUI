angular.module('app.directives', [])
	.directive('activityIndicator', function(){
		return {
			replace: true,
			templateUrl: 'app/partials/activityIndicator.html'
		}
	});