/* Controllers */
angular.module('app.controllers', [])
    .controller('appCtrl', ['$rootScope', '$location', '$state', '$http', '$timeout', 'loginModal', 'onlineBookingAPIFactory', 'ENV', 'sessionService', 'coachSeekAPIService', '$cookies', 'expiredLicenseModal','$window',
        function ($rootScope, $location, $state, $http, $timeout, loginModal, onlineBookingAPIFactory, ENV, sessionService, coachSeekAPIService, $cookies, expiredLicenseModal,$window) {
            // TODO - add ability to remove alerts by view
            $rootScope._ = _; //allow lodash.js to be used in angular partials
            $rootScope.Modernizr = Modernizr; //allow Modernizr.js to be used in angular partials

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
                $rootScope.resetSession();
                $rootScope.addAlert({
                    type: 'success',
                    message: 'logged-out'
                });

                loginModal.open().then(function () {
                    $rootScope.removeAlerts();
                    return $state.go($state.current, {}, {reload: true});
                });
            };

            $rootScope.resetSession = function(){
                sessionService.sessionType = null;
                $cookies.remove('coachseekLogin')
                $http.defaults.headers.common.Authorization = null;
                delete sessionService.user;
                delete sessionService.business;
                delete $rootScope.currentUser;
                if(window.Intercom) Intercom('shutdown');
            }

            $rootScope.login = function(){
                loginModal.open().then(function () {
                    $rootScope.removeAlerts();
                    $state.go('scheduling');
                });
            };

            var startIntercom = function(user, business){
                if(window.Intercom){
                    //init Intercom new user
                    if(user.firstName && user.lastName){
                        Intercom('boot', {
                            app_id: "udg0papy",
                            name: user.firstName + " " + user.lastName,
                            email: user.email,
                            created_at: _.now(),
                            business_domain: business.domain,
                            business_name: business.name
                        });
                    //returning user
                    } else {
                        Intercom('boot', {
                            app_id: "udg0papy",
                            email: user.email,
                            business_domain: business.domain,
                            business_name: business.name
                        });
                        Intercom('update', {TotalSessions: _.get(business, 'statistics.totalNumberOfSessions')})
                    }
                }
            };

            function startFullstory(user, business){
                if(window.FS){
                    FS.identify(business.id, {
                      displayName: business.name,
                      email: user.email
                    });
                }
            }

            $rootScope.setupCurrentUser = function(user, business){
                sessionService.sessionType = 'app';
                _.assign(user, {
                    trialDaysLeft: moment(business.authorisedUntil).diff(moment().add(15, 'd'), 'days')
                });
                $rootScope.setUserAuth(user.email, user.password)
                startIntercom(user, business);
                startFullstory(user, business);
                $rootScope.business    = sessionService.business = business;
                $rootScope.currentUser = sessionService.user     = user;
            };

            $rootScope.setUserAuth = function(email, password){
                var authHeader = 'Basic ' + btoa(email + ':' + password);
                $http.defaults.headers.common.Authorization = authHeader;
            };

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
                $rootScope.currentTabTitle = toState.name.split(".")[0];

                var requireLogin = toState.data.requireLogin;
                var requireBusinessDomain = toState.data.requireBusinessDomain;
                var toStateSessionType = toState.data.sessionType;
                var businessDomain = _.first($location.host().split("."));
                if(ENV.name !== 'prod') $window.localStorage.removeItem('completedCoachseekMobileOnboarding');

                if(!sessionService.sessionType){
                    if(businessDomain !== ENV.defaultSubdomain) {
                        toStateSessionType = 'online-booking';
                    } else if(toStateSessionType !== 'app'){
                        // is not a url going to app but needs to be. default to scheduling
                        event.preventDefault();
                        $state.go('scheduling');
                        return false;
                    }

                    //determine session type
                    switch (toStateSessionType) {
                        case 'app':
                            if(!$window.localStorage.getItem('completedCoachseekMobileOnboarding') && !sessionService.isBigScreen){
                                //launch mobile onboarding
                                event.preventDefault();
                                sessionService.sessionType = 'mobile-onboarding';
                                $state.go("mobileOnboardingSignUp");
                            } else if(requireLogin) {
                                if($cookies.get('coachseekLogin')){
                                    //login with cookies
                                    event.preventDefault();
                                    rememberMeLogin(toState, toParams);
                                } else {
                                    //loginModal
                                    event.preventDefault();
                                    loginModal.open().then(function () {
                                        $rootScope.removeAlerts();
                                        return $state.go(toState.name, toParams);
                                    });
                                }
                            }
                            break;
                        case 'online-booking':
                            event.preventDefault();
                            sessionService.sessionType = 'online-booking';
                            runOnlineBookingSite(businessDomain)
                            break;
                        default:
                            //navigate to 404?
                            break;
                    }
                } else if(toStateSessionType && sessionService.sessionType !== toStateSessionType) {
                    //redirect to default
                    event.preventDefault();
                    switch (sessionService.sessionType) {
                        case 'app':
                            $state.go('scheduling');
                            break;
                        case 'online-booking':
                            $state.go('booking.selection');
                            break;
                        default:
                            //navigate to 404?
                            break;
                    }
                } else {
                    $rootScope.removeAlerts();
                }
            });

            function runOnlineBookingSite(businessDomain){
                $rootScope.appLoading = true;
                onlineBookingAPIFactory.anon(businessDomain).get({section:'Business'}).$promise
                    .then(function(business){
                        sessionService.business = business;
                        startFullstory({}, business);
                        if($location.search().currentBooking){
                            sessionService.currentBooking = JSON.parse($location.search().currentBooking);
                            $state.go('booking.confirmation');
                        } else {
                            $state.go('booking.selection');
                        }
                    }, function(){
                        $state.go('error.404');
                    }).finally(function(){
                        $rootScope.appLoading = false;
                    });
            }

            function rememberMeLogin(toState, toParams){
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
                        $rootScope.resetSession()
                        $rootScope.addAlert({
                            type: 'danger',
                            message: error.statusText,
                            code: error.data.code
                        });

                        if(error.status === 403 && error.data.code === 'license-expired'){
                            expiredLicenseModal.open();
                        } else {
                            loginModal.open().then(function () {
                                $rootScope.removeAlerts();
                                return $state.go(toState.name, toParams);
                            });
                        }
                    }).finally(function(){
                        $rootScope.appLoading = false;
                    });
            }

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
        .controller('loginModalCtrl', ['$q', '$scope', 'coachSeekAPIService', '$http', '$activityIndicator', '$cookies', 'expiredLicenseModal',
            function ($q, $scope, coachSeekAPIService, $http, $activityIndicator, $cookies, expiredLicenseModal) {
            
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
                            if(error.status === 403 && error.data.code === 'license-expired'){
                                $scope.$dismiss();
                                expiredLicenseModal.open();
                            }
                            $http.defaults.headers.common.Authorization = null;
                            $scope.addAlert({
                                type: 'danger',
                                message: error.statusText,
                                code: error.data.code
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
        }]);