angular.module('app.directives', [])
    .directive('durationPicker', function(){
        return {
            scope: {
                duration: '='
            },
            restrict: "E",
            templateUrl: 'app/partials/durationPicker.html',
            link: function(scope, elem){
                scope.editingTime = false;

                var durationCopy,
                    minutes,
                    hours,
                    $timePickerContainer = angular.element(elem.find('.time-picker-container'));

                scope.$watch('duration', function(newVal) {
                    scope.duration = newVal;
                    if(scope.duration){
                        hours = Math.floor( scope.duration / 60);          
                        minutes = scope.duration % 60;

                        scope.time = displayHours() + ":" + displayMinutes();
                    }
                });

                scope.$watch('time', function(newVal, oldVal){
                    if(newVal){
                        var timeArray = scope.time.split(":");
                        hours = parseFloat(timeArray[0]);
                        minutes = parseFloat(timeArray[1]);

                        if(hours === 0 && minutes === 0){
                            scope.time = oldVal;
                        } else {
                            scope.duration = (hours * 60) + minutes;
                        }
                    }
                });

                scope.editTime = function(currentTime){
                    if(!scope.editingTime) {
                        durationCopy = angular.copy(scope.duration);
                        scope.editingTime = true;
                    }
                };

                scope.$on('closeTimePicker', function(event, resetTime){
                    if(resetTime && durationCopy){
                        scope.duration = durationCopy;
                    } 
                    scope.editingTime = false;
                    $timePickerContainer.one('$animate:after', function(){
                        durationCopy = null;
                    });
                });

                /* Displays minutes */
                var displayMinutes = function () {
                    return minutes <= 9 ? "0" + minutes : minutes;
                };

                var displayHours = function () {
                    return hours <= 9 ? "0" + hours : hours;
                };
            }
        };
    })
    .directive('activityIndicator', function(){
        return {
            replace: true,
            templateUrl: 'app/partials/activityIndicator.html'
        };
    })
    .directive('ngTabAdd', function(){
        return function (scope, element, attrs) {
            $(window).on("keydown keypress", function (event) {
                if(event.which === 9) {
                    scope.$apply(function (){
                        scope.$eval(attrs.ngTabAdd);
                    });
                }
            });
        };
    })
    .directive('ngEnter', function(){
        return function (scope, element, attrs) {
            element.on("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    })
    .directive('selectArrows', function(){
        return {
            restrict: "E",
            templateUrl:'app/partials/selectArrows.html'    
        };
    })
    .directive('ellipsisAnimated', function () {
        return {
            restrict: "EAC",
            templateUrl:'app/partials/ellipsisAnimated.html'
        };
    })
    .directive('loadingAnimation', function () {
        return {
            restrict: "E",
            templateUrl:'app/partials/loadingAnimation.html'
        };
    });