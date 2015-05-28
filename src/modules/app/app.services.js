angular.module('app.services', [])
    // TODO change name to coachseekAPIFactory
    .factory('coachSeekAPIService', ['$resource', function($resource) {
        return $resource('https://api.coachseek.com/:section/:id');
            //   DEFAULT RESOURCE FUNTIONS
            //   'get':    {method:'GET'},
            //   'save':   {method:'POST'},
            //   'query':  {method:'GET', isArray:true},
            //   'remove': {method:'DELETE'},
            //   'delete': {method:'DELETE'}
    }])
    .factory('anonCoachseekAPIFactory', ['$resource', function($resource){
        return {
            anon: function (subdomain) {
                return $resource('https://api.coachseek.com/:section/:id', {}, {
                    get:   {method: 'GET', headers: {'Business-Domain': subdomain}},
                    // query: {method: 'GET', isArray:true, headers: {'Business-Domain': subdomain}},
                    // save:  {method: 'POST', headers: {'Business-Domain': subdomain}}
                })
            }
        };
    }])
    .service('CRUDService', ['coachSeekAPIService', '$activityIndicator',
        function(coachSeekAPIService, $activityIndicator){

        this.get = function(functionName, $scope){
            $activityIndicator.startAnimating();
            coachSeekAPIService.query({section: functionName})
                .$promise.then(function(itemList){
                    //set list data or create first item
                    if(_.size(itemList)){
                        $scope.itemList = itemList;
                    } else {
                        $scope.itemList = [];
                        $scope.createItem();
                    }
                }, $scope.handleErrors).finally(function(){
                    $activityIndicator.stopAnimating();
                });
        };

        this.update = function(functionName, $scope, item){
            $activityIndicator.startAnimating();
            return coachSeekAPIService.save({section: functionName}, item)
                .$promise.then(function(item){
                    if($scope.itemList) $scope.itemList.push(item);
                    if($scope.newItem){
                        var updateObject = {};
                        updateObject[functionName] = $scope.itemList.length;
                        Intercom('update', updateObject);
                    }
                    resetToList($scope);
                    $scope.addAlert({
                        type: 'success',
                        message: "businessSetup:save-success",
                        name: item.name ? item.name: findName(item)
                    });
                    $scope.$broadcast('updateSuccess');
                    return item;
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