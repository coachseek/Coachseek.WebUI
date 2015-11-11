angular.module('onboarding',
    [
        'onboarding.controllers',
        'onboarding.directives',
        'onboarding.services'
    ])
    .config(['$stateProvider',function ($stateProvider) {
       $stateProvider
            .state('mobileOnboardingSignUp', {
                url: "/mobile-onboarding-signUp",
                templateUrl: "onboarding/partials/mobileOnboardingSignUp.html",
                controller: 'mobileOnboardingSignUpCtrl',
                data: {
                    requireLogin: false
                }
            })
            .state('mobileOnboardingDefault',{
                url: "/mobile-onboarding",
                templateUrl: "onboarding/partials/mobileOnboardingDefault.html",
                controller: 'mobileOnboardingDefaultsModalCtrl',
                data: {
                    requireLogin: false
                }

            })    
    }])
    .config(['$tooltipProvider', function($tooltipProvider){
        $tooltipProvider.setTriggers({
            'showDragServicePopover': 'hideDragServicePopover',
            'showSessionModalPopover': 'hideSessionModalPopover'
        });
    }]);