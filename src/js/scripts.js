'use strict';
(function(){
/* Controllers */
angular.module('app.controllers', [])
    .controller('appCtrl', ['$rootScope',
        function ($rootScope) {
            //TODO add ability to remove alerts by view
            $rootScope.addAlert = function(alert){
                var addAlert = true;

                _.forEach($rootScope.alerts, function(existingAlert){
                    if(existingAlert.message === alert.message){
                        addAlert = false;
                        return addAlert;
                    }
                });

                if( addAlert ){
                    $rootScope.alerts.push(alert);
                }
            };
            
            $rootScope.closeAlert = function(index) {
                $rootScope.alerts.splice(index, 1);
            };

            $rootScope.removeAlerts = function(alerts){
                $rootScope.alerts = [];
            };
        }]);
angular.module('app.directives', [])
	.directive('activityIndicator', function(){
		return {
			replace: true,
			templateUrl: 'app/partials/activityIndicator.html'
		};
	});
/* App Module */
angular.module('app',
  [
    // LIBRARIES
  	'ui.bootstrap',
    'ui.router',
    'jm.i18next',
    'xeditable',

    // coachSeekApp
    'app.controllers', 
    'app.services',
    'app.directives',

    // MODULES
    'businessSetup',

    // UTILITIES
    'ngActivityIndicator'

  ]).config(['$stateProvider', function ($stateProvider){
    $stateProvider.state('home', { url: "/" });
  }]).config(['$i18nextProvider', function( $i18nextProvider ){

    $i18nextProvider.options = {
        lng: 'en',
        fallbackLng: 'en',
        ns : {
            namespaces : ['app', 'businessSetup'],
            defaultNs: 'app'
        },
        resGetPath: 'modules/__ns__/i18n/__lng__/__ns__.json',
        defaultLoadingValue: ''
    };

    }]).run(['$rootScope', '$state', '$stateParams', 'editableOptions',
        function($rootScope, $stateParams, $state, editableOptions){
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $rootScope.alerts = [];
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    }]);
/* Services */

angular.module('app.services', []).
  factory('coachSeekAPIService', ['$http', '$q', '$timeout', function($http, $q, $timeout) {

    var coachSeekAPI = {};
    // return $resource('https://api.coachseek.com/api/Coaches/:id', {}, {
    //     getCoaches: { method: 'GET' },
    //     saveCoach: { method: 'PUT', params: {id: '@id'} },
    //     createCoach: { method: 'POST', params: {id: '@id'} },
    //     deleteCoach: { method: 'DELETE', params: {id: '@id'} },

    //     createService: { method: 'POST'},
    //     saveServices: { method: 'PUT'},
    //     getServices: { method: 'GET'},
    //     deleteService: { method: 'DELETE'}

    //     createLocation: { method: 'POST'},
    //     saveLocation: { method: 'PUT'},
    //     getLocations: { method: 'GET'},
    //     deleteLocation: { method: 'DELETE'}
    // });
    
    coachSeekAPI.getLocations = function(businessId) {
        this.deferred = $q.defer();
        var self = this;
        $timeout(function(){
        self.deferred.resolve([]);
        }, _.random(500, 600));
        return this.deferred.promise;
    };

    coachSeekAPI.createLocation = function(businessId) {
        this.deferred = $q.defer();
        var self = this;
        $timeout(function(){
        self.deferred.resolve({
                businessId: "8786bcd0-3b14-4f7b-92db-198527a5b949",
                id: null,
                name: "Club Trouw",
                address: "aaron.smith@example.com"
            });
        }, _.random(500, 800));
        return this.deferred.promise;
    };

    coachSeekAPI.saveLocation = function(businessId, coachId){
        var deferred = $q.defer();
        deferred.resolve("DATA");
        return deferred.promise;
    };

    coachSeekAPI.getServices = function(businessId) {
        this.deferred = $q.defer();
        var self = this;
        $timeout(function(){
        self.deferred.resolve([]);
        }, _.random(500, 600));
        return this.deferred.promise;
    };

    coachSeekAPI.createService = function(businessId) {
        this.deferred = $q.defer();
        var self = this;
        $timeout(function(){
        self.deferred.resolve({
                businessId: "8786bcd0-3b14-4f7b-92db-198527a5b949",
                id: null,
                firstName: "NEWEST",
                name: "USER",
                description: "aaron.smith@example.com",
                timing: {
                    duration: "0:15"
                },
                booking: {
                    studentCapacity: 8
                },
                presentation: {
                    color: 'blue'
                },
                repititon: {
                    sessionCount: 12,
                    repeatFrequency: 'w'
                },
                pricing: {
                    sessionPrice: 15.00,
                    coursePrice: 150.0
                }
            });
        }, _.random(500, 800));
        return this.deferred.promise;
    };

    coachSeekAPI.saveService = function(businessId, coachId){
        var deferred = $q.defer();
        deferred.resolve("DATA");
        return deferred.promise;
    };

    coachSeekAPI.getCoaches = function(businessId) {
		this.deferred = $q.defer();
		var self = this;
		$timeout(function(){
		   self.deferred.resolve({});
		}, _.random(500, 1500));
		return this.deferred.promise;
    };

    coachSeekAPI.saveCoach = function(businessId, coachId){
		var deferred = $q.defer();
		deferred.resolve("DATA");
		return deferred.promise;
    };

    coachSeekAPI.createCoach = function(){

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
angular.module('businessSetup.controllers', [])
    .controller('businessCtrl', ['$scope', 'CRUDService',
        function($scope, CRUDService){

    }])
    .controller('servicesCtrl', ['$scope', 'CRUDService', 
        function($scope, CRUDService){

        $scope.createItem = function(){
            CRUDService.create('createService', $scope);
        };

        $scope.editItem = function(service){
            _.pull($scope.itemList, service);
            $scope.itemCopy = angular.copy(service);
            
            $scope.item = service;
        };

        $scope.saveItem = function(service){
            var formValid = CRUDService.validateForm($scope);
            if(formValid){
                CRUDService.update('saveService', $scope, service);  
            }
        };

        $scope.cancelEdit = function(){
            CRUDService.cancelEdit($scope);
        };

        $scope.checkDuplicates = function(valid){
            var serviceName = $scope.item.name;
            if( _.find($scope.itemList, {name: serviceName}) ){
                $scope.addAlert({
                    type: 'warning',
                    message: 'businessSetup:service-already-exists'
                });
                valid = false;
            }
            return valid;
        };

        $scope.$watch('item.repititon.repeatFrequency', function(newVal){
            if(newVal === -1 || newVal === null){
                $scope.item.pricing.coursePrice = null;
            }
        });

        $scope.$on('$stateChangeStart', function(event, toState){
            if( toState.name === "businessSetup.scheduling" ){
                if(!$scope.itemList || $scope.itemList.length <= 0){
                    event.preventDefault();
                    //show bootstrap message
                    $scope.addAlert({
                        type: 'warning',
                        message: 'businessSetup:add-services-warning'
                    });
                }
            }
        });

        CRUDService.get('getServices', $scope);

    }])
    .controller('locationsCtrl', ['$scope', 'CRUDService',
        function($scope, CRUDService){
            $scope.createItem = function(){
                CRUDService.create('createLocation', $scope);
            };

            $scope.editItem = function(location){
                _.pull($scope.itemList, location);
                $scope.itemCopy = angular.copy(location);
                
                $scope.item = location;
            };

            $scope.saveItem = function(location){
                var formValid = CRUDService.validateForm($scope);
                if(formValid){
                    CRUDService.update('saveLocation', $scope, location);  
                }
            };

            $scope.cancelEdit = function(){
                CRUDService.cancelEdit($scope);
            };

            $scope.checkDuplicates = function(valid){
                return valid;
            };

            //TODO - if an open item exists do we cancel or ask if they want to save?
            $scope.$on('$stateChangeStart', function(event, toState){
                if( toState.name === "businessSetup.coachList" ){
                    if(!$scope.itemList || $scope.itemList.length <= 0){
                        event.preventDefault();
                        //show bootstrap message
                        $scope.addAlert({
                            type: 'warning',
                            message: 'businessSetup:add-location-warning'
                        });
                    }
                }
            });

            CRUDService.get('getLocations', $scope);
    }])
    .controller('schedulingCtrl', ['$scope', 
        function($scope){
        
        console.log('SCHEDUling CTRL');
    }])
    .controller('coachesCtrl', ['$scope', 'CRUDService',
        function ($scope, CRUDService) {
        
        $scope.editItem = function(coach){
            _.pull($scope.itemList, coach);
            $scope.itemCopy = angular.copy(coach);
            $scope.item = coach;
            $scope.weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        };

        $scope.createItem = function(){
            CRUDService.create('createCoach', $scope);
        };

        $scope.cancelEdit = function(){
            CRUDService.cancelEdit($scope);
        };

        $scope.saveItem = function(coach){
            var formValid = CRUDService.validateForm($scope);
            if(formValid){
                CRUDService.update('saveCoach', $scope, coach);  
            }
        };

        $scope.checkDuplicates = function(valid){
            var firstName = $scope.item.firstName;
            var lastName = $scope.item.lastName;
            if( _.find($scope.itemList, {firstName: firstName,lastName: lastName}) ){
                $scope.addAlert({
                    type: 'warning',
                    message: 'businessSetup:name-already-exists'
                });
                valid = false;
            }
            return valid;
        };

        $scope.$on('$stateChangeStart', function(event, toState){
            if( toState.name === "businessSetup.services" ){
                if(!$scope.itemList || $scope.itemList.length <= 0){
                    event.preventDefault();
                    //show bootstrap message
                    $scope.addAlert({
                        type: 'warning',
                        message: 'businessSetup:add-coach-warning'
                    });
                }
            }
        });

        CRUDService.get('getCoaches', $scope);
    }]);
angular.module('businessSetup.directives', [])
    .directive('repeatSelector', function(){
        var frequencies = [
            {value: 'w', text: 'week'},
            {value: 'd', text: 'day'},
            {value: null, text: 'once'},
            {value: -1, text: 'forever'}
        ];
        return {
            scope: {
                sessionCount: '=',
                repeatFrequency: '='
            },
            templateUrl: 'businessSetup/partials/repeatSelector.html',
            link: function(scope, elem, attr){
                scope.frequencies = frequencies;

                scope.$watch('repeatFrequency', function(newVal){
                    if(newVal === -1 || newVal === null){
                        scope.sessionCount = newVal;
                    } else if((scope.sessionCount < 0 || scope.sessionCount === null) && newVal ) {
                        scope.sessionCount = 2;
                    }
                });

                scope.showStatus = function() {
                  var selected = _.filter(scope.frequencies, {value: scope.repeatFrequency});
                  return selected[0] ? selected[0].text : "Not set";
                };
            }
        };
    })
    .directive('colorPicker', function() {
        var defaultColors =  [
            'red',
            'green',
            'blue',
            'orange',
            'yellow'
        ];
        return {
            scope: {
                currentColor: '='
            },
            templateUrl: 'businessSetup/partials/colorPicker.html',
            link: function (scope) {
                scope.colors = defaultColors;
                scope.$watch('currentColor', function(newVal) {
                    scope.currentColor = newVal;
                });
            }
        };

    })
	.directive('timeSlot', function(){
		return {
			replace: true,
			templateUrl: 'businessSetup/partials/timeSlot.html'
		};
	})
    .directive('timePicker', function(){
        return {
            replace: true,
            templateUrl: 'businessSetup/partials/timePicker.html',
            scope: {
                time: "="
            },
            link: function (scope, elem, attr) {

                scope.$watch('time', function(newVal) {
                    scope.time = newVal;
                    if(scope.time){
                        var timeArray = scope.time.split(":");
                        scope.hours = parseFloat(timeArray[0]);
                        scope.minutes = parseFloat(timeArray[1]);
                    }
                });
     
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
                };
     
                /* Decreases hours by one */
                scope.decreaseHours = function () {
     
                    //Check whether hours have reached min
                    scope.hours = scope.hours <= 0 ? 23 : --scope.hours;

                    setTime();
                };
     
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
                };
     
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
                };

                /* Displays minutes */
                var displayMinutes = function () {
                    return scope.minutes <= 9 ? "0" + scope.minutes : scope.minutes;
                };

                var setTime = function(){
                    var minutesString = displayMinutes();
                    scope.time = scope.hours + ":" + minutesString;
                };
            }
        };
    })
    .directive('timeRangePicker', function(){
            return {
                replace: false,
                scope: {
                    start: "=",
                    finish: "=",
                    disabled: "=ngDisabled"
                },
                templateUrl: 'businessSetup/partials/timeRangePicker.html',
                require: 'ngModel',
                link: function(scope, elm, attrs, ctrl) {
                    scope.$watchGroup(['start', 'finish', 'disabled'], function(newValues){
                        if(newValues[0] && newValues[1]) {
                            var startTime = timeStringToObject(newValues[0]);
                            var finishTime = timeStringToObject(newValues[1]);

                            if(newValues[2] === true || startTime.hours < finishTime.hours) {
                                ctrl.$setValidity('timeRange', true);
                            } else if( (startTime.hours === finishTime.hours && startTime.minutes >= finishTime.minutes) || 
                                            startTime.hours > finishTime.hours ){
                                ctrl.$setValidity('timeRange', false);
                            }
                        }
                    });

                    var timeStringToObject = function(time){
                        var timeArray = time.split(":");

                        time  = {};
                        time.hours = parseFloat(timeArray[0]);
                        time.minutes = parseFloat(timeArray[1]);

                        return time;
                    };
                }
            };
    });
angular.module('businessSetup',
	[
		'businessSetup.controllers',
        'businessSetup.directives',
		'businessSetup.services'
	])
	.config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            .state('businessSetup', {
                abstract: true,
                url: "/business-setup",
                templateUrl: "businessSetup/partials/businessSetup.html",
            })
            .state('businessSetup.business', {
                url: "/business",
                views: {
                    "list-item-view": { 
                        templateUrl: "businessSetup/partials/businessView.html",
                        controller: 'businessCtrl'
                    }
                }
            })
            .state('businessSetup.locations', {
                url: "/locations",
                views: {
                    "list-item-view": { 
                        templateUrl: "businessSetup/partials/locationsView.html",
                        controller: 'locationsCtrl'
                    }
                }
            })
            .state('businessSetup.coachList', {
                url: "/coach-list",
                views: {
                    "list-item-view": { 
                        templateUrl: "businessSetup/partials/coachesView.html",
                        controller: 'coachesCtrl'
                    }
                }
            })
            .state('businessSetup.services', {
                url: "/services",
                views: {
                    "list-item-view": { 
                        templateUrl: "businessSetup/partials/servicesView.html",
                        controller: "servicesCtrl"
                     }
                }
            })
            .state('businessSetup.scheduling', {
                url: "/scheduling",
                views: {
                    "list-item-view": { 
                        templateUrl: "businessSetup/partials/schedulingView.html",
                        controller: "schedulingCtrl"
                     }
                }
            });


    }]);
