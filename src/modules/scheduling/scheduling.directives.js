angular.module('scheduling.directives', [])
    .directive('schedulingServicesList', function(){
        return {
            restrict: "E",
            replace: false,
            templateUrl:'scheduling/partials/schedulingServicesList.html'
        };
    })
    .directive('modalSessionForm', ['uiCalendarConfig', 'sessionService', function(uiCalendarConfig, sessionService){
        return {
            restrict: "E",
            replace: false,
            templateUrl:'scheduling/partials/modalSessionForm.html',
            link: function(scope){
                scope.business = sessionService.business;
                scope.changeServiceName = function(){
                    var newService = _.find(scope.serviceList, {id: scope.currentSessionForm.services.$viewValue});
                    scope.currentEvent.session.presentation.colour = newService.presentation.colour;
                    _.assign(scope.currentEvent, {
                        className: newService.presentation.colour,
                        title: newService.name
                    });
                    updateCurrentEvent();
                };

                scope.changeLocationName = function(){
                    var newLocation = _.find(scope.locationList, {id: scope.currentSessionForm.locations.$viewValue});
                    scope.currentEvent.session.location = newLocation;
                    updateCurrentEvent();
                };

                var updateCurrentEvent = function(){
                    //TODO - why does this freak out when currentEvent is a new event?
                    if(!scope.currentEvent.tempEventId){
                        uiCalendarConfig.calendars.sessionCalendar.fullCalendar('updateEvent', scope.currentEvent);
                    }
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

                $(".session-form").css("height", "100%").css("height", "-=285px"); 
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
                $(".attendance-list .student-list").css("height", "-=330px"); 
                $(".attendance-list div.customer-list ul.short-list").css("height", "-=365px"); 
                $(".attendance-list div.customer-list ul").css("height", "-=330px");


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

                scope.updateCourse = function(){
                    return getUpdatedCourse().then(function(course){
                        _.each(scope.currentCourseEvents, function(event){
                            //fullcalendar needs original event so we get it from the calendar here
                            event = uiCalendarConfig.calendars.sessionCalendar.fullCalendar('clientEvents', event._id)[0];
                            _.assign(event, {
                                session: _.find(course.sessions, function(session){return session.id === event.session.id}),
                                course:  course
                            });
                        });
                    }).finally(function(){
                        scope.$broadcast('stopBookingLoading');
                    });
                }

                function getUpdatedCourse(){
                    return coachSeekAPIService.get({section: 'Sessions', id: scope.currentEvent.course.id}).$promise;
                }

                scope.updateStandaloneSession = function(){
                    return getUpdatedSession().then(function(session){
                        //fullcalendar needs original event so we get it from the calendar here
                        var event = uiCalendarConfig.calendars.sessionCalendar.fullCalendar('clientEvents', scope.currentEvent._id)[0];
                        event.session = session;
                    }).finally(function(){
                        scope.$broadcast('stopBookingLoading');
                    });
                }

                function getUpdatedSession(){
                    return coachSeekAPIService.get({section: 'Sessions', id: scope.currentEvent.session.id}).$promise;
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
                            if(addToCourse){
                                scope.updateCourse();
                            } else {
                                scope.updateStandaloneSession()
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
                scope.toggleAttendance = function(){
                    updateBooking({
                        commandName: 'BookingSetAttendance',
                        hasAttended: !scope.booking.hasAttended
                    }).then(function(){
                        scope.booking.hasAttended = !scope.booking.hasAttended;
                    },scope.handleErrors).finally(function(){
                        scope.bookingLoading = false;
                    });
                };

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
                                scope.updateCourse();
                            } else {
                                scope.updateStandaloneSession()
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
    }]);
