angular.module('businessSetup.directives', [])
    .directive('repeatSelector', function(){
        var frequencies = [
            {value: 'w', text: 'week'},
            {value: 'd', text: 'day'},
            {value: null, text: 'once'},
            {value: -1, text: 'forever'}
        ];
        return {
            scope: {
                sessionCount: '=',
                repeatFrequency: '='
            },
            templateUrl: 'businessSetup/partials/repeatSelector.html',
            link: function(scope, elem, attr){
                scope.frequencies = frequencies;

                scope.$watch('repeatFrequency', function(newVal){
                    if(newVal === -1 || newVal === null){
                        scope.sessionCount = newVal;
                    } else if((scope.sessionCount < 0 || scope.sessionCount === null) && newVal ) {
                        scope.sessionCount = 2;
                    }
                });

                scope.$watch('sessionCount', function(newVal){
                    console.log(newVal)

                });

                scope.showStatus = function() {
                  var selected = _.filter(scope.frequencies, {value: scope.repeatFrequency});
                  return selected[0] ? selected[0].text : "Not set";
                };
            }
        }
    })
    .directive('colorPicker', function() {
        var defaultColors =  [
            'red',
            'green',
            'blue',
            'orange',
            'yellow'
        ];
        return {
            scope: {
                currentColor: '='
            },
            templateUrl: 'businessSetup/partials/colorPicker.html',
            link: function (scope) {
                scope.colors = defaultColors;
                scope.$watch('currentColor', function(newVal) {
                    scope.currentColor = newVal;
                });
            }
        };

    })
	.directive('timeSlot', function(){
		return {
			replace: true,
			templateUrl: 'businessSetup/partials/timeSlot.html'
		};
	})
    .directive('timePicker', function(){
        return {
            replace: true,
            templateUrl: 'businessSetup/partials/timePicker.html',
            scope: {
                time: "="
            },
            link: function (scope, elem, attr) {

                scope.$watch('time', function(newVal) {
                    scope.time = newVal;
                    if(scope.time){
                        var timeArray = scope.time.split(":");
                        scope.hours = parseFloat(timeArray[0]);
                        scope.minutes = parseFloat(timeArray[1]);
                    }
                });
     
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
                };
     
                /* Decreases hours by one */
                scope.decreaseHours = function () {
     
                    //Check whether hours have reached min
                    scope.hours = scope.hours <= 0 ? 23 : --scope.hours;

                    setTime();
                };
     
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
                };
     
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
                };

                /* Displays minutes */
                var displayMinutes = function () {
                    return scope.minutes <= 9 ? "0" + scope.minutes : scope.minutes;
                };

                var setTime = function(){
                    var minutesString = displayMinutes();
                    scope.time = scope.hours + ":" + minutesString;
                };
            }
        };
    })
    .directive('timeRangePicker', function(){
            return {
                replace: false,
                scope: {
                    start: "=",
                    finish: "=",
                    disabled: "=ngDisabled"
                },
                templateUrl: 'businessSetup/partials/timeRangePicker.html',
                require: 'ngModel',
                link: function(scope, elm, attrs, ctrl) {
                    scope.$watchGroup(['start', 'finish', 'disabled'], function(newValues){
                        if(newValues[0] && newValues[1]) {
                            var startTime = timeStringToObject(newValues[0]);
                            var finishTime = timeStringToObject(newValues[1]);

                            if(newValues[2] === true || startTime.hours < finishTime.hours) {
                                ctrl.$setValidity('timeRange', true);
                            } else if( (startTime.hours === finishTime.hours && startTime.minutes >= finishTime.minutes) || 
                                            startTime.hours > finishTime.hours ){
                                ctrl.$setValidity('timeRange', false);
                            }
                        }
                    });

                    var timeStringToObject = function(time){
                        var timeArray = time.split(":");

                        time  = {};
                        time.hours = parseFloat(timeArray[0]);
                        time.minutes = parseFloat(timeArray[1]);

                        return time;
                    };
                }
            };
    });