angular.module('scheduling.controllers', [])
    .controller('schedulingCtrl', ['$scope', '$q', '$timeout', 'coachSeekAPIService', '$activityIndicator', 'sessionOrCourseModal', 'serviceDefaults', 'uiCalendarConfig',
        function($scope, $q, $timeout, coachSeekAPIService, $activityIndicator, sessionOrCourseModal, serviceDefaults, uiCalendarConfig){

            //TODO - add ability to edit time range in modal?

            $scope.events = [];
            $scope.eventSources = [];
            $scope.currentRanges = [];

            var rangesLoaded = [],
                tempEventId,
                currentEventCopy,
                $currentEvent;

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
                    slotEventOverlap: false,
                    firstDay: 1,
                    titleFormat: {month:'MMM YYYY', week:'MMM YYYY', day:'D MMM YYYY'},
                    snapDuration: '00:15:00',
                    defaultView: $scope.isBigScreen ? 'agendaWeek' : 'agendaDay',
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
                    events: function(start, end, timezone, renderEvents){
                        var getSessionsParams = {
                            startDate: start.format('YYYY-MM-DD'),
                            endDate: end.format('YYYY-MM-DD'),
                            locationId: $scope.currentLocationId,
                            coachId: $scope.currentCoachId,
                            useNewSearch: true,
                            section: 'Sessions'
                        };
                        startCalendarLoading();
                        coachSeekAPIService.get(getSessionsParams)
                            .$promise.then(function(sessionObject){
                                $scope.events = [];
                                addSessionsWithinInterval(sessionObject.sessions);
                                addCoursesWithinInterval(sessionObject.courses);
                                renderEvents($scope.events);
                                $scope.$broadcast('fetchSuccesful');
                            }, $scope.handleErrors).finally(function(){
                                stopCalendarLoading();
                            });
                    },
                    eventRender: function(event, element, view) {
                        if(view.type !== 'month'){
                            $('<div></div>', {
                                class: 'fc-location',
                                text: event.session.location.name
                            }).appendTo(element.find('.fc-content'));
                        }
                    },
                    windowResize: function(view){
                        handleWindowResize(view.name);
                    },
                    // handle event drag/drop within calendar
                    eventDrop: function( event, delta, revertDate){
                        if(event.tempEventId){
                            _.assign($scope.currentEvent.session.timing, {
                                startDate: event._start.format('YYYY-MM-DD'),
                                startTime: event._start.format('HH:mm')
                            });
                        } else {
                            if(event.course){
                                //have to set $scope.currentEvent so sessionOrCourseModal can return id
                                $scope.currentEvent = event;
                                sessionOrCourseModal($scope).then(function(id){
                                    if(id === event.course.id){
                                        startCalendarLoading();
                                        updateSessionTiming(event.course, delta, revertDate, true);
                                    } else {
                                        updateSessionTiming(event.session, delta, revertDate, false);
                                    }
                                }, function(){
                                    revertDate();
                                });
                            } else {
                                updateSessionTiming(event.session, delta, revertDate, false);
                            }
                        }
                    },
                    eventClick: function(event, jsEvent, view) {
                        if(!$scope.showModal) $scope.currentTab = 'attendance';
                        if($scope.isBigScreen || view.type == 'agendaDay'){
                            $scope.showModal = true;

                            if($currentEvent) $currentEvent.removeClass('current-event');
                            $currentEvent = $(jsEvent.currentTarget);
                            $currentEvent.addClass('current-event');
                        }

                        $scope.currentEvent = event;
                        currentEventCopy = angular.copy(event);

                        if(event.course){
                            setCurrentCourseEvents();
                        }
                    },
                    viewRender: function(view){
                        $timeout(function(){
                            var heightToSet = $scope.isBigScreen ? ($('.calendar-container').height() - 10 ) : $(window).height();
                            uiCalendarConfig.calendars.sessionCalendar.fullCalendar('option', 'height', heightToSet);
                            handleWindowResize(view);
                        });
                    },
                    dayClick: function(date, jsEvent, view) {
                        if(!$scope.isBigScreen && view.type === 'month'){
                            uiCalendarConfig.calendars.sessionCalendar.fullCalendar('changeView', 'agendaDay');
                            uiCalendarConfig.calendars.sessionCalendar.fullCalendar('gotoDate', date);
                        } else if (Modernizr.touch) {
                            handleServiceDrop(date, angular.copy(serviceDefaults));
                        }
                    }
                }
            };

            var updateSessionTiming = function(session, delta, revertDate, reloadRanges){
                var newDate = getNewDate(session.timing);
                newDate.add(delta);

                _.assign(session.timing, {
                    startDate: newDate.format('YYYY-MM-DD'),
                    startTime: newDate.format('HH:mm')
                });

                $activityIndicator.startAnimating();
                updateSession(session).then(function(session){
                    $scope.removeAlerts();
                    if(reloadRanges) uiCalendarConfig.calendars.sessionCalendar.fullCalendar('refetchEvents');
                }, function(error){
                    revertDate();
                    handleClashingError(error);
                }).finally(function(){
                    $activityIndicator.stopAnimating();
                });
            };

            var handleWindowResize = function(viewName){
                var $sessionCalendar = uiCalendarConfig.calendars.sessionCalendar;
                if($scope.isBigScreen){
                    $sessionCalendar.find('.fc-agendaWeek-button').show();
                } else {
                    $sessionCalendar.find('.fc-agendaWeek-button').hide();
                    $scope.toggleOpen = false;
                    if(viewName === 'agendaWeek'){
                        $sessionCalendar.fullCalendar('changeView', 'agendaDay');
                    }
                }
                $sessionCalendar.fullCalendar('option', 'height', ($('.calendar-container').height() - 10));
            };

            var handleClashingError = function(error){
                var clashingMessage = error.data[0].data || error.data;
                clashingMessage = clashingMessage.substring(clashingMessage.indexOf(":") + 2, clashingMessage.indexOf(";"));

                $scope.addAlert({
                    type: 'danger',
                    message: 'scheduling:clashing-error',
                    clashingMessage: clashingMessage
                });
            };

            var handleServiceDrop = function(date, serviceData){
                $scope.currentTab = 'general';
                $scope.showModal = true;
                var session = buildSessionObject(date, serviceData);
                var repeatFrequency = serviceData.repetition.repeatFrequency;
                tempEventId = _.uniqueId('service_');

                _.times(serviceData.repetition.sessionCount, function(index){
                    var newEvent = buildCalendarEvent(moment(date).add(index, repeatFrequency), session);
                    $scope.events.push(newEvent);
                    uiCalendarConfig.calendars.sessionCalendar.fullCalendar('renderEvent', newEvent);
                    if(index === 0){
                        $scope.currentEvent = newEvent;
                        $scope.currentEvent.course = {pricing:newEvent.session.pricing};
                    }
                });
            };

            var addCoursesWithinInterval = function(courses){
                _.forEach(courses, function(course){
                    addSessionsWithinInterval(course.sessions, course);
                });
            };

            var addSessionsWithinInterval = function(sessions, course){
                _.forEach(sessions, function(session){
                    var newDate = getNewDate(session.timing);
                    $scope.events.push(buildCalendarEvent(newDate, session, course));
                });
            };

            var buildCalendarEvent = function(date, session, course){
                var dateClone = date.clone();
                var duration = session.timing.duration;
                // set default display length to never be less than 30
                duration =  duration < 30 ? 30 : duration;

                return {
                    _id: tempEventId,
                    tempEventId: tempEventId,
                    title: session.service.name,
                    start: moment(dateClone),
                    end: moment(dateClone.add(duration, 'minutes')),
                    allDay: false,
                    className: session.presentation.colour,
                    session: session,
                    course: course
                };
            };

            var buildSessionObject = function(date, serviceData){
                return {
                    service: serviceData,
                    location: {
                        id: $scope.currentLocationId
                    },
                    coach: {
                        id: $scope.currentCoachId
                    },
                    timing: {
                        startDate: date.format('YYYY-MM-DD'),
                        startTime: date.format('HH:mm'),
                        duration: serviceData.timing.duration
                    },
                    booking: {
                        isOnlineBookable: serviceData.booking ? serviceData.booking.isOnlineBookable : true,
                        studentCapacity: serviceData.booking ? serviceData.booking.studentCapacity : 1,
                        bookings: []
                    },
                    pricing: serviceData.pricing,
                    presentation: serviceData.presentation,
                    repetition: serviceData.repetition
                };
            };

            $scope.filterSessions = function(){
                $scope.removeAlerts();
                uiCalendarConfig.calendars.sessionCalendar.fullCalendar('refetchEvents');
                // SET BIZ HOURS
                // uiCalendarConfig.calendars.sessionCalendar.fullCalendar({businessHours: {}});
                // uiCalendarConfig.calendars.sessionCalendar.fullCalendar('render');
            };

            // var buildAvailableHours = function(coachAvailibility){}

            // HELPER FUNCTIONS
            $scope.minutesToStr = function(duration){
                return Math.floor(duration / 60) + ":" + duration % 60;
            };

            $scope.getCurrentCoach = function(){
                if($scope.coachList){
                    return _.result(_.find($scope.coachList, {id: $scope.currentCoachId}), 'name');
                }
            };

            $scope.cancelModalEdit = function(){
                if(currentEventCopy){
                    // must keep autosaved edits even if canceled
                    _.assign(currentEventCopy.session.booking.bookings, $scope.currentEvent.session.booking.bookings);
                    _.assign($scope.currentEvent, currentEventCopy);
                    uiCalendarConfig.calendars.sessionCalendar.fullCalendar('updateEvent', $scope.currentEvent);
                }
                closeModal(true);
            };

            $scope.saveModalEdit = function(){
                forceFormTouched();
                if($scope.currentSessionForm.$valid){
                    var course = $scope.currentEvent.course;
                    if($scope.currentEvent.tempEventId && course){
                        var session = $scope.currentEvent.session;
                        if ($scope.currentEvent.course.pricing && $scope.currentEvent.course.pricing.coursePrice){
                            session.pricing.coursePrice = $scope.currentEvent.course.pricing.coursePrice;     
                        }
                         saveSession(session);
                    } else if(course){
                        sessionOrCourseModal($scope).then(function(id){
                            if(id === course.id){
                                saveSession(assignCourseAttributes(course));
                            } else {
                                saveSession($scope.currentEvent.session);
                            }
                        }); 
                    } else {
                        saveSession($scope.currentEvent.session);
                    }
                }
            };

            var assignCourseAttributes = function(course){
                return _.assign($scope.currentEvent.session, {
                    id: course.id,
                    repetition: course.repetition,
                    timing: {
                        duration: $scope.currentEvent.session.timing.duration,
                        startDate: course.timing.startDate,
                        startTime: $scope.currentEvent.session.timing.startTime
                    },
                    pricing: {
                        sessionPrice: $scope.currentEvent.session.pricing.sessionPrice,
                        coursePrice: course.pricing.coursePrice
                    }
                });
            };

            var saveSession = function(session){
                startCalendarLoading();
                updateSession(session).then(function(session){
                    if($scope.currentEvent.tempEventId){
                        removeTempEvents();
                        delete $scope.currentEvent.tempEventId;
                        if(session.sessions){
                            $scope.currentEvent.session = session.sessions[0];
                            $scope.currentEvent.course = session;
                        } else {
                            $scope.currentEvent.session = session;
                        }
                    } else {
                        closeModal();
                    }
                    $scope.removeAlerts();
                    uiCalendarConfig.calendars.sessionCalendar.fullCalendar('refetchEvents');
                }, handleCalendarErrors);
            };

            $scope.$on('fetchSuccesful', function(){
                if($scope.currentEvent) {
                    $scope.currentEvent = _.find($scope.events, function(event){
                        return event.session.id === $scope.currentEvent.session.id;
                    });
                    if($scope.currentEvent) setCurrentCourseEvents();
                }
            });

            var setCurrentCourseEvents = function(){
                $scope.currentCourseEvents = _.filter($scope.events, function(event){
                    return event.course && event.course.id === $scope.currentEvent.course.id;
                });
            };

            $scope.deleteSession = function(){
                if($scope.currentEvent.course){
                    sessionOrCourseModal($scope).then(deleteSessions);
                } else {
                    deleteSessions($scope.currentEvent.session.id);
                }
            };

            var deleteSessions = function(id){
                startCalendarLoading();
                coachSeekAPIService.delete({section: 'Sessions', id: id})
                    .$promise.then(function(){

                        $scope.addAlert({
                            type: 'success',
                            message: id === $scope.currentEvent.session.parentId ? "scheduling:delete-course-success" : "scheduling:delete-session-success",
                            name: $scope.currentEvent.session.service.name,
                            startDate: $scope.currentEvent.start.format("MMMM Do YYYY, h:mm a")
                        });
                        closeModal();
                        uiCalendarConfig.calendars.sessionCalendar.fullCalendar('refetchEvents');
                    },  function(error){
                        $scope.handleErrors(error);
                        stopCalendarLoading();
                    });
            };

            var handleCalendarErrors = function(error){
                _.forEach(error.data, function(error){
                    if(error.code === "clashing-session"){
                        handleClashingError(error);
                    } else {
                        $scope.addAlert({
                            type: 'danger',
                            message: error.message ? error.message: error
                        });
                    }
                });
                stopCalendarLoading();
            };

            var closeModal = function(resetTimePicker){
                removeTempEvents();
                $scope.$broadcast('closeTimePicker', resetTimePicker);
                $scope.currentSessionForm.$setUntouched();
                $scope.currentSessionForm.$setPristine();
                $scope.showModal = false;
            };

            var forceFormTouched = function(){
                $scope.currentSessionForm.coaches.$setTouched();
                $scope.currentSessionForm.locations.$setTouched();
                $scope.currentSessionForm.sessionPrice.$setTouched();
                $scope.currentSessionForm.coursePrice.$setTouched();
            };

            var removeTempEvents = function(){
                if(tempEventId){
                    uiCalendarConfig.calendars.sessionCalendar.fullCalendar('removeEvents', tempEventId);
                    tempEventId = null;
                }
            };

            var getNewDate = function(timing){
                return moment(timing.startDate + " " + timing.startTime, "YYYY-MM-DD HH:mm");
            };

            var updateSession = function(sessionObject){
                return coachSeekAPIService.save({section: 'Sessions'}, sessionObject).$promise;
            };

            var startCalendarLoading = function(){
                if(!$scope.calendarLoading){
                    $scope.calendarLoading = true;
                }
            };

            var stopCalendarLoading = function(){
                $scope.calendarLoading = false;
            };

            // TODO - do this in repeat selector
            $scope.$watch('currentEvent.session.repetition.sessionCount', function(newVal){
                if($scope.currentEvent && $scope.currentEvent.tempEventId && newVal < 2 && $scope.currentEvent.course.pricing && $scope.currentEvent.course.pricing.coursePrice){
                    delete $scope.currentEvent.course.pricing.coursePrice;
                }
            });

            // INITIAL LOAD
            startCalendarLoading();
            $q.all({
                    coaches: coachSeekAPIService.query({section: 'Coaches'}).$promise,
                    locations: coachSeekAPIService.query({section: 'Locations'}).$promise,
                    services: coachSeekAPIService.query({section: 'Services'}).$promise
                })
                .then(function(response) {
                    $scope.coachList    = response.coaches;
                    $scope.locationList = response.locations;
                    $scope.serviceList  = response.services;
                },function(error){
                    $scope.handleErrors(error);
                    stopCalendarLoading();
                });
    }]);