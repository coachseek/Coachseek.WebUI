angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('index.html',
    "<!DOCTYPE html>\r" +
    "\n" +
    "<html>\r" +
    "\n" +
    "<head>\r" +
    "\n" +
    "    <meta charset=\"utf-8\" />\r" +
    "\n" +
    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r" +
    "\n" +
    "    <title>Coachseek</title>\r" +
    "\n" +
    "    <link rel=\"shortcut icon\" href=\"assets/pics/favicon.png\">\r" +
    "\n" +
    "    <link rel=\"stylesheet\" href=\"css/style.css\">\r" +
    "\n" +
    "    <script src=\"js/libs.js\"></script>\r" +
    "\n" +
    "    <script src=\"js/scripts.js\"></script>\r" +
    "\n" +
    "    <script src=\"js/templates.js\"></script>\r" +
    "\n" +
    "</head>\r" +
    "\n" +
    "<body ng-app=\"app\" ng-controller=\"appCtrl\">\r" +
    "\n" +
    "    <div class=\"navbar navbar-inverse navbar-fixed-top\">\r" +
    "\n" +
    "        <div class=\"container\">\r" +
    "\n" +
    "            <activity-indicator ui-sref=\"businessSetup.business\"></activity-indicator>\r" +
    "\n" +
    "            <ul class=\"nav navbar-nav navbar-left\">\r" +
    "\n" +
    "                <li><a ui-sref=\"businessSetup.business\" ng-class=\"{ active: $state.includes('businessSetup') }\">{{'settings' | i18next}}</a></li>\r" +
    "\n" +
    "                <li><a class=\"inactive\" ui-sref=\"dashboard\" ui-sref-active=\"active\">{{'dashboard' | i18next}}</a></li>\r" +
    "\n" +
    "                <li><a ui-sref=\"scheduling\" ui-sref-active=\"active\">{{'scheduling' | i18next}}</a></li>\r" +
    "\n" +
    "                <li><a class=\"inactive\" ui-sref=\"services\" ui-sref-active=\"active\">{{'services' | i18next}}</a></li>\r" +
    "\n" +
    "                <li><a class=\"inactive\" ui-sref=\"customers\" ui-sref-active=\"active\">{{'customers' | i18next}}</a></li>\r" +
    "\n" +
    "                <li><a class=\"inactive\" ui-sref=\"financials\" ui-sref-active=\"active\">{{'financials' | i18next}}</a></li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "            <ul class=\"nav navbar-nav navbar-right\">\r" +
    "\n" +
    "                <li class=\"logout\" ng-click=\"currentUser ? logout() : loginModal()\" ng-i18next>{{currentUser ? 'logout-text' : 'login-text'}}</li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div ui-view id=\"main-view\" state=\"{{$state.current.name}}\"></div>\r" +
    "\n" +
    "    <div class=\"alert-container\">\r" +
    "\n" +
    "        <alert class=\"fade-in-out\" ng-repeat=\"alert in alerts\" type=\"{{alert.type}}\" close=\"closeAlert($index)\" >\r" +
    "\n" +
    "            <span ng-i18next=\"[i18next]({name:alert.name}){{alert.message}}\"></span>\r" +
    "\n" +
    "        </alert>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</body>\r" +
    "\n" +
    "</html>\r" +
    "\n"
  );

}]);
