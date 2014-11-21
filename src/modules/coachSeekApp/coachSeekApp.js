/* App Module */
angular.module('coachSeekApp',
  [
    // LIBRARIES
  	'ui.bootstrap',
    'ngRoute',

    // coachSeekApp
    'coachSeekApp.controllers', 
    'coachSeekApp.services',
    'coachSeekApp.directives',

    // MODULES
    'workingHours',
    'locations',

    // UTILITIES
    'ngActivityIndicator'
  ]).config(['$routeProvider', function ($routeProvider){
    $routeProvider.otherwise({redirectTo: '/registration/coach-list'});
  }]);