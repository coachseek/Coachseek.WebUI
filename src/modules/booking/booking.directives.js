angular.module('booking.directives', [])
    .directive('bookingRectangle', function(){
        return {
            restrict: "E",
            templateUrl:'booking/partials/bookingRectangle.html',
            link: function(scope){
                scope.selected = false;
                var startDate = moment(scope.event.timing.startDate + " " + scope.event.timing.startTime, "YYYY-MM-DD HH:mm");
                scope.spacesAvailable = getSpacesAvailable();
                scope.fullCoursePrice = getFullCoursePrice();
                scope.isSoldOut = function(){
                    // course with no session price
                    if(_.has(scope.event, 'pricing.coursePrice') && !_.has(scope.event, 'pricing.sessionPrice') ){
                        return scope.spacesAvailable <= 0;
                    // any course that does not have only course price
                    }else if(_.has(scope.event,'sessions') ){
                        return checkAllSessionsSpacesSoldOut(scope.event.sessions);
                    // returns true if single session with space
                    // returns false if course
                    }else {
                        return !scope.event.sessions && scope.spacesAvailable <= 0;
                    }
                };

                function checkAllSessionsSpacesSoldOut(sessions){
                    return _.every(sessions,function(session){
                        return scope.getSessionSpacesAvailable(session) <= 0 ;
                    });
                };

                function getFullCoursePrice(){
                    var event = scope.event;
                    if(scope.isBefore(event) && scope.business.payment.useProRataPricing){
                        // SUM SESSION PRICES
                        if(event.pricing.sessionPrice >= 0){
                            return sumSessionCosts(event.sessions);
                        // PRO RATE
                        } else {
                            var numSessionsInFuture = _.size(_.filter(event.sessions, function(session){return !scope.isBefore(session)}));
                            return (event.pricing.coursePrice / event.repetition.sessionCount * numSessionsInFuture).toFixed(0);
                        }
                    } else {
                        return event.pricing.coursePrice || sumSessionCosts(event.sessions);
                    }
                };

                function sumSessionCosts(sessions){
                    return _.sumBy(sessions, function(session){
                        if(scope.isBefore(session) || scope.getSessionSpacesAvailable(session) <= 0){
                            return 0;
                        }else{
                            return session.pricing.sessionPrice;
                        }
                    });
                };

                scope.getEventDateRange = function(){
                    if(scope.event.sessions){
                        var repetition = scope.event.repetition;
                        return startDate.format('dddd Do MMM') +  " – " + startDate.clone().add(repetition.sessionCount - 1, repetition.repeatFrequency).format('dddd Do MMM');
                    } else {
                        return startDate.format('dddd Do MMM');
                    }
                };

                scope.getEventTimeRange = function(){
                    return startDate.format('h:mm A') + " – " + startDate.clone().add(scope.event.timing.duration, 'minutes').format('h:mm A');
                };

                function getSpacesAvailable(){
                    var booking = scope.event.booking;
                    var spacesAvailable;
                    // for course
                    if(scope.event.sessions){
                        spacesAvailable = booking.studentCapacity - getMaxBookingSessionCount();
                    // for session
                    } else {
                        spacesAvailable = booking.studentCapacity - booking.bookingCount;
                    }
                    return spacesAvailable > 0 ? spacesAvailable : 0;
                };

                function getMaxBookingSessionCount(){
                    // why were we filtering here? past bookings count too!
                    // var sessions = _.filter(, function(session){
                    //     return getNewDate(session.timing).isAfter();
                    // });
                    return _.maxBy(scope.event.sessions, "booking.bookingCount").booking.bookingCount;
                };

                function getNewDate(timing){
                    return moment(timing.startDate + " " + timing.startTime, "YYYY-MM-DD HH:mm")
                }

                scope.toggleEventSelect = function(){
                    scope.selected = !scope.selected;
                    scope.selectEvent(scope.event)
                };
            }
        };
    })
    .directive('bookingCourseSessions', ['currentBooking', function(currentBooking){
        return {
            restrict: "E",
            templateUrl:'booking/partials/bookingCourseSessions.html',
            link: function(scope){

                scope.getSessionDate = function(session){
                    return getNewDate(session.timing).format('dddd Do MMM');
                };

                scope.getSessionTimeRange = function(session){
                    var startDate = getNewDate(session.timing)
                    return startDate.format('h:mm A') + " – " + startDate.clone().add(session.timing.duration, 'minutes').format('h:mm A');
                };

                function getNewDate(timing){
                    return moment(timing.startDate + " " + timing.startTime, "YYYY-MM-DD HH:mm")
                }

                scope.isSelected = function(session){
                    return _.includes(currentBooking.booking.sessions, session);
                };
            }
        };
    }])
    .directive('bookingDateRange', ['currentBooking', function(currentBooking){
        return {
            restrict: "E",
            templateUrl:'booking/partials/bookingDateRange.html',
            link: function(scope){
                // TODO this is nasty. pare this down.
                scope.calculateBookingDateRange = function(){
                    if(currentBooking.booking.course){
                        var course = currentBooking.booking.course;
                        var dateRange = getNewDateRange(course.timing, course.repetition);
                        if(_.size(currentBooking.booking.sessions)){
                            return dateRange.start.format('dddd Do MMM') + " – " + dateRange.end.format('dddd Do MMM');
                        } else {
                            return dateRange.start.format('dddd Do MMM');
                        }
                    } else if (currentBooking.booking.sessions) {
                        var dates = [];
                        _.each(currentBooking.booking.sessions, function(session){
                            dates.push(getNewDate(session.timing));
                        });

                        dates = _.sortBy(dates, function(date){return date.valueOf();});
                        if(_.size(dates) === 1 ){
                            return _.first(dates).format('dddd Do MMM');
                        } else if (_.size(dates)){
                            var dateRange = moment.range(_.first(dates), _.last(dates));
                            return dateRange.start.format('dddd Do MMM') + " – " + dateRange.end.format('dddd Do MMM');
                        }
                    }
                };

                function getNewDate(timing){
                    return moment(timing.startDate, "YYYY-MM-DD");
                };

                function getNewDateRange(timing, repetition){
                    var startDate = moment(timing.startDate + " " + timing.startTime, "YYYY-MM-DD HH:mm");
                    var endDate = startDate.clone().add(repetition.sessionCount - 1, repetition.repeatFrequency);
                    return moment.range(startDate, endDate);
                };
            }
        };
    }])
    .directive('bookingPrice', ['currentBooking', function(currentBooking){
        return {
            restrict: "E",
            templateUrl:'booking/partials/bookingPrice.html',
            link: function(scope){
                scope.calculateTotalPrice = function(){
                    var course = currentBooking.booking.course;

                    if(!currentBooking.totalPrice && course){
                        // STANDALONE SESSION
                        if(!course.sessions) {
                            return course.pricing.sessionPrice.toFixed(2);
                        // COURSE IN PAST
                        } else if(isBefore(course)){
                            if(!scope.business.payment.useProRataPricing && course.pricing.coursePrice){
                                return course.pricing.coursePrice.toFixed(2);
                            } else if (course.pricing.coursePrice && !course.pricing.sessionPrice){
                                //PRO RATE
                                var numSessionsInFuture = _.size(_.filter(course.sessions, function(session){return !isBefore(session)}));
                                var perSessionPrice = Math.round((course.pricing.coursePrice / course.repetition.sessionCount) * 100) / 100;
                                return (perSessionPrice * numSessionsInFuture).toFixed(2);
                            } else {
                                return (_.size(scope.availableSessions) * course.pricing.sessionPrice).toFixed(2);
                            }
                        // COURSE IN FUTURE
                        } else {
                            if(course.pricing.coursePrice){
                                return course.pricing.coursePrice.toFixed(2);
                            } else {
                                return (_.size(scope.availableSessions) * course.pricing.sessionPrice).toFixed(2);
                            }
                        }
                    // ONLY COURSE SESSIONS SELECTED
                    } else if (!currentBooking.totalPrice && currentBooking.booking.sessions){
                        return _.sumBy(currentBooking.booking.sessions, 'pricing.sessionPrice').toFixed(2);
                    //NOTHING SELECTED
                    } else {
                        return "0.00"
                    }
                };

                function isBefore(session){
                    return moment(session.timing.startDate + " " + session.timing.startTime, "YYYY-MM-DD HH:mm").isBefore(moment().add(3, 'h'));
                };
            }
        };
    }])
    .directive('paypalPaymentButton', ['$timeout', 'currentBooking', function($timeout, currentBooking){
        return {
            restrict: "E",
            templateUrl:'booking/partials/paypalPaymentButton.html',
            link: function(scope, elem){
                scope.getServiceName = function(){
                    return _.get(currentBooking.booking, 'course.service.name') || _.get(currentBooking.booking, 'sessions[0].service.name');
                };

                scope.getQueryString = function(){
                    return JSON.stringify({
                        customer: currentBooking.customer,
                        filters: currentBooking.filters,
                        //TODO check this keeps correct number from pricingEnquiry
                        totalPrice: currentBooking.totalPrice || scope.calculateTotalPrice(),
                        discountPrice: currentBooking.discountPrice,
                        dateRange: scope.calculateBookingDateRange()
                    });
                };

                scope.paypalSubmit = function(){
                    scope.processBooking().then(function(){
                        // must use timeout so scope.$digest finishes and adds
                        // values to hidden paypal form
                        $timeout(function(){
                            elem.find('.paypal-form').submit();
                        });
                    });
                };
            }
        }
    }])
    .directive('manageBookingNotes', ['coachSeekAPIService', '$activityIndicator', function(coachSeekAPIService, $activityIndicator){
        return {
            restrict: "E",
            templateUrl: "booking/partials/manageBookingNotes.html",
            link: function(scope){
                var newNoteDefaults = {
                    type: 'customer',
                    name: '',
                    isRequired: false
                };
                scope.newNote = angular.copy(newNoteDefaults);
                scope.showAddNote = false;
                scope.saveNewNote = function(){
                    //check form valid
                    if(scope.newNoteNameForm.$valid){
                        $activityIndicator.startAnimating();
                        coachSeekAPIService.save({section: 'CustomFields'}, scope.newNote).$promise
                            .then(function(note){
                                scope.bookingNotes.unshift(note);
                                scope.newNote = angular.copy(newNoteDefaults);
                                scope.showAddNote = false;
                            }, scope.handleErrors).finally(function(){
                                $activityIndicator.stopAnimating();
                            });
                    }
                };

                scope.addNoteShow = function(){
                    scope.showAddNote = true;
                }

                scope.addNoteHide = function(){
                    scope.showAddNote = false;
                }

                coachSeekAPIService.query({section: 'CustomFields', type: 'customer'})
                    .$promise.then(function(bookingNotes){
                        scope.bookingNotes = bookingNotes;
                    }, scope.handleErrors).finally(function(){
                        scope.initNoteLoad = false;
                    });
            }
        }
    }])
    .directive('bookingNoteTemplate', ['coachSeekAPIService', '$activityIndicator', function(coachSeekAPIService, $activityIndicator){
        return {
            restrict: "E",
            templateUrl:'booking/partials/bookingNoteTemplate.html',
            link: function(scope, elem){
                scope.loading = false;
                scope.saveName = function(){
                    if(scope.noteNameForm.$valid){
                        scope.editName = false;
                        scope.note.name = scope.tempName;
                        saveNote().then(function(){
                            scope.tempName = scope.note.name;
                        }, function(errors){
                            scope.editName = true;
                            scope.handleErrors(errors);
                        }).finally(function(){
                            scope.loading = false;
                            $activityIndicator.stopAnimating();
                        });
                    }
                }

                scope.$watchCollection('note', function(newVal, oldVal){
                    if(newVal !== oldVal && !scope.editName){
                        saveNote().then({}, scope.handleErrors)
                            .finally(function(){
                                scope.loading = false;
                                $activityIndicator.stopAnimating();
                            })
                    }
                });

                scope.cancelEdit = function(){
                    scope.editName = false;
                    scope.tempName = scope.note.name;
                }

                function saveNote(){
                    $activityIndicator.startAnimating();
                    scope.loading = true;
                    return coachSeekAPIService.save({section:'CustomFields'}, scope.note).$promise
                };
            }
        }
    }])
    .directive('manageDiscountCodes', ['coachSeekAPIService', '$activityIndicator', function(coachSeekAPIService, $activityIndicator){
        return {
            restrict: "E",
            templateUrl: "booking/partials/manageDiscountCodes.html",
            link: function(scope, elem){
                var newDiscountCodeDefaults = {
                    code: scope.business.name.substring(0,4).trim().toUpperCase() + 10,
                    discountPercent: 10,
                    isActive: true
                };
                scope.discountCodes = [];
                scope.newDiscountCode = angular.copy(newDiscountCodeDefaults);
                scope.showAddDiscountCode = false;
                scope.saveNewDiscountCode = function(){
                    //check form valid
                    if(scope.newDiscountCodeForm.$valid){
                        $activityIndicator.startAnimating();
                        coachSeekAPIService.save({section: 'DiscountCodes'}, scope.newDiscountCode).$promise
                            .then(function(code){
                                scope.discountCodes.unshift(code);
                                scope.newDiscountCode = angular.copy(newDiscountCodeDefaults);
                                scope.showAddDiscountCode = false;
                            }, scope.handleErrors).finally(function(){
                                $activityIndicator.stopAnimating();
                            });
                    }
                };

                scope.addDiscountCodeShow = function(){
                    scope.showAddDiscountCode = true;
                }

                scope.addDiscounCodeHide = function(){
                    scope.showAddDiscountCode = false;
                }

                scope.initDiscountCodeLoad = true;
                coachSeekAPIService.query({section: 'DiscountCodes'})
                    .$promise.then(function(discountCodes){
                        scope.discountCodes = discountCodes;
                    }, scope.handleErrors).finally(function(){
                        scope.initDiscountCodeLoad = false;
                    });
            }
        };
    }])
    .directive('bookingDiscountCode', ['coachSeekAPIService', '$activityIndicator', function(coachSeekAPIService, $activityIndicator){
        return {
            restrict: "E",
            templateUrl:'booking/partials/bookingDiscountCode.html',
            link: function(scope, elem){
                scope.editCode = false;
                scope.loading = false;
                scope.tempCode = scope.discountCode.code;
                scope.tempPercent = scope.discountCode.discountPercent;
                scope.saveDiscountCode = function(){
                    if(scope.discountCodeForm.$valid){
                        scope.editCode = false;
                        scope.discountCode.code = scope.tempCode;
                        scope.discountCode.discountPercent = scope.tempPercent;
                        saveDiscountCode().then(function(){
                            scope.tempCode = scope.discountCode.code;
                            scope.tempPercent = scope.discountCode.discountPercent;
                        }, function(errors){
                            scope.editCode = true;
                            scope.handleErrors(errors);
                        }).finally(function(){
                            scope.loading = false;
                            $activityIndicator.stopAnimating();
                        });
                    }
                }

                scope.$watch('discountCode.isActive', function(newVal, oldVal){
                    if(newVal !== oldVal){
                        scope.cancelEdit();
                        saveDiscountCode().then({}, scope.handleErrors)
                            .finally(function(){
                                scope.loading = false;
                                $activityIndicator.stopAnimating();
                            });
                    }
                });

                scope.cancelEdit = function(){
                    scope.editCode = false;
                    scope.tempCode = scope.discountCode.code;
                    scope.tempPercent = scope.discountCode.discountPercent;
                }

                function saveDiscountCode(){
                    $activityIndicator.startAnimating();
                    scope.loading = true;
                    return coachSeekAPIService.save({section:'DiscountCodes'}, scope.discountCode).$promise
                };
            }
        }
    }])
    .directive('applyDiscountCode', ['onlineBookingAPIFactory', 'currentBooking', function(onlineBookingAPIFactory, currentBooking){
        return {
            restrict: "E",
            templateUrl:'booking/partials/applyDiscountCode.html',
            link: function(scope, elem){
                scope.discountCodeLoading = false;
                scope.showDiscountErrors = false;
                scope.applyDiscountCode = function(){
                    if(scope.applyDiscountFrom.$valid){
                        scope.discountCodeLoading = true;
                        onlineBookingAPIFactory.anon(scope.business.domain)
                            .pricingEnquiry({}, {
                                sessions: currentBooking.booking.sessions,
                                discountCode: scope.discountCode
                            }).$promise.then(function(discountPrice){
                                currentBooking.discountPrice = discountPrice;
                                _.assign(currentBooking.discountPrice, {originalPrice: currentBooking.totalPrice});
                                currentBooking.totalPrice = discountPrice.amount;
                            }, scope.handleErrors).finally(function(){
                                scope.discountCodeLoading = false;
                            });
                    } else {
                        scope.showDiscountErrors = true;
                    }
                }
            }
        };
    }]);