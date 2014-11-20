'use strict';
(function(){
/* Controllers */
angular.module('coachSeekApp.controllers', []);
angular.module('coachSeekApp.directives', []);
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
/* Services */

angular.module('coachSeekApp.services', []).
  factory('coachSeekAPIService', ['$http', function($http) {

    var coachSeekAPI = {};

    coachSeekAPI.getCoaches = function() {
      // return $http({
      //   method: 'GET', 
      //   url: 'https://api.coachseek.com/api/Coaches',
      //   params: {businessId: '@businessId'}
      // });
    };

    coachSeekAPI.getCoach = function(userId){
    	// return $http({
    	//   method: 'GET', 
    	//   url: 'https://api.coachseek.com/api/Coaches',
    	//   params: {businessId: '@businessId', coachId: '@coachId'}
    	// });
    }

    coachSeekAPI.saveCoach = function(){
    	// return $http({
    	//   method: 'POST', 
    	//   url: 'https://api.coachseek.com/api/Coaches',
    	//   params: {businessId: '@businessId', coachId: '@coachId'}
    	// });
    };

    coachSeekAPI.createCoach = function(){
    	// return $http({
    	//   method: 'PUT', 
    	//   url: 'https://api.coachseek.com/api/Coaches',
    	//   params: {businessId: '@businessId', coachId: '@coachId'}
    	// });
    };

    return coachSeekAPI;
  }]);
angular.module('workingHours.controllers', [])
    .controller('coachListCtrl', ['$scope', 'coachSeekAPIService', '$location',
    	function ($scope, coachSeekAPIService, $location) {

        coachSeekAPIService.getCoaches().success(function(data){
        	$scope.coachList = data;
        }).error(function(error){
			//log error
        });

        $scope.editCoach = function(coach){
        	$location.path('registration/coach-list/' + coach.bussinessId + '/' + coach.id);
        }

        $scope.createCoach = function(){
        	var data = 'new3123';
    		// var newCoach = coachSeekAPIService.createCoach().success(function(data){
	        	$location.path('registration/coach-list/' + data);
    		// }).error(function(error){
				//log error
    		// });
        }
    }]).controller('coachEditCtrl', ['$scope', 'coachSeekAPIService', '$location', '$routeParams',
    	function($scope, coachSeekAPIService, $location, $routeParams){

    	coachSeekAPIService.getCoach($routeParams.coachId).success(function(data){
    		$scope.coach = data;
    	}).error(function(error){
			//log error
        });

    	// need in order to keep days in order
    	$scope.weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    	$scope.save = function(coach){
    		// coachSeekAPIService.saveCoach(coach.coachId).success().error();
    		$location.path('registration/coach-list/' + coach.businessId);
    	}
    }]);
angular.module('workingHours.directives', [])
	.directive('timeSlot', function(){
		return {
			replace: true,
			templateUrl: 'workingHours/partials/timeSlot.html'
		}
	}).directive('coachListNav', function(){
		return {
			replace: false,
			templateUrl: 'workingHours/partials/coachListNav.html'
		}		
	});
angular.module('workingHours',
	              [
	              	'toggle-switch',
	                'workingHours.controllers',
	                'workingHours.directives',
	              ])
	.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/registration/coach-list/:businessId', {templateUrl: 'workingHours/partials/coachListView.html', controller: 'coachListCtrl'});
        $routeProvider.when('/registration/coach-list/:businessId/:id', {templateUrl: 'workingHours/partials/coachEditView.html', controller: 'coachEditCtrl'});
    }]);
})();