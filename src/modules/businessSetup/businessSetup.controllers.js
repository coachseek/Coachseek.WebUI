angular.module('businessSetup.controllers', [])
    .controller('businessRegistrationCtrl', ['$scope', 'coachSeekAPIService', 'CRUDService', '$activityIndicator', '$state', 'sessionService', 'getLocationBasedCurrency',
        function($scope, coachSeekAPIService, CRUDService, $activityIndicator, $state, sessionService, getLocationBasedCurrency){
        $scope.business = {};
        $scope.admin = {};

        $scope.saveItem = function(){
            var formValid = CRUDService.validateForm($scope);

            if(formValid){
                _.assign($scope.business, {
                    currency: getLocationBasedCurrency.locationCurrency
                });
                $activityIndicator.startAnimating()
                coachSeekAPIService.save({section: 'businessRegistration'}, {admin: $scope.admin, business: $scope.business})
                    .$promise.then(function(newBusiness){
                        $scope.setupCurrentUser({
                            email: newBusiness.admin.email,
                            password: $scope.admin.password,
                            firstName: newBusiness.admin.firstName,
                            lastName: newBusiness.admin.lastName
                        }, newBusiness.business);
                        $state.go('scheduling');
                        if($scope.isBigScreen) sessionService.onboarding.showOnboarding = true;
                        if(ga) ga('send', 'event', 'conversions', 'newUserSignUp');
                    }, $scope.handleErrors).finally(function(){
                    $activityIndicator.stopAnimating();
                });
            }
        };
    }])
    .controller('businessCtrl', ['$rootScope', '$scope', 'CRUDService', 'sessionService',
        function($rootScope, $scope, CRUDService, sessionService){
        $scope.editItem = function(){
            $scope.itemCopy = angular.copy($scope.business);

            $scope.item = $scope.business;
        };

        $scope.saveItem = function(business){
            var formValid = CRUDService.validateForm($scope);

            if(formValid){
                CRUDService.update('Business', $scope, business)
                    .then(function(business){
                        $rootScope.business = business;
                        sessionService.business = business;
                    });
            }
        };

        $scope.cancelEdit = function(){
            $scope.business = $scope.itemCopy
            $scope.item = null;
            $scope.itemForm.$setPristine();
            $scope.itemForm.$setUntouched();
            $scope.removeAlerts();
            $scope.itemCopy = null;
        };

        $scope.business = angular.copy(sessionService.business);
    }])
    .controller('locationsCtrl', ['$scope', 'CRUDService',
        function($scope, CRUDService){

            $scope.createItem = function(){
                if(!$scope.item){
                    $scope.newItem = true;
                    $scope.item = {};
                }
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
    .controller('coachesCtrl', ['$scope', 'CRUDService', 'coachDefaults',
        function ($scope, CRUDService, coachDefaults) {

        $scope.createItem = function(){
            if(!$scope.item){
                $scope.newItem = true;
                $scope.item = angular.copy(coachDefaults);
            }
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
    })
    .controller('servicesCtrl', ['$scope', '$state', 'CRUDService', 'serviceDefaults', 'sessionService',
        function($scope, $state, CRUDService, serviceDefaults, sessionService){
        $scope.business = sessionService.business;

        $scope.createItem = function(){
            if(!$scope.item){
                $scope.newItem = true;
                $scope.item = angular.copy(serviceDefaults);
            }
        };

        $scope.editItem = function(service){
            _.pull($scope.itemList, service);
            $scope.itemCopy = angular.copy(service);
            $scope.item = service;
        };

        $scope.saveItem = function(service){
            var formValid = CRUDService.validateForm($scope);
            if( formValid ){
                $scope.$broadcast('closeTimePicker', false);
                CRUDService.update('Services', $scope, service);
            }
        };

        $scope.cancelEdit = function(){
            $scope.$broadcast('closeTimePicker', true);
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
                delete $scope.item.pricing.coursePrice;
            }
        });

        CRUDService.get('Services', $scope);
        if ($state.current.data && $state.current.data.newService) {
            $scope.AILoading = false;
            $scope.createItem();
        }
    }])
    .value('serviceDefaults', {
        booking: {
            isOnlineBookable: true
        },
        timing: {
            duration: 60
        },
        repetition: {
            sessionCount: 1
        },
        presentation: {
            colour: 'green'
        }
    });