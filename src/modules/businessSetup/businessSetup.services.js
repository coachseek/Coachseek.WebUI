angular.module('businessSetup.services', []).
    service('CRUDService', ['coachSeekAPIService', '$activityIndicator',
        function(coachSeekAPIService, $activityIndicator){

        this.get = function(functionName, $scope){
            $activityIndicator.startAnimating();
            coachSeekAPIService[functionName]().then(function(response){
                //set list data or create first item
                var itemList = response.data;
                if(_.size(itemList)){
                    $scope.itemList = itemList;
                } else {
                    $scope.itemList = [];
                    $scope.createItem();
                }
            }, function(error){
                _.forEach(error.data, function(error){
                    $scope.addAlert({
                        type: 'danger',
                        message: error.message
                    });
                });
            }).finally(function(){
                $activityIndicator.stopAnimating();
            });
        };

        this.update = function(functionName, $scope, item){
            $activityIndicator.startAnimating();
            coachSeekAPIService[functionName](item).then(function(response){
                item = response.data;
                $scope.itemList.push(item);
                resetToList($scope);

                $scope.addAlert({
                    type: 'success',
                    message: "businessSetup:save-success",
                    name: item.name ? item.name: findName(item)
                });
            }, function(error){
                _.forEach(error.data, function(error){
                    $scope.addAlert({
                        type: 'danger',
                        message: error.message
                    });
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
            $scope.itemForm.$setPristine();
            $scope.itemForm.$setUntouched();
        };

        var findName = function(item){
            if(item.firstName && item.lastName){
                return item.firstName + " " + item.lastName;
            } else if (item.business) {
                return item.business.name;
            }
        };
    }]);