angular.module('businessSetup.directives', [])
	.directive('timeSlot', function(){
		return {
			replace: true,
			templateUrl: 'businessSetup/partials/timeSlot.html'
		}
	}).directive('timePicker', function(){
        return {
            replace: true,
            templateUrl: 'businessSetup/partials/timePicker.html',
            scope: {
                time: "="
            },
            link: function (scope, elem, attr) {

                scope.time = scope.time ? scope.time : "0:00";

                var timeArray = scope.time.split(":");
                scope.hours = parseFloat(timeArray[0]);
                scope.minutes = parseFloat(timeArray[1]);
     
                /* Increases hours by one */
                scope.increaseHours = function () {

                    //Check whether hours have reached max
                    if (scope.hours < 23) {
                        scope.hours = ++scope.hours;
                    }
                    else {
                        scope.hours = 0;
                    }

                    setTime();
                }
     
                /* Decreases hours by one */
                scope.decreaseHours = function () {
     
                    //Check whether hours have reached min
                    scope.hours = scope.hours <= 0 ? 23 : --scope.hours;

                    setTime();
                }
     
                /* Increases minutes by 15 */
                scope.increaseMinutes = function () {
     
                    //Check whether to reset
                    if (scope.minutes >= 45) {
                        scope.minutes = 0;
                        scope.increaseHours();
                    }
                    else {
                        scope.minutes = scope.minutes + 15;
                    }
                    setTime();
                }
     
                /* Decreases minutes by 15 */
                scope.decreaseMinutes = function () {
     
                    //Check whether to reset
                    if (scope.minutes <= 0) {
                        scope.minutes = 45;
                        scope.decreaseHours();
                    }
                    else {
                        scope.minutes = scope.minutes - 15;
                    }
                    setTime();
                }

                /* Displays minutes */
                var displayMinutes = function () {
                    return scope.minutes <= 9 ? "0" + scope.minutes : scope.minutes;
                }

                var setTime = function(){
                    var minutesString = displayMinutes();

                    scope.time = scope.hours + ":" + minutesString;
                }
            }
        }
    });