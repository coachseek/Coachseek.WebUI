/* Controllers */
angular.module('app.controllers', [])
    .controller('appCtrl', ['$rootScope', '$state', '$http', '$timeout', 'loginModal',
        function ($rootScope, $state, $http, $timeout, loginModal) {
            // TODO - add ability to remove alerts by view
            $rootScope.addAlert = function(alert){
                _.forEach($rootScope.alerts, function(existingAlert, index){
                    if(existingAlert.message === alert.message){
                        $rootScope.closeAlert(index)
                    }
                });

                $rootScope.alerts.push(alert);
                if(alert.type === 'success'){
                    $timeout(function(){
                        _.pull($rootScope.alerts, alert);
                    }, 3000);
                }
            };
            
            $rootScope.closeAlert = function(index) {
                $rootScope.alerts.splice(index, 1);
            };

            $rootScope.removeAlerts = function(alerts){
                $rootScope.alerts = [];
            };

            $rootScope.logout = function(){
                $http.defaults.headers.common['Authorization'] = null;
                delete $rootScope.currentUser;
                $state.go('businessSetup.business.newUser');
                $rootScope.addAlert({
                    type: 'success',
                    message: 'logged-out'
                });
            };

            $rootScope.loginModal = function(){
                loginModal().then(function () {
                    $rootScope.removeAlerts();
                    $state.go('scheduling');
                });
            };

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
                var requireLogin = toState.data.requireLogin;

                if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
                    event.preventDefault();

                    loginModal().then(function () {
                        $rootScope.removeAlerts();
                        return $state.go(toState.name, toParams);
                    });
                } else {
                    $rootScope.removeAlerts();
                }
            });
        }])
        .controller('loginModalCtrl', ['$scope', 'coachSeekAPIService', '$http', '$activityIndicator', 
            function ($scope, coachSeekAPIService, $http, $activityIndicator) {
            
            $scope.attemptLogin = function (email, password) {
                $scope.removeAlerts();
                if($scope.loginForm.$valid){
                    var authHeader = 'Basic ' + btoa(email + ':' + password);
                    $http.defaults.headers.common['Authorization'] = authHeader;

                    $activityIndicator.startAnimating();
                    coachSeekAPIService.get({section: 'Locations'})
                        .$promise.then(function(){
                            $scope.$close(authHeader);
                        }, function(error){
                            $http.defaults.headers.common['Authorization'] = null;

                            $scope.addAlert({
                                type: 'danger',
                                message: error.statusText
                            });
                        }).finally(function(){
                            $activityIndicator.stopAnimating();
                        });
                } else {
                    var errorTypes = $scope.loginForm.$error;
                    _.forEach(errorTypes, function(errorType, key){
                        _.forEach(errorType, function(error){
                            var errorMessage = error.$name;
                            $scope.addAlert({
                                type: 'warning',
                                message: 'businessSetup:' + errorMessage + '-invalid'
                            });
                        });
                    });
                }
            }

            $scope.cancel = $scope.$dismiss;
        }]);