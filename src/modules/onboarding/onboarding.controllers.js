angular.module('onboarding.controllers', ['businessSetup'])
    .controller('onboardingDefaultsModalCtrl', ['$scope', '$q', '$timeout', '$activityIndicator', 'coachSeekAPIService', 'sessionService', 'serviceDefaults', 'coachDefaults',
      function($scope, $q, $timeout, $activityIndicator, coachSeekAPIService, sessionService, serviceDefaults, coachDefaults){
        $scope.coachFirstName = $scope.currentUser.firstName;
        $scope.coachLastName = $scope.currentUser.lastName;
        $scope.createDefaults = function () {
            $scope.removeAlerts();
            if($scope.onboardingDefaultsForm.$valid){
                $activityIndicator.startAnimating();
                $q.all(getDefaultPromises()).then(function(){
                    $scope.$close();
                    if(window.Intercom) {
                        Intercom('update', {Locations: 1});
                        Intercom('update', {Services: 1});
                        Intercom('update', {Coaches: 1});
                    }
                }, $scope.handleErrors).finally(function(){
                    $activityIndicator.stopAnimating();
                });
            } else {
                $scope.onboardingDefaultsForm.coachFirstName.$setTouched();
                $scope.onboardingDefaultsForm.coachLastName.$setTouched();
                $scope.onboardingDefaultsForm.locationName.$setTouched();
                $scope.onboardingDefaultsForm.serviceName.$setTouched();
            }
        };

        function getDefaultPromises(){
            var defaultServiceValues = angular.copy(serviceDefaults);
            return [
                coachSeekAPIService.save({ section: 'Coaches' }, getDefaultCoachValues()).$promise,
                coachSeekAPIService.save({ section: 'Locations' }, {name: $scope.locationName}).$promise,
                coachSeekAPIService.save({ section: 'Services' }, _.assign(defaultServiceValues, {name: $scope.serviceName})).$promise
            ];
        };

        function getDefaultCoachValues(){
            var defaultCoachValues = angular.copy(coachDefaults);
            return _.assign(defaultCoachValues, {
                firstName: $scope.coachFirstName,
                lastName: $scope.coachLastName,
                email: $scope.coachFirstName + $scope.coachLastName + "@" + sessionService.business.domain + '.com',
                phone: i18n.t('onboarding:1800coach') + $scope.coachLastName.toUpperCase()
            });
        };
    }])
    .controller('mobileOnboardingSkipModalCtrl', ['$scope','loginModal','$modalInstance','$state','$stateParams',
        function ($scope, loginModal, $modalInstance, $state, $stateParams) {
        $scope.continueMobileOnboarding = function(){ 
            $modalInstance.dismiss('cancel');
        };
        $scope.skipMobileOnboarding = function(){
            $state.go('newUserSetup').then(function(){
                $modalInstance.dismiss('cancel');
            }, function(error){});
            
        };
    }])
    .controller('mobileOnboardingSignUpCtrl', ['$rootScope','$scope', '$q', '$stateParams', '$state' , 'loginModal', 'ENV',
        function($rootScope,$scope, $q, $stateParams, $state ,loginModal,ENV){     
            $rootScope.signIn = function(){
                loginModal.open().then(function () {
                    $rootScope.removeAlerts();
                    $state.go('scheduling');
                });
            };
            $rootScope.joinUs = function(){
                $state.go('mobileOnboardingDefault');
            };
    }])
    .controller('mobileOnboardingDefaultCtrl', ['$q','$stateParams', '$state','$rootScope','$scope','$timeout', '$activityIndicator','coachSeekAPIService','serviceDefaults','coachDefaults','mobileOnboardingSkipModal','sessionService','uiCalendarConfig',
        function ($q, $stateParams, $state, $rootScope, $scope, $timeout, $activityIndicator, coachSeekAPIService, serviceDefaults, coachDefaults, mobileOnboardingSkipModal,sessionService,uiCalendarConfig) {
        $scope.business = {};
        $scope.admin = {};
        $scope.events=[];
        /*onboarding  calendar config*/
         $scope.uiConfig = {
                calendar:{
                    editable: true,
                    droppable: true,
                    allDaySlot: false,
                    slotEventOverlap: false,
                    firstDay: 1,
                    titleFormat: {month:'MMM YYYY', week:'MMM YYYY', day:'D MMM YYYY'},
                    snapDuration: '00:15:00',
                    defaultView: 'month',
                    eventDurationEditable: false,
                    scrollTime:  "06:00:00",
                    defaultDate: sessionService.calendarView.start || null,
                    header:{
                        left: '',
                        center: 'prev title next',
                        right: '' 
                    },
                    // externalDragStart: function(){
                    //     $scope.$broadcast('hideDragServicePopover');
                    // },
                    // externalDragFail: function(){
                    //     if(showDragServicePopover()) $scope.$broadcast('showDragServicePopover');
                    // },
                    // drop: function(date, event) {
                    //     handleServiceDrop(date, $(this).data('service'));
                    // },
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
                    // events: function(start, end, timezone, renderEvents){
                    //     if(!showOnboarding()){
                    //         var getSessionsParams = {
                    //             startDate: start.format('YYYY-MM-DD'),
                    //             endDate: end.format('YYYY-MM-DD'),
                    //             locationId: sessionService.calendarView.locationId,
                    //             coachId: sessionService.calendarView.coachId,
                    //             section: 'Sessions'
                    //         };
                    //         startCalendarLoading();
                    //         coachSeekAPIService.get(getSessionsParams)
                    //             .$promise.then(function(sessionObject){
                    //                 $scope.events = [];
                    //                 addSessionsWithinInterval(sessionObject.sessions);
                    //                 addCoursesWithinInterval(sessionObject.courses);
                    //                 renderEvents($scope.events);
                    //                 $scope.$broadcast('fetchSuccesful');
                    //             }, $scope.handleErrors).finally(function(){
                    //                 stopCalendarLoading();
                    //             });
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
                    // windowResize: function(view){
                    //     handleWindowResize(view.name);
                    // },
                    // handle event drag/drop within calendar
                    // eventDrop: function( event, delta, revertDate){
                    //     if(event.tempEventId){
                    //         _.assign($scope.currentEvent.session.timing, {
                    //             startDate: event._start.format('YYYY-MM-DD'),
                    //             startTime: event._start.format('HH:mm')
                    //         });
                    //     } else {
                    //         if(event.course){
                    //             //have to set $scope.currentEvent so sessionOrCourseModal can return id
                    //             $scope.currentEvent = event;
                    //             sessionOrCourseModal($scope).then(function(id){
                    //                 if(id === event.course.id){
                    //                     startCalendarLoading();
                    //                     updateSessionTiming(event.course, delta, revertDate, true);
                    //                 } else {
                    //                     updateSessionTiming(event.session, delta, revertDate, false);
                    //                 }
                    //             }, function(){
                    //                 revertDate();
                    //             });
                    //         } else {
                    //             updateSessionTiming(event.session, delta, revertDate, false);
                    //         }
                    //     }
                    // },
                    // eventClick: function(event, jsEvent, view) {
                    //     if(!$scope.showModal) $scope.currentTab = 'attendance';
                    //     if($scope.isBigScreen || view.type == 'agendaDay'){
                    //         $scope.showModal = true;

                    //         if($currentEvent) $currentEvent.removeClass('current-event');
                    //         $currentEvent = $(jsEvent.currentTarget);
                    //         $currentEvent.addClass('current-event');
                    //     }

                    //     $scope.currentEvent = event;
                    //     currentEventCopy = angular.copy(event);

                    //     if(event.course){
                    //         $scope.setCurrentCourseEvents();
                    //     } else {
                    //         delete $scope.currentCourseEvents;
                    //     }
                    // },
                    viewRender: function(view){
                        _.assign(sessionService.calendarView, {
                            view: view.type,
                            start: view.intervalStart
                        });

                        $timeout(function(){
                            var heightToSet = $scope.isBigScreen ? ($('.calendar-container').height() - 10 ) : $(window).height();
                            uiCalendarConfig.calendars.mobileOnboardingCalendar.fullCalendar('option', 'height', heightToSet);
                            handleWindowResize(view);
                        });
                    },
                    dayClick: function(date, jsEvent, ev, view) {
                        if(view.type === 'month'){
                            uiCalendarConfig.calendars.mobileOnboardingCalendar.fullCalendar('changeView', 'agendaDay');
                            uiCalendarConfig.calendars.mobileOnboardingCalendar.fullCalendar('gotoDate', date);
                        } else if (Modernizr.touch && ev.type !== "tap") {
                            handleServiceDrop(date, $scope.firstService);
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
                    if(reloadRanges) uiCalendarConfig.calendars.mobileOnboardingCalendar.fullCalendar('refetchEvents');
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
                var $mobileOnboardingCalendar = uiCalendarConfig.calendars.mobileOnboardingCalendar;
                if($scope.isBigScreen){
                    $mobileOnboardingCalendar.find('.fc-agendaWeek-button').show();
                } else {
                    $mobileOnboardingCalendar.find('.fc-agendaWeek-button').hide();
                    $scope.toggleOpen = false;
                    if(viewName === 'agendaWeek'){
                        $mobileOnboardingCalendar.fullCalendar('changeView', 'agendaDay');
                    }
                }
                $mobileOnboardingCalendar.fullCalendar('option', 'height', ($('.calendar-container').height() - 10));
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
                // $scope.showModal = true;
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


            $scope.saveModalEdit = function(){
                forceFormTouched();
                if($scope.currentSessionForm.$valid){
                    var course = $scope.currentEvent.course;
                    if($scope.currentEvent.tempEventId && course){
                        var session = $scope.currentEvent.session;
                        _.set(session, 'pricing.coursePrice', _.get($scope.currentEvent, 'course.pricing.coursePrice'));
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
                    end: moment(dateClone.clone().add(duration, 'minutes')),
                    _start: moment(dateClone),
                    _end: moment(dateClone.clone().add(duration, 'minutes')),
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
            /*calendar config end*/


        $scope.slideNext = function(inputNames){
            if(inputNames){
                if( _.every(inputNames,function(inputName){
                    return $scope.mobileOnboardingDefaultForm[inputName].$valid;
                })){
                    $('.m-scooch').scooch('next');
                }else{
                    _.each(inputNames,function(inputName){
                        $scope.mobileOnboardingDefaultForm[inputName].$setTouched();
                    });
                }
            }else{
                $('.m-scooch').scooch('next');
            }
            
        };
        $scope.slidePrev = function(){
            $('.m-scooch').scooch('prev');
        };
        $scope.skipModal = function(){
            mobileOnboardingSkipModal.open('mobileOnboardingSkipModal','mobileOnboardingSkipModalCtrl');
        }
        $scope.createDefaults = function(){
            $scope.removeAlerts();
            if($scope.mobileOnboardingDefaultForm.$valid){
                $rootScope.appLoading = true; 
                coachSeekAPIService.save({
                    section: 'businessRegistration'}, {
                    admin: $scope.admin, 
                    business: $scope.business
                }).$promise.then(function(newUser){
                    $scope.setupCurrentUser({
                        email: newUser.admin.email,
                        password: $scope.admin.password,
                        firstName: newUser.admin.firstName,
                        lastName: newUser.admin.lastName
                    }, newUser.business);
                    $q.all(getDefaultPromises()).then(function(response){
                         $('.m-scooch').scooch('next');
                        $scope.firstService =response.service; 
                    }, $scope.handleErrors)
                    .finally(function(){
                        $rootScope.appLoading = false; 
                    });
                    
                }); 
            }

        };

         function getDefaultPromises(){
            var defaultServiceValues = angular.copy(serviceDefaults);
            return {
                coach: coachSeekAPIService.save({ section: 'Coaches' }, getDefaultCoachValues()).$promise,
                location: coachSeekAPIService.save({ section: 'Locations' }, {name: $scope.locationName}).$promise,
                service: coachSeekAPIService.save({ section: 'Services' }, _.assign(defaultServiceValues, {name: $scope.serviceName,pricing:{sessionPrice:$scope.sessionPrice}})).$promise
            }
        };

        function getDefaultCoachValues(){
            var defaultCoachValues = angular.copy(coachDefaults);
            return _.assign(defaultCoachValues, {
                firstName: $scope.admin.firstName,
                lastName: $scope.admin.lastName,
                email: $scope.admin.email,
                phone: i18n.t('onboarding:1800coach') + $scope.admin.lastName.toUpperCase()
            });
        };

    }]);
