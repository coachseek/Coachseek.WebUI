angular.module('onboarding',
    [
        'onboarding.controllers',
        'onboarding.directives',
        'onboarding.services'
    ])
    .config(['$tooltipProvider', function($tooltipProvider){
        $tooltipProvider.setTriggers({
            'showDragServicePopover': 'hideDragServicePopover',
            'showSessionModalPopover': 'hideSessionModalPopover'
        });
    }]);