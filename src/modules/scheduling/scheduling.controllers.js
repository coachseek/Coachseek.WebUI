angular.module('scheduling.controllers', [])
    .controller('schedulingCtrl', ['$scope', '$q', '$state', '$timeout', 'sessionService', 'coachSeekAPIService', '$activityIndicator', 'sessionOrCourseModal', 'serviceDefaults', 'uiCalendarConfig','$compile','$templateCache', 'onboardingModal',
        function($scope, $q, $state, $timeout, sessionService, coachSeekAPIService, $activityIndicator, sessionOrCourseModal, serviceDefaults, uiCalendarConfig,$compile,$templateCache, onboardingModal){
            $scope.events = [];
            $scope.calendarView = sessionService.calendarView;

            var tempEventId,
                currentEventCopy,
                $currentEvent,
                totalNumSessions,
                cachedRanges,
                loadingRanges,
                currentMonthLoaded; //used to not stop calendar loading when initally loading next/previous month

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
                    defaultView: sessionService.calendarView.view || ($scope.isBigScreen ? 'agendaWeek' : 'agendaDay'),
                    eventDurationEditable: false,
                    scrollTime:  "06:00:00",
                    defaultDate: sessionService.calendarView.start || null,
                    header:{
                        left: '',
                        center: 'prev title next',
                        right: 'month agendaWeek agendaDay today' 
                    },
                    externalDragStart: function(){
                        $scope.$broadcast('hideDragServicePopover');
                    },
                    externalDragFail: function(){
                        if(showDragServicePopover()) $scope.$broadcast('showDragServicePopover');
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
                    eventRender: function(event, element, view) {
                        if(view.type !== 'month'){
                            $('<div></div>', {
                                class: 'fc-location',
                                text: event.session.location.name
                            }).appendTo(element.find('.fc-content'));
                        }
                        handleFullyBooked(event,element,view);
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
                            $scope.setCurrentCourseEvents();
                        } else {
                            delete $scope.currentCourseEvents;
                        }
                    },
                    viewRender: function(view){
                        _.assign(sessionService.calendarView, {
                            view: view.type,
                            start: view.intervalStart
                        });

                        $timeout(function(){
                            var heightToSet = $scope.isBigScreen ? ($('.calendar-container').height() - 10 ) : $(window).height();
                            uiCalendarConfig.calendars.sessionCalendar.fullCalendar('option', 'height', heightToSet);
                            handleWindowResize(view);
                        });
                    },
                    dayClick: function(date, jsEvent, ev, view) {
                        if(view.type === 'month'){
                            uiCalendarConfig.calendars.sessionCalendar.fullCalendar('changeView', 'agendaDay');
                            uiCalendarConfig.calendars.sessionCalendar.fullCalendar('gotoDate', date);
                        } else if (Modernizr.touch && ev.type !== "tap") {
                            handleServiceDrop(date, angular.copy(serviceDefaults));
                        }
                    },
                    waitForFetch: function(fetchNeeded, intervalStart, reportEvents){
                        startCalendarLoading();
                        $scope.uiConfig.calendar[fetchNeeded](intervalStart, reportEvents, 2);
                    },
                    getPreviousMonthEvents: function(start, reportEvents, monthsToSubtract){
                        var previousDate = start.clone().subtract(monthsToSubtract || 1, 'M');
                        var monthStart = previousDate.clone().startOf('month').format('YYYY-MM-DD');
                        if(!_.includes(cachedRanges.rangesLoading, monthStart)){
                            loadNextOrPreviousMonth(monthStart, previousDate, reportEvents).then(function(){
                                cachedRanges.cachedRangeStart = moment(previousDate.clone().startOf('month').format('YYYY-MM-DD'));
                            });
                        }
                    },
                    getNextMonthEvents: function(start, reportEvents, monthsToAdd, a, b, c){
                        var nextDate = start.clone().add(monthsToAdd || 1, 'M');
                        var monthStart = nextDate.clone().startOf('month').format('YYYY-MM-DD');
                        if(!_.includes(cachedRanges.rangesLoading, monthStart)){
                            loadNextOrPreviousMonth(monthStart, nextDate, reportEvents).then(function(){
                                cachedRanges.cachedRangeEnd = moment(nextDate.clone().endOf('month').format('YYYY-MM-DD'));
                            });
                        }
                    },
                    events: function(start, end, intervalStart, timezone, renderEvents, reportEvents){
                        if(!cachedRanges) cachedRanges = uiCalendarConfig.calendars.sessionCalendar.fullCalendar('getCachedRanges');
                        cachedRanges.rangesLoading = [];
                        if(!showOnboarding()){
                            var getSessionsParams = buildGetSessionsParams(intervalStart);
                            cachedRanges.cachedRangeStart = moment(getSessionsParams.startDate);
                            cachedRanges.cachedRangeEnd = moment(getSessionsParams.endDate);
                            $scope.events = [];
                            currentMonthLoaded = false;

                            startCalendarLoading();
                            getAndRenderSessions(getSessionsParams)
                                .then(function(){
                                    renderEvents($scope.events);
                                    currentMonthLoaded = true;
                                    $scope.$broadcast('fetchSuccesful');
                                }, $scope.handleErrors).finally(function(){
                                    stopCalendarLoading();
                                });
                            $scope.uiConfig.calendar.getPreviousMonthEvents(intervalStart, reportEvents, 1);
                            $scope.uiConfig.calendar.getNextMonthEvents(intervalStart, reportEvents, 1);
                        }
                    }
                }
            };

            function loadNextOrPreviousMonth(monthStart, date, reportEvents){
                var getSessionsParams = buildGetSessionsParams(date);
                cachedRanges.rangesLoading.push(monthStart);
                return getAndRenderSessions(getSessionsParams)
                    .then(function(){
                        reportEvents($scope.events);
                        _.remove(cachedRanges.rangesLoading, function(value){return value === monthStart});
                    }, $scope.handleErrors).finally(function(){
                        if(currentMonthLoaded) stopCalendarLoading();
                    });
            }

            function buildGetSessionsParams(date){
                return {
                    startDate: date.clone().startOf('month').format('YYYY-MM-DD'),
                    endDate: date.clone().endOf('month').format('YYYY-MM-DD'),
                    locationId: sessionService.calendarView.locationId,
                    coachId: sessionService.calendarView.coachId,
                    section: 'Sessions'
                };
            };

            function getAndRenderSessions(getSessionsParams){
                return coachSeekAPIService.get(getSessionsParams)
                    .$promise.then(function(sessionObject){
                        addSessionsWithinInterval(sessionObject.sessions);
                        addCoursesWithinInterval(sessionObject.courses);
                    })
            };

            var addCoursesWithinInterval = function(courses){
                _.forEach(courses, function(course){
                    addSessionsWithinInterval(course.sessions, course);
                });
            };

            var addSessionsWithinInterval = function(sessions, course){
                _.forEach(sessions, function(session){
                    var newDate = getNewDate(session.timing);
                    var calendarEvent = buildCalendarEvent(newDate, session, course);
                    if(!_.find($scope.events, function(event){return event.session.id === session.id})){
                        $scope.events.push(calendarEvent);
                    }
                });
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

            var handleFullyBooked = function(event,element,view){
                if(event.session.booking.studentCapacity - _.size(event.session.booking.bookings) <= 0){
                    $scope.viewType = view.type;
                    $('<div></div>', {
                        class: 'fc-fullybooked-'+view.type+' '+event.session.presentation.colour,
                        html: $compile($templateCache.get('scheduling/partials/calendarFullyBooked.html'))($scope)
                    }).appendTo(element.find('.fc-content'));
                }
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
                        if(showSessionModalPopover()) $scope.$broadcast('showSessionModalPopover', 500);
                    }
                });
            };

            var buildCalendarEvent = function(date, session, course){
                var dateClone = date.clone();
                var duration = session.timing.duration;
                // set default display length to never be less than 30
                duration =  duration < 30 ? 30 : duration;

                return {
                    _id: tempEventId || _.uniqueId('session_'),
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
                        id: $scope.calendarView.locationId
                    },
                    coach: {
                        id: $scope.calendarView.coachId
                    },
                    timing: {
                        startDate: date.format('YYYY-MM-DD'),
                        startTime: date.format('HH:mm'),
                        duration: serviceData.timing.duration
                    },
                    booking: {
                        isOnlineBookable: _.get(serviceData, 'booking.isOnlineBookable', true),
                        studentCapacity: _.get(serviceData, 'booking.studentCapacity', 1),
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
                    return _.result(_.find($scope.coachList, {id: $scope.calendarView.coachId}), 'name');
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
                            _.set(session, 'pricing.coursePrice', $scope.currentEvent.course.pricing.coursePrice);
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
                        totalNumSessions = null;
                        delete $scope.currentEvent.tempEventId;
                        if(session.sessions){
                            $scope.currentEvent.session = session.sessions[0];
                            $scope.currentEvent.course = session;
                        } else {
                            $scope.currentEvent.session = session;
                        }
                        // Add drag and session modal onboarding here
                        $scope.$broadcast('hideSessionModalPopover');
                        sessionService.onboarding.stepsCompleted.push('dragService', 'sessionModal');
                        if(sessionService.onboarding.showOnboarding) {
                            onboardingModal.open('onboardingReviewModal')
                                .then().finally(function(){
                                    heap.track('Onboarding Close', {step: 'onboardingReview'});
                                    sessionService.onboarding.showOnboarding = false;
                                });
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
                    if($scope.currentEvent) $scope.setCurrentCourseEvents();
                }
            });

            $scope.setCurrentCourseEvents = function(){
                $scope.currentCourseEvents = _.filter(uiCalendarConfig.calendars.sessionCalendar.fullCalendar('clientEvents'), function(event){
                    return _.get(event, 'course.id', 1) === _.get($scope, 'currentEvent.course.id', 1);
                });
            };

            $scope.deleteSession = function(){
                if($scope.currentEvent.course){
                    sessionOrCourseModal($scope).then(deleteSessions);
                } else {
                    deleteSessions($scope.currentEvent.session.id);
                }
            };

            $scope.toggleServiceDrawer = function(){
                $scope.calendarView.serviceDrawerOpen = !$scope.calendarView.serviceDrawerOpen
                if($scope.calendarView.serviceDrawerOpen && showDragServicePopover()){
                    $scope.$broadcast('showDragServicePopover');
                } else {
                    $scope.$broadcast('hideDragServicePopover');
                }
            };

            $scope.closePopover = function(hidePopoverTrigger){
                $scope.$broadcast(hidePopoverTrigger, 0, true);
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

            var handleCalendarErrors = function(errors){
                _.forEach(errors.data, function(error){
                    if(error.code === "clashing-session"){
                        handleClashingError(error);
                    } else {
                        $scope.addAlert({
                            type: 'danger',
                            code: error.code,
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
                $scope.$broadcast('hideSessionModalPopover');
                if(showDragServicePopover()) $scope.$broadcast('showDragServicePopover');
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

            function showOnboarding(){
                return sessionService.onboarding.showOnboarding && !_.includes(sessionService.onboarding.stepsCompleted, 'createDefaults');
            };

            function showDragServicePopover(){
                return sessionService.onboarding.showOnboarding && !_.includes(sessionService.onboarding.stepsCompleted, 'dragService');
            };

            function showSessionModalPopover(){
                return sessionService.onboarding.showOnboarding && !_.includes(sessionService.onboarding.stepsCompleted, 'sessionModal');
            };

            // TODO - do this in repeat selector
            $scope.$watch('currentEvent.session.repetition.sessionCount', function(newVal){
                if(_.has($scope, 'currentEvent.tempEventId') && newVal < 2 && _.has($scope, 'currentEvent.course.pricing.coursePrice')){
                    delete $scope.currentEvent.course.pricing.coursePrice;
                }
            });

            function initFetch(){
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
                        if(showDragServicePopover()){
                            $timeout(function(){
                                stopCalendarLoading();
                                $scope.$broadcast('showDragServicePopover', 1000)
                            });
                        }
                    },function(error){
                        $scope.handleErrors(error);
                        stopCalendarLoading();
                    });
            }

            if(showOnboarding()){
                onboardingModal.open('onboardingDefaultsModal', 'onboardingDefaultsModalCtrl').then(function(response){
                    sessionService.onboarding.stepsCompleted.push('createDefaults');
                    initFetch();
                }, function(){
                    onboardingModal.open('exitOnboardingModal')
                        .then(function(){
                            $state.reload();
                        }, function(){
                            heap.track('Onboarding Close', {step: 'createDefaults'});
                            sessionService.onboarding.showOnboarding = false;
                        });
                });
            } else {
                initFetch();
            }
    }]);