/* Services */

angular.module('app.services', []).
  factory('coachSeekAPIService', ['$rootScope', '$resource', function($rootScope, $resource) {

    return $resource('http://coachseek-api.azurewebsites.net/api/:section', {}, {
        get: { method: 'GET', isArray: true, headers: $rootScope.basicAuth ? $rootScope.basicAuth : 'Basic bmljZUBiaXouY29tOm5ld3BsYWNl'},
        update: {method: 'POST', headers: $rootScope.basicAuth ? $rootScope.basicAuth : 'Basic bmljZUBiaXouY29tOm5ld3BsYWNl'}
    });
}]);