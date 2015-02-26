angular.module('scheduling.controllers', [])
    .controller('schedulingCtrl', ['$scope', '$q', 'coachSeekAPIService',
        function($scope, $q, coachSeekAPIService){

            //TODO - add ability to edit time range in modal?

            $scope.eventSources = [];
            $scope.tempEventId;

            var rangesLoaded = [],
                events = [],
                currentEventCopy;

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
                    aspectRatio: 1.2,
                    snapDuration: '00:15:00',
                    defaultView: 'agendaWeek',
                    eventDurationEditable: false,
                    scrollTime:  "06:00:00",
                    header:{
                        left: '',
                        center: 'prev title next',
                        right: 'month agendaWeek agendaDay today'
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

                            startCalendarLoading();     
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
                                stopCalendarLoading();
                            });
                        }
                    },
                    eventClick: function(event) {
                        if(!event.session.parentId){
                            $scope.showModal = true;
                            $scope.currentEvent = event;
                            currentEventCopy = angular.copy(event);
                        }
                    },
                    viewRender: function(view, $element){
                        $('#session-calendar').fullCalendar('option', 'height', ($('.calendar-container').height() - 10 ));

                        // load one month at a time and keep track of what months
                        // have been loaded and don't load those. must use month because it
                        // is the biggest denomination allowed by calendar. if using week/day 
                        // we load days/weeks twice when switching to month.
                        $scope.intervalStart = view.intervalStart.clone().startOf('month');
                        $scope.intervalEnd = view.intervalStart.clone().endOf('month');
                        var newRange = moment().range($scope.intervalStart, $scope.intervalEnd);

                        if(isNewRange(newRange)){
                            loadInterval(newRange);
                        }
                    }
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

            var loadInterval = function(newRange, removeEvents){
                var getSessionsParams = {
                    startDate: $scope.intervalStart.format('YYYY-MM-DD'),
                    endDate: $scope.intervalEnd.format('YYYY-MM-DD'),
                    locationId: $scope.currentLocationId,
                    coachId: $scope.currentCoachId,
                    section: 'Sessions'
                };

                startCalendarLoading();
                coachSeekAPIService.get(getSessionsParams)
                    .$promise.then(function(sessions){
                        addSessionsWithinInterval(sessions, removeEvents);
                        if(newRange){
                            rangesLoaded.push(newRange);
                        }
                    }, function(error){
                        //remove temp event here
                        _.forEach(error.data, function(error){
                            $scope.addAlert({
                                type: 'danger',
                                message: error.message
                            });
                        });
                        stopCalendarLoading();
                    });
            };

            var addSessionsWithinInterval = function(sessions, removeEvents){
                if(removeEvents){                            
                    // TODO - figure out how to get calendar element from Dependency Injection?
                    rangesLoaded = [];
                    $('#session-calendar').fullCalendar('removeEvents');
                    events = [];
                }
                startCalendarLoading();
                _.forEach(sessions, function(session, index){
                    var newDate = getNewDate(session.timing);
                    events.push(buildCalendarEvent(newDate, session));
                });
                $scope.eventSources[0] = events;
                stopCalendarLoading();
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
                    _id: $scope.tempEventId || session.parentId,
                    title: session.service.name,
                    start: moment(newDate),
                    end: moment(newDate.add(session.timing.duration, 'minutes')),
                    allDay: false,
                    editable: $scope.tempEventId || session.parentId ? false: true,
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
                        studentCapacity: 1
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
                var newRange = moment().range($scope.intervalStart, $scope.intervalEnd);
                loadInterval(newRange, true);
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

            $scope.changeDuration = function(){
                console.log('CHANGE DURATION')
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
                        resetForm();
                        $scope.showModal = false;
                        $scope.tempEventId = null;
                        var newRange = moment().range($scope.intervalStart, $scope.intervalEnd);
                        loadInterval(newRange, true);
                    }, function(error){
                        _.forEach(error.data, function(error){
                            $scope.addAlert({
                                type: 'danger',
                                message: error.message
                            });
                        });
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
                    _.forEach(error.data, function(error){
                        $scope.addAlert({
                            type: 'danger',
                            message: error.message ? error.message: error
                        });
                    });
                    stopCalendarLoading();
                });
    }]);