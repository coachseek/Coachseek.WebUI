angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/partials/activityIndicator.html',
    "<div class=\"indicator-container\"><div class=\"outer-logo\"></div><div ng-class=\"{active: AILoading}\" class=\"inner-logo\"></div></div>"
  );


  $templateCache.put('businessSetup/partials/businessSetup.html',
    "<a ui-sref=\"businessSetup.locations\">{{'businessSetup:nav-to-locations' | i18next}}</a> <a ui-sref=\"businessSetup.coachList\">{{'businessSetup:nav-to-coaches' | i18next}}</a> <a class=\"nav-to-services\" ui-sref=\"businessSetup.services\">{{'businessSetup:nav-to-services' | i18next}}</a><h3>{{'businessSetup:coach-services-title' | i18next}}</h3><div ui-view=\"list-item-view\"></div>"
  );


  $templateCache.put('businessSetup/partials/coachesView.html',
    "<div class=\"coach-list-view\" ng-hide=\"item\"><ul><li class=\"coach-details\" ng-repeat=\"item in itemList | orderBy:'lastName'\"><span class=\"coach-name\">{{item.firstName}} {{coach.lastName}}</span> <span class=\"coach-email\">{{item.email}}</span> <span class=\"coach-phone\">{{item.phone}}</span><!-- show coach edit on click --> <button class=\"edit-coach\" ng-click=\"editItem(item)\">{{'edit' | i18next}}</button></li></ul><!-- show coach creation on click --><button class=\"create-coach\" ng-click=\"createItem()\">{{'businessSetup:add-new-coach' | i18next}}</button></div><div class=\"coach-item-view\" ng-show=\"item\"><form name=\"itemForm\" novalidate><label name=\"firstName\">{{'person-details.first-name' | i18next}}</label><input name=\"firstName\" ng-model=\"item.firstName\" placeholder=\"{{'person-details.first-name' | i18next}}\" required ng-maxlength=\"50\"><label name=\"lastName\">{{'person-details.last-name' | i18next}}</label><input name=\"lastName\" ng-model=\"item.lastName\" placeholder=\"{{'person-details.last-name' | i18next}}\" required ng-maxlength=\"50\"><label name=\"email\">{{'person-details.email' | i18next}}</label><input type=\"email\" name=\"email\" ng-model=\"item.email\" placeholder=\"{{'person-details.email' | i18next}}\" required ng-maxlength=\"100\"><label name=\"phone\">{{'person-details.phone' | i18next}}</label><input name=\"phone\" ng-model=\"item.phone\" placeholder=\"{{'person-details.phone' | i18next}}\" required ng-maxlength=\"50\"><time-slot></time-slot><!-- POST here --><button class=\"save-coach\" ng-click=\"saveItem(item)\">{{'save' | i18next}}</button> <button class=\"cancel-button\" ng-hide=\"!itemList.length && newItem\" ng-click=\"cancelEdit()\">{{'cancel' | i18next}}</button></form></div>"
  );


  $templateCache.put('businessSetup/partials/locationsView.html',
    "<h1>LOCATIONS<h1></h1></h1>"
  );


  $templateCache.put('businessSetup/partials/servicesView.html',
    "<div class=\"services-list-view\" ng-hide=\"item\"><ul><li class=\"service-details\" ng-repeat=\"item in itemList\"><span class=\"service-name\">{{item.name}}</span> <span class=\"service-description\">{{item.description}}</span><!-- show coach edit on click --> <button class=\"edit-service\" ng-click=\"editItem(item)\">{{'edit' | i18next}}</button></li></ul><!-- show coach creation on click --><button class=\"create-service\" ng-click=\"createItem()\">{{'businessSetup:add-new-service' | i18next}}</button></div><div class=\"service-item-view\" ng-show=\"item\"><form name=\"itemForm\" novalidate><label name=\"name\">{{'service-details.name' | i18next}}</label><input name=\"name\" ng-model=\"item.name\" placeholder=\"{{'service-details.name' | i18next}}\" required ng-maxlength=\"50\"><label name=\"description\">{{'service-details.description' | i18next}}</label><textbox name=\"description\" ng-model=\"item.description\" placeholder=\"{{'service-details.description' | i18next}}\" required><!-- POST here --><button class=\"save-service\" ng-click=\"saveItem(item)\">{{'save' | i18next}}</button> <button class=\"cancel-service\" ng-hide=\"!itemList.length && newItem\" ng-click=\"cancelEdit()\">{{'cancel' | i18next}}</button></form></div>"
  );


  $templateCache.put('businessSetup/partials/timePicker.html',
    "<div class=\"time-picker\"><div class=\"increase\"><span class=\"hours\" ng-click=\"increaseHours()\"><span class=\"glyphicon glyphicon-chevron-up\"></span></span> <span class=\"minutes\" ng-click=\"increaseMinutes()\"><span class=\"glyphicon glyphicon-chevron-up\"></span></span></div><div class=\"display\">{{time}}</div><div class=\"decrease\"><span class=\"hours\" ng-click=\"decreaseHours()\"><span class=\"glyphicon glyphicon-chevron-down\"></span></span> <span class=\"minutes\" ng-click=\"decreaseMinutes()\"><span class=\"glyphicon glyphicon-chevron-down\"></span></span></div></div>"
  );


  $templateCache.put('businessSetup/partials/timeRangePicker.html',
    "<time-picker time=\"start\"></time-picker>to<time-picker time=\"finish\"></time-picker>"
  );


  $templateCache.put('businessSetup/partials/timeSlot.html',
    "<div ng-repeat=\"weekday in weekdays\" class=\"weekday\"><p ng-i18next>businessSetup:weekdays.{{weekday}}</p><toggle-switch ng-model=\"item.workingHours[weekday].isAvailable\" on-label=\"yes\" off-label=\"no\"></toggle-switch><time-range-picker ng-model=\"item.workingHours[weekday]\" start=\"item.workingHours[weekday].startTime\" finish=\"item.workingHours[weekday].finishTime\" ng-disabled=\"!item.workingHours[weekday].isAvailable\"></time-range-picker></div>"
  );

}]);
