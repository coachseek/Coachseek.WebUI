/* App Module */
angular.module('app',
  [
    // LIBRARIES
    'ngAnimate',
    'ngMessages',
    'ngSanitize',
    'ngResource',
    'ngTouch',
  	'ui.bootstrap',
    'ui.router',
    'jm.i18next',

    // coachSeekApp
    'app.controllers',
    'app.services',
    'app.directives',

    // MODULES
    'businessSetup',
    'scheduling',
    'customers',
    'booking',

    // UTILITIES
    'ngActivityIndicator'

    ]).config(['$i18nextProvider', function( $i18nextProvider ){
        $i18nextProvider.options = {
            lng: 'en',
            fallbackLng: 'en',
            ns : {
                namespaces : ['app', 'businessSetup', 'scheduling', 'customers', 'booking'],
                defaultNs: 'app'
            },
            resGetPath: 'i18n/__lng__.json',
            defaultLoadingValue: ''
        };
    }])
    .config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/scheduling');

        $stateProvider
            .state('comingSoon', {
                templateUrl: "app/partials/comingSoon.html",
                controller: 'comingSoonCtrl',
                data: {
                    requireLogin: true
                }
            })
            .state('comingSoon.dashboard', {
                url: "/dashboard/coming-soon"
            }).state('comingSoon.services', {
                url: "/services/coming-soon"
            }).state('comingSoon.financials', {
                url: "/financials/coming-soon"
            });
    }])
    .run(['$rootScope', '$state', '$stateParams',
        function($rootScope, $state, $stateParams){
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            $rootScope.alerts = [];
    }]);
