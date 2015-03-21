/* Controllers */
angular.module('app.controllers', [])
    .controller('appCtrl', ['$rootScope', '$state', '$http', '$timeout', 'loginModal', '$window',
        function ($rootScope, $state, $http, $timeout, loginModal, $window) {
            // TODO - add ability to remove alerts by view
            $rootScope.addAlert = function(alert){

                _.forEach($rootScope.alerts, function(existingAlert, index){
                    if(existingAlert && existingAlert.message === alert.message){
                        $rootScope.closeAlert(index);
                    }
                });

                $rootScope.alerts.push(alert);
                if(alert.type === 'success'){
                    $timeout(function(){
                        _.pull($rootScope.alerts, alert);
                    }, 3000);
                }
            };

            $rootScope.handleErrors = function(error){
                _.forEach(error.data, function(error){
                    $rootScope.addAlert({
                        type: 'danger',
                        message: error.message ? error.message: error
                    });
                });
            };
            
            $rootScope.closeAlert = function(index) {
                $rootScope.alerts.splice(index, 1);
            };

            $rootScope.removeAlerts = function(alerts){
                $rootScope.alerts = [];
            };

            $rootScope.logout = function(){
                $http.defaults.headers.common.Authorization = null;
                delete $rootScope.currentUser;
                Intercom('shutdown');
                $rootScope.addAlert({
                    type: 'success',
                    message: 'logged-out'
                });

                loginModal().then(function () {
                    $rootScope.removeAlerts();
                    return $state.go($state.current, {}, {reload: true});
                });
            };

            $rootScope.loginModal = function(){
                loginModal().then(function () {
                    $rootScope.removeAlerts();
                    $state.go('scheduling');
                });
            };

            $rootScope.startIntercom = function(email, date, name){
                Intercom('boot', {
                    app_id: "udg0papy",
                    name: name,
                    email: email,
                    created_at: date
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

            $rootScope.isCollapsed = true;

        }])
        .controller('loginModalCtrl', ['$scope', 'coachSeekAPIService', '$http', '$activityIndicator', '$window',
            function ($scope, coachSeekAPIService, $http, $activityIndicator, $window) {
            
            $scope.attemptLogin = function (email, password) {
                $scope.removeAlerts();
                if($scope.loginForm.$valid){
                    var authHeader = 'Basic ' + btoa(email + ':' + password);
                    $http.defaults.headers.common.Authorization = authHeader;
                    $window.sessionStorage.setItem("authHeader", authHeader);

                    $activityIndicator.startAnimating();
                    coachSeekAPIService.get({section: 'Locations'})
                        .$promise.then(function(){
                            $scope.startIntercom(email);
                            $scope.$close(email);
                        }, function(error){
                            $http.defaults.headers.common.Authorization = null;
                            $rootScope.addAlert({
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
            };

            $scope.cancel = $scope.$dismiss;
        }])
        .controller('comingSoonCtrl', ['$scope', 
            function ($scope) {
                $scope.saveFeedback = function(){
                    Intercom('trackEvent', 'feedback', {feedback: $scope.feedback});
                    $scope.feedbackSent = true;
                };
        }]);