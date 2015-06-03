angular.module('businessSetup.directives', [])
    .directive('repeatSelector', function(){
        return {
            restrict: "E",
            scope: {
                repeatFrequency: '=',
                sessionCount: '='
            },
            templateUrl: 'businessSetup/partials/repeatSelector.html',
            link: function(scope, elem, attr){
                scope.frequencies = [
                    {value: 'w', text: 'weekly'},
                    {value: 'd', text: 'daily'}
                ];
                scope.repeatableOptions = [
                    {value: false, text:'no' },
                    {value: true, text:'yes' }
                ];


                scope.$watch('sessionCount', function(newVal){
                    if(!scope.isFocused){
                        scope.isRepeatable = newVal > 1;

                        if(newVal < 2){
                            delete scope.repeatFrequency;
                        } else if(newVal > 1 && !scope.repeatFrequency){
                            scope.repeatFrequency = 'd';
                        }
                    }
                });

                scope.setValues = function(){
                    if(scope.sessionCount === 1){
                        // Takes care of case where $watcher does not get triggered
                        scope.isRepeatable = false;
                    } else if(scope.sessionCount < 2){
                        scope.sessionCount = 1;
                    }
                    scope.isFocused = false;
                };

                scope.toggleRepeatable = function(){
                    if(scope.sessionCount < 2){
                        scope.sessionCount = 2;
                    } else {
                        scope.sessionCount = 1;
                    }
                    scope.setValues();
                };

                scope.showStatus = function() {
                    var selected = _.filter(scope.frequencies, {value: scope.repeatFrequency});
                    return selected[0] ? 'businessSetup:repeat-selector.' + selected[0].text  + "-plural": "";
                };
            }
        };
    })
    .directive('colorPicker', function() {
        var defaultColors =  [
            "green",
            "mid-green",
            "dark-green",
            "red",
            "dark-red",
            "yellow",
            "orange",
            "blue",
            "mid-blue",
            "dark-blue"
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
    .directive('currencyPicker', function(){
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'businessSetup/partials/currencyPicker.html',
            link: function(scope){
                scope.currencies = [
                    'NZD',
                    'USD',
                    'AUD',
                    'EUR',
                    'GBP',
                    'SEK'
                ];
            }
        };
    })
    .directive('timeSlot', function(){
        return {
            replace: false,
            templateUrl: 'businessSetup/partials/timeSlot.html',
            link: function(scope){
                scope.weekdays = [
                    'monday', 
                    'tuesday', 
                    'wednesday', 
                    'thursday', 
                    'friday', 
                    'saturday', 
                    'sunday'
                ];
            }
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

                        scope.displayHours = displayHours();
                        scope.displayMinutes = displayMinutes();
                    }
                });
     
                /* Increases hours by one */
                scope.increaseHours = function () {

                    //Check whether hours have reached max
                    if (scope.hours < 23) {
                        scope.hours++;
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

                scope.cancelEdit = function(){
                    scope.$emit('closeTimePicker', true);
                };

                scope.saveEdit = function(){
                    scope.$emit('closeTimePicker', false);
                };

                /* Displays minutes */
                var displayMinutes = function () {
                    return scope.minutes <= 9 ? "0" + scope.minutes : scope.minutes;
                };

                var displayHours = function () {
                    return scope.hours <= 9 ? "0" + scope.hours : scope.hours;
                };

                var setTime = function(){
                    var minutesString = displayMinutes();
                    var hoursString = displayHours();

                    scope.displayHours = hoursString;
                    scope.displayMinutes = minutesString;

                    scope.time = hoursString + ":" + minutesString;
                };
            }
        };
    })
    .directive('timeRangePicker', ['$rootScope', function($rootScope){
        return {
            replace: false,
            scope: {
                workingHours: "="
            },
            templateUrl: 'businessSetup/partials/timeRangePicker.html',
            require: 'ngModel',
            link: function(scope, elem, attrs, ctrl) {
                var workingHoursCopy;
                var $timePickerContainer = angular.element(elem.find('.time-picker-container'));
                scope.currentTime = null;

                scope.$watchCollection('workingHours', function(newValues){
                    if(newValues) {
                        var startTime = timeStringToObject(newValues.startTime);
                        var finishTime = timeStringToObject(newValues.finishTime);
                        if(newValues.isAvailable === false || 
                                        (startTime.hours === finishTime.hours && startTime.minutes < finishTime.minutes) ||
                                        startTime.hours < finishTime.hours) {
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

                scope.editTime = function(currentTime){
                    if(scope.currentTime === null) {
                        workingHoursCopy = angular.copy(scope.workingHours);
                    }
                    scope.currentTime = currentTime;
                    scope.editingTime = true;
                };

                scope.$on('closeTimePicker', function(event, resetTime){
                    if(!ctrl.$valid && !resetTime){
                        $rootScope.addAlert({
                            type: 'warning',
                            message: 'businessSetup:timeRange-invalid'
                        });
                    } else {
                        if(resetTime && workingHoursCopy){
                            scope.workingHours = workingHoursCopy;
                        } 
                        scope.editingTime = false;
                        $timePickerContainer.one('$animate:after', function(){
                            workingHoursCopy = null;
                            scope.currentTime = null;
                        });
                    }
                });
            }
        };
    }]);