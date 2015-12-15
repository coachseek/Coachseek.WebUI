angular.module('onboarding',
    [
        'onboarding.controllers',
        'onboarding.directives',
        'onboarding.services'
    ])
    .config(['$stateProvider',function ($stateProvider) {
       $stateProvider
            .state('mobileOnboardingSignUp', {
                url: "/mobile-onboarding-sign-up",
                templateUrl: "onboarding/partials/mobileOnboardingSignUp.html",
                controller: 'mobileOnboardingSignUpCtrl',
                data: {
                    requireLogin: false,
                    sessionType: 'mobile-onboarding'
                }
            })
            .state('mobileOnboardingDefault',{
                url: "/mobile-onboarding",
                templateUrl: "onboarding/partials/mobileOnboardingDefault.html",
                controller: 'mobileOnboardingDefaultCtrl',
                data: {
                    requireLogin: false,
                    sessionType: 'mobile-onboarding'
                }
            });    
    }])
    .config(['$tooltipProvider', function($tooltipProvider){
        $tooltipProvider.setTriggers({
            'showDragServicePopover': 'hideDragServicePopover',
            'showSessionModalPopover': 'hideSessionModalPopover'
        });
    }]);