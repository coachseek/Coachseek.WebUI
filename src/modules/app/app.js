/* App Module */
angular.module('app',
  [
    // LIBRARIES
  	'ui.bootstrap',
    'ngRoute',
    'jm.i18next',

    // coachSeekApp
    'app.controllers', 
    'app.services',
    'app.directives',

    // MODULES
    'businessSetup',

    // UTILITIES
    'ngActivityIndicator' 

  ]).config(['$routeProvider', function ($routeProvider){

    $routeProvider.otherwise({redirectTo: '/'});

  }]).config(['$i18nextProvider', function( $i18nextProvider ){

    $i18nextProvider.options = {
        lng: 'en',
        fallbackLng: 'en',
        ns : {
            namespaces : ['app', 'businessSetup'],
            defaultNs: 'app'
        },
        resGetPath: 'modules/__ns__/i18n/__lng__/__ns__.json'
        // defaultLoadingValue: ''
    };

    }]).run(['$rootScope', function($rootScope){
        $rootScope.alerts = [];
    }]);