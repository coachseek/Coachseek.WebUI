angular.module('coachSeekApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('locations/partials/locations.html',
    "<h1>LOCATIONS<h1>"
  );


  $templateCache.put('workingHours/partials/coachListView.html',
    "<a href=\"#/registration/locations\">Back to Locations</a>\n" +
    "<h3>Coach List</h3>\n" +
    "<a href=\"#/registration/services\">Forward to Services</a>\n" +
    "<div ng-hide=\"coach\">\n" +
    "    <ul>\n" +
    "        <li ng-repeat=\"coach in coachList | orderBy:'lastName'\">\n" +
    "            <span class=\"coach-name\">{{coach.firstName}} {{coach.lastName}}</span>\n" +
    "            <span class=\"coach-email\">{{coach.email}}</span>\n" +
    "            <span class=\"coach-phone\">{{coach.phone}}</span>\n" +
    "    \t\t<!-- show coach edit on click -->\n" +
    "            <button ng-click=\"editCoach(coach)\">Edit</button>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "    <!-- show coach creation on click -->\n" +
    "    <button ng-click=\"createCoach()\">Add New Coach</button>\n" +
    "</div>\n" +
    "<div ng-show=\"coach\">\n" +
    "    <form >\n" +
    "        First Name:<input ng-model=\"coach.firstName\"/>\n" +
    "        Last Name: <input ng-model=\"coach.lastName\"/>\n" +
    "        Email: <input ng-model=\"coach.email\"/>\n" +
    "        phone: <input ng-model=\"coach.phone\"/>\n" +
    "        <time-slot></time-slot>\n" +
    "\n" +
    "        <!-- POST here -->\n" +
    "        <button ng-click=\"save(coach)\">Save</button>\n" +
    "    </form>\n" +
    "</div>"
  );


  $templateCache.put('workingHours/partials/timeSlot.html',
    "<div ng-repeat=\"weekday in weekdays\" class=\"workingHours-weekday\">\n" +
    "\t<!-- how do we i18n this? -->\n" +
    "\t<!-- __(i18n.workingHours.{{weekday}})? -->\n" +
    "\t{{weekday}}\n" +
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
