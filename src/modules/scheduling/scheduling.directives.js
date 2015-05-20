angular.module('scheduling.directives', [])
    .directive('schedulingServicesList', function(){
        return {
            restrict: "E",
            replace: false,
            templateUrl:'scheduling/partials/schedulingServicesList.html'
        };
    })
    .directive('modalSessionForm', ['uiCalendarConfig', function(uiCalendarConfig){
        return {
            restrict: "E",
            replace: false,
            templateUrl:'scheduling/partials/modalSessionForm.html',
            link: function(scope){
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
    .directive('modalSessionAttendanceList', ['coachSeekAPIService', function(coachSeekAPIService){
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
    .directive('modalCustomerDetails', ['coachSeekAPIService', '$q', function(coachSeekAPIService, $q){
        return {
            restrict: "E",
            replace: false,
            templateUrl:'scheduling/partials/modalCustomerDetails.html',
            link: function(scope){
                scope.addStudent = function(addToCourse){
                    if(scope.isCourseStudent && !addToCourse){
                        var courseBooking = _.find(scope.currentEvent.course.booking.bookings, function(booking){
                            return booking.customer.id === scope.item.id;
                        });

                        scope.bookingLoading = true;
                        coachSeekAPIService.delete({section: 'Bookings', id: courseBooking.id})
                            .$promise.then(function(){
                                removeBookingsFromCourseSessions(courseBooking);
                                saveBooking(addToCourse);
                            }, scope.handleErrors);
                    } else if (scope.currentEvent.course && addToCourse){
                        //Remove from all individual sessions (API and UI)
                        var deleteBookingsPromises = [];
                        _.each(scope.currentCourseEvents, function(event){
                            var booking = _.find(event.session.booking.bookings, function(booking){
                                return booking.customer.id === scope.item.id;
                            });
                            if(booking) {
                                deleteBookingsPromises.push(coachSeekAPIService.delete({section: 'Bookings', id: booking.id}));
                            }
                        });

                        scope.bookingLoading = true;
                        $q.all(deleteBookingsPromises)
                            .then(function() {
                                _.each(scope.currentCourseEvents, function(event){
                                    var booking = _.find(event.session.booking.bookings, function(booking){
                                        return booking.customer.id === scope.item.id;
                                    });
                                    if(booking) _.pull(event.session.booking.bookings, booking);
                                    booking = _.find(event.course.booking.bookings, function(booking){
                                        return booking.customer.id === scope.item.id;
                                    });
                                    if(booking) _.pull(event.course.booking.bookings, booking);
                                });
                                saveBooking(addToCourse);
                            }, scope.handleErrors);
                    } else {
                        saveBooking(addToCourse);
                    }
                };

                function removeBookingsFromCourseSessions(courseBooking){
                    _.each(scope.currentCourseEvents, function(event){
                        var booking = _.find(event.session.booking.bookings, function(booking){
                            return booking.parentId === courseBooking.id;
                        });
                        if(booking) _.pull(event.session.booking.bookings, booking);
                    });
                }

                function saveBooking(addToCourse){
                    var bookingObject = buildBooking(addToCourse);
                    scope.bookingLoading = true;
                    coachSeekAPIService.save({section: 'Bookings'}, bookingObject)
                        .$promise.then(function(booking){
                            _.assign(booking.customer, {
                                firstName: scope.item.firstName,
                                lastName: scope.item.lastName
                            });
                            if(booking.course){
                                scope.currentEvent.course.booking.bookings.push(booking);
                                addBookingsToCourseSessions(booking);
                                scope.isSessionStudent = false;
                                scope.isCourseStudent = true;
                            } else {
                                scope.isSessionStudent = true;
                                scope.isCourseStudent = false;
                                scope.currentEvent.session.booking.bookings.push(booking);               
                            }
                        }, scope.handleErrors).finally(function(){
                            scope.bookingLoading = false;
                        });
                }

                function addBookingsToCourseSessions(courseBooking){
                    _.each(scope.currentCourseEvents, function(event){
                        // if bookings does not have this customer we push it
                        var booking = _.find(courseBooking.sessionBookings, function(sessionBooking){
                            return sessionBooking.session.id === event.session.id;
                        });
                        if(booking){
                            _.assign(booking.customer, {
                                firstName: scope.item.firstName,
                                lastName: scope.item.lastName
                            });
                            event.session.booking.bookings.push(booking);
                        }
                    });
                }

                scope.$watch('currentEvent.session.booking.bookings', function(newBookings){
                    if(newBookings){
                        scope.isSessionStudent = false;
                        scope.isCourseStudent = false;
                        var customerBooking = getSessionBooking(newBookings);
                        if(_.size(customerBooking) && customerBooking[0].parentId){
                            scope.isCourseStudent = true;
                        } else if(_.size(customerBooking)){
                            scope.isSessionStudent = true;
                        }
                    }
                }, true);

                function getSessionBooking(bookings){
                    return _.filter(bookings, function(booking){
                        return booking.customer.id === scope.item.id;
                    });
                }

                function buildBooking(addToCourse){
                    return {
                        session: {
                            id: addToCourse ? scope.currentEvent.course.id : scope.currentEvent.session.id,
                            name: scope.currentEvent.session.service.name
                        },
                        customer: {
                            id: scope.item.id,
                            firstName: scope.item.firstName,
                            lastName: scope.item.lastName
                        },
                        paymentStatus: "awaiting-invoice",
                        hasAttended: false
                    };
                }
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
                                bookingRemoval(scope.booking.id);
                            }
                        });
                    } else {
                        bookingRemoval(scope.booking.id);
                    }
                };

                function bookingRemoval(bookingId, removeFromCourse){
                    scope.bookingLoading = true;
                    coachSeekAPIService.delete({section: 'Bookings', id: bookingId})
                        .$promise.then(function(){
                            _.pull(scope.currentEvent.session.booking.bookings, scope.booking);
                            if(removeFromCourse){
                                removeBookingsFromCourseSessions();
                            }
                        },scope.handleErrors).finally(function(){
                            scope.bookingLoading = false;
                        });
                }

                function removeBookingsFromCourseSessions(){
                    _.each(scope.currentCourseEvents, function(event){
                        var booking = _.find(event.session.booking.bookings, function(booking){
                            return booking.customer.id === scope.booking.customer.id;
                        });
                        if(booking) _.pull(event.session.booking.bookings, booking);
                    });
                }

                var paymentStatusOptions = [
                    'awaiting-invoice',
                    'awaiting-payment',
                    'paid',
                    'overdue'
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
            }
        };
    }]);
