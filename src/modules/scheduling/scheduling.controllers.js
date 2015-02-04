angular.module('scheduling.controllers', [])
    .controller('schedulingCtrl', ['$scope', '$q', 'coachSeekAPIService', '$activityIndicator',
        function($scope, $q, coachSeekAPIService, $activityIndicator){
            var rangesLoaded = [];

            $scope.events = [];
            $scope.eventSources = [$scope.events];
            $scope.uiConfig = {
                calendar:{
                    height: 500,
                    editable: true,
                    droppable: true,
                    allDaySlot: false,
                    firstDay: 1,
                    snapDuration: '00:15:00',
                    defaultView: 'agendaWeek',
                    eventDurationEditable: false,
                    drop: function(date, event) {
                        console.log("DROP")
                        var serviceData = $(this).data('service');
                        handleServiceDrop(date, serviceData);
                        $(this).animate({ opacity: 1 }, 750);
                    },
                    // businessHours: {
                    //     start: '10:00', // a start time (10am in this example)
                    //     end: '18:00', // an end time (6pm in this example)

                    //     dow: [ 1, 2, 3, 4 ]
                    //     // days of week. an array of zero-based day of week integers (0=Sunday)
                    //     // (Monday-Thursday in this example)
                    // },
                    eventRender: function(event, element, view) {
                        if(view.type === 'agendaDay'){
                            $('<div></div>', {
                                class: 'fc-description',
                                text: event.description
                            }).appendTo(element.find('.fc-content'));
                        }
                    },
                    // handle event drag/drop within calendar
                    eventDrop: function( event, delta, revertDate){
                        var session = event.session;
                        var newDate = getNewDate(session.timing);
                        newDate.add(delta);

                        _.assign(session.timing, {
                            startDate: newDate.format('YYYY-MM-DD'),
                            startTime: newDate.format('HH:mm')
                        });

                        startCalendarLoading();     
                        saveEvent(session).then({}, function(error){
                            revertDate();

                            _.forEach(error.data, function(error){
                                $scope.addAlert({
                                    type: 'danger',
                                    message: error.message
                                });
                            });
                        }).finally(function(){
                            stopCalendarLoading();
                        });
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
                        var intervalStart = view.intervalStart.clone().startOf('month');
                        var intervalEnd = view.intervalStart.clone().endOf('month');
                        var newRange = moment().range(intervalStart, intervalEnd);

                        if(intervalLoaded(newRange)){
                            loadNewInterval(intervalStart, intervalEnd, newRange);
                        }
                    },
                    header:{
                        left: '',
                        center: 'prev title next',
                        right: 'month agendaWeek agendaDay today'
                    },
                    scrollTime:  "08:00:00"
                }
            };

            var intervalLoaded = function(newRange){
                var isNewRange = true;
                _.forEach(rangesLoaded, function(loadedRange){
                    if( loadedRange.contains(newRange) ){
                        isNewRange = false;
                    }
                });
                return isNewRange;
            };

            var loadNewInterval = function(intervalStart, intervalEnd, newRange){
                // TODO? - how do we make this work for sessions that start before our
                // interval but carry into the current day/week/month?
                // GET sessions here
                var getSessionsParams = {
                    startDate: intervalStart.format('YYYY-MM-DD'),
                    endDate: intervalEnd.format('YYYY-MM-DD'),
                    section: 'Sessions'
                };

                startCalendarLoading();
                coachSeekAPIService.get(getSessionsParams)
                    .$promise.then(function(sessions){
                        addSessionsWithinInterval(sessions);
                        rangesLoaded.push(newRange);
                    }, function(error){
                        _.forEach(error.data, function(error){
                            $scope.addAlert({
                                type: 'danger',
                                message: error.message
                            });
                        });
                    }).finally(function(){
                        stopCalendarLoading();
                    });
            };

            var addSessionsWithinInterval = function(sessions){
                startCalendarLoading();
                _.forEach(sessions, function(session, index){
                    var newDate = getNewDate(session.timing);
                    if($scope.serviceList){
                        var serviceData = _.find($scope.serviceList, {id: session.service.id})
                        buildCalendarEvents(newDate, serviceData, session);
                    } else {
                        console.log('NO SERVICES RETRIEVED YET?')
                    }
                });
                stopCalendarLoading();
            };

            var handleServiceDrop = function(date, serviceData){
                var sessionObject = buildSessionObject(date, serviceData);

                startCalendarLoading();         
                saveEvent(sessionObject).then(function(session){
                    buildCalendarEvents(date, serviceData, session);
                }, function(error){
                    _.forEach(error.data, function(error){
                        $scope.addAlert({
                            type: 'danger',
                            message: error.message
                        });
                    });
                }).finally(function(){
                    stopCalendarLoading();
                });
            };

            var buildCalendarEvents = function(date, serviceData, session){
                var repeatFrequency = session.repetition.repeatFrequency;
                var id = _.uniqueId('service_');

                // if( repeatFrequency === -1 ){
                //     // FOREVER
                //     addEventToCalendar(id, date, serviceData, 0);
                // } else 
                if ( repeatFrequency === undefined ) {
                    // ONCE
                    addEventToCalendar(id, date, serviceData, 0, session);
                } else if ( repeatFrequency ) {
                    // FINITE
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

                // TODO - add coaches and locations.
                var newEvent = {
                    _id: id,
                    title: serviceData.name,
                    description: serviceData.description,
                    start: moment(newDate.add(index, repeatFrequency)),
                    end: moment(newDate.add(duration, 'minutes')),
                    allDay: false,
                    className: serviceData.presentation.colour,
                    session: session
                };
                $scope.eventSources[0].push(newEvent);
            };


            var buildSessionObject = function(date, serviceData){
                return {
                    service: serviceData,
                    location: {
                        id: $scope.locationList[0].id,
                        name: $scope.locationList[0].name
                    },
                    coach: {
                        id: $scope.coachList[0].id,
                        name: $scope.coachList[0].name  
                    },
                    timing: {
                        startDate: date.format('YYYY-MM-DD'),
                        startTime: date.format('HH:mm')
                    },
                    booking: {
                        isOnlineBookable: false,
                        studentCapacity: 1
                    }
                };
            };

            // HELPER FUNCTIONS
            $scope.minutesToStr = function(duration){
                return Math.floor(duration / 60) + ":" + duration % 60;
            };

            $scope.onRevert = function(valid){
                if(valid) {
                    $(this).css('opacity', '0');
                }
                return true;
            };

            var getNewDate = function(timing){
                return moment(timing.startDate + " " + timing.startTime, "YYYY-MM-DD HH:mm");
            };

            var saveEvent = function(sessionObject){
                return coachSeekAPIService.update({section: 'Sessions'}, sessionObject).$promise
            };

            var startCalendarLoading = function(){
                if(!$activityIndicator.isAnimating()){
                    // prevent drops from happening while loading
                    $scope.calendarView.calendar.options.droppable = false;
                    $scope.$calendarElement.droppable( "option", "disabled", true );
                    $activityIndicator.startAnimating();
                }
            };

            var stopCalendarLoading = function(view, $element){
                $scope.$calendarElement.droppable( "option", "disabled", false );
                $scope.calendarView.calendar.options.droppable = true;
                $activityIndicator.stopAnimating();
            };

            // INITIAL LOAD
            $activityIndicator.startAnimating();
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
                }).finally(function(){
                    $activityIndicator.stopAnimating();
                });
    }]);