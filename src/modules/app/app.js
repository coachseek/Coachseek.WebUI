/* App Module */
angular.module('app',
  [
    'envConfig',

    // LIBRARIES
    'ngAnimate',
    'ngMessages',
    'ngSanitize',
    'ngResource',
    'ngTouch',
    'ngCookies',
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
    'onboarding',

    // UTILITIES
    'ngActivityIndicator',
    'ngClipboard'

    ]).config(['$i18nextProvider', function( $i18nextProvider ){
        $i18nextProvider.options = {
            lng: 'en',
            fallbackLng: 'en',
            ns : {
                namespaces : ['app', 'businessSetup', 'scheduling', 'customers', 'booking', 'onboarding'],
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
    }])
    .config(['$compileProvider', function ($compileProvider) {
        $compileProvider.debugInfoEnabled(false);
    }])
    .run(['$rootScope', '$state', '$stateParams','$window',
        function($rootScope, $state, $stateParams,$window){
            FastClick.attach(document.body);

            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            $rootScope.alerts = [];
            $window.localStorage.clear();
            var applaunchCount = $window.localStorage.getItem('launchCount');
            if(!applaunchCount){               
                $state.go("mobileOnboardingSignUp");
                $window.localStorage.setItem('launchCount',1);
            }

            $window.fbAsyncInit = function() {
                FB.init({
                  appId      : '172144976459129',
                  xfbml      : true,
                  version    : 'v2.5'
                });
            };
    }]);