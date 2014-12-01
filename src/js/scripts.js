'use strict';
(function(){
/* Controllers */
angular.module('coachSeekApp.controllers', []);
angular.module('coachSeekApp.directives', [])
	.directive('activityIndicator', function(){
		return {
			replace: true,
			templateUrl: 'coachSeekApp/partials/activityIndicator.html'
		}
	});
/* App Module */
angular.module('coachSeekApp',
  [
    // LIBRARIES
  	'ui.bootstrap',
    'ngRoute',
    'jm.i18next',

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

    $routeProvider.otherwise({redirectTo: '/'});

  }]).config(['$i18nextProvider', function( $i18nextProvider ){

    $i18nextProvider.options = {
        lng: 'en',
        fallbackLng: 'en',
        ns : {
            namespaces : ['coachSeekApp', 'workingHours'],
            defaultNs: 'coachSeekApp'
        },
        resGetPath: 'modules/__ns__/i18n/__lng__/__ns__.json'
        // defaultLoadingValue: ''
    };

  }]);
/* Services */

angular.module('coachSeekApp.services', []).
  factory('coachSeekAPIService', ['$http', '$q', '$timeout', function($http, $q, $timeout) {

    var coachSeekAPI = {};

    var startTime = new Date()
    startTime.setHours(9)
    startTime.setMinutes(0);
    var finishTime = new Date()
    finishTime.setHours(17)
    finishTime.setMinutes(0);		

    coachSeekAPI.getCoaches = function(businessId) {
      // return $http({
      //   method: 'GET', 
      //   url: 'https://api.coachseek.com/api/Coaches',
      //   params: {businessId: '@businessId'}
      // });
		this.deferred = $q.defer();
		var self = this;
		$timeout(function(){
		   self.deferred.resolve({});
		}, _.random(500, 5500));
		return this.deferred.promise;
    };

  //   coachSeekAPI.getCoach = function(businessId, coachId){
  //   	// return $http({
  //   	//   method: 'GET', 
  //   	//   url: 'https://api.coachseek.com/api/Coaches',
  //   	//   params: {businessId: '@businessId', coachId: '@coachId'}
  //   	// });



		// this.deferred = $q.defer();
		// var self = this;
		// $timeout(function(){
		//    self.deferred.resolve({
		// 		businessId: "8786bcd0-3b14-4f7b-92db-198527a5b949",
		// 		id: null,
		// 		firstName: "Koot",
		// 		lastName: "Stains",
		// 		email: "n.h@example.com",
		// 		phone: "021 99 88 77",
		// 		workingHours: {
		// 			monday: { 
		// 				isAvailable: true,
		// 				startTime: startTime,
		// 				finishTime: finishTime
		// 			},
		// 			tuesday: {
		// 				isAvailable: true,
		// 				startTime: startTime,
		// 				finishTime: finishTime
		// 			}, 
		// 			wednesday: {
		// 				isAvailable: true,
		// 				startTime: startTime,
		// 				finishTime: finishTime
		// 			},
		// 			thursday: {
		// 				isAvailable: true,
		// 				startTime: startTime,
		// 				finishTime: finishTime
		// 			},
		// 			friday: {
		// 				isAvailable: true,
		// 				startTime: startTime,
		// 				finishTime: finishTime
		// 			},
		// 			saturday: {
		// 				isAvailable: false,
		// 				startTime: startTime, 
		// 				finishTime: finishTime
		// 			}, 
		// 			sunday: {
		// 				isAvailable: false,
		// 				startTime: startTime, 
		// 				finishTime: finishTime
		// 			}
		// 		}
		// 	});
		// }, _.random(500, 1500));
  // 		return this.deferred.promise;
  //   }

    coachSeekAPI.saveCoach = function(businessId, coachId){
    	// return $http({
    	//   method: 'POST', 
    	//   url: 'https://api.coachseek.com/api/Coaches',
    	//   params: {businessId: '@businessId', coachId: '@coachId'}
    	// });
		var deferred = $q.defer();
		deferred.resolve("DATA");
		return deferred.promise;
    };

    coachSeekAPI.createCoach = function(){
    	// return $http({
    	//   method: 'PUT', 
    	//   url: 'https://api.coachseek.com/api/Coaches',
    	//   params: {businessId: '@businessId'}
    	// });

		var deferred = $q.defer();
  		deferred.resolve({
					businessId: "8786bcd0-3b14-4f7b-92db-198527a5b949",
					id: null,
					firstName: "NEWEST",
					lastName: "USER",
					email: "aaron.smith@example.com",
					phone: "021 99 88 77",
					workingHours: {
						monday: { 
							isAvailable: true,
							startTime: startTime,
							finishTime: finishTime
						},
						tuesday: {
							isAvailable: true,
							startTime: startTime,
							finishTime: finishTime
						}, 
						wednesday: {
							isAvailable: true,
							startTime: startTime,
							finishTime: finishTime
						},
						thursday: {
							isAvailable: true,
							startTime: startTime,
							finishTime: finishTime
						},
						friday: {
							isAvailable: true,
							startTime: startTime,
							finishTime: finishTime
						},
						saturday: {
							isAvailable: false,
							startTime: startTime, 
							finishTime: finishTime
						}, 
						sunday: {
							isAvailable: false,
							startTime: startTime, 
							finishTime: finishTime
						}
					}
				});
  		return deferred.promise;
    };

    return coachSeekAPI;
  }]);
angular.module('locations.controllers', [])
    .controller('locationsCtrl', ['$scope', function(){
    	console.log('LOCATIONS CTRL');
    }]);
angular.module('locations',
	              [
	                'locations.controllers'
	              ])
	.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/registration/locations', {templateUrl: 'locations/partials/locations.html', controller: 'locationsCtrl'});
    }]);
angular.module('workingHours.controllers', [])
    .controller('coachListCtrl', ['$scope', 'coachSeekAPIService', '$location', '$activityIndicator',
    	function ($scope, coachSeekAPIService, $location, $activityIndicator) {

        $scope.editCoach = function(coach){
            $scope.coach = coach;
            $scope.weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        }

        $scope.createCoach = function(){
            $activityIndicator.startAnimating();

            coachSeekAPIService.createCoach().then(function(data){
                $activityIndicator.stopAnimating();

                $scope.coachList.push(data);
                $scope.editCoach(data);
                
            }, function(error){
                throw new Error(error);
            });
        }

        $scope.save = function(coach){
            $activityIndicator.startAnimating();
            $scope.coach = null;

            coachSeekAPIService.saveCoach(coach.coachId).then(function(){
                $activityIndicator.stopAnimating();
            }, function(error){
                throw new Error(error);
            });
        }

    	$activityIndicator.startAnimating();

        coachSeekAPIService.getCoaches().then(function(data){
	    	$activityIndicator.stopAnimating();
	    	//set coach list data or creat first coach
	    	if(data.length){  		
	        	$scope.coachList = data;
	    	} else {
		    	$scope.coachList = [];
	    		$scope.createCoach();
	    	}
        }, function(error){
			throw new Error(error);
        });
    }]);
angular.module('workingHours.directives', [])
	.directive('timeSlot', function(){
		return {
			replace: true,
			templateUrl: 'workingHours/partials/timeSlot.html'
		}
	});
angular.module('workingHours',
	[
		'toggle-switch',
		'workingHours.controllers',
		'workingHours.directives'
	])
	.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/registration/coach-list', {
        	templateUrl: 'workingHours/partials/coachListView.html',
        	controller: 'coachListCtrl'
        });
    }]).constant('timepickerConfig', {
	  hourStep: 1,
	  minuteStep: 15,
	  showMeridian: false
	});
})();