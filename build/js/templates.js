angular.module('coachSeekApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('workingHours/partials/coachEditView.html',
    "<coach-list-nav></coach-list-nav><form>First Name:<input ng-model=\"coach.firstName\"> Last Name: <input ng-model=\"coach.lastName\"> Email: <input ng-model=\"coach.email\"> phone: <input ng-model=\"coach.phone\"> <span time-slot></span><!-- POST here --> <button ng-click=\"save(coach)\">Save</button></form>"
  );


  $templateCache.put('workingHours/partials/coachListNav.html',
    "<a href=\"#/registration/locations\">Back to Locations</a><h3>Coach List</h3><a href=\"#/registration/services\">Forward to Services</a>"
  );


  $templateCache.put('workingHours/partials/coachListView.html',
    "<div ng-app=\"workingHours\" class=\"container body-content\"><coach-list-nav></coach-list-nav><ul><li ng-repeat=\"coach in coachList | orderBy:'lastName'\"><span class=\"coach-name\">{{coach.firstName}} {{coach.lastName}}</span> <span class=\"coach-email\">{{coach.email}}</span> <span class=\"coach-phone\">{{coach.phone}}</span><!-- show coach edit on click --> <button ng-click=\"editCoach(coach)\">Edit</button></li></ul><!-- show coach creation on click --><button ng-click=\"createCoach()\">Add New Coach</button></div>"
  );


  $templateCache.put('workingHours/partials/timeSlot.html',
    "<div ng-repeat=\"weekday in weekdays\"><!-- how do we i18n this? --><!-- __(i18n.workingHours.{{weekday}})? -->{{weekday}}<toggle-switch ng-model=\"coach.workingHours[weekday].isAvailable\" on-label=\"yes\" off-label=\"no\"></toggle-switch><input ng-model=\"coach.workingHours[weekday].startTime\" ng-disabled=\"!coach.workingHours[weekday].isAvailable\"> to <input ng-model=\"coach.workingHours[weekday].finishTime\" ng-disabled=\"!coach.workingHours[weekday].isAvailable\"></div>"
  );

}]);
