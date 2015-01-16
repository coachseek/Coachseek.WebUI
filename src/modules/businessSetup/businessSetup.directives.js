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

                scope.showStatus = function() {
                  var selected = _.filter(scope.frequencies, {value: scope.repeatFrequency});
                  return selected[0] ? selected[0].text : "Not set";
                };
            }
        };
    })
    .directive('colorPicker', function() {
        var defaultColors =  [
            '#00A578', //green
            '#2980B9', //blue
            '#E74C3C', //red
            '#E67E22', //orange
            '#F1C40F'  //yellow
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
    .directive('clockpicker', function(){
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.clockpicker(scope.$eval(attrs.clockpicker));
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