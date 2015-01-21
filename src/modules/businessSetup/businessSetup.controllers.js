angular.module('businessSetup.controllers', [])
    .controller('businessCtrl', ['$scope', 'CRUDService', 'businessDefaults',
        function($scope, CRUDService, businessDefaults){

        $scope.createItem = function(){
            $scope.newItem = true;
            $scope.item = _.assign({}, businessDefaults);
        };

        $scope.editItem = function(business){
            _.pull($scope.itemList, business);
            $scope.itemCopy = angular.copy(business);

            $scope.item = business;
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
    .controller('locationsCtrl', ['$scope', 'CRUDService', 'locationDefaults',
        function($scope, CRUDService, locationDefaults){

            $scope.createItem = function(){
                $scope.newItem = true;
                $scope.item = _.assign({}, locationDefaults);
            };

            $scope.editItem = function(location){
                _.pull($scope.itemList, location);
                $scope.itemCopy = angular.copy(location);
                
                $scope.item = location;
            };

            $scope.saveItem = function(location){
                var formValid = CRUDService.validateForm($scope);
                formValid = checkDuplicates(formValid);
                if( formValid ){
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
    .controller('coachesCtrl', ['$scope', 'CRUDService', 'coachDefaults',
        function ($scope, CRUDService, coachDefaults) {
        $scope.weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

        $scope.createItem = function(){
            $scope.newItem = true;
            $scope.item = _.assign({}, coachDefaults);
        };
        
        $scope.editItem = function(coach){
            _.pull($scope.itemList, coach);
            $scope.itemCopy = angular.copy(coach);
            $scope.item = coach;
        };

        $scope.cancelEdit = function(){
            CRUDService.cancelEdit($scope);
        };

        $scope.saveItem = function(coach){
            var formValid = CRUDService.validateForm($scope);
                formValid = checkDuplicates(formValid);
            if( formValid ){
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
    .controller('servicesCtrl', ['$scope', 'CRUDService', 'serviceDefaults',
        function($scope, CRUDService, serviceDefaults){

        $scope.createItem = function(){
            $scope.newItem = true;
            $scope.item = _.assign({}, serviceDefaults);
        };

        $scope.editItem = function(service){
            _.pull($scope.itemList, service);
            service = setRepeatFrequency(service);
            $scope.itemCopy = angular.copy(service);
            $scope.item = service;
        };

        $scope.saveItem = function(service){
            var formValid = CRUDService.validateForm($scope);
                formValid = checkDuplicates(formValid);
            if( formValid ){
                CRUDService.update('saveService', $scope, service);                  
            }
        };

        $scope.cancelEdit = function(){
            CRUDService.cancelEdit($scope);
        };

        var setRepeatFrequency = function(service){
            if(!service.repetition.repeatFrequency){
                service.repetition.repeatFrequency = null;
            }
            return service;
        }

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

        $scope.$watch('item.repetition.sessionCount', function(newVal){
            if($scope.item && newVal < 2){
                $scope.item.pricing.coursePrice = null;
            }
        });

        CRUDService.get('getServices', $scope);

    }])
    .value('businessDefaults', {
            business: {
                name: undefined
            },
            admin: {
                firstName: undefined,
                lastName: undefined,
                email: undefined,
                password: undefined
            }
        }
    )
    .value('locationDefaults', {
            name: undefined
        }
    )
    .value('coachDefaults', {
            businessId: undefined,
            id: undefined,
            firstName: undefined,
            lastName: undefined,
            email: undefined,
            phone: undefined,
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
        }
    )
    .value('serviceDefaults', {
            name: undefined,
            description: undefined,
            timing: {
                duration: 15
            },
            repetition: {
                sessionCount: 1,
                repeatFrequency: null
            },
            booking: {
                studentCapacity: undefined
            },
            presentation: {
                colour: 'green'
            },
            pricing: {
                sessionPrice: 0,
                coursePrice: undefined
            }
        }
    );