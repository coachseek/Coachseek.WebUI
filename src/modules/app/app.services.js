angular.module('app.services', [])
	.factory('coachSeekAPIService', ['$resource', function($resource) {
	    return $resource('http://coachseek-api.azurewebsites.net/api/:section/:id', {}, {
	        get: { method: 'GET', isArray: true},
	        update: {method: 'POST'},
	        delete: {method: 'DELETE'}
	    });
	}])
    .service('CRUDService', ['coachSeekAPIService', '$activityIndicator',
        function(coachSeekAPIService, $activityIndicator){

        this.get = function(functionName, $scope){
            $activityIndicator.startAnimating();
            coachSeekAPIService.get({section: functionName})
                .$promise.then(function(itemList){
                    //set list data or create first item
                    if(_.size(itemList)){
                        $scope.itemList = itemList;
                    } else {
                        $scope.itemList = [];
                        $scope.createItem();
                    }
                    $scope.$broadcast('getSuccess');
                }, $scope.handleErrors).finally(function(){
                    $activityIndicator.stopAnimating();
                });
        };

        this.update = function(functionName, $scope, item){
            $activityIndicator.startAnimating();
            coachSeekAPIService.update({section: functionName}, item)
                .$promise.then(function(item){
                    $scope.itemList.push(item);

                    $scope.addAlert({
                        type: 'success',
                        message: "businessSetup:save-success",
                        name: item.name ? item.name: findName(item)
                    });
                    if($scope.newItem){
                        var updateObject = {};
                        updateObject[functionName] = $scope.itemList.length;
                        Intercom('update', updateObject);
                    }
                    resetToList($scope);
                    $scope.$broadcast('updateSuccess');
                }, $scope.handleErrors).finally(function(){
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
            $scope.itemForm.$setPristine();
            $scope.itemForm.$setUntouched();
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
    }])
	.service('loginModal', ['$modal', '$rootScope',
		function ($modal, $rootScope) {
			function assignCurrentUser (user) {
                $rootScope.setupCurrentUser(user);
				return user;
			}

			return function() {
				var instance = $modal.open({
					templateUrl: 'app/partials/loginModal.html',
					controller: 'loginModalCtrl',
					backdropClass: 'modal-backdrop',
                    backdrop: 'static',
                    keyboard: false
				});

				return instance.result.then(assignCurrentUser);
			};
		}
	]);