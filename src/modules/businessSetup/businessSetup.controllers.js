angular.module('businessSetup.controllers', [])
    .controller('businessCtrl', ['$scope', 'CRUDService', 'businessDefaults',
        function($scope, CRUDService, businessDefaults){

        $scope.createItem = function(){
            $scope.newItem = true;
            $scope.item = angular.copy(businessDefaults);
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

        CRUDService.get('getBusiness', $scope);
    }])
    .controller('locationsCtrl', ['$scope', 'CRUDService', 'locationDefaults',
        function($scope, CRUDService, locationDefaults){

            $scope.createItem = function(){
                $scope.newItem = true;
                $scope.item = angular.copy(locationDefaults);
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
                if( _.find($scope.itemList, {name: name}) ){
                    $scope.itemForm.name.$setValidity('duplicatename', false);
                    valid = false;
                } else {
                    $scope.itemForm.name.$setValidity('duplicatename', true);
                }
                return valid;
            };

            CRUDService.get('getLocations', $scope);
    }])
    .controller('coachesCtrl', ['$scope', 'CRUDService', 'coachDefaults',
        function ($scope, CRUDService, coachDefaults) {

        $scope.createItem = function(){
            $scope.newItem = true;
            $scope.item = angular.copy(coachDefaults);
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
            if( _.find($scope.itemList, {firstName: firstName}) ){
                $scope.itemForm.firstName.$setValidity('duplicatename', false);
                valid = false;
            } else if( _.find($scope.itemList, {lastName: lastName}) ){
                $scope.itemForm.lastName.$setValidity('duplicatename', false);
                valid = false;
            } else {
                $scope.itemForm.firstName.$setValidity('duplicatename', true);
                $scope.itemForm.lastName.$setValidity('duplicatename', true);
            }
            return valid;
        };

        CRUDService.get('getCoaches', $scope);
    }])
    .controller('servicesCtrl', ['$scope', 'CRUDService', 'serviceDefaults',
        function($scope, CRUDService, serviceDefaults){

        $scope.createItem = function(){
            $scope.newItem = true;
            $scope.item = angular.copy(serviceDefaults);
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
                $scope.itemForm.name.$setValidity('duplicatename', false);
                valid = false;
            } else {
                $scope.itemForm.name.$setValidity('duplicatename', true);
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