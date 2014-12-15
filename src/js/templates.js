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
    "<h1>LOCATIONS<h1>\n" +
    "<span class=\"icon-check\"></span>"
  );


  $templateCache.put('businessSetup/partials/repeatSelector.html',
    "{{'businessSetup:repeat-selector.repeat-session' | i18next}}\n" +
    "<span ng-show=\"sessionCount > 0\">\n" +
    "    {{'businessSetup:repeat-selector.every' | i18next}}\n" +
    "</span>\n" +
    "<a href=\"#\"\n" +
    "    editable-select=\"repeatFrequency\"\n" +
    "    buttons=\"no\"\n" +
    "    e-ng-options=\"s.value as s.text for s in frequencies\"\n" +
    "    class=\"repeat-frequency\"\n" +
    "><span ng-i18next>businessSetup:repeat-selector.{{ showStatus() }}</span></a>\n" +
    "\n" +
    "<span ng-show=\"sessionCount > 0\">\n" +
    "    {{'businessSetup:repeat-selector.total-of' | i18next}}\n" +
    "    <a href=\"#\"\n" +
    "        e-min=\"1\"\n" +
    "        editable-number=\"sessionCount\"\n" +
    "        class=\"session-count\"\n" +
    "    >{{ sessionCount }} </a>\n" +
    "    <span ng-i18next=\"[i18next]({count:sessionCount})businessSetup:repeat-selector.{{ showStatus() }}\"></span>\n" +
    "</span>"
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
    "    <form name=\"itemForm\" editable-form novalidate>\n" +
    "        <label name=\"name\">{{'businessSetup:service-details.name' | i18next}}</label>\n" +
    "        <input name=\"name\" ng-model=\"item.name\" placeholder=\"{{'businessSetup:service-details.name' | i18next}}\"  required ng-maxlength=50 />\n" +
    "\n" +
    "        <label name=\"description\">{{'businessSetup:service-details.description' | i18next}}</label>\n" +
    "        <textarea name=\"description\" ng-model=\"item.description\" placeholder=\"{{'businessSetup:service-details.description' | i18next}}\" ng-maxlength=\"200\"></textarea>\n" +
    "\n" +
    "        <label>{{'businessSetup:service-details.duration' | i18next}}</label>\n" +
    "        <time-picker time=\"item.timing.duration\"></time-picker>\n" +
    "\n" +
    "        <label name=\"studentCapacity\">{{'businessSetup:service-details.student-capacity' | i18next}}</label>\n" +
    "        <input name=\"studentCapacity\" type=\"number\" ng-model=\"item.booking.studentCapacity\" placeholder=\"{{'businessSetup:service-details.student-capacity' | i18next}}\"  min=\"1\"  />\n" +
    "\n" +
    "        <color-picker\n" +
    "            current-color=\"item.presentation.color\"\n" +
    "        ></color-picker>\n" +
    "\n" +
    "        <label name=\"sessionPrice\">{{'businessSetup:service-details.session-price' | i18next}}</label>\n" +
    "        <input name=\"sessionPrice\" type=\"number\" ng-model=\"item.pricing.sessionPrice\" placeholder=\"{{'businessSetup:service-details.session-price' | i18next}}\"  min=\"0\" step=\".01\"  />\n" +
    "\n" +
    "        <label name=\"coursePrice\">{{'businessSetup:service-details.session-price' | i18next}}</label>\n" +
    "        <input name=\"coursePrice\" ng-disabled=\"!item.repititon.repeatFrequency > 0\" type=\"number\" ng-model=\"item.pricing.coursePrice\" placeholder=\"{{'businessSetup:service-details.course-price' | i18next}}\"  min=\"0\" step=\".01\" />\n" +
    "    </form>\n" +
    "\n" +
    "    <label >{{'businessSetup:service-details.repeat-frequency' | i18next}}</label>\n" +
    "    <repeat-selector\n" +
    "        repeat-frequency=\"item.repititon.repeatFrequency\"\n" +
    "        session-count=\"item.repititon.sessionCount\"\n" +
    "    ></repeat-selector>\n" +
    "\n" +
    "    <!-- POST here -->\n" +
    "    <button class=\"save-service\" ng-click=\"saveItem(item)\">{{'save' | i18next}}</button>\n" +
    "    <button class=\"cancel-service\" ng-hide=\"!itemList.length && newItem\" ng-click=\"cancelEdit()\">{{'cancel' | i18next}}</button>\n" +
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
    "\t<span ng-i18next>businessSetup:weekdays.{{weekday}}</span>\n" +
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
