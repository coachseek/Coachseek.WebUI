/* Services */

angular.module('app.services', []).
  factory('coachSeekAPIService', ['$rootScope', '$resource', function($rootScope, $resource) {

    return $resource('http://coachseek-api.azurewebsites.net/api/:section', {}, {
        get: { method: 'GET', isArray: true},
        update: {method: 'POST'}
    });
}]);