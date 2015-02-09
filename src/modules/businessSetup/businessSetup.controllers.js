angular.module('businessSetup.controllers', [])
    .controller('businessCtrl', ['$rootScope', '$scope', 'CRUDService', 'businessDefaults', '$http',
        function($rootScope, $scope, CRUDService, businessDefaults, $http){

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
                var authHeader = 'Basic ' + btoa(business.admin.email + ':' + business.admin.password);
                $http.defaults.headers.common['Authorization'] = authHeader;
                $rootScope.basicAuth = authHeader;
                console.log($rootScope.basicAuth);
                CRUDService.update('BusinessRegistration', $scope, business);
            }
        };

        $scope.cancelEdit = function(){
            CRUDService.cancelEdit($scope);
        };

        $scope.itemList = [];
        $scope.createItem();
        // CRUDService.get('BusinessRegistration', $scope);
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
                if( formValid ){
                    CRUDService.update('Locations', $scope, location);
                }
            };

            $scope.cancelEdit = function(){
                CRUDService.cancelEdit($scope);
            };


            $scope.$watch('item.name', function(newVal){
                if( _.find($scope.itemList, {name: newVal}) ){
                    $scope.itemForm.name.$setValidity('duplicatename', false);
                } else {
                    $scope.itemForm.name.$setValidity('duplicatename', true);
                }
            });

            CRUDService.get('Locations', $scope);
    }])
    .value('locationDefaults', {
            name: undefined
        }
    )
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
            $scope.$broadcast('closeTimePicker', true);
            CRUDService.cancelEdit($scope);
        };

        $scope.saveItem = function(coach){
            var formValid = CRUDService.validateForm($scope);
            if( formValid ){
                $scope.$broadcast('closeTimePicker', false);
                CRUDService.update('Coaches', $scope, coach);
            }
        };

        $scope.$watchGroup(['item.firstName', 'item.lastName'], function(newValues){
            var firstName = newValues[0];
            var lastName  = newValues[1];
            if( _.find($scope.itemList, {firstName: firstName, lastName: lastName}) ){
                $scope.itemForm.firstName.$setValidity('duplicatename', false);
                $scope.itemForm.lastName.$setValidity('duplicatename', false);
            } else {
                $scope.itemForm.firstName.$setValidity('duplicatename', true);
                $scope.itemForm.lastName.$setValidity('duplicatename', true);
            }
        });

        CRUDService.get('Coaches', $scope);
    }])
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
    .controller('servicesCtrl', ['$scope', '$filter', 'CRUDService', 'serviceDefaults',
        function($scope, $filter, CRUDService, serviceDefaults){

        $scope.createItem = function(){
            $scope.newItem = true;
            $scope.item = angular.copy(serviceDefaults);
        };

        $scope.editItem = function(service){
            _.pull($scope.itemList, service);
            $scope.itemCopy = angular.copy(service);
            $scope.item = service;
        };

        $scope.saveItem = function(service){
            var formValid = CRUDService.validateForm($scope);
            if( formValid ){
                CRUDService.update('Services', $scope, service);
            }
        };

        $scope.cancelEdit = function(){
            CRUDService.cancelEdit($scope);
        };

        $scope.$watch('item.name', function(newVal){
            if( _.find($scope.itemList, {name: newVal}) ){
                $scope.itemForm.name.$setValidity('duplicatename', false);
            } else {
                $scope.itemForm.name.$setValidity('duplicatename', true);
            }
        });

        $scope.$watch('item.repetition.sessionCount', function(newVal){
            if($scope.item && newVal < 2 && $scope.item.pricing){
                $scope.item.pricing.coursePrice = null;
            }
        });

        CRUDService.get('Services', $scope);
    }])
    .value('serviceDefaults', {
            name: undefined,
            description: null,
            timing: {
                duration: 15
            },
            repetition: {
                sessionCount: 1,
                repeatFrequency: null
            },
            booking: {
                isOnlineBookable: false,
                studentCapacity: null
            },
            presentation: {
                colour: 'green'
            }
        }
    );