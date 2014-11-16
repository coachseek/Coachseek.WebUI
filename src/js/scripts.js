'use strict';

/* App Module */

(function(){

var app = angular.module('coachSeekApp', ['ngRoute', 'coachSeekControllers', 'coachSeekDirectives']);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/business-registration.html',
        controller: 'BusinessRegCtrl'
      }).
      when('/business/registration', {
        templateUrl: 'partials/business-registration.html',
        controller: 'BusinessRegCtrl'
      }).
      when('/:domain/business/locations', {
          templateUrl: 'partials/business-locations.html',
        controller: 'LocationCtrl'
      }).
      when('/:domain/business/coaches', {
          templateUrl: 'partials/business-coaches.html',
          controller: 'CoachCtrl'
      }).
      otherwise({
        redirectTo: '/business'
      });
      
    // use the HTML5 History API
		//$locationProvider.html5Mode(true);
  }]);

// app.run(function (editableOptions) {
//     editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
// });

})();

'use strict';

/* Controllers */

(function(){

var coachSeekControllers = angular.module('coachSeekControllers', []);


coachSeekControllers.controller('BusinessRegCtrl', ['$scope', '$http', '$location', '$rootScope', function ($scope, $http, $location, $rootScope) {

}]);


coachSeekControllers.controller('LocationCtrl', ['$scope', '$filter', '$http', '$rootScope', '$routeParams', function ($scope, $filter, $http, $rootScope, $routeParams) {

}]);

})();
'use strict';

/* Directives */

(function(){


})();