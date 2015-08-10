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
                        elem.trigger(ev.name);
                        if(exitOnboarding) exitOnboardingModal();
                    }, delay);
                });

                function exitOnboardingModal(){
                    onboardingModal.open('exitOnboardingModal')
                        .then(function(){
                            $timeout(function(){
                                elem.trigger(scope.onboardingShow)
                            });
                        }, function(){
                            ga('send', 'event', 'onboarding', 'close', scope.onboardingStep);
                            sessionService.onboarding.showOnboarding = false;
                        });
                }
            }
        };
    }])