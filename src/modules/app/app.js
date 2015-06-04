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
    'angularMoment',

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
    'ngActivityIndicator',
    'ngClipboard'

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
        $urlRouterProvider.otherwise(function($injector) {
            var $state = $injector.get("$state");
            $state.go("scheduling");
        });

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
            }).state('comingSoon.financials', {
                url: "/financials/coming-soon"
            });
    }])
    .config(['$compileProvider', function ($compileProvider) {
        $compileProvider.debugInfoEnabled(false);
    }])
    .run(['$rootScope', '$state', '$stateParams',
        function($rootScope, $state, $stateParams){
            FastClick.attach(document.body);

            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            $rootScope.alerts = [];
    }]);
