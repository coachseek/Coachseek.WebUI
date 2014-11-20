angular.module('coachSeekApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('workingHours/partials/coachEditView.html',
    "<coach-list-nav></coach-list-nav>\n" +
    "<form >\n" +
    "\tFirst Name:<input ng-model=\"coach.firstName\"/>\n" +
    "\tLast Name: <input ng-model=\"coach.lastName\"/>\n" +
    "\tEmail: <input ng-model=\"coach.email\"/>\n" +
    "\tphone: <input ng-model=\"coach.phone\"/>\n" +
    "\t<span time-slot></span>\n" +
    "\n" +
    "\t<!-- POST here -->\n" +
    "\t<button ng-click=\"save(coach)\">Save</button>\n" +
    "</form>"
  );


  $templateCache.put('workingHours/partials/coachListNav.html',
    "<a href=\"#/registration/locations\">Back to Locations</a>\n" +
    "<h3>Coach List</h3>\n" +
    "<a href=\"#/registration/services\">Forward to Services</a>"
  );


  $templateCache.put('workingHours/partials/coachListView.html',
    "<div ng-app='workingHours' class=\"container body-content\">\n" +
    "\t<coach-list-nav></coach-list-nav>\n" +
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
    "</div>"
  );


  $templateCache.put('workingHours/partials/timeSlot.html',
    "<div ng-repeat=\"weekday in weekdays\">\n" +
    "\t<!-- how do we i18n this? -->\n" +
    "\t<!-- __(i18n.workingHours.{{weekday}})? -->\n" +
    "\t{{weekday}}\n" +
    "\t<toggle-switch \n" +
    "\t\tng-model=\"coach.workingHours[weekday].isAvailable\"\n" +
    "\t\ton-label=\"yes\"\n" +
    "\t    off-label=\"no\"\n" +
    "\t></toggle-switch>\n" +
    "\t<input\n" +
    "\t\tng-model='coach.workingHours[weekday].startTime'\n" +
    "\t\tng-disabled='!coach.workingHours[weekday].isAvailable'\n" +
    "\t/>\n" +
    "\tto\n" +
    "\t<input\n" +
    "\t\tng-model='coach.workingHours[weekday].finishTime'\n" +
    "\t\tng-disabled='!coach.workingHours[weekday].isAvailable'\n" +
    "\t/>\n" +
    "</div>"
  );

}]);