angular.module('businessSetup.services', []).
    service('CRUDService', ['coachSeekAPIService', '$activityIndicator',
        function(coachSeekAPIService, $activityIndicator){

        this.get = function(functionName, $scope){
            $activityIndicator.startAnimating();
            coachSeekAPIService[functionName]().then(function(data){
                //set coach list data or creat first coach
                if(data.length){        
                    $scope.itemList = data;
                } else {
                    $scope.itemList = [];
                    $scope.createItem();
                }
            }, function(error){
                $scope.addAlert({
                    type: 'danger',
                    message: 'businessSetup:' + error.message
                });
            }).finally(function(){
                $activityIndicator.stopAnimating();
            });
        };

        this.create = function(functionName, $scope){
            $activityIndicator.startAnimating();
            coachSeekAPIService[functionName]().then(function(data){
                $scope.newItem = true;
                $scope.editItem(data);
            }, function(error){
                $scope.addAlert({
                    type: 'danger',
                    message: 'businessSetup:' + error.message
                });
            }).finally(function(){
                $activityIndicator.stopAnimating();
            });
        };

        this.update = function(functionName, $scope, item){
            $activityIndicator.startAnimating();
            coachSeekAPIService[functionName]().then(function(data){
                $scope.itemList.push(item);
                resetToList($scope);
            }, function(error){
                $scope.addAlert({
                    type: 'danger',
                    message: 'businessSetup:' + error.message
                });
            }).finally(function(){
                $activityIndicator.stopAnimating();
            });
        };

        this.cancelEdit = function($scope){
            if(!$scope.newItem){
                $scope.itemList.push($scope.itemCopy);
            }
            resetToList($scope);
        };

        this.validateForm = function($scope){
            var valid = $scope.itemForm.$valid;

            if(!valid){
                var errors = $scope.itemForm.$error;
                _.forEach(errors, function(error, key){
                    var errorMessage = error[0] && error[0].$name ? error[0].$name : key;
                    $scope.addAlert({
                        type: 'warning',
                        message: 'businessSetup:' + errorMessage + '-invalid'
                    });
                });
            } else {
                valid = $scope.checkDuplicates(valid);
            }
            return valid;
        };

        var resetToList = function($scope){
            $scope.item = null;
            $scope.removeAlerts();
            $scope.newItem = null;
            $scope.itemCopy = null;
        };
    }]);
})();