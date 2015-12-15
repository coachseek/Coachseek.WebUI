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
                $cookies.remove('coachseekLogin')
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

            $rootScope.redirectToApp = function(){
                $timeout(function(){
                    window.location = 'https://' + ENV.defaultSubdomain + '.coachseek.com';
                }, 5000)
            };

            $rootScope.detectCurrentStateNameOnMobile = function(currentStateName) {
                switch(currentStateName){
                    case 'scheduling':
                        $rootScope.currentStateNameOnMobile = i18n.t("app:stateName.scheduling");
                        $rootScope.displayCurrentStateNameOnMobile = true;
                        break;
                    case 'customers':
                        $rootScope.currentStateNameOnMobile = i18n.t("app:stateName.customers");
                        $rootScope.displayCurrentStateNameOnMobile = true;
                        break;
                    case 'businessSetup.business':
                        $rootScope.currentStateNameOnMobile = i18n.t("app:stateName.businessSetup");
                        $rootScope.displayCurrentStateNameOnMobile = true;
                        break;
                    case 'bookingAdmin':
                        $rootScope.currentStateNameOnMobile = i18n.t("app:stateName.bookingAdmin");
                        $rootScope.displayCurrentStateNameOnMobile = true;
                        break;
                    default:
                        $rootScope.displayCurrentStateNameOnMobile = false;
                }       
            }

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
                $rootScope.detectCurrentStateNameOnMobile(toState.name);
                $rootScope.displayCurrentStateNameOnMobile = true;

                var requireLogin = toState.data.requireLogin;
                var requireBusinessDomain = toState.data.requireBusinessDomain;
                var businessDomain = _.first($location.host().split("."));

                if(ENV.name !== 'prod') $window.localStorage.removeItem('hasLaunchedCoachseek');
                var hasLaunchedCoachseek = $window.localStorage.getItem('hasLaunchedCoachseek');
                if(businessDomain === ENV.defaultSubdomain && !$cookies.get('coachseekLogin') && !hasLaunchedCoachseek && !sessionService.mobileOnboarding.showMobileOnboarding && !sessionService.isBigScreen){  
                    event.preventDefault();
                    sessionService.mobileOnboarding.showMobileOnboarding = true;           
                    $window.localStorage.setItem('hasLaunchedCoachseek', true);
                    $state.go("mobileOnboardingSignUp");
                }else if(businessDomain !== ENV.defaultSubdomain && !sessionService.business&&!sessionService.mobileOnboarding.showMobileOnboarding){
                    event.preventDefault();
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
                            $rootScope.addAlert({
                                type: 'warning',
                                message: 'businessDomain-invalid'
                            });
                            $rootScope.redirectToApp();
                        }).finally(function(){
                            $rootScope.appLoading = false;
                        });
                } else if (requireBusinessDomain && businessDomain === 'app'&&!sessionService.mobileOnboarding.showMobileOnboarding) {
                    event.preventDefault();
                    $state.go('scheduling');
                } else if (requireLogin && $cookies.get('coachseekLogin') && !sessionService.business&&!sessionService.mobileOnboarding.showMobileOnboarding) {
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
                                message: error.statusText,
                                code: error.data.code
                            });
                            $cookies.remove('coachseekLogin');

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
                } else if (requireLogin && !sessionService.user&&!sessionService.mobileOnboarding.showMobileOnboarding) {
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