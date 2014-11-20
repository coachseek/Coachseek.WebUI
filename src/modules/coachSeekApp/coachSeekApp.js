/* App Module */
angular.module('coachSeekApp',
                          [
                            'ngRoute',
                            'coachSeekApp.controllers', 
                            'coachSeekApp.services',
                            'coachSeekApp.directives',
                            'workingHours'
                          ]).config(['$routeProvider', function ($routeProvider){
					        $routeProvider.otherwise({redirectTo: '/'});
                          }]);