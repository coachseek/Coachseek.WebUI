angular.module('onboarding.directives', [])
    .directive('onboardingPopover', ['$timeout', 'sessionService', 'onboardingModal', function($timeout, sessionService, onboardingModal){
        return {
            scope: {
                onboardingShow: '=',
                onboardingHide: '=',
                onboardingStep: '='
            },
            link: function(scope, elem){
                scope.$on([scope.onboardingShow, scope.onboardingHide], function(ev, delay, exitOnboarding){
                    $timeout(function(){
                        elem[0].dispatchEvent(new Event(ev.name))
                        if(exitOnboarding) exitOnboardingModal();
                    }, delay);
                });

                function exitOnboardingModal(){
                    onboardingModal.open('exitOnboardingModal')
                        .then(function(){
                            $timeout(function(){
                                elem[0].dispatchEvent(new Event(scope.onboardingShow));
                            });
                        }, function(){
                            heap.track('Onboarding Close', {step: scope.onboardingStep});
                            sessionService.onboarding.showOnboarding = false;
                        });
                }
            }
        };
    }])
    .directive('scoochSlider', [function () {
        return {
            restrict: 'A',
            scope: {
                options: '='
            },
            link: function (scope, elem) {
                elem.scooch(scope.options);
            }
        };
    }]);