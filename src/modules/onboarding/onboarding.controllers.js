angular.module('onboarding.controllers', [])
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
    .controller('mobileOnboardingSignUpCtrl', ['$rootScope','$scope', '$q', '$stateParams', '$state' , 'loginModal', 'ENV','mobileOnboardingModal',
        function($rootScope,$scope, $q, $stateParams, $state ,loginModal,ENV,mobileOnboardingModal){        
            $rootScope.signIn = function(){
                loginModal.open().then(function () {
                    $rootScope.removeAlerts();
                    $state.go('scheduling');
                });
            }
            $rootScope.joinUs = function(){
                $state.go('mobileOnboardingDefault');
            }
    }])
    .controller('mobileOnboardingDefaultsModalCtrl', ['$scope', function ($scope) {
        
    }]);
