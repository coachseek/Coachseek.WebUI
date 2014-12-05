angular.module('coachSeekApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('coachSeekApp/partials/activityIndicator.html',
    "<div class=\"indicator-container\">\n" +
    "\t<div class='outer-logo'></div>\n" +
    "\t<div ng-class=\"{active: AILoading}\" class='inner-logo'></div>\n" +
    "</div>"
  );


  $templateCache.put('coachServices/partials/coachServices.html',
    "<h1>SERVICES<h1>"
  );


  $templateCache.put('locations/partials/locations.html',
    "<h1>LOCATIONS<h1>"
  );


  $templateCache.put('workingHours/partials/coachListView.html',
    "<a href=\"#/registration/locations\">{{'workingHours:nav-to-locations' | i18next}}</a>\n" +
    "<h3>{{'workingHours:coach-list-title' | i18next}}</h3>\n" +
    "<a class=\"nav-to-services\" ng-click=\"navigateToServices()\">{{'workingHours:nav-to-services' | i18next}}</a>\n" +
    "<div class=\"coach-list-view\" ng-hide=\"coach\">\n" +
    "    <ul>\n" +
    "        <li class=\"coach-details\" ng-repeat=\"coach in coachList | orderBy:'lastName'\">\n" +
    "            <span class=\"coach-name\">{{coach.firstName}} {{coach.lastName}}</span>\n" +
    "            <span class=\"coach-email\">{{coach.email}}</span>\n" +
    "            <span class=\"coach-phone\">{{coach.phone}}</span>\n" +
    "    \t\t<!-- show coach edit on click -->\n" +
    "            <button class=\"edit-coach\" ng-click=\"editCoach(coach)\">{{'edit' | i18next}}</button>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "    <!-- show coach creation on click -->\n" +
    "    <button class=\"create-coach\" ng-click=\"createCoach()\">{{'workingHours:add-new-coach' | i18next}}</button>\n" +
    "</div>\n" +
    "<div class=\"coach-edit-view\" ng-show=\"coach\">\n" +
    "    <form name=\"newCoachForm\" novalidate>\n" +
    "        <label name=\"firstName\">{{'person-details.first-name' | i18next}}</label>\n" +
    "        <input name=\"firstName\" ng-model=\"coach.firstName\" placeholder=\"{{'person-details.first-name' | i18next}}\"  required ng-maxlength=50 />\n" +
    "\n" +
    "        <label name=\"lastName\">{{'person-details.last-name' | i18next}}</label>\n" +
    "        <input name=\"lastName\" ng-model=\"coach.lastName\" placeholder=\"{{'person-details.last-name' | i18next}}\"  required ng-maxlength=50 />\n" +
    "\n" +
    "        <label name=\"email\">{{'person-details.email' | i18next}}</label>\n" +
    "        <input type=\"email\" name=\"email\" ng-model=\"coach.email\" placeholder=\"{{'person-details.email' | i18next}}\"  required ng-maxlength=100 />\n" +
    "\n" +
    "        <label name=\"phone\">{{'person-details.phone' | i18next}}</label>\n" +
    "        <input name=\"phone\" ng-model=\"coach.phone\" placeholder=\"{{'person-details.phone' | i18next}}\"  required ng-maxlength=50 />\n" +
    "\n" +
    "        <time-slot></time-slot>\n" +
    "\n" +
    "        <!-- POST here -->\n" +
    "        <button class=\"save-coach\" ng-click=\"saveCoach(coach)\">{{'save' | i18next}}</button>\n" +
    "        <button class=\"cancel-button\" ng-hide=\"!coachList.length && newCoach\" ng-click=\"cancelEdit()\">{{'cancel' | i18next}}</button>\n" +
    "    </form>\n" +
    "</div>"
  );


  $templateCache.put('workingHours/partials/timeSlot.html',
    "<div ng-repeat=\"weekday in weekdays\" class=\"workingHours-weekday\">\n" +
    "\t<p ng-i18next>workingHours:weekdays.{{weekday}}</p>\n" +
    "\t<toggle-switch \n" +
    "\t\tng-model=\"coach.workingHours[weekday].isAvailable\"\n" +
    "\t\ton-label=\"yes\"\n" +
    "\t    off-label=\"no\"\n" +
    "\t></toggle-switch>\n" +
    "\t<timepicker\n" +
    "\t\tng-model='coach.workingHours[weekday].startTime'\n" +
    "\t\tng-disabled='!coach.workingHours[weekday].isAvailable'\n" +
    "\t\tclass=\"workingHours-timepicker\"\n" +
    "\t></timepicker>\n" +
    "\tto\n" +
    "\t<timepicker\n" +
    "\t\tng-model='coach.workingHours[weekday].finishTime'\n" +
    "\t\tng-disabled='!coach.workingHours[weekday].isAvailable'\n" +
    "\t\tclass=\"workingHours-timepicker\"\n" +
    "\t></timepicker>\n" +
    "</div>"
  );

}]);
