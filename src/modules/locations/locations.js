angular.module('locations',
	              [
	                'locations.controllers'
	              ])
	.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/registration/locations', {templateUrl: 'locations/partials/locations.html', controller: 'locationsCtrl'});
    }]);