/* App Module */
angular.module('app',
  [
    // LIBRARIES
    'ngAnimate',
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

    ]).config(['$stateProvider', function ($stateProvider){
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
    }]).run(['$rootScope', '$state', '$stateParams', 'editableOptions',
        function($rootScope, $stateParams, $state, editableOptions){
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $rootScope.alerts = [];
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    }]);