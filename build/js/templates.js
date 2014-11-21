angular.module('coachSeekApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('locations/partials/locations.html',
    "<h1>LOCATIONS<h1></h1></h1>"
  );


  $templateCache.put('workingHours/partials/coachListView.html',
    "<a href=\"#/registration/locations\">Back to Locations</a><h3>Coach List</h3><a href=\"#/registration/services\">Forward to Services</a><div ng-hide=\"coach\"><ul><li ng-repeat=\"coach in coachList | orderBy:'lastName'\"><span class=\"coach-name\">{{coach.firstName}} {{coach.lastName}}</span> <span class=\"coach-email\">{{coach.email}}</span> <span class=\"coach-phone\">{{coach.phone}}</span><!-- show coach edit on click --> <button ng-click=\"editCoach(coach)\">Edit</button></li></ul><!-- show coach creation on click --><button ng-click=\"createCoach()\">Add New Coach</button></div><div ng-show=\"coach\"><form>First Name:<input ng-model=\"coach.firstName\"> Last Name: <input ng-model=\"coach.lastName\"> Email: <input ng-model=\"coach.email\"> phone: <input ng-model=\"coach.phone\"><time-slot></time-slot><!-- POST here --><button ng-click=\"save(coach)\">Save</button></form></div>"
  );


  $templateCache.put('workingHours/partials/timeSlot.html',
    "<div ng-repeat=\"weekday in weekdays\" class=\"workingHours-weekday\"><!-- how do we i18n this? --><!-- __(i18n.workingHours.{{weekday}})? -->{{weekday}}<toggle-switch ng-model=\"coach.workingHours[weekday].isAvailable\" on-label=\"yes\" off-label=\"no\"></toggle-switch><timepicker ng-model=\"coach.workingHours[weekday].startTime\" ng-disabled=\"!coach.workingHours[weekday].isAvailable\" class=\"workingHours-timepicker\"></timepicker>to<timepicker ng-model=\"coach.workingHours[weekday].finishTime\" ng-disabled=\"!coach.workingHours[weekday].isAvailable\" class=\"workingHours-timepicker\"></timepicker></div>"
  );

}]);
