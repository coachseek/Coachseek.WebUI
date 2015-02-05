/* App Module */
angular.module('app',
  [
    // LIBRARIES
    'ngAnimate',
    'ngMessages',
    'ngSanitize',
    'ngResource',
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
    
    // UTILITIES
    'ngActivityIndicator'

    ]).config(['$stateProvider', '$locationProvider', function ($stateProvider){
        $stateProvider.state('home', { url: "/" });
    }]).config(['$i18nextProvider', function( $i18nextProvider ){
        $i18nextProvider.options = {
            lng: 'en',
            fallbackLng: 'en',
            ns : {
                namespaces : ['app', 'businessSetup', 'scheduling'],
                defaultNs: 'app'
            },
            resGetPath: 'i18n/__lng__.json',
            defaultLoadingValue: ''
        };
    }])
    .config(['$httpProvider', function($httpProvider) {
        //TEMP AUTH CREDENTIALS
        //TODO - REMOVE WHEN WE HAVE SESSIONS AND CAN SET AUTH THERE
        $httpProvider.defaults.headers.common['Authorization'] = 'Basic ckBsb2IuY29tOmxramFsZHNk';
    }])
    .run(['$rootScope', '$state', '$stateParams',
        function($rootScope, $stateParams, $state, editableOptions){
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $rootScope.alerts = [];
    }]);