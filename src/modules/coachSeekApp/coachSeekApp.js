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
    'locations'
  ]).config(['$routeProvider', function ($routeProvider){
    $routeProvider.otherwise({redirectTo: '/'});
  }]);