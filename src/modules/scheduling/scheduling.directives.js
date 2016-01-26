//TODO clean up unused DI
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

                // $(".session-form").css("height", "100%").css("height", "-=285px"); 
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
                        scope.getCourseBookingData();
                    }, scope.handleErrors).finally(function(){
                        scope.bookingLoading = false;
                    });
                }

                scope.$watch('currentEvent.session.booking.bookings', function(newBookings){
                    if(newBookings){
                        if(scope.currentEvent.course){
                            scope.isCourseStudent = getCustomerBooking(_.get(scope.currentEvent, 'course.booking.bookings'));
                        } else {
                            scope.isSessionStudent = getCustomerBooking(newBookings);
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

                function getCustomerBooking(bookings){
                    return _.find(bookings, function(booking){
                        return booking.customer.id === scope.item.id;
                    });
                };
            }
        };
    }])
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
                        scope.courseBooking.bookings[index].sessionId = sessionId;
                    }, scope.handleErrors).finally(function(){
                        scope.sessionBookingLoading = false;
                        scope.stopCourseLoading();
                    });
                }
            }
        }
    }])
    .directive('generalSettingsModal', function(){
        return {
           restrict: "E",
           replace: false,
           templateUrl:'scheduling/partials/generalSettingsModal.html'
        }; 
    })
    .directive('courseAttendanceModal', ['coachSeekAPIService', 'bookingManager', 'sessionOrCourseModal', 'removeFromCourseModal', '$timeout', 
      function(coachSeekAPIService, bookingManager, sessionOrCourseModal, removeFromCourseModal, $timeout){
        return {
           restrict: "E",
           replace: false,
           templateUrl:'scheduling/partials/courseAttendanceModal.html',
           link: function(scope, elem){
                var itemsLoadingCounter = 0;
                scope.courseLoading = true;

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

                scope.removeBooking = function(courseBooking){
                    //must determine if current booking is a course booking
                    var sessionBooking = _.find(courseBooking.bookings, function(booking){
                        return booking.sessionId === scope.currentEvent.session.id;
                    });
                    if(scope.currentEvent.course && sessionBooking.parentId && !sessionBooking.showAddToSessionButton) {
                        sessionOrCourseModal(scope).then(function(id){
                            if(id === scope.currentEvent.course.id){
                                removeCustomerFromCourse(courseBooking);
                            } else {
                                bookingRemoval('removeFromSession', sessionBooking.id);
                            }
                        });
                    } else {
                        removeFromCourseModal().then(function(){
                            if(scope.currentEvent.course){
                                removeCustomerFromCourse(courseBooking);
                            } else {
                                bookingRemoval('removeFromSession', sessionBooking.id);
                            }
                        });
                    }
                };

                function removeCustomerFromCourse(courseBooking){
                    var courseBookings = _.filter(courseBooking.bookings, function(booking){
                        return !booking.showAddToSessionButton
                    });
                    courseBookings = _.uniq(courseBookings, 'parentId');
                    bookingRemoval('removeFromCourse', courseBookings);
                };

                function bookingRemoval(functionName, bookingId){
                    scope.startCourseLoading(true);
                    bookingManager[functionName](bookingId).then(function(booking){
                        // var customerName = customer.firstName + " " + scope.item.lastName;
                        // showSuccessAlert(actionName, customerName, course.service.name)
                        scope.getCourseBookingData();
                    }, scope.handleErrors).finally(function(){
                        scope.stopCourseLoading();
                    });
                }

                scope.$watch('currentEvent', function(newVal, oldVal){
                    if(newVal){
                        //set up scroll to event when opening attendance tab
                        var deregister = scope.$watch('modalTab', function(newVal){
                            if(newVal === 'attendance' || newVal === 'payment'){
                                $timeout(function(){
                                    $(elem).find('table.session-data').animate({scrollLeft: $(elem).find('li.current').position().left}, 800);
                                });
                                deregister()
                            }
                        });

                        //only run if course changes otherwise would re-render same data
                        if(_.get(newVal, 'course.id') !== _.get(oldVal, 'course.id') || !_.has(newVal, 'course.id')) {
                            scope.showCustomers = false;
                            scope.courseLoading = 'idle';

                            scope.getCourseBookingData();
                            $(elem).find('.attendance-list').animate(
                                {
                                    width: (180 + (_.size(_.get(scope.currentEvent, 'course.sessions')) * 125))
                                }, 300, function(){
                                    $(elem).find('.course-table-container').scrollbar({
                                        "autoScrollSize": false,
                                        "scrollx": null,
                                        "scrolly": $('.external-scroll_y')
                                    });
                                });
                            $timeout(centerModal);
                       }
                    }
                });

                scope.$watch('modalTab', function(newVal){
                    if(newVal && scope.showModal){
                        $timeout(centerModal);
                    }
                });

                $(window).on('resize', function(){
                    centerModal();
                });

                function centerModal(){
                    var $modalContainer = $('.modal-container');
                    $modalContainer.animate( { marginLeft : -($modalContainer.width()/2) + 'px' }, 200);
                };

                scope.getCourseBookingData = function(){
                    //TODO restructure as PAYMENT and BOOKINGS for tabs?
                    //TODO gauruntee in order date sequence
                    // go through session bookings and pluck out unique customers
                    // [{customer: {}, bookings:[booking, sessionId, booking]},{customer: {}, bookings:[sessionId, sessionId, booking]}]
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
                                    sessionBooking.sessionId = session.id;
                                    booking.bookings[sessionIndex] = sessionBooking;
                                } else if (!booking.bookings[sessionIndex]){
                                    booking.bookings[sessionIndex] = {sessionId: session.id, showAddToSessionButton: true};
                                }
                            });
                        });
                    });
                    scope.courseBookingData = _.sortByAll(courseBookingData, function(booking){
                        return [booking.customer.lastName.toLowerCase(), booking.customer.firstName.toLowerCase()]
                    });
                    if(!_.size(courseBookingData)) scope.showCustomers = true;
                }

                coachSeekAPIService.query({section: 'Customers'})
                    .$promise.then(function(customerList){
                        scope.itemList  =  customerList;
                    }, scope.handleErrors);
           }
        }; 
    }])
    .directive('reactCustomerDataTable', ['bookingManager', 'coachSeekAPIService', function(bookingManager, coachSeekAPIService){
        return {
            restrict: "E",
            replace: false,
            templateUrl:'scheduling/partials/reactCustomerDataTable.html',
            link: function(scope, elem){
                scope.$watch('courseBookingData', function(newVal){
                    if(newVal && (scope.modalTab === 'attendance' || scope.modalTab === 'payment')){
                        renderCustomerTable(newVal);
                    }
                });
                scope.$watch('modalTab', function(newVal){
                    if(newVal === 'attendance' || newVal === 'payment'){
                        renderCustomerTable(scope.courseBookingData);
                    }
                });

                function renderCustomerTable(courseBookingData){
                    console.time("courseBookingsLoaded");
                    //scope.courseBookingData[newVal]?
                     ReactDOM.render(
                       <CustomerDataTable courseBookings={courseBookingData}/>,
                       $(elem).find('table.session-data').get(0)
                     );
                     $(elem).find('table.session-data').scrollbar({
                         "autoScrollSize": false,
                         "scrollx": $('.external-scroll_x'),
                         "scrolly": null
                     }).on('scrollbar-x-scroll', function(event, scrollLeft){
                         $('div.session-headers').css("left", 180-scrollLeft);
                     });
                     console.timeEnd("courseBookingsLoaded");
                }

                //TODO split into CustomerAttendanceTable and CustomerPaymentTable
                var CustomerDataTable = React.createClass({
                    render(){
                        var customerNodes = this.props.courseBookings.map(function(courseBooking) {
                            return (
                                <CustomerDataRow 
                                    key={courseBooking.customer.id} 
                                    customer={courseBooking.customer}
                                    bookings={courseBooking.bookings}
                                />
                            );
                        });
                        return (
                            <tbody>
                                {customerNodes}
                            </tbody>
                        );
                    }
                });

                var CustomerDataRow = React.createClass({
                    render(){
                        var bookingNodes = this.props.bookings.map(function(booking) {
                            if(booking.showAddToSessionButton){
                                return  (<AddCustomerToSession 
                                            key={booking.sessionId}
                                            customer={this.props.customer} 
                                            sessionId={booking.sessionId} 
                                        />);
                            } else if(scope.modalTab === "payment"){
                                return  (<CustomerPaymentStatus 
                                            key={booking.id}
                                            paymentStatus={booking.paymentStatus} 
                                            bookingId={booking.id}
                                            sessionId={booking.sessionId} 
                                        />);
                            } else if(scope.modalTab === "attendance"){
                                return  (<CustomerAttendanceStatus 
                                            key={booking.id}
                                            bookingId={booking.id} 
                                            hasAttended={booking.hasAttended} 
                                            sessionId={booking.sessionId} 
                                        />);
                            }
                        }, this);
                        return (
                            <tr>
                                {bookingNodes}
                            </tr>
                        );
                    }
                });

                var AddCustomerToSession = React.createClass({
                    addToSession(){
                        this.setState({loading: true})
                        scope.startCourseLoading(true);
                        bookingManager.addToSession(this.props.customer, this.props.sessionId).then(function(courseBooking){
                            scope.getCourseBookingData();
                        }, scope.handleErrors).finally(function(){
                            scope.stopCourseLoading();
                        });
                    },
                    getInitialState(){
                        return {
                            loading: false
                        };
                    },
                    render(){
                        var tdClassNames = classNames({
                            "current": scope.currentEvent.session.id === this.props.sessionId
                        });

                        return (
                            <td className={tdClassNames}  onClick={this.addToSession} disabled={this.state.loading}>
                                <button className="add-student to-session fa fa-plus" ></button>
                                <span className='course-table ellipsis_animated-inner add-student'>
                                    <span>.</span>
                                    <span>.</span>
                                    <span>.</span>
                                </span>
                            </td>
                        );
                    }
                });


                var CustomerPaymentStatus = React.createClass({
                    paymentStatusOptions: ['pending-invoice', 'pending-payment', 'paid', 'overdue-payment'],
                    updatePaymentStatus(event){
                        while(this.paymentStatusOptions[0] !== this.state.paymentStatus){
                            this.paymentStatusOptions.push(this.paymentStatusOptions.shift());
                        }
                        this.paymentStatusOptions.push(this.paymentStatusOptions.shift());
                        this.setState({paymentStatus: this.paymentStatusOptions[0]});
                        scope.startCourseLoading();
                        this.debounceSavePaymentStatus();
                    },
                    savePaymentStatus(){
                        var self = this;
                        if(this.isMounted()) this.setState({loading: true});
                        scope.startCourseLoading(true);
                        bookingManager.updateBooking(this.props.bookingId, {
                            commandName: 'BookingSetPaymentStatus',
                            paymentStatus: this.state.paymentStatus
                        }).then({},scope.handleErrors).finally(function(){
                            scope.getCourseBookingData();
                            scope.stopCourseLoading();  
                            if(self.isMounted()) self.setState({loading: false});
                        });
                    },
                    componentWillMount() {
                       this.debounceSavePaymentStatus = _.debounce(this.savePaymentStatus, 1000);
                    },
                    getInitialState(){
                        return {
                            paymentStatus: this.props.paymentStatus
                        };
                    },
                    render(){
                        var tdClassNames = classNames({
                            "current": scope.currentEvent.session.id === this.props.sessionId
                        });
                        return (
                            <td className={tdClassNames} onClick={this.updatePaymentStatus} disabled={this.state.loading}>
                                <div className={"payment-status " + this.state.paymentStatus}>
                                    {i18n.t('scheduling:payment-status.' + this.state.paymentStatus)}
                                </div>
                            </td>);
                    }
                });

                var CustomerAttendanceStatus = React.createClass({
                    attendanceStatusOptions: [undefined, true, false],
                    updateAttendance(event){
                        while(this.attendanceStatusOptions[0] !== this.state.hasAttended){
                            this.attendanceStatusOptions.push(this.attendanceStatusOptions.shift());
                        }
                        this.attendanceStatusOptions.push(this.attendanceStatusOptions.shift());
                        this.setState({
                            hasAttended: this.attendanceStatusOptions[0],
                            attendanceLogo: getAttendanceLogo(this.attendanceStatusOptions[0])
                        });
                        scope.startCourseLoading();
                        this.debounceSaveAttendanceStatus();
                    },
                    saveAttendanceStatus(){
                        var self = this;
                        if(this.isMounted()) this.setState({loading: true})
                        scope.startCourseLoading(true);
                        bookingManager.updateBooking(this.props.bookingId, {
                            commandName: 'BookingSetAttendance',
                            hasAttended: this.state.hasAttended
                        }).then({},scope.handleErrors).finally(function(){
                            scope.getCourseBookingData();
                            scope.stopCourseLoading();
                            if(self.isMounted()) self.setState({loading: false});
                        });
                    },
                    componentWillMount() {
                       this.debounceSaveAttendanceStatus = _.debounce(this.saveAttendanceStatus, 1000);
                    },
                    getInitialState(){
                        return {
                            hasAttended: this.props.hasAttended,
                            attendanceLogo: getAttendanceLogo(this.props.hasAttended)
                        };
                    },
                    render(){
                        var tdClassNames = classNames({
                            "current": scope.currentEvent.session.id === this.props.sessionId
                        });
                        return (
                            <td className={tdClassNames} onClick={this.updateAttendance} disabled={this.state.loading}>
                               <div className={"attending-checkbox " + this.state.hasAttended} >
                                   <i className={"fa " + this.state.attendanceLogo}></i>
                               </div>
                            </td>
                        );
                    }
                });

                function getAttendanceLogo(status){
                    if(status === true){
                        return 'fa-check'
                    } else if (status === false){
                        return 'fa-close';
                    } else {
                        return ''
                    }
                };
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
