/* Controllers */
angular.module('app.controllers', [])
    .controller('appCtrl', ['$rootScope', '$location', '$state', '$http', '$timeout', 'loginModal', 'onlineBookingAPIFactory', 'ENV', 'sessionService', 'coachSeekAPIService', '$cookies',
        function ($rootScope, $location, $state, $http, $timeout, loginModal, onlineBookingAPIFactory, ENV, sessionService, coachSeekAPIService, $cookies) {
            // TODO - add ability to remove alerts by view
            $rootScope._ = _;

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

            $rootScope.handleErrors = function(errors){
                _.forEach(errors.data, function(error){
                    $rootScope.addAlert({
                        type: 'danger',
                        code: error.code,
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
                $cookies.remove('coachseekLogin')
                if(window.Intercom) Intercom('shutdown');
                $rootScope.addAlert({
                    type: 'success',
                    message: 'logged-out'
                });

                loginModal.open().then(function () {
                    $rootScope.removeAlerts();
                    return $state.go($state.current, {}, {reload: true});
                });
            };

            $rootScope.login = function(){
                loginModal.open().then(function () {
                    $rootScope.removeAlerts();
                    $state.go('scheduling');
                });
            };

            var startIntercom = function(user){
                if(window.Intercom){
                    //init Intercom new user
                    if(user.firstName && user.lastName){
                        Intercom('boot', {
                            app_id: "udg0papy",
                            name: user.firstName + " " + user.lastName,
                            email: user.email,
                            created_at: _.now()
                        });
                    //returning user
                    } else {
                        Intercom('boot', {
                            app_id: "udg0papy",
                            email: user.email
                        });
                    }
                }
            };

            function startHeapAnalytics(user, business){
                heap.identify({
                    handle: business.id,
                    businessName: business.name,
                    email: user.email
                });
            }

            $rootScope.setupCurrentUser = function(user, business){
                $rootScope.setUserAuth(user.email, user.password)
                startIntercom(user);
                startHeapAnalytics(user, business);
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
                    window.location = 'https://' + ENV.defaultSubdomain + '.coachseek.com';
                }, 5000)
            };

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
                var requireLogin = toState.data.requireLogin;
                var requireBusinessDomain = toState.data.requireBusinessDomain;
                var businessDomain = _.first($location.host().split("."));
                if(businessDomain !== ENV.defaultSubdomain && !sessionService.business){
                    event.preventDefault();
                    $rootScope.appLoading = true;
                    onlineBookingAPIFactory.anon(businessDomain).get({section:'Business'}).$promise
                        .then(function(business){
                            sessionService.business = business;
                            startHeapAnalytics({}, business);
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
                        }).finally(function(){
                            $rootScope.appLoading = false;
                        });
                } else if (requireBusinessDomain && businessDomain === 'app') {
                    event.preventDefault();
                    $state.go('scheduling');
                } else if (requireLogin && $cookies.get('coachseekLogin') && !sessionService.business) {
                    event.preventDefault();

                    var coachseekLogin = $cookies.get('coachseekLogin');
                    $http.defaults.headers.common.Authorization = 'Basic ' + coachseekLogin;
                    $rootScope.appLoading = true;
                    coachSeekAPIService.get({section: 'Business'})
                        .$promise.then(function(business){
                            var userData = atob(coachseekLogin).split(':');
                            $cookies.put('coachseekLogin', coachseekLogin, {'expires': moment().add(14, 'd').toDate()});
                            var user = {
                                email: userData[0],
                                password: userData[1]
                            };
                            $rootScope.setupCurrentUser(user, business);
                            $state.go(toState.name, toParams);
                        }, function(error){
                            $http.defaults.headers.common.Authorization = null;
                            $rootScope.addAlert({
                                type: 'danger',
                                message: error.statusText
                            });
                        }).finally(function(){
                            $rootScope.appLoading = false;
                        });
                } else if (requireLogin && !sessionService.user) {
                    event.preventDefault();

                    loginModal.open().then(function () {
                        $rootScope.removeAlerts();
                        return $state.go(toState.name, toParams);
                    });
                } else {
                    $rootScope.removeAlerts();
                }
            });

            $rootScope.showFeature = function(){
                return ENV.name === 'dev' || _.includes(_.get(ENV, 'allFeaturesWhitelist'), _.get(sessionService, 'user.email'))
            };

            $rootScope.ENV = ENV;
            $rootScope.isCollapsed = true;
            $rootScope.isBigScreen = sessionService.isBigScreen;
            $(window).on('resize', function () {
                $rootScope.isBigScreen = $(this).width() > 768;
                $rootScope.$apply();
            });

            var keys = {};

            $(document).keydown(function (e) {
                keys[e.which] = true;
                if(keys[16] && keys[32] && keys[79]){
                    sessionService.onboarding.showOnboarding = true;
                    $state.reload();
                }
            });

            $(document).keyup(function (e) {
                delete keys[e.which];
            });
        }])
        .controller('loginModalCtrl', ['$scope', 'coachSeekAPIService', '$http', '$activityIndicator', '$cookies',
            function ($scope, coachSeekAPIService, $http, $activityIndicator, $cookies) {
            
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

                            if($scope.rememberMe) $cookies.put('coachseekLogin', btoa(email + ':' + password), {'expires': moment().add(14, 'd').toDate()});
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