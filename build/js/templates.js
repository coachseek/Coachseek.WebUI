angular.module('coachSeekApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('coachSeekApp/partials/activityIndicator.html',
    "<div class=\"indicator-container\"><div class=\"outer-logo\"></div><div ng-class=\"{active: AILoading}\" class=\"inner-logo\"></div></div>"
  );


  $templateCache.put('coachServices/partials/coachServices.html',
    "<h1>SERVICES<h1></h1></h1>"
  );


  $templateCache.put('locations/partials/locations.html',
    "<h1>LOCATIONS<h1></h1></h1>"
  );


  $templateCache.put('workingHours/partials/coachListView.html',
    "<a href=\"#/registration/locations\">{{'workingHours:nav-to-locations' | i18next}}</a><h3>{{'workingHours:coach-list-title' | i18next}}</h3><a class=\"nav-to-services\" ng-click=\"navigateToServices()\">{{'workingHours:nav-to-services' | i18next}}</a><div class=\"coach-list-view\" ng-hide=\"coach\"><ul><li class=\"coach-details\" ng-repeat=\"coach in coachList | orderBy:'lastName'\"><span class=\"coach-name\">{{coach.firstName}} {{coach.lastName}}</span> <span class=\"coach-email\">{{coach.email}}</span> <span class=\"coach-phone\">{{coach.phone}}</span><!-- show coach edit on click --> <button class=\"edit-coach\" ng-click=\"editCoach(coach)\">{{'edit' | i18next}}</button></li></ul><!-- show coach creation on click --><button class=\"create-coach\" ng-click=\"createCoach()\">{{'workingHours:add-new-coach' | i18next}}</button></div><div class=\"coach-edit-view\" ng-show=\"coach\"><form name=\"newCoachForm\" novalidate><label name=\"firstName\">{{'person-details.first-name' | i18next}}</label><input name=\"firstName\" ng-model=\"coach.firstName\" placeholder=\"{{'person-details.first-name' | i18next}}\" required ng-maxlength=\"50\"><label name=\"lastName\">{{'person-details.last-name' | i18next}}</label><input name=\"lastName\" ng-model=\"coach.lastName\" placeholder=\"{{'person-details.last-name' | i18next}}\" required ng-maxlength=\"50\"><label name=\"email\">{{'person-details.email' | i18next}}</label><input type=\"email\" name=\"email\" ng-model=\"coach.email\" placeholder=\"{{'person-details.email' | i18next}}\" required ng-maxlength=\"100\"><label name=\"phone\">{{'person-details.phone' | i18next}}</label><input name=\"phone\" ng-model=\"coach.phone\" placeholder=\"{{'person-details.phone' | i18next}}\" required ng-maxlength=\"50\"><time-slot></time-slot><!-- POST here --><button class=\"save-coach\" ng-click=\"saveCoach(coach)\">{{'save' | i18next}}</button> <button class=\"cancel-button\" ng-hide=\"!coachList.length && newCoach\" ng-click=\"cancelEdit()\">{{'cancel' | i18next}}</button></form></div>"
  );


  $templateCache.put('workingHours/partials/timePicker.html',
    "<div class=\"time-picker\"><div class=\"increase\"><div class=\"hours\" ng-click=\"increaseHours()\"><span class=\"glyphicon glyphicon-chevron-up\"></span></div><div class=\"minutes\" ng-click=\"increaseMinutes()\"><span class=\"glyphicon glyphicon-chevron-up\"></span></div></div><div class=\"display\">{{time}}</div><div class=\"decrease\"><div class=\"hours\" ng-click=\"decreaseHours()\"><span class=\"glyphicon glyphicon-chevron-down\"></span></div><div class=\"minutes\" ng-click=\"decreaseMinutes()\"><span class=\"glyphicon glyphicon-chevron-down\"></span></div></div></div>"
  );


  $templateCache.put('workingHours/partials/timeSlot.html',
    "<div ng-repeat=\"weekday in weekdays\" class=\"workingHours-weekday\"><p ng-i18next>workingHours:weekdays.{{weekday}}</p><toggle-switch ng-model=\"coach.workingHours[weekday].isAvailable\" on-label=\"yes\" off-label=\"no\"></toggle-switch><time-picker time=\"coach.workingHours[weekday].startTime\" ng-disabled=\"!coach.workingHours[weekday].isAvailable\"></time-picker>to<time-picker time=\"coach.workingHours[weekday].finishTime\" ng-disabled=\"!coach.workingHours[weekday].isAvailable\"></time-picker></div>"
  );

}]);
