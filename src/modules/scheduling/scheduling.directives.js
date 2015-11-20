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

                scope.checkFormValidThenSave = function(){
                    forceFormTouched();
                    if(scope.currentSessionForm.$valid){
                        scope.saveModalEdit();
                    }
                }

                var forceFormTouched = function(){
                    scope.currentSessionForm.coaches.$setTouched();
                    scope.currentSessionForm.locations.$setTouched();
                    scope.currentSessionForm.sessionPrice.$setTouched();
                    scope.currentSessionForm.coursePrice.$setTouched();
                };

                scope.$on('resetSessionForm', function(){
                    scope.currentSessionForm.$setUntouched();
                    scope.currentSessionForm.$setPristine();
                });

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
//TODO clean up unused DI
    .directive('modalCustomerDetails', ['bookingManager', function(bookingManager){
        return {
            restrict: "E",
            replace: false,
            templateUrl:'scheduling/partials/modalCustomerDetails.html',
            link: function(scope){
                scope.addBooking = function(functionName, customer, sessionId){
                    scope.bookingLoading = true;
                    bookingManager[functionName](customer, sessionId).then(function(){
                        // var customerName = customer.firstName + " " + customer.lastName;
                        // showSuccessAlert(actionName, customerName, course.service.name)
                        scope.$emit('addBookingToCourse');
                    }, scope.handleErrors).finally(function(){
                        scope.bookingLoading = false;
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

                function showSuccessAlert(actionName, customerName, sessionName){
                    scope.addAlert({
                        type: 'success',
                        message: "scheduling:alert." + actionName,
                        customerName: customerName,
                        sessionName: sessionName
                    });
                }

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
            }
        };
    }])
    .directive('customerBooking', ['coachSeekAPIService', 'bookingManager', 'sessionOrCourseModal', function(coachSeekAPIService, bookingManager, sessionOrCourseModal){
        return {
            restrict: "E",
            replace: false,
            templateUrl:'scheduling/partials/customerBooking.html',
            link: function(scope){
                var customerName = scope.booking.customer.firstName + " " + scope.booking.customer.lastName

                scope.removeBooking = function(){
                    //must determine if current booking is a course booking
                    if(scope.currentEvent.course && scope.booking.parentId){
                        sessionOrCourseModal(scope).then(function(id){
                            if(id === scope.currentEvent.course.id){
                                bookingRemoval('removeFromCourse', scope.booking.parentId);
                            } else {
                                bookingRemoval('removeFromSession', scope.booking.id, true);
                            }
                        });
                    } else {
                        bookingRemoval('removeFromSession', scope.booking.id);
                    }
                };

                function bookingRemoval(functionName, bookingId){
                    scope.bookingLoading = true;
                    bookingManager[functionName](bookingId).then(function(){
                        // var customerName = customer.firstName + " " + scope.item.lastName;
                        // showSuccessAlert(actionName, customerName, course.service.name)
                    }, scope.handleErrors).finally(function(){
                        scope.bookingLoading = false;
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
    .directive('customerAttendanceStatus', ['coachSeekAPIService', function(coachSeekAPIService){
        return {
            restrict: "E",
            replace: false,
            templateUrl:'scheduling/partials/customerAttendanceStatus.html',
            link: function(scope){
                var attendanceStatusOptions = [
                    null, //no value
                    true, //present
                    false //absent
                ];

                var attendanceStatusIndex = _.indexOf(attendanceStatusOptions, _.get(scope, 'booking.hasAttended'));
                // if we havn't set payment status set to default
                if(attendanceStatusIndex === -1) attendanceStatusIndex = 0;
                scope.attendanceStatus = attendanceStatusOptions[attendanceStatusIndex];

                scope.changeAttendanceStatus = function(){
                    attendanceStatusIndex++;
                    if(attendanceStatusIndex === _.size(attendanceStatusOptions)) {
                        attendanceStatusIndex = 0;
                    }

                    scope.attendanceStatus = attendanceStatusOptions[attendanceStatusIndex];
                    scope.startCourseLoading();
                    saveAttendanceStatus();
                };

                var saveAttendanceStatus = _.debounce(function(){
                    updateBooking({
                        commandName: 'BookingSetAttendance',
                        hasAttended: scope.attendanceStatus
                    }).then(function(){
                        scope.booking.hasAttended = scope.attendanceStatus;
                    },scope.handleErrors).finally(function(){
                        scope.sessionBookingLoading = false;
                        scope.stopCourseLoading();
                    });
                }, 1000);

                function updateBooking(updateCommand){
                    scope.sessionBookingLoading = true;
                    scope.startCourseLoading(true);
                    return coachSeekAPIService.save({section: 'Bookings', id: scope.booking.id}, updateCommand).$promise;
                }

                scope.$on('stopBookingLoading', function(){
                    scope.bookingLoading = false;
                });
            }
        }
    }])
    .directive('customerCourseBooking', function(){
        return {
            restrict: "A",
            replace: false,
            templateUrl:'scheduling/partials/customerCourseBooking.html'
        }
    })
    .directive('addToSession', ['bookingManager', function(bookingManager){
        return {
            // restrict: "A",
            replace: false,
            templateUrl:'scheduling/partials/addToSession.html',
            link: function(scope){
                scope.sessionBookingLoading = false;
                scope.addToSession = function(customer, sessionId, index){
                    scope.sessionBookingLoading = sessionId;
                    scope.startCourseLoading(true);
                    bookingManager.addToSession(customer, sessionId).then(function(courseBooking){
                        scope.courseBooking.bookings[index] = courseBooking.sessionBookings[0];
                    }, scope.handleErrors).finally(function(){
                        scope.sessionBookingLoading = false;
                        scope.stopCourseLoading();  
                    });
                }
            }
        }
    }])
    .directive('courseAttendanceModal', ['coachSeekAPIService', '$timeout', function(coachSeekAPIService, $timeout){
        return {
           restrict: "E",
           replace: false,
           templateUrl:'scheduling/partials/courseAttendanceModal.html',
           link: function(scope, elem){
                var itemsLoadingCounter = 0,
                    courseLoaded;
                scope.courseLoading = true;
                $(elem).find('table.session-data').on('scroll', function(event) {
                    $('div.session-headers').css("left", 175-$(event.currentTarget).scrollLeft());
                });

                scope.blockAddBookings = function(){
                    if(scope.currentEvent){
                        var session = scope.currentEvent.session;
                        return session.booking.studentCapacity - _.size(session.booking.bookings) <= 0
                    }
                };

                scope.getSessionDate = function(session){
                    if(session){
                        var date = moment(session.timing.startDate, "YYYY-MM-DD")
                        return date.format("MMM Do");
                    }
                }

                scope.startCourseLoading = function(addToCounter){
                    if(addToCounter) itemsLoadingCounter++;
                    scope.courseLoading = true;
                };

                scope.stopCourseLoading = function(){
                    itemsLoadingCounter--;
                    if(itemsLoadingCounter === 0){
                        scope.courseLoading = false;                    
                    }
                };

                scope.$watch('currentEvent', function(newVal, oldVal){
                    if(newVal && (_.get(newVal, 'course.id') !== _.get(oldVal, 'course.id') || !_.has(newVal, 'course.id'))){
                        console.log('CURRENTEVENT COURSE CHANGE')
                        console.time("courseBookingsLoaded")
                        scope.showCustomers = false;
                        scope.courseLoading = 'idle';
                        //TODO don't delay if modal open?
                        $timeout(function(){
                            courseLoaded = true;
                            scope.courseBookingData = getCourseBookingData();
                            $timeout(function(){
                                $(elem).find('.attendance-list').width(175 + (_.size(_.get(scope.currentEvent, 'course.sessions')) * 125));
                                console.timeEnd("courseBookingsLoaded")
                            })
                        }, 350); // has to be longer than modal slide animation or will freeze mid animation
                    }
                });

                scope.$on('addBookingToCourse', function(){
                    console.log('ADD BOOKING')
                    console.time("addBookingLoaded")
                    scope.courseBookingData = getCourseBookingData();
                    $timeout(function(){
                        console.timeEnd("addBookingLoaded")
                    })
                });

                function getCourseBookingData(){
                    // go through session bookings and pluck out unique customers
                    // [{customer: {}, bookings:[booking, sessionId, booking]}, {customer: {}, bookings:[sessionId, sessionId, booking]}]
                    var courseBookingData = [];
                    var bookings = _.get(scope.currentEvent, 'course.booking.bookings') || _.get(scope.currentEvent, 'session.booking.bookings');
                    _.each(bookings, function(booking){
                        courseBookingData.push({customer: booking.customer, bookings: []});
                    });
                    courseBookingData = _.uniq(courseBookingData, 'customer.id')
                    var sessions = _.get(scope.currentEvent, 'course.sessions') || [_.get(scope.currentEvent, 'session')];
                    _.each(sessions, function(session, sessionIndex){
                        // if there are no bookings at all need to still loop through in order to get add to session button in there
                        var sessionBookings = _.size(session.booking.bookings) ? session.booking.bookings : [{}];
                        _.each(sessionBookings, function(sessionBooking){
                            _.each(courseBookingData, function(booking){
                                if(_.get(sessionBooking, 'customer.id') === booking.customer.id){
                                    booking.bookings[sessionIndex] = sessionBooking;
                                } else if (!booking.bookings[sessionIndex]){
                                    booking.bookings[sessionIndex] = {sessionId: session.id};
                                }
                            });
                        });
                    });
                    return _.sortByAll(courseBookingData, ['customer.lastName', 'customer.firstName']);
                }

                coachSeekAPIService.query({section: 'Customers'})
                    .$promise.then(function(customerList){
                        scope.itemList  =  customerList;
                    }, scope.handleErrors);
           }
        }; 
    }])
    .directive('generalSettingsModal', function(){
        return {
           restrict: "E",
           replace: false,
           templateUrl:'scheduling/partials/generalSettingsModal.html'
        }; 
    });