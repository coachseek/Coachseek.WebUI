angular.module('app.directives', [])
    .directive('dynamicName', ['$compile', '$parse', function($compile, $parse) {
        return {
            restrict: 'A',
            terminal: true,
            priority: 100000,
            link: function(scope, elem) {
                var name = $parse(elem.attr('dynamic-name'))(scope);
                // $interpolate() will support things like 'skill'+skill.id where parse will not
                elem.removeAttr('dynamic-name');
                elem.attr('name', name);
                $compile(elem)(scope);
            }
        };
    }])
    .directive('exportToCsv', function(){
        return {
            restrict: 'E',
            templateUrl: 'app/partials/exportToCsv.html',
            scope: {
                exportData: "=",
                keys: "=",
                filename: "="
            },
            link: function(scope){
                scope.downloadCsvData = function(){
                    var csv = convertArrayOfObjectsToCSV();
                    if (csv == null) return;
                    var $link = $('<a></a>', {
                        class: "export-csv",
                        href: 'data:attachment/csv,' + encodeURI(csv),
                        download: scope.filename || i18n.t('export-csv')
                    }).appendTo('body');
                    $link[0].click();
                    $link.remove();
                };

                function convertArrayOfObjectsToCSV() {
                    if (scope.exportData == null || !scope.exportData.length) {
                        return null;
                    }
                    var result,
                        columnDelimiter = ',',
                        lineDelimiter = '\n',
                        keys = scope.keys || _.keys(scope.exportData[0]);

                    var headings = angular.copy(keys);
                    _.each(headings, function(heading, i){
                        if(_.isObject(heading)){
                            headings[i] = _.values(heading);
                        }
                    });
                    headings = _.flattenDeep(headings);

                    result = '';
                    result += _.map(headings, function(heading){return i18n.t(heading) || heading}).join(columnDelimiter);
                    result += lineDelimiter;

                    _.each(scope.exportData, function(item, index) {
                        var ctr = 0;
                        _.each(keys,function(key) {
                            //this is really on for custom fields at the moment
                            if(_.isObject(key)){
                                _.each(item[_.keys(key)[0]], function(item){
                                    if (ctr > 0) result += columnDelimiter;

                                    result += item.value || '';
                                    ctr++;
                                });
                            } else {
                                if (ctr > 0) result += columnDelimiter;

                                result += item[key] || '';
                                ctr++;
                            }
                        });
                        result += lineDelimiter;
                    });
                    return result;
                }
            }
        };
    })
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
    .directive('ngEsc', function(){
        return function (scope, element, attrs) {
            element.on("keydown keypress", function (event) {
                if(event.which === 27) {
                    scope.$apply(function (){
                        scope.$eval(attrs.ngEsc);
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
    })
    .directive('toggleSwitch', function(){
        return {
            restrict: 'E',
            templateUrl: 'app/partials/toggleSwitch.html',
            scope: {
                property: "=",
                positive: "=",
                negative: "="
            }
        }
    })
    .directive('selectOverlay', function(){
        return {
            restrict: 'E',
            templateUrl: 'app/partials/selectOverlay.html',
            scope: {
                i18nPrefix: "=",
                placeholder: "=",
                selectedOption: "="
            }
        }
    })
    .directive('trialStatus', function(){
        return {
            restrict: 'E',
            templateUrl: 'app/partials/trialStatus.html',
            scope: {
                trialDaysLeft: "="
            },
            link: function(scope, elem){

                scope.determineTrialStatus = function(){
                    if(scope.trialDaysLeft > 0){
                        return "trial-live";
                    } else {
                        return "trial-license-expired";
                    }
                };

                scope.closeTrialStatus = function(){
                    elem.remove();
                };
            }
        }
    })
    .directive('sliderNav', ['$timeout', function($timeout){
        return {
            restrict: 'C',
            replace: false,
            link: function(scope, element){
                //need $timeout to wait for widths to be set
                $timeout(function(){
                    var $navTabs = element.find('.slider-nav-option');
                    var initLeft = element.find('.slider-nav-option.active').position().left;
                    var $slider = $('<span></span>', {
                        class: "slider-nav-slider",
                        style: "width:" + $navTabs.first().outerWidth() + "px; left:" + initLeft + "px;"
                    }).appendTo(element);

                    $navTabs.on('click', function(){
                        $slider.animate({left: $(this).position().left})
                    });

                    scope.$on('triggerSliderSlide', function(event, tabName){
                        element.find('[data-tab-name="' + tabName + '"]').trigger('click');
                    });
                });
            }
        }
    }])
    .directive('pongGame', ['$timeout', function($timeout){
       return {
           restrict: 'A',
           link: function(scope, element){
                $timeout(function(){
                    element.pong({
                        "pad_height":100
                    });
                });

                element.on('pongGameOver', function(event, data){
                    scope.wonOrLost = data.status
                    scope.$digest();
                });
           }
       }
    }])
    .directive('datePicker', [function(){
        return {
            restrict: 'E',
            templateUrl: 'app/partials/datePicker.html',
            scope: {
                form: "=",
                date: "="
            },
            link: function(scope, element){
                scope.maxMonthDay = 31;
                scope.months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

                scope.getMaxBirthYear = function(){
                    return moment().format('YYYY')
                }

                scope.$watch('date', function(newVal){
                    if(newVal){
                        var momentDate = moment(scope.date, "YYYY-MM-DD")
                        scope.month = momentDate.month();
                        scope.day = momentDate.date();
                        scope.year = momentDate.year();
                    } else {
                        scope.month = null;
                        scope.day = null;
                        scope.year = null;
                    }
                });

                scope.setSelectedDate = function(){
                    if(scope.year && scope.day && (scope.month || scope.month === 0)){
                        var selectedDate = moment({year:scope.year, month:scope.month, day:scope.day});
                        scope.maxMonthDay = selectedDate.clone().endOf('month').date();
                        scope.date = selectedDate.format('YYYY-MM-DD');
                    }
                };
            }
        }
    }])
    .directive('pongGame', ['$timeout', function($timeout){
       return {
           restrict: 'A',
           link: function(scope, element){
                $timeout(function(){
                    element.pong({
                        "pad_height":100
                    });
                });

                element.on('pongGameOver', function(event, data){
                    scope.wonOrLost = data.status
                    scope.$digest();
                });
           }
       }
    }])
    .directive('datePicker', [function(){
        return {
            restrict: 'E',
            templateUrl: 'app/partials/datePicker.html',
            scope: {
                form: "=",
                date: "="
            },
            link: function(scope, element){
                scope.maxMonthDay = 31;
                scope.months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

                scope.getMaxBirthYear = function(){
                    return moment().format('YYYY')
                }

                scope.$watch('date', function(newVal){
                    if(newVal){
                        var momentDate = moment(scope.date, "YYYY-MM-DD")
                        scope.month = momentDate.month();
                        scope.day = momentDate.date();
                        scope.year = momentDate.year();
                    } else {
                        scope.month = null;
                        scope.day = null;
                        scope.year = null;
                    }
                });

                scope.setSelectedDate = function(){
                    if(scope.year && scope.day && (scope.month || scope.month === 0)){
                        var selectedDate = moment({year:scope.year, month:scope.month, day:scope.day});
                        scope.maxMonthDay = selectedDate.clone().endOf('month').date();
                        scope.date = selectedDate.format('YYYY-MM-DD');
                    }
                };
            }
        }
    }]);