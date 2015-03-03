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
    'customers',
    
    // UTILITIES
    'ngActivityIndicator'

    ]).config(['$i18nextProvider', function( $i18nextProvider ){
        $i18nextProvider.options = {
            lng: 'en',
            fallbackLng: 'en',
            ns : {
                namespaces : ['app', 'businessSetup', 'scheduling', 'customers'],
                defaultNs: 'app'
            },
            resGetPath: 'i18n/__lng__.json',
            defaultLoadingValue: ''
        };
    }])
    .run(['$rootScope', '$state', '$stateParams',
        function($rootScope, $state, $stateParams){
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            $rootScope.alerts = [];
    }]);