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
    .directive('scoochSlider', function () {
        return {
            restrict: 'A',
            scope: {
                options: '='
            },
            link: function (scope, elem) {
                elem.scooch(scope.options);
            }
        };
    })
    .directive('mobileOnboardingDefaultSlider', function(){
        return {
            restrict: 'A',
            link: function (scope, elem) {
                elem.find('input, select').on('focus', function(event){
                    elem.find('input').not(this).attr("readonly", "readonly");
                    elem.find('select').not(this).attr("disabled", "disabled");
                });

                elem.find('input, select').on('blur', function(event){
                    elem.find('input').removeAttr("readonly");
                    elem.find('select').removeAttr("disabled");
                });

                scope.slideNext = function(inputNames){
                    //validate inputs if necessary
                    if(inputNames){
                        if(inputsValid(inputNames)){
                            elem.scooch('next');
                        }else{
                            _.each(inputNames,function(inputName){
                                scope.mobileOnboardingDefaultForm[inputName].$setTouched();
                            });
                        }
                    }else{
                        elem.scooch('next');
                    }  
                };

                scope.slidePrev = function(){
                    elem.scooch('prev');
                };

                function inputsValid(inputNames){
                    return  _.every(inputNames,function(inputName){
                        return scope.mobileOnboardingDefaultForm[inputName].$valid;
                    });
                }
            }
        };
    });