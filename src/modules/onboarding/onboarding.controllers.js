angular.module('onboarding.controllers', ['businessSetup'])
    .controller('onboardingDefaultsModalCtrl', ['$scope', '$q', '$timeout', '$activityIndicator', 'coachSeekAPIService', 'sessionService', 'serviceDefaults', 'coachDefaults',
      function($scope, $q, $timeout, $activityIndicator, coachSeekAPIService, sessionService, serviceDefaults, coachDefaults){
        $scope.coachFirstName = $scope.currentUser.firstName;
        $scope.coachLastName = $scope.currentUser.lastName;
        $scope.createDefaults = function () {
            $scope.removeAlerts();
            if($scope.onboardingDefaultsForm.$valid){
                $activityIndicator.startAnimating();
                $q.all(getDefaultPromises()).then(function(){
                    $scope.$close();
                    if(window.Intercom) {
                        Intercom('update', {Locations: 1});
                        Intercom('update', {Services: 1});
                        Intercom('update', {Coaches: 1});
                    }
                }, $scope.handleErrors).finally(function(){
                    $activityIndicator.stopAnimating();
                });
            } else {
                $scope.onboardingDefaultsForm.coachFirstName.$setTouched();
                $scope.onboardingDefaultsForm.coachLastName.$setTouched();
                $scope.onboardingDefaultsForm.locationName.$setTouched();
                $scope.onboardingDefaultsForm.serviceName.$setTouched();
            }
        };

        function getDefaultPromises(){
            var defaultServiceValues = angular.copy(serviceDefaults);
            return [
                coachSeekAPIService.save({ section: 'Coaches' }, getDefaultCoachValues()).$promise,
                coachSeekAPIService.save({ section: 'Locations' }, {name: $scope.locationName}).$promise,
                coachSeekAPIService.save({ section: 'Services' }, _.assign(defaultServiceValues, {name: $scope.serviceName})).$promise
            ];
        };

        function getDefaultCoachValues(){
            var defaultCoachValues = angular.copy(coachDefaults);
            return _.assign(defaultCoachValues, {
                firstName: $scope.coachFirstName,
                lastName: $scope.coachLastName,
                email: $scope.coachFirstName + $scope.coachLastName + "@" + sessionService.business.domain + '.com',
                phone: i18n.t('onboarding:1800coach') + $scope.coachLastName.toUpperCase()
            });
        };
    }])
    .controller('mobileOnboardingSkipModalCtrl', ['$scope','loginModal','$modalInstance','$state','$stateParams',function ($scope,loginModal,$modalInstance,$state,$stateParams) {
        $scope.continueMobileOnboarding = function(){ 
            $modalInstance.dismiss('cancel');
        };
        $scope.skipMobileOnboarding = function(){
            $state.go('newUserSetup').then(function(){
                $modalInstance.dismiss('cancel');
            }, function(error){});
            
        };
    }])
    .controller('mobileOnboardingSignUpCtrl', ['$rootScope','$scope', '$q', '$stateParams', '$state' , 'loginModal', 'ENV',
        function($rootScope,$scope, $q, $stateParams, $state ,loginModal,ENV){        
            $rootScope.signIn = function(){
                loginModal.open().then(function () {
                    $rootScope.removeAlerts();
                    $state.go('scheduling');
                });
            };
            $rootScope.joinUs = function(){
                $state.go('mobileOnboardingDefault');
            };
    }])
    .controller('mobileOnboardingDefaultCtrl', ['$q','$stateParams', '$state','$rootScope','$scope','$timeout', '$activityIndicator','coachSeekAPIService','serviceDefaults','coachDefaults','mobileOnboardingSkipModal',function ($q,$stateParams,$state,$rootScope,$scope,$timeout, $activityIndicator,coachSeekAPIService,serviceDefaults,coachDefaults,mobileOnboardingSkipModal) {
        $scope.business = {};
        $scope.admin = {};

        $scope.slideNext = function(){
            $('.m-scooch').scooch('next');
        };
        $scope.slidePrev = function(){
            $('.m-scooch').scooch('prev');
        };
        $scope.skipModal = function(){
            mobileOnboardingSkipModal.open('mobileOnboardingSkipModal','mobileOnboardingSkipModalCtrl');
        }
        $scope.createDefaults = function(){
            $scope.removeAlerts();
            // if($scope.onboardingDefaultsForm.$valid){
                $activityIndicator.startAnimating();
                coachSeekAPIService.save({
                    section: 'businessRegistration'}, {
                    admin: $scope.admin, 
                    business: $scope.business
                }).$promise.then(function(newUser){
                    $scope.setupCurrentUser({
                        email: newUser.admin.email,
                        password: $scope.admin.password,
                        firstName: newUser.admin.firstName,
                        lastName: newUser.admin.lastName
                    }, newUser.business);
                    $q.all(getDefaultPromises()).then(function(response){
                        $state.go('scheduling');
                    }, $scope.handleErrors)
                    .finally(function(){
                        $activityIndicator.stopAnimating();
                    });
                    
                }); 
            // }

        };

         function getDefaultPromises(){
            var defaultServiceValues = angular.copy(serviceDefaults);
            return [
                coachSeekAPIService.save({ section: 'Coaches' }, getDefaultCoachValues()).$promise,
                coachSeekAPIService.save({ section: 'Locations' }, {name: $scope.locationName}).$promise,
                coachSeekAPIService.save({ section: 'Services' }, _.assign(defaultServiceValues, {name: $scope.serviceName,pricing:{sessionPrice:$scope.sessionPrice}})).$promise
            ];
        };

        function getDefaultCoachValues(){
            var defaultCoachValues = angular.copy(coachDefaults);
            return _.assign(defaultCoachValues, {
                firstName: $scope.admin.firstName,
                lastName: $scope.admin.lastName,
                email: $scope.admin.email,
                phone: i18n.t('onboarding:1800coach') + $scope.admin.lastName.toUpperCase()
            });
        };

    }]);
