angular.module('scheduling',
    [
        'scheduling.controllers',
        'scheduling.directives',
        'scheduling.services',

        'ngDragDrop',
        'ui.calendar'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('scheduling', {
                url: "/scheduling",
                templateUrl: "scheduling/partials/schedulingView.html",
                controller: 'schedulingCtrl',
                data: {
                    requireLogin: true
                }
            });
    }]);