/* App Module */
angular.module('coachSeekApp',
  [
    // LIBRARIES
  	'ui.bootstrap',
    'ngRoute',
    'jm.i18next',

    // coachSeekApp
    'coachSeekApp.controllers', 
    'coachSeekApp.services',
    'coachSeekApp.directives',

    // MODULES
    'workingHours',
    'locations',

    // UTILITIES
    'ngActivityIndicator'

  ]).config(['$routeProvider', function ($routeProvider){

    $routeProvider.otherwise({redirectTo: '/'});

  }]).config(['$i18nextProvider', function( $i18nextProvider ){

    $i18nextProvider.options = {
        lng: 'en',
        fallbackLng: 'en',
        ns : {
            namespaces : ['coachSeekApp', 'workingHours'],
            defaultNs: 'coachSeekApp'
        },
        resGetPath: 'modules/__ns__/i18n/__lng__/__ns__.json'
        // defaultLoadingValue: ''
    };

  }]);