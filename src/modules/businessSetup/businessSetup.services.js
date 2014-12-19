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