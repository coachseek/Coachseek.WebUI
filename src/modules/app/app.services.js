angular.module('app.services', []).
  factory('coachSeekAPIService', ['$resource', function($resource) {
    return $resource('http://coachseek-api.azurewebsites.net/api/:section', {}, {
        get: { method: 'GET', isArray: true},
        update: {method: 'POST'}
    });
}]);