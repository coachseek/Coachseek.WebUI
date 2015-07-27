angular.module('onboarding.directives', [])
    .directive('onboardingPopover', ['$timeout', function($timeout){
        return {
            scope: {
                onboardingShow: '=',
                onboardingHide: '='
            },
            link: function(scope, elem){
                scope.$on([scope.onboardingShow, scope.onboardingHide], function(ev, delay){
                    $timeout(function(){
                        elem.trigger(ev.name);                        
                    }, delay);
                });
            }
        };
    }])