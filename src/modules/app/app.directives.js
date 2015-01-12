angular.module('app.directives', [])
	.directive('activityIndicator', function(){
		return {
			replace: true,
			templateUrl: 'app/partials/activityIndicator.html'
		};
	})
	.directive('ngEnter', function(){
		return function (scope, element, attrs) {
		    element.on("keydown keypress", function (event) {
		        if(event.which === 13) {
		            scope.$apply(function (){
		                scope.$eval(attrs.ngEnter);
		            });
		            event.preventDefault();
		        }
		    });
		};
	});