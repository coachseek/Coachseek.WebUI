angular.module('scheduling.directives', [])
    .directive('schedulingServicesList', ['sessionService', function(sessionService){
        return {
            restrict: "E",
            replace: false,
            templateUrl:'scheduling/partials/schedulingServicesList.html',
            link: function(scope){
                scope.showOnboarding = sessionService.onboarding.showOnboarding;
            }
        };
    }])
    .directive('shiftDragEvents', ['$window', function($window){
        return {
            restrict: "A",
            link: function(scope){
                scope.shiftKeydown = false;
                $(window).on('keydown', function(event){
                    scope.shiftKeydown = event.shiftKey;
                }).on('keyup', function(event){
                    scope.shiftKeydown = false;
                });
            }
        };
    }])
    .directive('modalSessionForm', ['uiCalendarConfig', 'sessionService', function(uiCalendarConfig, sessionService){
        return {
            restrict: "E",
            replace: false,
            templateUrl:'scheduling/partials/modalSessionForm.html',
            link: function(scope){
                scope.business = sessionService.business;
                scope.changeServiceName = function(){
                    var newService = _.find(scope.serviceList, {id: scope.currentEvent.session.service.id});
                    scope.currentEvent.session.presentation.colour = newService.presentation.colour;
                    _.assign(scope.currentEvent, {
                        className: newService.presentation.colour,
                        title: newService.name
                    });

                    // TODO - write tests for this!
                    if(scope.currentEvent.tempEventId){
                        _.set(scope.currentEvent, 'session.timing.duration', newService.timing.duration);
                        _.assign(scope.currentEvent.session, {
                            pricing: newService.pricing,
                            booking: {
                                isOnlineBookable: _.get(newService, 'booking.isOnlineBookable', true),
                                studentCapacity: _.get(newService, 'booking.studentCapacity', 1),
                                bookings: []
                            },
                            repetition: newService.repetition
                        });
                        _.set(scope.currentEvent, 'course.pricing.coursePrice', _.get(newService, 'pricing.coursePrice'));
                    }

                    updateCurrentEvent();
                };

                scope.changeLocationName = function(){
                    var newLocation = _.find(scope.locationList, {id: scope.currentSessionForm.locations.$viewValue});
                    scope.currentEvent.session.location = newLocation;
                    updateCurrentEvent();
                };

                var updateCurrentEvent = function(){
                    uiCalendarConfig.calendars.sessionCalendar.fullCalendar('updateEvent', scope.currentEvent);
                };

                scope.requireSessionPrice = function(){
                    if(scope.currentEvent && scope.currentEvent.course && scope.currentEvent.course.pricing){
                        return priceRequired(scope.currentEvent.course.pricing.coursePrice);
                    } else if(scope.currentEvent && scope.currentEvent.session.repetition.sessionCount === 1 ){
                        return true;
                    }
                };

                scope.requireCoursePrice = function(){
                    if(scope.currentEvent && scope.currentEvent.session.pricing){
                        return priceRequired(scope.currentEvent.session.pricing.sessionPrice);
                    }
                };

                function priceRequired(price){
                    if(price === 0){
                        return false;
                    } else {
                        return !price;
                    }
                }
            }
        };
    }])
    .directive('startTimePicker', function(){
        return {
            scope: {
                startTime: '='
            },
            restrict: "E",
            templateUrl:'scheduling/partials/startTimePicker.html',
            link: function(scope, elem){
                scope.editingTime = false;

                var startTimeCopy,
                    $timePickerContainer = angular.element(elem.find('.time-picker-container'));

                scope.editTime = function(currentTime){
                    if(!scope.editingTime) {
                        startTimeCopy = angular.copy(scope.startTime);
                        scope.editingTime = true;
                    }
                };

                scope.$on('closeTimePicker', function(event, resetTime){
                    if(resetTime && startTimeCopy){
                        scope.startTime = startTimeCopy;
                    }
                    scope.editingTime = false;
                    $timePickerContainer.one('$animate:after', function(){
                        startTimeCopy = null;
                    });
                });
            }
        };
    })
    .directive('modalSessionAttendanceList', ['coachSeekAPIService', 'uiCalendarConfig', function(coachSeekAPIService, uiCalendarConfig){
        return {
            restrict: "E",
            replace: false,
            templateUrl:'scheduling/partials/modalSessionAttendanceList.html',
            link: function(scope){
                scope.showCustomers = false;

                scope.showCustomerList = function(){
                    scope.showCustomers = true;
                };

                scope.hideCustomerList = function(){
                    scope.showCustomers = false;
                };

                scope.blockAddBookings = function(){
                    if(scope.currentEvent){
                        var session = scope.currentEvent.session;
                        return session.booking.studentCapacity - _.size(session.booking.bookings) <= 0
                    }
                };

                scope.updateCourse = function(actionName, customerName){
                    return getUpdatedCourse().then(function(course){
                        _.each(scope.currentCourseEvents, function(event){
                            //fullcalendar needs original event so we get it from the calendar here
                            event = uiCalendarConfig.calendars.sessionCalendar.fullCalendar('clientEvents', event._id)[0];
                            _.assign(event, {
                                session: _.find(course.sessions, function(session){return session.id === event.session.id}),
                                course:  course
                            });
                        });
                        showSuccessAlert(actionName, customerName, course.service.name)
                    }).finally(function(){
                        scope.$broadcast('stopBookingLoading');
                    });
                }

                function getUpdatedCourse(){
                    return coachSeekAPIService.get({section: 'Sessions', id: scope.currentEvent.course.id}).$promise;
                }

                scope.updateStandaloneSession = function(actionName, customerName){
                    return getUpdatedSession().then(function(session){
                        //fullcalendar needs original event so we get it from the calendar here
                        var event = uiCalendarConfig.calendars.sessionCalendar.fullCalendar('clientEvents', scope.currentEvent._id)[0];
                        event.session = session;
                        showSuccessAlert(actionName, customerName, session.service.name)
                    }).finally(function(){
                        scope.$broadcast('stopBookingLoading');
                    });
                }

                function getUpdatedSession(){
                    return coachSeekAPIService.get({section: 'Sessions', id: scope.currentEvent.session.id}).$promise;
                }

                function showSuccessAlert(actionName, customerName, sessionName){
                    scope.addAlert({
                        type: 'success',
                        message: "scheduling:alert." + actionName,
                        customerName: customerName,
                        sessionName: sessionName
                    });
                }

                scope.$watch('currentEvent', function(){
                    scope.showCustomers = false;
                });

                coachSeekAPIService.query({section: 'Customers'})
                    .$promise.then(function(customerList){
                        scope.itemList  =  customerList;
                    }, scope.handleErrors);
            }
        };
    }])
    .directive('modalCustomerDetails', ['coachSeekAPIService', function(coachSeekAPIService){
        return {
            restrict: "E",
            replace: false,
            templateUrl:'scheduling/partials/modalCustomerDetails.html',
            link: function(scope){
                scope.addBooking = function(addToCourse){
                    scope.bookingLoading = true;
                    coachSeekAPIService.save({section: 'Bookings'}, buildBooking(addToCourse))
                        .$promise.then(function(booking){
                            var customerName = scope.item.firstName + " " + scope.item.lastName;
                            if(addToCourse){
                                scope.updateCourse('add-course-booking', customerName);
                            } else {
                                scope.updateStandaloneSession('add-session-booking', customerName)
                            }
                        }, function(errors){
                            scope.bookingLoading = false;
                            scope.handleErrors(errors);
                        });
                }

                scope.$watch('currentEvent.session.booking.bookings', function(newBookings){
                    if(newBookings){
                        var customerBooking = getSessionBooking(newBookings);
                        // is standalone session
                        if(!scope.currentCourseEvents){
                            scope.isSessionStudent = customerBooking;
                        } else {
                            scope.isCourseStudent = customerBooking ? isCourseStudent(customerBooking) : false;
                            scope.isSessionStudent = customerBooking && !scope.isCourseStudent;
                        }
                    }
                });

                function isCourseStudent(customerBooking){
                    var sessionBookings = [];
                    _.each(scope.currentCourseEvents, function(event){
                        var booking = _.find(event.session.booking.bookings, function(booking){
                            return booking.parentId === customerBooking.parentId;
                        });
                        if(booking) sessionBookings.push(booking);
                    });
                    return _.size(scope.currentCourseEvents) === _.size(sessionBookings);
                };

                function getSessionBooking(bookings){
                    return _.find(bookings, function(booking){
                        return booking.customer.id === scope.item.id;
                    });
                };

                function buildBooking(addToCourse){
                    return {
                        sessions: getBookingSessionsArray(addToCourse),
                        customer: {
                            id: scope.item.id,
                            firstName: scope.item.firstName,
                            lastName: scope.item.lastName
                        }
                    };
                };

                function getBookingSessionsArray(addToCourse){
                    if(addToCourse){
                        return scope.currentEvent.course.sessions;
                    } else {
                        return [{
                            id:  scope.currentEvent.session.id,
                            name: scope.currentEvent.session.service.name
                        }]
                    }
                };

                scope.$on('stopBookingLoading', function(){
                    scope.bookingLoading = false;
                });
            }
        };
    }])
    .directive('customerBooking', ['coachSeekAPIService', 'sessionOrCourseModal', function(coachSeekAPIService, sessionOrCourseModal){
        return {
            restrict: "E",
            replace: false,
            templateUrl:'scheduling/partials/customerBooking.html',
            link: function(scope){
                var customerName = scope.booking.customer.firstName + " " + scope.booking.customer.lastName

                var attendanceStatusOptions = [
                    null, //no value
                    true, //present
                    false //absent
                ];

                var attendanceStatusIndex = _.indexOf(attendanceStatusOptions, scope.booking.hasAttended);
                // if we havn't set payment status set to default
                if(attendanceStatusIndex === -1) attendanceStatusIndex = 0;
                scope.attendanceStatus = attendanceStatusOptions[attendanceStatusIndex];

                scope.changeAttendanceStatus = function(){
                    attendanceStatusIndex++;
                    if(attendanceStatusIndex === _.size(attendanceStatusOptions)) {
                        attendanceStatusIndex = 0;
                    }

                    scope.attendanceStatus = attendanceStatusOptions[attendanceStatusIndex];
                    saveAttendanceStatus();
                };

                var saveAttendanceStatus = _.debounce(function(){
                    updateBooking({
                        commandName: 'BookingSetAttendance',
                        hasAttended: scope.attendanceStatus
                    }).then(function(){
                        scope.booking.hasAttended = scope.attendanceStatus;
                    },scope.handleErrors).finally(function(){
                        scope.bookingLoading = false;
                    });
                }, 1000);

                scope.removeBooking = function(){
                    //must determine if current booking is a course booking
                    if(scope.currentEvent.course && scope.booking.parentId){
                        sessionOrCourseModal(scope).then(function(id){
                            if(id === scope.currentEvent.course.id){
                                bookingRemoval(scope.booking.parentId, true);
                            } else {
                                bookingRemoval(scope.booking.id, true);
                            }
                        });
                    } else {
                        bookingRemoval(scope.booking.id);
                    }
                };

                function bookingRemoval(bookingId, isCourse){
                    scope.bookingLoading = true;
                    coachSeekAPIService.delete({section: 'Bookings', id: bookingId})
                        .$promise.then(function(){
                            if(isCourse){
                                scope.updateCourse('delete-course-booking', customerName);
                            } else {
                                scope.updateStandaloneSession('delete-session-booking', customerName)
                            }
                        }, function(errors){
                            scope.bookingLoading = false;
                            scope.handleErrors(errors);
                        });
                }

                var paymentStatusOptions = [
                    'pending-invoice',
                    'pending-payment',
                    'paid',
                    'overdue-payment'
                ];

                var paymentStatusIndex = _.indexOf(paymentStatusOptions, scope.booking.paymentStatus);
                // if we havn't set payment status set to default
                if(paymentStatusIndex === -1) paymentStatusIndex = 0;
                scope.paymentStatus = paymentStatusOptions[paymentStatusIndex];

                scope.changePaymentStatus = function(){
                    paymentStatusIndex++;
                    if(paymentStatusIndex === _.size(paymentStatusOptions)) {
                        paymentStatusIndex = 0;
                    }

                    scope.paymentStatus = paymentStatusOptions[paymentStatusIndex];
                    savePaymentStatus();
                };

                var savePaymentStatus = _.debounce(function(){
                    updateBooking({
                        commandName: 'BookingSetPaymentStatus',
                        paymentStatus: scope.paymentStatus
                    }).then(function(){
                        scope.booking.paymentStatus = scope.paymentStatus;

                        scope.addAlert({
                            type: 'success',
                            message: "scheduling:alert.update-payment-status." + scope.paymentStatus,
                            customerName: customerName
                        });
                    },scope.handleErrors).finally(function(){
                        scope.bookingLoading = false;
                    });
                }, 1000);

                function updateBooking(updateCommand){
                    scope.bookingLoading = true;
                    return coachSeekAPIService.save({section: 'Bookings', id: scope.booking.id}, updateCommand).$promise;
                }

                scope.$on('stopBookingLoading', function(){
                    scope.bookingLoading = false;
                });
            }
        };
    }])
    .directive('calendarPrivateSession', function(){
        return {
            restrict: "E",
            templateUrl:'scheduling/partials/calendarPrivateSession.html',
            scope: {
                firstName: '@',
                lastName: '@'
            }
        };
    });
