angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/partials/activityIndicator.html',
    "<div class=\"indicator-container\"><div class=\"outer-logo\"></div><div ng-class=\"{active: AILoading}\" class=\"inner-logo\"></div></div>"
  );


  $templateCache.put('businessSetup/partials/businessSetup.html',
    "<a class=\"nav-to-business\" ui-sref=\"businessSetup.business\">{{'businessSetup:nav-to-business' | i18next}}</a> <a class=\"nav-to-locations\" ui-sref=\"businessSetup.locations\">{{'businessSetup:nav-to-locations' | i18next}}</a> <a class=\"nav-to-coaches\" ui-sref=\"businessSetup.coachList\">{{'businessSetup:nav-to-coaches' | i18next}}</a> <a class=\"nav-to-services\" ui-sref=\"businessSetup.services\">{{'businessSetup:nav-to-services' | i18next}}</a> <a class=\"nav-to-scheduling\" ui-sref=\"businessSetup.scheduling\">{{'businessSetup:nav-to-scheduling' | i18next}}</a><div ui-view=\"list-item-view\"></div>"
  );


  $templateCache.put('businessSetup/partials/businessView.html',
    "<h3>{{'businessSetup:business-title' | i18next}}</h3><div class=\"service-item-view\" ng-show=\"item\"><form name=\"itemForm\" editable-form novalidate></form><!-- POST here --><button class=\"save-business\" ng-click=\"saveItem(item)\">{{'save' | i18next}}</button></div>"
  );


  $templateCache.put('businessSetup/partials/coachesView.html',
    "<h3>{{'businessSetup:coach-list-title' | i18next}}</h3><div class=\"coach-list-view\" ng-hide=\"item\"><ul><li class=\"coach-details\" ng-repeat=\"item in itemList | orderBy:'lastName'\"><span class=\"coach-name\">{{item.firstName}} {{coach.lastName}}</span> <span class=\"coach-email\">{{item.email}}</span> <span class=\"coach-phone\">{{item.phone}}</span><!-- show coach edit on click --> <button class=\"edit-coach\" ng-click=\"editItem(item)\">{{'edit' | i18next}}</button></li></ul><!-- show coach creation on click --><button class=\"create-coach\" ng-click=\"createItem()\">{{'businessSetup:add-new-coach' | i18next}}</button></div><div class=\"coach-item-view\" ng-show=\"item\"><form name=\"itemForm\" novalidate><label name=\"firstName\">{{'person-details.first-name' | i18next}}</label><input name=\"firstName\" ng-model=\"item.firstName\" placeholder=\"{{'person-details.first-name' | i18next}}\" required ng-maxlength=\"50\"><label name=\"lastName\">{{'person-details.last-name' | i18next}}</label><input name=\"lastName\" ng-model=\"item.lastName\" placeholder=\"{{'person-details.last-name' | i18next}}\" required ng-maxlength=\"50\"><label name=\"email\">{{'person-details.email' | i18next}}</label><input type=\"email\" name=\"email\" ng-model=\"item.email\" placeholder=\"{{'person-details.email' | i18next}}\" required ng-maxlength=\"100\"><label name=\"phone\">{{'person-details.phone' | i18next}}</label><input name=\"phone\" ng-model=\"item.phone\" placeholder=\"{{'person-details.phone' | i18next}}\" required ng-maxlength=\"50\"><time-slot></time-slot><!-- POST here --><button class=\"save-coach\" ng-click=\"saveItem(item)\">{{'save' | i18next}}</button> <button class=\"cancel-button\" ng-hide=\"!itemList.length && newItem\" ng-click=\"cancelEdit()\">{{'cancel' | i18next}}</button></form></div>"
  );


  $templateCache.put('businessSetup/partials/colorPicker.html',
    "<ul><li ng-repeat=\"color in colors\" ng-class=\"{selected: (color===currentColor)}\" ng-click=\"$parent.currentColor = color\" style=\"background-color:{{color}}\"></li></ul>"
  );


  $templateCache.put('businessSetup/partials/locationsView.html',
    "<h3>{{'businessSetup:locations-title' | i18next}}</h3><div class=\"location-list-view\" ng-hide=\"item\"><ul><li class=\"location-details\" ng-repeat=\"item in itemList\"><span class=\"location-name\">{{item.name}}</span><!-- show coach edit on click --> <button class=\"edit-location\" ng-click=\"editItem(item)\">{{'edit' | i18next}}</button></li></ul><!-- show coach creation on click --><button class=\"create-location\" ng-click=\"createItem()\">{{'businessSetup:add-new-location' | i18next}}</button></div><div class=\"location-item-view\" ng-show=\"item\"><form name=\"itemForm\" editable-form novalidate><label name=\"name\">{{'businessSetup:location-details.name' | i18next}}</label><input name=\"name\" ng-model=\"item.name\" placeholder=\"{{'businessSetup:location-details.name' | i18next}}\" required ng-maxlength=\"50\"><label name=\"address\">{{'businessSetup:location-details.address' | i18next}}</label><input name=\"address\" ng-blur=\"updateAddress()\" ng-model=\"item.address\" placeholder=\"{{'businessSetup:location-details.address' | i18next}}\" required><label name=\"city\">{{'businessSetup:location-details.city' | i18next}}</label><input name=\"city\" ng-model=\"item.city\" placeholder=\"{{'businessSetup:location-details.city' | i18next}}\" required><label name=\"state\">{{'businessSetup:location-details.state' | i18next}}</label><input name=\"state\" ng-model=\"item.state\" placeholder=\"{{'businessSetup:location-details.state' | i18next}}\" required><label name=\"country\">{{'businessSetup:location-details.country' | i18next}}</label><input name=\"country\" ng-model=\"item.country\" placeholder=\"{{'businessSetup:location-details.country' | i18next}}\" required></form><!-- POST here --><button class=\"save-location\" ng-click=\"saveItem(item)\">{{'save' | i18next}}</button> <button class=\"cancel-location\" ng-hide=\"!itemList.length && newItem\" ng-click=\"cancelEdit()\">{{'cancel' | i18next}}</button></div>"
  );


  $templateCache.put('businessSetup/partials/repeatSelector.html',
    "{{'businessSetup:repeat-selector.repeat-session' | i18next}} <span ng-show=\"sessionCount > 0\">{{'businessSetup:repeat-selector.every' | i18next}}</span> <a href=\"#\" editable-select=\"repeatFrequency\" buttons=\"no\" e-ng-options=\"s.value as s.text for s in frequencies\" class=\"repeat-frequency\"><span ng-i18next>businessSetup:repeat-selector.{{ showStatus() }}</span></a> <span ng-show=\"sessionCount > 0\">{{'businessSetup:repeat-selector.total-of' | i18next}} <a href=\"#\" e-min=\"1\" editable-number=\"sessionCount\" class=\"session-count\">{{ sessionCount }}</a> <span ng-i18next=\"[i18next]({count:sessionCount})businessSetup:repeat-selector.{{ showStatus() }}\"></span></span>"
  );


  $templateCache.put('businessSetup/partials/schedulingView.html',
    "<h3>{{'businessSetup:scheduling-title' | i18next}}</h3>"
  );


  $templateCache.put('businessSetup/partials/servicesView.html',
    "<h3>{{'businessSetup:coach-services-title' | i18next}}</h3><div class=\"service-list-view\" ng-hide=\"item\"><ul><li class=\"service-details\" ng-repeat=\"item in itemList\"><span class=\"service-name\">{{item.name}}</span> <span class=\"service-description\">{{item.description}}</span><!-- show coach edit on click --> <button class=\"edit-service\" ng-click=\"editItem(item)\">{{'edit' | i18next}}</button></li></ul><!-- show coach creation on click --><button class=\"create-service\" ng-click=\"createItem()\">{{'businessSetup:add-new-service' | i18next}}</button></div><div class=\"service-item-view\" ng-show=\"item\"><form name=\"itemForm\" novalidate><label name=\"name\">{{'businessSetup:service-details.name' | i18next}}</label><input name=\"name\" ng-model=\"item.name\" placeholder=\"{{'businessSetup:service-details.name' | i18next}}\" required ng-maxlength=\"50\"><label name=\"description\">{{'businessSetup:service-details.description' | i18next}}</label><textarea name=\"description\" ng-model=\"item.description\" placeholder=\"{{'businessSetup:service-details.description' | i18next}}\" ng-maxlength=\"200\"></textarea><label>{{'businessSetup:service-details.duration' | i18next}}</label><time-picker time=\"item.timing.duration\"></time-picker><label name=\"studentCapacity\">{{'businessSetup:service-details.student-capacity' | i18next}}</label><input name=\"studentCapacity\" type=\"number\" ng-model=\"item.booking.studentCapacity\" placeholder=\"{{'businessSetup:service-details.student-capacity' | i18next}}\" min=\"1\"><color-picker current-color=\"item.presentation.color\"></color-picker><label name=\"sessionPrice\">{{'businessSetup:service-details.session-price' | i18next}}</label><input name=\"sessionPrice\" type=\"number\" ng-model=\"item.pricing.sessionPrice\" placeholder=\"{{'businessSetup:service-details.session-price' | i18next}}\" min=\"0\" step=\".01\"><label name=\"coursePrice\">{{'businessSetup:service-details.course-price' | i18next}}</label><input name=\"coursePrice\" ng-disabled=\"!item.repititon.repeatFrequency > 0\" type=\"number\" ng-model=\"item.pricing.coursePrice\" placeholder=\"{{'businessSetup:service-details.course-price' | i18next}}\" min=\"0\" step=\".01\"></form><label>{{'businessSetup:service-details.repeat-frequency' | i18next}}</label><!-- xeditable does not play well with other inputs. yet.--><!-- https://github.com/vitalets/angular-xeditable/issues/6 --><repeat-selector repeat-frequency=\"item.repititon.repeatFrequency\" session-count=\"item.repititon.sessionCount\"></repeat-selector><!-- POST here --><button class=\"save-service\" ng-click=\"saveItem(item)\">{{'save' | i18next}}</button> <button class=\"cancel-service\" ng-hide=\"!itemList.length && newItem\" ng-click=\"cancelEdit()\">{{'cancel' | i18next}}</button></div>"
  );


  $templateCache.put('businessSetup/partials/timePicker.html',
    "<div class=\"time-picker\"><div class=\"increase\"><span class=\"hours\" ng-click=\"increaseHours()\"><span class=\"glyphicon glyphicon-chevron-up\"></span></span> <span class=\"minutes\" ng-click=\"increaseMinutes()\"><span class=\"glyphicon glyphicon-chevron-up\"></span></span></div><div class=\"display\">{{time}}</div><div class=\"decrease\"><span class=\"hours\" ng-click=\"decreaseHours()\"><span class=\"glyphicon glyphicon-chevron-down\"></span></span> <span class=\"minutes\" ng-click=\"decreaseMinutes()\"><span class=\"glyphicon glyphicon-chevron-down\"></span></span></div></div>"
  );


  $templateCache.put('businessSetup/partials/timeRangePicker.html',
    "<time-picker time=\"start\"></time-picker>to<time-picker time=\"finish\"></time-picker>"
  );


  $templateCache.put('businessSetup/partials/timeSlot.html',
    "<div ng-repeat=\"weekday in weekdays\" class=\"weekday\"><span ng-i18next>businessSetup:weekdays.{{weekday}}</span><time-range-picker ng-model=\"item.workingHours[weekday]\" start=\"item.workingHours[weekday].startTime\" finish=\"item.workingHours[weekday].finishTime\" ng-disabled=\"!item.workingHours[weekday].isAvailable\" ng-show=\"item.workingHours[weekday].isAvailable\"></time-range-picker><button type=\"button\" class=\"btn btn-primary\" ng-model=\"item.workingHours[weekday].isAvailable\" ng-click=\"item.workingHours[weekday].isAvailable = !item.workingHours[weekday].isAvailable\"><span ng-class=\"item.workingHours[weekday].isAvailable ? 'icon-cross' : 'icon-check' \"></span></button></div>"
  );

}]);
