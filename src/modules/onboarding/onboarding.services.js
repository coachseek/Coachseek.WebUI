angular.module('onboarding.services', [])
    .service('onboardingModal', ['$modal', '$rootScope',
        function ($modal, $rootScope) {
            return {
                open: function(template, ctrl, windowClass) {
                    var instance = $modal.open({
                        templateUrl: 'onboarding/partials/' + template + '.html',
                        controller: ctrl,
                        windowClass: 'onboarding-modal-backdrop ' + (windowClass ? windowClass : ''),
                        backdrop: 'static'
                    });

                    return instance.result;
                }
            }
        }
    ])
    .service('getOnboardingDefaults', ['coachSeekAPIService', 'sessionService', 'serviceDefaults', 'coachDefaults',
        function(coachSeekAPIService, sessionService, serviceDefaults, coachDefaults){
            function getDefaultCoachValues(firstName, lastName, email){
                var defaultCoachValues = angular.copy(coachDefaults);
                return _.assign(defaultCoachValues, {
                    firstName: firstName,
                    lastName: lastName,
                    email: email || firstName + lastName + "@" + sessionService.business.domain + '.com',
                    phone: i18n.t('onboarding:1800coach') + lastName.toUpperCase()
                });
            };

            return function(locationName, serviceName, firstName, lastName, email){
                var defaultServiceValues = angular.copy(serviceDefaults);
                return {
                    coach: coachSeekAPIService.save({ section: 'Coaches' }, getDefaultCoachValues(firstName, lastName, email)).$promise,
                    location: coachSeekAPIService.save({ section: 'Locations' }, {name: locationName}).$promise,
                    service: coachSeekAPIService.save({ section: 'Services' }, _.assign(defaultServiceValues, {name: serviceName})).$promise
                };
            }
    }]);