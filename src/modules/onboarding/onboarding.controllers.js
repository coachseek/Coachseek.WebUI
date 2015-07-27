angular.module('onboarding.controllers', [])
    .controller('onboardingDefaultsModalCtrl', ['$scope', '$q', '$timeout', '$activityIndicator', 'coachSeekAPIService', 'sessionService', 'serviceDefaults', 'coachDefaults',
      function($scope, $q, $timeout, $activityIndicator, coachSeekAPIService, sessionService, serviceDefaults, coachDefaults){
        $scope.createDefaults = function () {
            $scope.removeAlerts();
            if($scope.onboardingDefaultsForm.$valid){
                $activityIndicator.startAnimating();
                $q.all(getDefaultPromises()).then(function(){
                    $scope.$close();
                }, $scope.handleErrors).finally(function(){
                    $activityIndicator.stopAnimating();
                });
            } else {
                var errorTypes = $scope.onboardingDefaultsForm.$error;
                _.forEach(errorTypes, function(errorType, key){
                    _.forEach(errorType, function(error){
                        var errorMessage = error.$name;
                        $scope.addAlert({
                            type: 'warning',
                            message: 'onboarding:' + errorMessage + '-invalid'
                        });
                    });
                });
            }
        };

        $scope.closeModal = function(){
            $scope.$dismiss();
        };

        function getDefaultPromises(){
            return [
                coachSeekAPIService.save({ section: 'Coaches' }, getDefaultCoachValues()).$promise,
                coachSeekAPIService.save({ section: 'Locations' }, {name: $scope.locationName}).$promise,
                coachSeekAPIService.save({ section: 'Services' }, _.assign(serviceDefaults, {name: $scope.serviceName})).$promise
            ];
        };

        function getDefaultCoachValues(){
            return _.assign(coachDefaults, {
                firstName: $scope.coachFirstName,
                lastName: $scope.coachLastName,
                email: $scope.coachFirstName + $scope.coachLastName + "@" + sessionService.business.domain + '.com',
                phone: i18n.t('onboarding:1800coach') + $scope.coachLastName.toUpperCase()
            });
        };
    }])
    .controller('onboardingReviewModalCtrl', ['$scope', 'sessionService',
      function($scope, sessionService){

        $scope.closeModal = function(){
            $scope.$dismiss();
            // turn onboarding off
        };
    }]);