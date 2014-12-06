'use strict';
(function(){
/* Controllers */
angular.module('coachSeekApp.controllers', [])
    .controller('appCtrl', ['$rootScope',
        function ($rootScope) {
            //TODO add ability to remove alerts by view
            $rootScope.addAlert = function(alert){
                var addAlert = true;;

                _.forEach($rootScope.alerts, function(existingAlert){
                    if(existingAlert.message === alert.message){
                        return addAlert = false;
                    }
                });

                if( addAlert ){
                    $rootScope.alerts.push(alert);
                }
            }
            
            $rootScope.closeAlert = function(index) {
                $rootScope.alerts.splice(index, 1);
            }

            $rootScope.removeAlerts = function(alerts){
                $rootScope.alerts = [];
            }
        }]);
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
    'coachServices',

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

    }]).run(['$rootScope', function($rootScope){
        $rootScope.alerts = [];
    }]);
/* Services */

angular.module('coachSeekApp.services', []).
  factory('coachSeekAPIService', ['$http', '$q', '$timeout', function($http, $q, $timeout) {

    var coachSeekAPI = {};
    
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
		}, _.random(500, 1500));
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
							startTime: "9:00",
							finishTime: "17:00"
						},
						tuesday: {
							isAvailable: true,
                            startTime: "9:00",
                            finishTime: "17:00"

						}, 
						wednesday: {
							isAvailable: true,
                            startTime: "9:00",
                            finishTime: "17:00"

						},
						thursday: {
							isAvailable: true,
                            startTime: "9:00",
                            finishTime: "17:00"

						},
						friday: {
							isAvailable: true,
                            startTime: "9:00",
                            finishTime: "17:00"

						},
						saturday: {
							isAvailable: false,
                            startTime: "9:00",
                            finishTime: "17:00"

						}, 
						sunday: {
							isAvailable: false,
                            startTime: "9:00",
                            finishTime: "17:00"

						}
					}
				});
  		return deferred.promise;
    };

    return coachSeekAPI;
  }]);
angular.module('coachServices',[])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/registration/coach-services', {
            templateUrl: 'coachServices/partials/coachServices.html'
            // controller: 'coachServicesCtrl'
        });
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
        var coachCopy;
        $scope.editCoach = function(coach){
            _.pull($scope.coachList, coach);
            coachCopy = angular.copy(coach);

            $scope.coach = coach;
            $scope.weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        }

        $scope.createCoach = function(){
            $activityIndicator.startAnimating();

            coachSeekAPIService.createCoach().then(function(data){
                $activityIndicator.stopAnimating();

                $scope.newCoach = true;
                $scope.editCoach(data);
            }, function(error){
                throw new Error(error);
            });
        }

        $scope.cancelEdit = function(){
            if(!$scope.newCoach){
                $scope.coachList.push(coachCopy);
            }
            resetToCoachList();
        }

        var resetToCoachList = function(){
            $scope.coach = null;
            $scope.removeAlerts();
            $scope.newCoach = null;
            coachCopy = null;
        }

        $scope.saveCoach = function(coach){
            var formValid = validateForm();
            if( formValid ) {
                $activityIndicator.startAnimating();
                coachSeekAPIService.saveCoach(coach.coachId).then(function(){
                    $scope.coachList.push(coach);

                    resetToCoachList();

                    $activityIndicator.stopAnimating();
                }, function(error){
                    throw new Error(error);
                });
            }
        }

        var validateForm = function(){
            var valid = $scope.newCoachForm.$valid;
            if(!valid){
                var errors = $scope.newCoachForm.$error
                _.each(errors, function(error){
                    $scope.addAlert({
                        type: 'warning',
                        message: 'workingHours:' + error[0].$name + '-invalid'
                    });
                })
            } else {
                valid = checkDuplicateNames(valid);
            }
            return valid;
        }

        var checkDuplicateNames = function(valid){
            _.forEach($scope.coachList, function(coach){
                if($scope.coach.firstName === coach.firstName
                     && $scope.coach.lastName === coach.lastName){

                    $scope.addAlert({
                        type: 'warning',
                        message: 'workingHours:name-already-exists'
                    });
                    // using return here to exit forEach early
                    return valid = false;
                }
            });
            return valid
        }

        $scope.navigateToServices = function(){
            if(!$scope.coachList || $scope.coachList.length <= 0){
                //show bootstrap message
                $scope.addAlert({
                    type: 'warning',
                    message: 'workingHours:add-coach-warning'
                });
            } else {
                $location.path('/registration/coach-services');
            }
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
	}).directive('timePicker', function(){
        return {
            replace: true,
            templateUrl: 'workingHours/partials/timePicker.html',
            scope: {
                time: "="
            },
            link: function (scope, elem, attr) {

                scope.time = scope.time ? scope.time : "0:00";

                var timeArray = scope.time.split(":");
                scope.hours = parseFloat(timeArray[0]);
                scope.minutes = parseFloat(timeArray[1]);
     
                /* Increases hours by one */
                scope.increaseHours = function () {

                    //Check whether hours have reached max
                    if (scope.hours < 23) {
                        scope.hours = ++scope.hours;
                    }
                    else {
                        scope.hours = 0;
                    }

                    setTime();
                }
     
                /* Decreases hours by one */
                scope.decreaseHours = function () {
     
                    //Check whether hours have reached min
                    scope.hours = scope.hours <= 0 ? 23 : --scope.hours;

                    setTime();
                }
     
                /* Increases minutes by 15 */
                scope.increaseMinutes = function () {
     
                    //Check whether to reset
                    if (scope.minutes >= 45) {
                        scope.minutes = 0;
                        scope.increaseHours();
                    }
                    else {
                        scope.minutes = scope.minutes + 15;
                    }
                    setTime();
                }
     
                /* Decreases minutes by 15 */
                scope.decreaseMinutes = function () {
     
                    //Check whether to reset
                    if (scope.minutes <= 0) {
                        scope.minutes = 45;
                        scope.decreaseHours();
                    }
                    else {
                        scope.minutes = scope.minutes - 15;
                    }
                    setTime();
                }

                /* Displays minutes */
                var displayMinutes = function () {
                    return scope.minutes <= 9 ? "0" + scope.minutes : scope.minutes;
                }

                var setTime = function(){
                    var minutesString = displayMinutes();

                    scope.time = scope.hours + ":" + minutesString;
                }
            }
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