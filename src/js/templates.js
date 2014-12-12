angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/partials/activityIndicator.html',
    "<div class=\"indicator-container\">\n" +
    "\t<div class='outer-logo'></div>\n" +
    "\t<div ng-class=\"{active: AILoading}\" class='inner-logo'></div>\n" +
    "</div>"
  );


  $templateCache.put('businessSetup/partials/businessSetup.html',
    "<a class=\"nav-to-locations\" ui-sref=\"businessSetup.locations\">{{'businessSetup:nav-to-locations' | i18next}}</a>\n" +
    "<a class=\"nav-to-coaches\" ui-sref=\"businessSetup.coachList\">{{'businessSetup:nav-to-coaches' | i18next}}</a>\n" +
    "<a class=\"nav-to-services\" ui-sref=\"businessSetup.services\">{{'businessSetup:nav-to-services' | i18next}}</a>\n" +
    "<a class=\"nav-to-scheduling\" ui-sref=\"businessSetup.scheduling\">{{'businessSetup:nav-to-scheduling' | i18next}}</a>\n" +
    "\n" +
    "<div ui-view=\"list-item-view\"></div>"
  );


  $templateCache.put('businessSetup/partials/coachesView.html',
    "<h3>{{'businessSetup:coach-list-title' | i18next}}</h3>\n" +
    "<div class=\"coach-list-view\" ng-hide=\"item\">\n" +
    "    <ul>\n" +
    "        <li class=\"coach-details\" ng-repeat=\"item in itemList | orderBy:'lastName'\">\n" +
    "            <span class=\"coach-name\">{{item.firstName}} {{coach.lastName}}</span>\n" +
    "            <span class=\"coach-email\">{{item.email}}</span>\n" +
    "            <span class=\"coach-phone\">{{item.phone}}</span>\n" +
    "            <!-- show coach edit on click -->\n" +
    "            <button class=\"edit-coach\" ng-click=\"editItem(item)\">{{'edit' | i18next}}</button>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "    <!-- show coach creation on click -->\n" +
    "    <button class=\"create-coach\" ng-click=\"createItem()\">{{'businessSetup:add-new-coach' | i18next}}</button>\n" +
    "</div>\n" +
    "<div class=\"coach-item-view\" ng-show=\"item\">\n" +
    "    <form name=\"itemForm\" novalidate>\n" +
    "        <label name=\"firstName\">{{'person-details.first-name' | i18next}}</label>\n" +
    "        <input name=\"firstName\" ng-model=\"item.firstName\" placeholder=\"{{'person-details.first-name' | i18next}}\"  required ng-maxlength=50 />\n" +
    "\n" +
    "        <label name=\"lastName\">{{'person-details.last-name' | i18next}}</label>\n" +
    "        <input name=\"lastName\" ng-model=\"item.lastName\" placeholder=\"{{'person-details.last-name' | i18next}}\"  required ng-maxlength=50 />\n" +
    "\n" +
    "        <label name=\"email\">{{'person-details.email' | i18next}}</label>\n" +
    "        <input type=\"email\" name=\"email\" ng-model=\"item.email\" placeholder=\"{{'person-details.email' | i18next}}\"  required ng-maxlength=100 />\n" +
    "\n" +
    "        <label name=\"phone\">{{'person-details.phone' | i18next}}</label>\n" +
    "        <input name=\"phone\" ng-model=\"item.phone\" placeholder=\"{{'person-details.phone' | i18next}}\"  required ng-maxlength=50 />\n" +
    "\n" +
    "        <time-slot></time-slot>\n" +
    "        <!-- POST here -->\n" +
    "        <button class=\"save-coach\" ng-click=\"saveItem(item)\">{{'save' | i18next}}</button>\n" +
    "        <button class=\"cancel-button\" ng-hide=\"!itemList.length && newItem\" ng-click=\"cancelEdit()\">{{'cancel' | i18next}}</button>\n" +
    "    </form>\n" +
    "</div>"
  );


  $templateCache.put('businessSetup/partials/colorPicker.html',
    "<ul >\n" +
    "    <li \n" +
    "        ng-repeat=\"color in colors\"\n" +
    "        ng-class=\"{selected: (color===currentColor)}\"\n" +
    "        ng-click=\"$parent.currentColor = color\"\n" +
    "        style=\"background-color:{{color}};\"\n" +
    "    ></li>\n" +
    "</ul>"
  );


  $templateCache.put('businessSetup/partials/locationsView.html',
    "<h1>LOCATIONS<h1>"
  );


  $templateCache.put('businessSetup/partials/schedulingView.html',
    "<h3>{{'businessSetup:scheduling-title' | i18next}}</h3>"
  );


  $templateCache.put('businessSetup/partials/servicesView.html',
    "<h3>{{'businessSetup:coach-services-title' | i18next}}</h3>\n" +
    "<div class=\"service-list-view\" ng-hide=\"item\">\n" +
    "    <ul>\n" +
    "        <li class=\"service-details\" ng-repeat=\"item in itemList\">\n" +
    "            <span class=\"service-name\">{{item.name}}</span>\n" +
    "            <span class=\"service-description\">{{item.description}}</span>\n" +
    "            <!-- show coach edit on click -->\n" +
    "            <button class=\"edit-service\" ng-click=\"editItem(item)\">{{'edit' | i18next}}</button>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "\n" +
    "    <!-- show coach creation on click -->\n" +
    "    <button class=\"create-service\" ng-click=\"createItem()\">{{'businessSetup:add-new-service' | i18next}}</button>\n" +
    "</div>\n" +
    "<div class=\"service-item-view\" ng-show=\"item\">\n" +
    "    <form name=\"itemForm\" novalidate>\n" +
    "        <label name=\"name\">{{'service-details.name' | i18next}}</label>\n" +
    "        <input name=\"name\" ng-model=\"item.name\" placeholder=\"{{'service-details.name' | i18next}}\"  required ng-maxlength=50 />\n" +
    "\n" +
    "        <label name=\"description\">{{'service-details.description' | i18next}}</label>\n" +
    "        <textarea name=\"description\" ng-model=\"item.description\" placeholder=\"{{'service-details.description' | i18next}}\" ng-maxlength=\"200\"></textarea>\n" +
    "        <time-picker time=\"item.timing.duration\"></time-picker>\n" +
    "\n" +
    "        <label name=\"studentCapacity\">{{'service-details.student-capacity' | i18next}}</label>\n" +
    "        <input name=\"studentCapacity\" type=\"number\" ng-model=\"item.booking.studentCapacity\" placeholder=\"{{'service-details.student-capacity' | i18next}}\"  min=\"1\" required />\n" +
    "\n" +
    "        <color-picker\n" +
    "            current-color=\"item.presentation.color\"\n" +
    "        ></color-picker>\n" +
    "\n" +
    "        <!-- POST here -->\n" +
    "        <button class=\"save-service\" ng-click=\"saveItem(item)\">{{'save' | i18next}}</button>\n" +
    "        <button class=\"cancel-service\" ng-hide=\"!itemList.length && newItem\" ng-click=\"cancelEdit()\">{{'cancel' | i18next}}</button>\n" +
    "    </form>\n" +
    "</div>"
  );


  $templateCache.put('businessSetup/partials/timePicker.html',
    "<div class=\"time-picker\">\n" +
    "    <div class=\"increase\"> \n" +
    "        <span class=\"hours\" ng-click=\"increaseHours()\">\n" +
    "            <span class=\"glyphicon glyphicon-chevron-up\"></span> \n" +
    "        </span>\n" +
    "        <span class=\"minutes\" ng-click=\"increaseMinutes()\"> \n" +
    "            <span class=\"glyphicon glyphicon-chevron-up\"></span> \n" +
    "        </span>\n" +
    "    </div>\n" +
    "    <div class=\"display\"> {{time}} </div>\n" +
    "    <div class=\"decrease\">\n" +
    "        <span class=\"hours\" ng-click=\"decreaseHours()\">\n" +
    "            <span class=\"glyphicon glyphicon-chevron-down\"></span> \n" +
    "        </span> \n" +
    "        <span class=\"minutes\" ng-click=\"decreaseMinutes()\"> \n" +
    "            <span class=\"glyphicon glyphicon-chevron-down\"></span> \n" +
    "        </span> \n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('businessSetup/partials/timeRangePicker.html',
    "<time-picker time=\"start\"></time-picker>\n" +
    "to\n" +
    "<time-picker time=\"finish\"></time-picker>"
  );


  $templateCache.put('businessSetup/partials/timeSlot.html',
    "<div ng-repeat=\"weekday in weekdays\" class=\"weekday\">\n" +
    "\t<p ng-i18next>businessSetup:weekdays.{{weekday}}</p>\n" +
    "\t<toggle-switch \n" +
    "\t\tng-model=\"item.workingHours[weekday].isAvailable\"\n" +
    "\t\ton-label=\"yes\"\n" +
    "\t    off-label=\"no\"\n" +
    "\t></toggle-switch>\n" +
    "\t<time-range-picker\n" +
    "\t\tng-model=\"item.workingHours[weekday]\"\n" +
    "\t\tstart=\"item.workingHours[weekday].startTime\"\n" +
    "\t\tfinish=\"item.workingHours[weekday].finishTime\"\n" +
    "\t\tng-disabled='!item.workingHours[weekday].isAvailable'\n" +
    "\t></time-range-picker>\n" +
    "</div>"
  );

}]);
