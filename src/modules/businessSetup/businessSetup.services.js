angular.module('businessSetup.services', []).
    factory('CRUDFactoryService', ['coachSeekAPIService', '$activityIndicator',
        function(coachSeekAPIService, $activityIndicator){

        var CRUDFactory = {};

        CRUDFactory.get = function(functionName, $scope){
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
                    message: 'businessSetup:' + error.message + '-invalid'
                });
            }).finally(function(){
                    $activityIndicator.stopAnimating();
                }
            );
        };

        CRUDFactory.create = function(functionName, $scope){
            $activityIndicator.startAnimating();
            coachSeekAPIService[functionName]().then(function(data){
                $scope.newItem = true;
                $scope.editItem(data);
            }, function(error){
                $scope.addAlert({
                    type: 'danger',
                    message: 'businessSetup:' + error.message + '-invalid'
                });
            }).finally(function(){
                $activityIndicator.stopAnimating();
            });
        };

        CRUDFactory.update = function(functionName, $scope, item){
            $activityIndicator.startAnimating();
            coachSeekAPIService[functionName]().then(function(){
                $scope.itemList.push(item);
                resetToList($scope);
            }, function(error){
                $scope.addAlert({
                    type: 'danger',
                    message: 'businessSetup:' + error.message + '-invalid'
                });
            }).finally(function(){
                $activityIndicator.stopAnimating();
            });
        };

        CRUDFactory.cancelEdit = function($scope){
            if(!$scope.newItem){
                $scope.itemList.push($scope.itemCopy);
            }
            resetToList($scope);
        };

        CRUDFactory.validateForm = function($scope){
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
                valid = $scope.checkDuplicateNames(valid);
            }
            return valid;
        };

        var resetToList = function($scope){
            $scope.item = null;
            $scope.removeAlerts();
            $scope.newItem = null;
            $scope.itemCopy = null;
        };

        return CRUDFactory;
    }]);