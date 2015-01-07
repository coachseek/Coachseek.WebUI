'use strict';
(function(){
/* Controllers */
angular.module('app.controllers', [])
    .controller('appCtrl', ['$rootScope', '$timeout',
        function ($rootScope, $timeout) {
            // TODO - add ability to remove alerts by view
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
                    if(alert.type === 'success'){
                        $timeout(function(){
                            _.pull($rootScope.alerts, alert);
                        }, 3000);
                    }
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
    'ngAnimate',
  	'ui.bootstrap',
    'ui.router',
    'jm.i18next',

    // coachSeekApp
    'app.controllers', 
    'app.services',
    'app.directives',

    // MODULES
    'businessSetup',
    'scheduling',

    // UTILITIES
    'ngActivityIndicator'

    ]).config(['$stateProvider', function ($stateProvider){
        $stateProvider.state('home', { url: "/" });
    }]).config(['$i18nextProvider', function( $i18nextProvider ){
        $i18nextProvider.options = {
            lng: 'en',
            fallbackLng: 'en',
            ns : {
                namespaces : ['app', 'businessSetup', 'scheduling'],
                defaultNs: 'app'
            },
            resGetPath: 'i18n/__lng__.json',
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

    coachSeekAPI.getBusiness = function(businessId) {
        this.deferred = $q.defer();
        var self = this;
        $timeout(function(){
        self.deferred.resolve({});
        }, _.random(500, 600));
        return this.deferred.promise;
    };

    coachSeekAPI.saveBusiness = function(businessId) {
        this.deferred = $q.defer();
        var self = this;
        $timeout(function(){
        self.deferred.resolve([]);
        }, _.random(500, 600));
        return this.deferred.promise;
    };

    coachSeekAPI.createBusiness = function(businessId) {
        this.deferred = $q.defer();
        var self = this;
        $timeout(function(){
        self.deferred.resolve({
                business: {
                    name: "West Coast Toast"
                },
                admin: {
                    firstName: "Toast",
                    lastName: "Master",
                    email: "toastmaster@westcoasttoast.com",
                    password: "password"
                }
            });
        }, _.random(500, 600));
        return this.deferred.promise;
    };
    
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
                name: "THE LAB",
                address: "1800 taylor ave n",
                city: "Seattle",
                state: "WA",
                country: "USA"
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
        self.deferred.resolve([{
                businessId: "8786bcd0-3b14-4f7b-92db-198527a5b949",
                id: _.uniqueId('service_'),
                name: "Toast Making w",
                description: "I show you how to make goddamn toast, son.",
                timing: {
                    duration: "0:30"
                },
                booking: {
                    studentCapacity: 8
                },
                presentation: {
                    color: 'blue'
                },
                repititon: {
                    sessionCount: 4,
                    repeatFrequency: 'w'
                },
                pricing: {
                    sessionPrice: 15.00,
                    coursePrice: 150.0
                }
            },{
                businessId: "8786bcd0-3b14-4f7b-92db-198527a5b949",
                id: _.uniqueId('service_'),
                name: "Toast Roasting d",
                description: "I show you how to roast goddamn toast, son.",
                timing: {
                    duration: "1:45"
                },
                booking: {
                    studentCapacity: 8
                },
                presentation: {
                    color: 'green'
                },
                repititon: {
                    sessionCount: 4,
                    repeatFrequency: 'd'
                },
                pricing: {
                    sessionPrice: 15.00,
                    coursePrice: 150.0
                }
            },{
                businessId: "8786bcd0-3b14-4f7b-92db-198527a5b949",
                id: _.uniqueId('service_'),
                name: "Boasting",
                description: "I show you how to boast, son.",
                timing: {
                    duration: "4:15"
                },
                booking: {
                    studentCapacity: 8
                },
                presentation: {
                    color: 'purple'
                },
                repititon: {
                    sessionCount: -1,
                    repeatFrequency: -1
                },
                pricing: {
                    sessionPrice: 15.00,
                    coursePrice: 150.0
                }
            },{
                businessId: "8786bcd0-3b14-4f7b-92db-198527a5b949",
                id: _.uniqueId('service_'),
                name: "Duding",
                description: "I teach you how to be a dude.",
                timing: {
                    duration: "2:15"
                },
                booking: {
                    studentCapacity: 8
                },
                presentation: {
                    color: 'orange'
                },
                repititon: {
                    sessionCount: null,
                    repeatFrequency: null
                },
                pricing: {
                    sessionPrice: 15.00,
                    coursePrice: 150.0
                }
            }]);
        }, _.random(500, 1600));
        return this.deferred.promise;
    };

    coachSeekAPI.createService = function(businessId) {
        this.deferred = $q.defer();
        var self = this;
        $timeout(function(){
        self.deferred.resolve({
                businessId: "8786bcd0-3b14-4f7b-92db-198527a5b949",
                id: null,
                name: "Toast Making",
                description: "I show you how to make goddamn toast, son.",
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
					firstName: "Toast",
					lastName: "Apprentice #1",
					email: "apprentice@westcoasttoast.com",
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

        $scope.editItem = function(business){
            _.pull($scope.itemList, business);
            $scope.itemCopy = angular.copy(business);

            $scope.item = business;  
        };

        $scope.createItem = function(){
            CRUDService.create('createBusiness', $scope);
        };

        $scope.saveItem = function(business){
            var formValid = CRUDService.validateForm($scope);
            if(formValid){
                CRUDService.update('saveBusiness', $scope, business);  
            }
        };

        $scope.cancelEdit = function(){
            CRUDService.cancelEdit($scope);
        };

        $scope.$on('$stateChangeStart', function(event, toState){
            if(_.contains(["businessSetup.locations", "businessSetup.coachList", "businessSetup.services"], toState.name) ){
                if(!$scope.itemList || $scope.itemList.length <= 0){
                    event.preventDefault();
                    //show bootstrap message
                    $scope.addAlert({
                        type: 'warning',
                        message: 'businessSetup:add-business-warning'
                    });
                }
            }
        });

        CRUDService.get('getBusiness', $scope);
    }])
    .controller('locationsCtrl', ['$scope', '$http', 'CRUDService',
        function($scope, $http, CRUDService){

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
                formValid = checkDuplicates(formValid);
                if(formValid){
                    CRUDService.update('saveLocation', $scope, location);  
                }
            };

            $scope.cancelEdit = function(){
                CRUDService.cancelEdit($scope);
            };

            var checkDuplicates = function(valid){
                var name = $scope.item.name;
                var address = $scope.item.address;
                if( _.find($scope.itemList, {name: name,address: address}) ){
                    $scope.addAlert({
                        type: 'warning',
                        message: 'businessSetup:location-already-exists'
                    });
                    valid = false;
                }
                return valid;
            };

            //TODO - if an open item exists do we cancel or ask if they want to save?
            //TODO - dont navigate forward in the registration process
            //      still skips coaches if there is a location
            $scope.$on('$stateChangeStart', function(event, toState){
                if(_.contains(["businessSetup.coachList", "businessSetup.services"], toState.name) ){
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
                formValid = checkDuplicates(formValid);
            if(formValid){
                CRUDService.update('saveCoach', $scope, coach);  
            }
        };

        var checkDuplicates = function(valid){
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
                formValid = checkDuplicates(formValid);
            if(formValid){
                CRUDService.update('saveService', $scope, service);  
            }
        };

        $scope.cancelEdit = function(){
            CRUDService.cancelEdit($scope);
        };

        var checkDuplicates = function(valid){
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
            });
    }]);
angular.module('businessSetup.services', []).
    service('CRUDService', ['coachSeekAPIService', '$activityIndicator',
        function(coachSeekAPIService, $activityIndicator){

        this.get = function(functionName, $scope){
            $activityIndicator.startAnimating();
            coachSeekAPIService[functionName]().then(function(data){
                //set coach list data or creat first coach
                if(_.size(data)){        
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

                $scope.addAlert({
                    type: 'success',
                    message: "businessSetup:save-success",
                    name: item.name ? item.name: findName(item)
                });
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
                var errorTypes = $scope.itemForm.$error;
                _.forEach(errorTypes, function(errorType, key){
                    _.forEach(errorType, function(error){
                        var errorMessage = error && error.$name ? error.$name : key;
                        $scope.addAlert({
                            type: 'warning',
                            message: 'businessSetup:' + errorMessage + '-invalid'
                        });
                    });
                });
            }
            return valid;
        };

        var resetToList = function($scope){
            $scope.item = null;
            $scope.removeAlerts();
            $scope.newItem = null;
            $scope.itemCopy = null;
        };

        var findName = function(item){
            if(item.firstName && item.lastName){
                return item.firstName + " " + item.lastName;
            } else if (item.business) {
                return item.business.name;
            }
        };
    }]);
angular.module('scheduling.controllers', [])
    .controller('schedulingCtrl', ['$scope', 'CRUDService',
        function($scope, CRUDService){
            $scope.events = [];
            $scope.eventSources = [$scope.events];

            $scope.myCallback = function(){
                console.log("REVERT")
            };

            $scope.uiConfig = {
                calendar:{
                    height: 500,
                    editable: true,
                    droppable: true,
                    allDaySlot: false,
                    defaultView: 'agendaWeek',
                    eventDurationEditable: false,
                    drop: function(date, event) {
                        $(this).hide().css({top: 0, left: 0}).fadeIn(600);
                        // console.log('Specified TIME', date.hasTime())
                        var serviceData = $(this).data('service');
                        buildEvents(date, serviceData);
                    },
                    eventDrop: function(event){
                    },
                    // businessHours: {
                    //     start: '10:00', // a start time (10am in this example)
                    //     end: '18:00', // an end time (6pm in this example)

                    //     dow: [ 1, 2, 3, 4 ]
                    //     // days of week. an array of zero-based day of week integers (0=Sunday)
                    //     // (Monday-Thursday in this example)
                    // },
                    header:{
                        left: 'month agendaWeek agendaDay',
                        center: 'title',
                        right: 'today prev,next'
                    },
                    scrollTime:  "08:00:00"
                }
            };

            var strToMinutes = function(duration){
                var timeArray = duration.split(":");
                return parseFloat(timeArray[0] * 60)  + parseFloat(timeArray[1]);
            };

            var buildEvents = function(date, serviceData){
                var repeatFrequency = serviceData.repititon.repeatFrequency
                var duration = strToMinutes(serviceData.timing.duration);
                var id = _.uniqueId('service_')
                if( repeatFrequency === -1 ){
                    // console.log('FOREVER')
                    createEvent(id, date, serviceData, 0);
                } else if ( repeatFrequency === null ) {
                    // console.log('ONCE')
                    createEvent(id, date, serviceData, 0);
                } else if ( repeatFrequency ) {
                    // console.log('FINITE')
                    var sessionCount = serviceData.repititon.sessionCount;
                    _.times(sessionCount, function(index){
                        createEvent(id, date, serviceData, index)
                    });
                }
            };

            var createEvent = function(id, date, serviceData, index){
                var newDate = date.clone();
                var repeatFrequency = serviceData.repititon.repeatFrequency
                var duration = strToMinutes(serviceData.timing.duration);
                var newEvent = {
                    _id: id,
                    title: serviceData.name,
                    start: moment(newDate.add(index, repeatFrequency)),
                    end: moment(newDate.add(duration, 'minutes')),
                    allDay: false,
                    color: serviceData.presentation.color
                }
                $scope.events.push(newEvent); 
            };

            CRUDService.get('getServices', $scope);
            // GET existing calendar
    }]);
angular.module('scheduling',
    [
        'scheduling.controllers',

        'ngDragDrop',
        'ui.calendar'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('scheduling', {
                url: "/scheduling",
                templateUrl: "scheduling/partials/schedulingView.html",
                controller: 'schedulingCtrl'
            });
    }]);
})();