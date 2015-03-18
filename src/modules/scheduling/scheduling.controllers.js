angular.module('scheduling.controllers', [])
    .controller('schedulingCtrl', ['$scope', '$q', 'coachSeekAPIService','$window',
        function($scope, $q, coachSeekAPIService,$window){


            //TODO: get window size
            var w = angular.element($window);
            $scope.isBigScreen = (function(){
               return w.width()>768;
            }());

  




            //TODO - add ability to edit time range in modal?

            $scope.eventSources = [];
            $scope.currentRanges = [];

            var rangesLoaded = [],
                events = [],
                currentEventCopy;

            $scope.eventSources[0] = events;
            $scope.draggableOptions = {
                helper: function(event) {
                    var serviceData = $(this).data('service');
                    return $('<span class="service-drag-helper ' + serviceData.presentation.colour + '">' + serviceData.name + '<span/>');
                },
                cursorAt: {
                    top: 15,
                    left: 45
                }
            };

            $scope.toggleDrag = function(event){
                $(event.target).toggleClass('dragging');
            };

            $scope.uiConfig = {
                calendar:{
                    editable: true,
                    droppable: true,
                    allDaySlot: false,
                    firstDay: 1,
                    // aspectRatio: 1.3,
                    snapDuration: '00:15:00',
                    defaultView:  (function(){
                        if($(window).width()<768){
                            return 'agendaDay';
                        }else{
                            return 'agendaWeek';
                        }
                    }()),
                    eventDurationEditable: false,
                    scrollTime:  "06:00:00",
                    header:{
                        left: '',
                        center: 'prev title next',
                        right: (function(){
                            if($(window).width()<768){
                                return 'month agendaDay today'
                            }else{
                                return 'month agendaWeek agendaDay today';
                            }   

                        }()) 
                    },
                    drop: function(date, event) {
                        handleServiceDrop(date, $(this).data('service'));
                    },
                    // businessHours: {
                    //     // start: '00:00', // a start time (10am in this example)
                    //     // end: '24:00', // an end time (6pm in this example)

                    //     // Sunday = 0 Monday = 6
                    //     dow: [0, 2, 3, 4],
                    //     availableHours: {
                    //         0:{
                    //             start: '10:00', // a start time (10am in this example)
                    //             end: '11:00', // an end time (6pm in this example)
                    //         },
                    //         2: {
                    //             start: '10:00', // a start time (10am in this example)
                    //             end: '18:00', // an end time (6pm in this example)
                    //         }
                    //     }
                    // },
                    eventRender: function(event, element) {
                        $('<div></div>', {
                            class: 'fc-location',
                            text: event.session.location.name
                        }).appendTo(element.find('.fc-content'));
                    },
                    windowResize: function(view){
                        $('#session-calendar').fullCalendar('option', 'height', ($('.calendar-container').height() - 10));
                        //mobi size
                        if($(window).width()<768){
                            console.log($(window).width()*0.9);
                 

                        }
                        

                    },
                    // handle event drag/drop within calendar
                    eventDrop: function( event, delta, revertDate){
                        // When we have an open event we don't want to save
                        // we just want to change the time displayed in the modal
                        if(event._id === $scope.tempEventId){
                            $scope.currentSession.timing.startDate = event._start.format('YYYY-MM-DD');
                            $scope.currentSession.timing.startTime = event._start.format('HH:mm');
                        } else {
                            var session = event.session;
                            var sessionTimingCopy = angular.copy(session.timing);
                            var newDate = getNewDate(session.timing);
                            newDate.add(delta);

                            _.assign(session.timing, {
                                startDate: newDate.format('YYYY-MM-DD'),
                                startTime: newDate.format('HH:mm')
                            });

                            $activityIndicator.startAnimating();
                            updateSession(session).then(function(){
                                $scope.removeAlerts();
                            }, function(error){
                                console.log('SENT Session', session, error);
                                revertDate();
                                // fullcalendar revertDate function does not reset all
                                // values so we must reset our changes
                                event.session.timing = sessionTimingCopy;

                                _.forEach(error.data, function(error){
                                    $scope.addAlert({
                                        type: 'danger',
                                        message: error.message
                                    });
                                });
                            }).finally(function(){
                                $activityIndicator.stopAnimating();
                            });
                        }
                    },
                    eventClick: function(event) {
                        $scope.showModal = true;
                        $scope.currentEvent = event;
                        currentEventCopy = angular.copy(event);
                    },
                    viewRender: function(view, $element){
                        $('#session-calendar').fullCalendar('option', 'height', ($('.calendar-container').height() - 10 ));
                        // load one month at a time and keep track of what months
                        // have been loaded and don't load those. must use month because it
                        // is the biggest denomination allowed by calendar. if using week/day 
                        // we load days/weeks twice when switching to month.
                        determineCurrentRange(view.intervalStart, view.intervalEnd);
                        loadCurrentRanges();
                    }



                }
            };

            var determineCurrentRange = function(intervalStart, intervalEnd){
                $scope.currentRanges = [];
                $scope.currentRanges.push(moment().range(intervalStart.clone().startOf('month'), intervalStart.clone().endOf('month')));
                if (intervalStart.format('MM') !== intervalEnd.format('MM')){
                    $scope.currentRanges.push(moment().range(intervalEnd.clone().startOf('month'), intervalEnd.clone().endOf('month')));
                }
            };

            var isNewRange = function(newRange){
                var isNewRange = true;
                _.forEach(rangesLoaded, function(loadedRange){
                    if( loadedRange.contains(newRange) ){
                        isNewRange = false;
                    }
                });
                return isNewRange;
            };

            var loadCurrentRanges = function(removeEvents, forceLoad){
                startCalendarLoading();
                var sessionPromises = [];
                _.forEach($scope.currentRanges, function(range){
                    if(removeEvents || isNewRange(range)){
                        var getSessionsParams = {
                            startDate: range.start.format('YYYY-MM-DD'),
                            endDate: range.end.format('YYYY-MM-DD'),
                            locationId: $scope.currentLocationId,
                            coachId: $scope.currentCoachId,
                            section: 'Sessions'
                        };
                        sessionPromises.push(coachSeekAPIService.get(getSessionsParams).$promise)
                    }
                });
                $q.all(sessionPromises)
                    .then(function(sessionLists) {
                        if(removeEvents){
                            // TODO - figure out how to get calendar element from Dependency Injection?
                            rangesLoaded = [];
                            $('#session-calendar').fullCalendar('removeEvents');
                            events = [];
                        }
                        _.forEach(sessionLists, function(sessions){
                            addSessionsWithinInterval(sessions, removeEvents);
                        });
                        _.forEach($scope.currentRanges, function(range){
                            rangesLoaded.push(range);
                        });
                    },function(error){
                        $scope.handleErrors(error);
                    }).finally(function(){
                        stopCalendarLoading();
                    });
            };

            var addSessionsWithinInterval = function(sessions, removeEvents){
                _.forEach(sessions, function(session, index){
                    var newDate = getNewDate(session.timing);
                    events.push(buildCalendarEvent(newDate, session));
                });
                $scope.eventSources[0] = events;
            };

            var handleServiceDrop = function(date, serviceData){
                $scope.showModal = true;
                var session = buildSessionObject(date, serviceData);
                $scope.tempEventId = _.uniqueId('service_');

                var newEvent = buildCalendarEvent(date, session);
                $scope.currentEvent = newEvent;
                events.push(newEvent);
            };

            var buildCalendarEvent = function(date, session){
                var newDate = date.clone();
                var duration = session.timing.duration;
                var newEvent = {
                    _id: $scope.tempEventId,
                    title: session.service.name,
                    start: moment(newDate),
                    end: moment(newDate.add(session.timing.duration, 'minutes')),
                    allDay: false,
                    className: session.presentation.colour,
                    // events need to know about sessions in order to save
                    // when moved/dragged while in calendar
                    // may need to do get here
                    session: session
                };
                return newEvent;
            };

            var buildSessionObject = function(date, serviceData){
                return {
                    service: serviceData,
                    location: {
                        id: $scope.currentLocation ? $scope.currentLocation.id : null,
                        name: $scope.currentLocation? $scope.currentLocation.name : null
                    },
                    coach: {
                        id: $scope.currentCoach ? $scope.currentCoach.id : null,
                        name: $scope.currentCoach ? $scope.currentCoach.name  : null
                    },
                    timing: {
                        startDate: date.format('YYYY-MM-DD'),
                        startTime: date.format('HH:mm'),
                        duration: serviceData.timing.duration
                    },
                    booking: {
                        isOnlineBookable: false,
                        studentCapacity: 1,
                        bookings: []
                    },
                    // need to specify these here for modal data
                    pricing: serviceData.pricing,
                    presentation: serviceData.presentation,
                    repetition: serviceData.repetition

                };
            };

            $scope.filterSessions = function(){
                $scope.currentLocation = _.find($scope.locationList, {id: $scope.currentLocationId});
                $scope.currentCoach = _.find($scope.coachList, {id: $scope.currentCoachId});
                $scope.removeAlerts();
                loadCurrentRanges(true);
                // SET BIZ HOURS
                // $('#session-calendar').fullCalendar({businessHours: {}});
                // $('#session-calendar').fullCalendar('render');
            };

            // var buildAvailableHours = function(coachAvailibility){}

            $scope.changeServiceName = function(){
                var newService = _.find($scope.serviceList, {id: $scope.currentSessionForm.services.$viewValue});
                $scope.currentEvent.session.presentation.colour = newService.presentation.colour;
                _.assign($scope.currentEvent, {
                    className: newService.presentation.colour,
                    title: newService.name
                });
                updateCurrentEvent();
            };

            $scope.changeLocationName = function(){
                var newLocation = _.find($scope.locationList, {id: $scope.currentSessionForm.locations.$viewValue});
                $scope.currentEvent.session.location = newLocation;
                updateCurrentEvent();
            };

            var updateCurrentEvent = function(){
                //TODO - why does this freak out when currentEvent is a new event?
                if(!$scope.tempEventId){
                    $('#session-calendar').fullCalendar('updateEvent', $scope.currentEvent);                    
                }
            };

            // HELPER FUNCTIONS
            $scope.minutesToStr = function(duration){
                return Math.floor(duration / 60) + ":" + duration % 60;
            };

            $scope.getSessionTimeRange = function(){
                if($scope.currentEvent && $scope.currentEvent.session){
                    var sessionTiming = $scope.currentEvent.session.timing;
                    var startTime = sessionTiming.startTime;
                    var endTime = moment(startTime, "HH:mm").add(sessionTiming.duration, 'minutes').format('HH:mm');
                    return startTime + " – " + endTime;
                }
            };

            $scope.cancelModalEdit = function(){
                $scope.removeAlerts();
                resetForm();
                removeTempEvents();
                $scope.$broadcast('closeTimePicker', true);
                if(currentEventCopy){
                    _.assign($scope.currentEvent, currentEventCopy);
                    $('#session-calendar').fullCalendar('updateEvent', $scope.currentEvent);            
                }
                $scope.showModal = false;
            };

            $scope.saveModalEdit = function(){
                forceFormTouched();
                if($scope.currentSessionForm.$valid){
                    startCalendarLoading();
                    updateSession($scope.currentEvent.session).then(function(session){
                        $scope.$broadcast('closeTimePicker', false);
                        resetForm();
                        $scope.showModal = false;
                        $scope.tempEventId = null;

                        loadCurrentRanges(true);
                    }, function(error){
                        $scope.handleErrors(error);
                        stopCalendarLoading();
                    });
                }
            };

            var resetForm = function(){
                $scope.currentSessionForm.$setUntouched();
                $scope.currentSessionForm.$setPristine();
            };

            var forceFormTouched = function(){
                $scope.currentSessionForm.coaches.$setTouched();
                $scope.currentSessionForm.locations.$setTouched();
            };

            var removeTempEvents = function(){
                if($scope.tempEventId){
                    $('#session-calendar').fullCalendar('removeEvents', $scope.tempEventId);
                    $scope.tempEventId = null;
                }
            };

            var getNewDate = function(timing){
                return moment(timing.startDate + " " + timing.startTime, "YYYY-MM-DD HH:mm");
            };

            var updateSession = function(sessionObject){
                return coachSeekAPIService.update({section: 'Sessions'}, sessionObject).$promise;
            };

            var startCalendarLoading = function(){
                if(!$scope.calendarLoading){
                    $scope.calendarLoading = true;
                }
            };

            var stopCalendarLoading = function(view, $element){
                $scope.calendarLoading = false;
            };

            // TODO - do this in repeat selector
            $scope.$watch('currentEvent.session.repetition.sessionCount', function(newVal){
                if($scope.currentEvent && newVal < 2 && $scope.currentEvent.session.pricing){
                    delete $scope.currentEvent.session.pricing.coursePrice;
                }
            });

            // INITIAL LOAD
            startCalendarLoading();
            $q.all({
                    coaches: coachSeekAPIService.get({section: 'Coaches'}).$promise,
                    locations: coachSeekAPIService.get({section: 'Locations'}).$promise,
                    services: coachSeekAPIService.get({section: 'Services'}).$promise
                })
                .then(function(response) {
                    $scope.coachList    = response.coaches;
                    $scope.locationList = response.locations;
                    $scope.serviceList  = response.services;
                },function(error){
                    $scope.handleErrors(error);
                    stopCalendarLoading();
                });
    }])
    .controller('attendanceCtrl', ['$scope', 'coachSeekAPIService',
        function($scope, coachSeekAPIService){
            $scope.showCustomers = false;

            $scope.showCustomerList = function(){
                $scope.showCustomers = true;
            };

            $scope.hideCustomerList = function(){
                $scope.showCustomers = false;
            };

            coachSeekAPIService.get({section: 'Customers'})
                .$promise.then(function(customerList){
                    $scope.itemList  =  customerList;
                }, $scope.handleErrors);
    }]);