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