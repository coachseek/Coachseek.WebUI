/* Controllers */
angular.module('app.controllers', [])
    .controller('appCtrl', ['$rootScope', '$location', '$state', '$http', '$timeout', 'loginModal', 'onlineBookingAPIFactory', 'ENV', 'sessionService',
        function ($rootScope, $location, $state, $http, $timeout, loginModal, onlineBookingAPIFactory, ENV, sessionService) {
            // TODO - add ability to remove alerts by view
            $rootScope.addAlert = function(alert){

                _.forEach($rootScope.alerts, function(existingAlert, index){
                    if(existingAlert && existingAlert.message === alert.message){
                        $rootScope.closeAlert(index);
                    }
                });

                _.assign(alert, {
                    dismissTimeout: alert.type === 'success' ? 3000 : 5000
                });

                $rootScope.alerts.push(alert);
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
                delete sessionService.user;
                delete sessionService.business;
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

            $rootScope.login = function(){
                loginModal().then(function () {
                    $rootScope.removeAlerts();
                    $state.go('scheduling');
                });
            };

            var startIntercom = function(user, date){
                if(window.Intercom){
                    Intercom('boot', {
                        app_id: "udg0papy",
                        name: user.firstName && user.lastName ? user.firstName + " " + user.lastName : user.email,
                        email: user.email,
                        created_at: date
                    });
                }
            };

            $rootScope.setupCurrentUser = function(user, business){
                $rootScope.setUserAuth(user.email, user.password)
                startIntercom(user, _.now());
                sessionService.user = user;
                sessionService.business = business;
                $rootScope.currentUser = sessionService.user;
            };

            $rootScope.setUserAuth = function(email, password){
                var authHeader = 'Basic ' + btoa(email + ':' + password);
                $http.defaults.headers.common.Authorization = authHeader;
            };

            $rootScope.redirectToApp = function(){
                $timeout(function(){
                    window.location = 'https://app.coachseek.com';
                }, 5000)
            };

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
                var requireLogin = toState.data.requireLogin;
                var requireBusinessDomain = toState.data.requireBusinessDomain;
                var businessDomain = _.first($location.host().split("."));
                if(businessDomain !== 'app' && !sessionService.business){
                    event.preventDefault();
                    onlineBookingAPIFactory.anon(businessDomain).get({section:'Business'}).$promise
                        .then(function(business){
                            sessionService.business = business;
                            if($location.search().currentBooking){
                                sessionService.currentBooking = JSON.parse($location.search().currentBooking);
                                $state.go('booking.confirmation');
                            } else {
                                $state.go('booking.selection');
                            }
                        }, function(){
                            $rootScope.addAlert({
                                type: 'warning',
                                message: 'businessDomain-invalid'
                            });
                            $rootScope.redirectToApp();
                        });
                } else if (requireBusinessDomain && businessDomain === 'app') {
                    event.preventDefault();
                    $state.go('scheduling');
                } else if (requireLogin && !sessionService.user) {
                    event.preventDefault();

                    loginModal().then(function () {
                        $rootScope.removeAlerts();
                        return $state.go(toState.name, toParams);
                    });
                } else {
                    $rootScope.removeAlerts();
                }
            });

            $rootScope.ENV = ENV;
            $rootScope.isCollapsed = true;
            $rootScope.isBigScreen = sessionService.isBigScreen;
            $(window).on('resize', function () {
                $rootScope.isBigScreen = $(this).width() > 768;
                $rootScope.$apply();
            }); 
        }])
        .controller('loginModalCtrl', ['$scope', 'coachSeekAPIService', '$http', '$activityIndicator', '$window',
            function ($scope, coachSeekAPIService, $http, $activityIndicator, $window) {
            
            $scope.attemptLogin = function (email, password) {
                $scope.removeAlerts();
                if($scope.loginForm.$valid){
                    $scope.setUserAuth(email, password);

                    $activityIndicator.startAnimating();
                    coachSeekAPIService.get({section: 'Business'})
                        .$promise.then(function(business){
                            var user = {
                                email: email,
                                password: password
                            };
                            $scope.$close({user:user, business:business});
                        }, function(error){
                            $http.defaults.headers.common.Authorization = null;
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