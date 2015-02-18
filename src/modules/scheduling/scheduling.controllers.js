angular.module('scheduling.controllers', [])
    .controller('schedulingCtrl', ['$scope', '$q', 'coachSeekAPIService', '$activityIndicator',
        function($scope, $q, coachSeekAPIService, $activityIndicator){

            //TODO - add ability to edit time range in modal?

            var rangesLoaded = [];
            var tempEventId;
            $scope.events = [];
            $scope.eventSources = [$scope.events];

            $scope.draggableOptions = {
                helper: function(event) {
                    var serviceData = $(this).data('service');
                    return $('<span class="service-drag-helper ' + serviceData.presentation.colour + '"><span/>');
                },
                cursorAt: {
                    top: 15,
                    left: 15
                }
            };

            $scope.dragstart = function(event){
                $(event.target).addClass('dragging');
            };

            $scope.dragstop = function(event){
                $(event.target).removeClass('dragging');
            };

            $scope.uiConfig = {
                calendar:{
                    editable: true,
                    droppable: true,
                    allDaySlot: false,
                    handleWindowResize: false,
                    firstDay: 1,
                    aspectRatio: 1.2,
                    snapDuration: '00:15:00',
                    defaultView: 'agendaWeek',
                    eventDurationEditable: false,
                    scrollTime:  "08:00:00",
                    header:{
                        left: '',
                        center: 'prev title next',
                        right: 'month agendaWeek agendaDay today'
                    },
                    drop: function(date, event) {
                        // console.log("DROP")
                        var serviceData = $(this).data('service');
                        handleServiceDrop(date, serviceData);
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
                    // handle event drag/drop within calendar
                    eventDrop: function( event, delta, revertDate){
                        //When we have an open event we don't want to save
                        if(event._id === tempEventId){
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
                            saveEvent(session).then(function(){
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
                        $scope.showModal = true;
                        $scope.currentSession = event.session;
                    },
                    viewRender: function(view, $element){
                        //doing this to allow user to drop outside of box
                        $element.droppable();
                        $scope.calendarView = view;
                        $scope.$calendarElement = $element;

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

            // THIS NEEDS TO INCLUDE COACHES AND LOCATIONS?
            // also need to get rid of loaded ranges when clearing.
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
                // TODO? - how do we make this work for sessions that start before our
                // interval but carry into the current day/week/month?
                // GET sessions here
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
                }
                startCalendarLoading();
                _.forEach(sessions, function(session, index){
                    var newDate = getNewDate(session.timing);
                    var serviceData = _.find($scope.serviceList, {id: session.service.id});
                    buildCalendarEvents(newDate, serviceData, session);
                });
                stopCalendarLoading();
            };

            var handleServiceDrop = function(date, serviceData){
                $scope.showModal = true;
                var session = buildSessionObject(date, serviceData);
                $scope.currentSession = session;
                tempEventId = _.uniqueId('service_');
                buildCalendarEvents(date, serviceData, session);
            };

            var buildCalendarEvents = function(date, serviceData, session){
                var repeatFrequency = session.repetition.repeatFrequency;
                var id = tempEventId || _.uniqueId('service_');
                // ONCE
                if ( repeatFrequency === undefined ) {
                    addEventToCalendar(id, date, serviceData, 0, session);
                // FINITE
                } else if ( repeatFrequency ) {
                    var sessionCount = session.repetition.sessionCount;
                    _.times(sessionCount, function(index){
                        addEventToCalendar(id, date, serviceData, index, session);
                    });
                }
            };

            var addEventToCalendar = function(id, date, serviceData, index, session){
                var newDate = date.clone();
                // always use duration/repeatFrequency that was set when session was originally
                // dragged into calendar
                var repeatFrequency = session.repetition.repeatFrequency;
                var duration = session.timing.duration;

                var newEvent = {
                    _id: id,
                    title: session.service.name,
                    description: serviceData.description,
                    start: moment(newDate.add(index, repeatFrequency)),
                    end: moment(newDate.add(duration, 'minutes')),
                    allDay: false,
                    className: serviceData.presentation.colour,
                    // events need to know about sessions in order to save
                    // when moved/dragged while in calendar
                    // may need to do get here
                    session: session
                };
                $scope.eventSources[0].push(newEvent);
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
                loadInterval(false, true);
                // SET BIZ HOURS
                // $('#session-calendar').fullCalendar({businessHours: {}});
                // $('#session-calendar').fullCalendar('render');
            };

            // var buildAvailableHours = function(coachAvailibility){

            // }

            // HELPER FUNCTIONS
            $scope.minutesToStr = function(duration){
                return Math.floor(duration / 60) + ":" + duration % 60;
            };

            $scope.getLocationName = function(){
                if ($scope.currentSessionForm.locations.$viewValue){
                    return _.find($scope.locationList, {id: $scope.currentSessionForm.locations.$viewValue}).name;
                }
            };

            $scope.getSessionTimeRange = function(){
                if($scope.currentSession){
                    var sessionTiming = $scope.currentSession.timing;
                    var startTime = sessionTiming.startTime;
                    var endTime = moment(startTime, "HH:mm").add(sessionTiming.duration, 'minutes').format('HH:mm');
                    return startTime + " – " + endTime;
                }
            };

            $scope.cancelModalEdit = function(){
                //TODO - unset currentSession so we don't load edited values if we click this session again
                $scope.removeAlerts();
                resetForm();
                removeTempEvents();
                $scope.showModal = false;
            };

            $scope.saveModalEdit = function(){
                $scope.currentSessionForm.coaches.$setTouched();
                $scope.currentSessionForm.locations.$setTouched();
                if($scope.currentSessionForm.$valid){
                    startCalendarLoading();
                    saveEvent($scope.currentSession).then(function(session){
                        resetForm(); 
                        $scope.showModal = false;
                        tempEventId = null;
                        loadInterval(false, true);
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

            var removeTempEvents = function(){
                if(tempEventId){
                    $('#session-calendar').fullCalendar('removeEvents', tempEventId);
                    tempEventId = null;
                }
            };

            var getNewDate = function(timing){
                return moment(timing.startDate + " " + timing.startTime, "YYYY-MM-DD HH:mm");
            };

            var saveEvent = function(sessionObject){
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
                            message: error.message
                        });
                    });
                    stopCalendarLoading();
                });
    }]);