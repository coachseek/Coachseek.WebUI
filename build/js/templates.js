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
    "<a href=\"#/registration/locations\">{{'workingHours:nav-to-locations' | i18next}}</a><h3>{{'workingHours:coach-list-title' | i18next}}</h3><a class=\"nav-to-services\" ng-click=\"navigateToServices()\">{{'workingHours:nav-to-services' | i18next}}</a><div class=\"coach-list-view\" ng-hide=\"coach\"><ul><li class=\"coach-details\" ng-repeat=\"coach in coachList | orderBy:'lastName'\"><span class=\"coach-name\">{{coach.firstName}} {{coach.lastName}}</span> <span class=\"coach-email\">{{coach.email}}</span> <span class=\"coach-phone\">{{coach.phone}}</span><!-- show coach edit on click --> <button class=\"edit-coach\" ng-click=\"editCoach(coach)\">{{'edit' | i18next}}</button></li></ul><!-- show coach creation on click --><button ng-click=\"createCoach()\">{{'workingHours:add-new-coach' | i18next}}</button></div><div class=\"coach-edit-view\" ng-show=\"coach\"><form>{{'person-details.first-name' | i18next}}<input ng-model=\"coach.firstName\"> {{'person-details.last-name' | i18next}} <input ng-model=\"coach.lastName\"> {{'person-details.email' | i18next}} <input ng-model=\"coach.email\"> {{'person-details.phone' | i18next}} <input ng-model=\"coach.phone\"><time-slot></time-slot><!-- POST here --><button class=\"save-coach\" ng-click=\"save(coach)\">{{'save' | i18next}}</button></form></div>"
  );


  $templateCache.put('workingHours/partials/timeSlot.html',
    "<div ng-repeat=\"weekday in weekdays\" class=\"workingHours-weekday\"><p ng-i18next>workingHours:weekdays.{{weekday}}</p><toggle-switch ng-model=\"coach.workingHours[weekday].isAvailable\" on-label=\"yes\" off-label=\"no\"></toggle-switch><timepicker ng-model=\"coach.workingHours[weekday].startTime\" ng-disabled=\"!coach.workingHours[weekday].isAvailable\" class=\"workingHours-timepicker\"></timepicker>to<timepicker ng-model=\"coach.workingHours[weekday].finishTime\" ng-disabled=\"!coach.workingHours[weekday].isAvailable\" class=\"workingHours-timepicker\"></timepicker></div>"
  );

}]);
