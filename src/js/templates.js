angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/partials/activityIndicator.html',
    "<div class=\"indicator-container\">\n" +
    "\t<div class='outer-logo'></div>\n" +
    "\t<div ng-class=\"{active: AILoading}\" class='inner-logo'></div>\n" +
    "</div>"
  );


  $templateCache.put('businessSetup/partials/businessSetup.html',
    "<h4 class='business-setup-title'>{{'businessSetup:title' | i18next}}</h4>\n" +
    "<div class=\"setup-nav-container\">\n" +
    "\t<a class=\"setup-nav nav-to-business\" ui-sref=\"businessSetup.business\" ui-sref-active=\"active\">{{'businessSetup:nav-to-business' | i18next}}</a>\n" +
    "\t<a class=\"setup-nav nav-to-locations\" ui-sref=\"businessSetup.locations\" ui-sref-active=\"active\">{{'businessSetup:nav-to-locations' | i18next}}</a>\n" +
    "\t<a class=\"setup-nav nav-to-coaches\" ui-sref=\"businessSetup.coachList\" ui-sref-active=\"active\">{{'businessSetup:nav-to-coaches' | i18next}}</a>\n" +
    "\t<a class=\"setup-nav nav-to-services\" ui-sref=\"businessSetup.services\" ui-sref-active=\"active\">{{'businessSetup:nav-to-services' | i18next}}</a>\n" +
    "</div>\n" +
    "<hr />\n" +
    "<div ui-view=\"list-item-view\"></div>"
  );


  $templateCache.put('businessSetup/partials/businessView.html',
    "<div class=\"business-list-view\" ng-hide=\"item\">\n" +
    "    <ul>\n" +
    "        <li class=\"business-details\" ng-repeat=\"item in itemList\">\n" +
    "            <button class=\"edit-item\" ng-click=\"editItem(item)\">{{'edit-details' | i18next}}</button>\n" +
    "            <span class=\"business-name\">{{item.business.name}} {{coach.lastName}}</span>\n" +
    "            <span class=\"business-firstName\">{{item.admin.firstName}} {{item.admin.lastName}}</span>\n" +
    "            <span class=\"business-email\">{{item.admin.email}}</span>\n" +
    "            <hr/>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "<div class=\"business-item-view\" ng-show=\"item\">\n" +
    "    <form name=\"itemForm\" editable-form novalidate>\n" +
    "        <div class=\"form-input\">\n" +
    "            <label name=\"name\">{{'businessSetup:business-details.name' | i18next}}</label>\n" +
    "            <input name=\"name\" ng-model=\"item.business.name\" placeholder=\"{{'businessSetup:business-details.placeholder.name' | i18next}}\" required ng-maxlength=50 />\n" +
    "        </div>\n" +
    "        <div class=\"form-input left-col\">\n" +
    "            <label name=\"firstName\">{{'person-details.first-name' | i18next}}</label>\n" +
    "            <input name=\"firstName\" ng-model=\"item.admin.firstName\" placeholder=\"{{'person-details.placeholder.first-name' | i18next}}\"  required ng-maxlength=50 />\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-input right-col\">\n" +
    "            <label name=\"lastName\">{{'person-details.last-name' | i18next}}</label>\n" +
    "            <input name=\"lastName\" ng-model=\"item.admin.lastName\" placeholder=\"{{'person-details.placeholder.last-name' | i18next}}\"  required ng-maxlength=50 />\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-input\">\n" +
    "            <label name=\"email\">{{'person-details.email' | i18next}}</label>\n" +
    "            <input type=\"email\" name=\"email\" ng-model=\"item.admin.email\" placeholder=\"{{'person-details.placeholder.email' | i18next}}\"  required ng-maxlength=100 />\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-input\">\n" +
    "            <label name=\"password\">{{'person-details.password' | i18next}}</label>\n" +
    "            <input type=\"password\" name=\"password\" ng-model=\"item.admin.password\" required ng-minlength=6 ng-maxlength=50 />\n" +
    "        </div>\n" +
    "    </form>\n" +
    "\n" +
    "    <!-- POST here -->\n" +
    "    <button class=\"save-button\" ng-click=\"saveItem(item)\">{{'save-details' | i18next}}</button>\n" +
    "    <button class=\"cancel-button\" ng-hide=\"newItem\" ng-click=\"cancelEdit()\">{{'cancel' | i18next}}</button>\n" +
    "</div>"
  );


  $templateCache.put('businessSetup/partials/coachesView.html',
    "<div class=\"coach-list-view\" ng-hide=\"item\">\n" +
    "    <button class=\"create-item\" ng-click=\"createItem()\">\n" +
    "        <span class=\"icon-plus\"></span>\n" +
    "        {{'businessSetup:add-coach' | i18next}}\n" +
    "    </button>\n" +
    "    <hr />\n" +
    "    <ul>\n" +
    "        <li class=\"coach-details\" ng-repeat=\"item in itemList | orderBy:'lastName'\">\n" +
    "            <!-- show coach edit on click -->\n" +
    "            <button class=\"edit-item\" ng-click=\"editItem(item)\">{{'edit-details' | i18next}}</button>\n" +
    "            <span class=\"coach-name\">{{item.firstName}} {{item.lastName}}</span>\n" +
    "            <span class=\"coach-phone\">{{item.phone}}</span>\n" +
    "            <hr />\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "<div class=\"coach-item-view\" ng-show=\"item\">\n" +
    "    <form name=\"itemForm\" novalidate>\n" +
    "        <div class=\"form-input left-col\">\n" +
    "            <label name=\"firstName\">{{'person-details.first-name' | i18next}}</label>\n" +
    "            <input name=\"firstName\" ng-model=\"item.firstName\" placeholder=\"{{'person-details.placeholder.first-name' | i18next}}\"  required ng-maxlength=50 />\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-input right-col\">\n" +
    "            <label name=\"lastName\">{{'person-details.last-name' | i18next}}</label>\n" +
    "            <input name=\"lastName\" ng-model=\"item.lastName\" placeholder=\"{{'person-details.placeholder.last-name' | i18next}}\"  required ng-maxlength=50 />\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-input\">\n" +
    "            <label name=\"email\">{{'person-details.email' | i18next}}</label>\n" +
    "            <input type=\"email\" name=\"email\" ng-model=\"item.email\" placeholder=\"{{'person-details.placeholder.email' | i18next}}\"  required ng-maxlength=100 />\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-input\">\n" +
    "            <label name=\"phone\">{{'person-details.phone' | i18next}}</label>\n" +
    "            <input name=\"phone\" ng-model=\"item.phone\" placeholder=\"{{'person-details.placeholder.phone' | i18next}}\"  required ng-maxlength=50 />\n" +
    "        </div>\n" +
    "\n" +
    "        <label>{{'person-details.availability' | i18next}}</label>\n" +
    "        <time-slot></time-slot>\n" +
    "        <!-- POST here -->\n" +
    "        <button class=\"save-button\" ng-click=\"saveItem(item)\">{{'save-details' | i18next}}</button>\n" +
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
    "<div class=\"location-list-view\" ng-hide=\"item\">\n" +
    "    <button class=\"create-item\" ng-click=\"createItem()\">\n" +
    "        <span class=\"icon-plus\"></span>\n" +
    "        {{'businessSetup:add-location' | i18next}}\n" +
    "    </button>\n" +
    "    <hr />\n" +
    "    <ul>\n" +
    "        <li class=\"location-details\" ng-repeat=\"item in itemList\">\n" +
    "            <button class=\"edit-item\" ng-click=\"editItem(item)\">{{'edit-details' | i18next}}</button>\n" +
    "            <span class=\"location-name\">{{item.name}}</span>\n" +
    "            <span class=\"location-address\">{{item.address}}</span>\n" +
    "            <hr />\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "<div class=\"location-item-view\" ng-show=\"item\">\n" +
    "    <form name=\"itemForm\" editable-form novalidate>\n" +
    "        <div class=\"form-input\">\n" +
    "            <label name=\"name\">{{'businessSetup:location-details.name' | i18next}}</label>\n" +
    "            <input name=\"name\" ng-model=\"item.name\" placeholder=\"{{'businessSetup:location-details.placeholder.name' | i18next}}\"  required ng-maxlength=50 />\n" +
    "        </div>\n" +
    "        <hr />\n" +
    "        <div class=\"form-input\">\n" +
    "            <label name=\"address\">{{'businessSetup:location-details.address' | i18next}}</label>\n" +
    "            <input name=\"address\" ng-blur=\"updateAddress()\" ng-model=\"item.address\" placeholder=\"{{'businessSetup:location-details.placeholder.address' | i18next}}\"/>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-input left-col\">\n" +
    "            <label name=\"city\">{{'businessSetup:location-details.city' | i18next}}</label>\n" +
    "            <input name=\"city\" ng-model=\"item.city\" placeholder=\"{{'businessSetup:location-details.placeholder.city' | i18next}}\"/>\n" +
    "        </div>\n" +
    "        \n" +
    "        <div class=\"form-input right-col\">\n" +
    "            <label name=\"postCode\">{{'businessSetup:location-details.post-code' | i18next}}</label>\n" +
    "            <input name=\"postCode\" type=\"number\" ng-model=\"item.postCode\" placeholder=\"{{'businessSetup:location-details.placeholder.post-code' | i18next}}\"/>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-input\">\n" +
    "            <label name=\"country\">{{'businessSetup:location-details.country' | i18next}}</label>\n" +
    "            <input name=\"country\" ng-model=\"item.country\" placeholder=\"{{'businessSetup:location-details.placeholder.country' | i18next}}\"/>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "\n" +
    "    <!-- POST here -->\n" +
    "    <button class=\"save-button\" ng-click=\"saveItem(item)\">{{'save-details' | i18next}}</button>\n" +
    "    <button class=\"cancel-button\" ng-hide=\"!itemList.length && newItem\" ng-click=\"cancelEdit()\">{{'cancel' | i18next}}</button>\n" +
    "</div>"
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


  $templateCache.put('businessSetup/partials/servicesView.html',
    "<div class=\"service-list-view\" ng-hide=\"item\">\n" +
    "    <button class=\"create-item\" ng-click=\"createItem()\">\n" +
    "        <span class=\"icon-plus\"></span>\n" +
    "        {{'businessSetup:add-service' | i18next}}\n" +
    "    </button>\n" +
    "    <hr />\n" +
    "    <ul>\n" +
    "        <li class=\"service-details\" ng-repeat=\"item in itemList\">\n" +
    "            <button class=\"edit-item\" ng-click=\"editItem(item)\">{{'edit-details' | i18next}}</button>\n" +
    "            <span class=\"service-name\">{{item.name}}</span>\n" +
    "            <span class=\"service-description\">{{item.description}}</span>\n" +
    "            <hr />\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "<div class=\"service-item-view\" ng-show=\"item\">\n" +
    "    <form name=\"itemForm\" novalidate>\n" +
    "        <div class=\"form-input\">\n" +
    "            <label name=\"name\">{{'businessSetup:service-details.name' | i18next}}</label>\n" +
    "            <input name=\"name\" ng-model=\"item.name\" placeholder=\"{{'businessSetup:service-details.placeholder.name' | i18next}}\"  required ng-maxlength=50 />\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-input\">\n" +
    "            <label name=\"description\">{{'businessSetup:service-details.description' | i18next}}</label>\n" +
    "            <textarea name=\"description\" ng-model=\"item.description\" placeholder=\"{{'businessSetup:service-details.placeholder.description' | i18next}}\" ng-maxlength=\"200\"></textarea>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-input\">\n" +
    "            <label>{{'businessSetup:service-details.duration' | i18next}}</label>\n" +
    "            <time-picker time=\"item.timing.duration\"></time-picker>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-input left-col\">\n" +
    "            <label name=\"studentCapacity\">{{'businessSetup:service-details.student-capacity' | i18next}}</label>\n" +
    "            <input name=\"studentCapacity\" type=\"number\" ng-model=\"item.booking.studentCapacity\" placeholder=\"{{'businessSetup:service-details.placeholder.student-capacity' | i18next}}\"  min=\"1\"  />\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-input\">\n" +
    "            <label>{{'businessSetup:service-details.service-colour' | i18next}}</label>\n" +
    "            <color-picker\n" +
    "                current-color=\"item.presentation.color\"\n" +
    "            ></color-picker>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-input left-col\">\n" +
    "            <label name=\"coursePriceMin\">{{'businessSetup:service-details.course-price-min' | i18next}}</label>\n" +
    "            <input name=\"coursePriceMin\" type=\"number\" ng-model=\"item.pricing.coursePriceMin\" placeholder=\"{{'businessSetup:service-details.placeholder.course-price-min' | i18next}}\"  min=\"0\" step=\".01\"  />\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-input right-col\">\n" +
    "            <label name=\"coursePriceMax\">{{'businessSetup:service-details.course-price-max' | i18next}}</label>\n" +
    "            <input name=\"coursePriceMax\" ng-disabled=\"!item.repititon.repeatFrequency > 0\" type=\"number\" ng-model=\"item.pricing.coursePriceMax\" placeholder=\"{{'businessSetup:service-details.placeholder.course-price-max' | i18next}}\"  min=\"0\" step=\".01\" />\n" +
    "        </div>\n" +
    "    </form>\n" +
    "\n" +
    "    <label >{{'businessSetup:service-details.repeat-frequency' | i18next}}</label>\n" +
    "    <!-- xeditable does not play well with other inputs. yet.-->\n" +
    "    <!-- https://github.com/vitalets/angular-xeditable/issues/6 -->\n" +
    "    <repeat-selector\n" +
    "        repeat-frequency=\"item.repititon.repeatFrequency\"\n" +
    "        session-count=\"item.repititon.sessionCount\"\n" +
    "    ></repeat-selector>\n" +
    "\n" +
    "    <!-- POST here -->\n" +
    "    <button class=\"save-button\" ng-click=\"saveItem(item)\">{{'save-details' | i18next}}</button>\n" +
    "    <button class=\"cancel-button\" ng-hide=\"!itemList.length && newItem\" ng-click=\"cancelEdit()\">{{'cancel' | i18next}}</button>\n" +
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
    "\t<div class=\"weekday-text\" ng-i18next>businessSetup:weekdays.{{weekday}}</div>\n" +
    "\t<time-range-picker\n" +
    "\t\tclass=\"slide-closed\"\n" +
    "\t\tng-model=\"item.workingHours[weekday]\"\n" +
    "\t\tstart=\"item.workingHours[weekday].startTime\"\n" +
    "\t\tfinish=\"item.workingHours[weekday].finishTime\"\n" +
    "\t\tng-disabled='!item.workingHours[weekday].isAvailable'\n" +
    "\t\tng-show='item.workingHours[weekday].isAvailable'>\n" +
    "\t</time-range-picker>\n" +
    "\t<button\n" +
    "\t\ttype=\"button\"\n" +
    "\t\tclass=\"toggle-time-slot\"\n" +
    "\t\tng-class=\"item.workingHours[weekday].isAvailable ? 'open' : 'closed'\"\n" +
    "\t\tng-model=\"item.workingHours[weekday].isAvailable\"\n" +
    "\t\tng-click=\"item.workingHours[weekday].isAvailable = !item.workingHours[weekday].isAvailable\">\n" +
    "\t\t<span\n" +
    "\t\t\tng-class=\"item.workingHours[weekday].isAvailable ? 'icon-cross' : 'icon-check' \"\n" +
    "\t\t></span>\n" +
    "\t</button>\n" +
    "</div>"
  );


  $templateCache.put('scheduling/partials/schedulingView.html',
    "<h3>{{'scheduling:scheduling-title' | i18next}}</h3>\n" +
    "<div class=\"scheduling-container\">\n" +
    "    <div class=\"services-list\">\n" +
    "        <ul>\n" +
    "            <li \n" +
    "                data-drag=\"true\"\n" +
    "                data-service=\"{{item}}\" \n" +
    "                data-duration=\"{{item.timing.duration}}\" \n" +
    "                jqyoui-draggable\n" +
    "                data-jqyoui-options=\"{revert: true}\" \n" +
    "                ng-style=\"{'background-color':item.presentation.color}\"\n" +
    "                class=\"service-details\" \n" +
    "                ng-repeat=\"item in itemList\">\n" +
    "                    <span class=\"service-name\">{{item.name}} {{item.repititon.sessionCount}}</span>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "    <div class=\"calendar\" ui-calendar=\"uiConfig.calendar\" ng-model=\"eventSources\" calendar=\"\"></div>\n" +
    "</div>"
  );

}]);
