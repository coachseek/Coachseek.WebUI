angular.module('businessSetup.controllers', [])
    .controller('servicesCtrl', ['$scope', 'CRUDFactoryService', 
        function($scope, CRUDFactoryService){

        $scope.createItem = function(){
            CRUDFactoryService.create('createService', $scope);
        };

        $scope.editItem = function(service){
            _.pull($scope.itemList, service);
            $scope.itemCopy = angular.copy(service);

            $scope.item = service;
        };

        $scope.saveItem = function(service){
            var formValid = CRUDFactoryService.validateForm($scope);
            if(formValid){
                CRUDFactoryService.update('saveService', $scope, service);  
            }
        };

        $scope.cancelEdit = function(){
            CRUDFactoryService.cancelEdit($scope);
        };

        $scope.checkDuplicateNames = function(valid){
            var serviceName = $scope.item.name;
            if( _.find($scope.itemList, {name: serviceName}) ){
                $scope.addAlert({
                    type: 'warning',
                    message: 'businessSetup:name-already-exists'
                });
                valid = false;
            }
            return valid;
        };

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

        CRUDFactoryService.get('getServices', $scope);

    }])
    .controller('locationsCtrl', ['$scope', 
        function($scope){
        
        console.log('LOCATIONS CTRL');
    }])
    .controller('coachesCtrl', ['$scope', 'CRUDFactoryService', '$state',
        function ($scope, CRUDFactoryService, $state) {
        
        $scope.editItem = function(coach){
            _.pull($scope.itemList, coach);
            $scope.itemCopy = angular.copy(coach);
            $scope.item = coach;
            $scope.weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        };

        $scope.createItem = function(){
            CRUDFactoryService.create('createCoach', $scope);
        };

        $scope.cancelEdit = function(){
            CRUDFactoryService.cancelEdit($scope);
        };

        $scope.saveItem = function(coach){
            var formValid = validateForm();
            if(formValid){
                CRUDFactoryService.update('saveCoach', $scope, coach);  
            }
        };

        var validateForm = function(){
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
                valid = checkDuplicateNames(valid);
            }
            return valid;
        };

        var checkDuplicateNames = function(valid){
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

        CRUDFactoryService.get('getCoaches', $scope);
    }]);