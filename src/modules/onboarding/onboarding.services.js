angular.module('onboarding.services', [])
    .service('onboardingModal', ['$modal', '$rootScope',
        function ($modal, $rootScope) {
            return {
                open: function(template, ctrl) {
                    var instance = $modal.open({
                        templateUrl: 'onboarding/partials/' + template + '.html',
                        controller: ctrl,
                        windowClass: 'onboarding-modal-backdrop',
                        backdrop: 'static'
                    });

                    return instance.result;
                }
            }
        }
    ]);