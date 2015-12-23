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
    .directive('customerPaymentStatus', ['coachSeekAPIService', 'bookingManager', 'sessionOrCourseModal', function(coachSeekAPIService, bookingManager, sessionOrCourseModal){
        return {
            restrict: "E",
            replace: false,
            templateUrl:'scheduling/partials/customerPaymentStatus.html',
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
    .directive('courseAttendanceModal', ['coachSeekAPIService', '$timeout', function(coachSeekAPIService, $timeout){
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

                scope.$watch('currentEvent', function(newVal, oldVal){
                    if(newVal){
                        //set up scroll to event when opening attendance tab
                        var deregister = scope.$watch('modalTab', function(newVal){
                            if(newVal === 'attendance'){
                                $timeout(function(){
                                    $(elem).find('table.session-data').animate({scrollLeft: $(elem).find('li.current').position().left}, 800);
                                });
                                deregister()
                            }
                        });

                        //only run if course changes otherwise would re-render same data
                        if(_.get(newVal, 'course.id') !== _.get(oldVal, 'course.id') || !_.has(newVal, 'course.id')) {
                           console.log('CURRENTEVENT COURSE CHANGE')
                           scope.showCustomers = false;
                           scope.courseLoading = 'idle';

                           //TODO don't delay if modal open?
                           // $timeout(function(){
                               scope.courseBookingData = getCourseBookingData();
                               // $timeout(function(){
                                    $(elem).find('.attendance-list').animate({width: (175 + (_.size(_.get(scope.currentEvent, 'course.sessions')) * 125))});
                                    scope.$emit('centerModal'); 
                               // })
                           // });
                       }
                    }
                });


                scope.$on('addBookingToCourse', function(){
                    console.time("addBookingLoaded")
                    scope.courseBookingData = getCourseBookingData();
                    $timeout(function(){
                        console.timeEnd("addBookingLoaded")
                    })
                });

                function getCourseBookingData(){
                    //TODO restructure as PAYMENT and BOOKINGS for tabs?
                    //TODO gauruntee in order date sequence
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
                                    sessionBooking.sessionId= session.id;
                                    booking.bookings[sessionIndex] = sessionBooking;
                                } else if (!booking.bookings[sessionIndex]){
                                    booking.bookings[sessionIndex] = {sessionId: session.id, showAddToSessionButton: true};
                                }
                            });
                        });
                    });
                    //TODO ignore upper/lower case
                    return _.sortByAll(courseBookingData, ['customer.lastName', 'customer.firstName']);
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
            //BIG TODO: FIGURE OUT HOW TO UPDATE CURRENT EVENT GRACEFULLY
            //          AND HAVE IT RENDER IN THE GRID AS WELL
            // <table class="session-data">
            //     <tbody>
            //         <td class="course-session-attendance" ng-class="{'current': currentEvent.session.id === booking.sessionId}" ng-repeat="booking in courseBooking.bookings track by $index">
            //             <customer-attendance-status ng-if="!booking.showAddToSessionButton && modalTab === 'attendance'"></customer-attendance-status>  
            //             <customer-payment-status ng-if="!booking.showAddToSessionButton && modalTab === 'payment'"></customer-payment-status>   
            //             <add-to-session ng-if="booking.showAddToSessionButton"></add-to-session>
            //         </td>
            //         <!-- <div class="no-students" ng-if="!currentEvent.course.booking.bookings">{{'scheduling:no-students-found' | i18next}}</div> -->
            //     </tbody>
            // </table>
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
                       <CustomerDataTable data={courseBookingData}/>,
                       elem.get(0)
                     );
                     console.timeEnd("courseBookingsLoaded");
                }

                //TODO split into CustomerAttendanceTable and CustomerPaymentTable
                var CustomerDataTable = React.createClass({
                    handleScroll: function(event){
                        $('div.session-headers').css("left", 175-$(event.currentTarget).scrollLeft());
                    },
                    render: function(){
                        var customerNodes = this.props.data.map(function(bookingData) {
                            return (
                                <CustomerDataRow 
                                    key={bookingData.customer.id} 
                                    customer={bookingData.customer}
                                    bookings={bookingData.bookings}
                                    />
                            );
                        });
                        return (
                            <table className="session-data" onScroll={this.handleScroll}>
                                <tbody>
                                    {customerNodes}
                                </tbody>
                            </table>
                        );
                    }
                });

                var CustomerDataRow = React.createClass({
                    render: function(){
                        var bookingNodes = this.props.bookings.map(function(booking) {
                            if(booking.showAddToSessionButton){
                                return (<AddCustomerToSession customer={this.props.customer} sessionId={booking.sessionId} key={booking.sessionId}/>);
                            } else if(scope.modalTab === "payment"){
                                return (<CustomerPaymentStatus paymentStatus={booking.paymentStatus} bookingId={booking.id} key={booking.id}/>);
                            } else if(scope.modalTab === "attendance"){
                                return (<CustomerAttendanceStatus 
                                            bookingId={booking.id} 
                                            hasAttended={booking.hasAttended} 
                                            key={booking.id}
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
                    addToSession: function(){
                        scope.startCourseLoading(true);
                        bookingManager.addToSession(this.props.customer, this.props.sessionId).then(function(courseBooking){
                            // scope.courseBookingData[customerIndex].bookings[bookingIndex] = courseBooking.sessionBookings[0];
                            //TODO do i need this anymore? possibly for checking if session is current one or loading?
                            // scope.courseBookingData[customerIndex].bookings[bookingIndex].sessionId = self.props.sessionId;
                            // renderCustomerTable(scope.courseBookingData)
                        }, scope.handleErrors).finally(function(){
                            scope.stopCourseLoading();
                        });
                    },
                    render: function(){
                        return (
                            <td onClick={this.addToSession}>
                                <button className="add-student to-session fa fa-plus" ></button>
                            </td>
                        );
                    }
                });


                var CustomerPaymentStatus = React.createClass({
                    paymentStatusOptions: ['pending-invoice', 'pending-payment', 'paid', 'overdue-payment'],
                    updatePaymentStatus: function(event){
                        while(this.paymentStatusOptions[0] !== this.state.paymentStatus){
                            this.paymentStatusOptions.push(this.paymentStatusOptions.shift());
                        }
                        this.paymentStatusOptions.push(this.paymentStatusOptions.shift());
                        this.setState({paymentStatus: this.paymentStatusOptions[0]});
                        scope.startCourseLoading();
                        this.savePaymentStatus();
                    },
                    savePaymentStatus: _.debounce(function(){
                        var self = this;
                        this.setState({loading: true})
                        this.updateBooking({
                            commandName: 'BookingSetPaymentStatus',
                            paymentStatus: this.state.paymentStatus
                        }).then({},scope.handleErrors).finally(function(){
                            self.setState({loading: false})
                            scope.stopCourseLoading();  
                        });
                    }, 1000),
                    updateBooking: function(updateCommand){
                        scope.startCourseLoading(true);
                        return coachSeekAPIService.save({section: 'Bookings', id: this.props.bookingId}, updateCommand).$promise;
                    },
                    getInitialState: function(){
                        return {
                            paymentStatus: this.props.paymentStatus
                        };
                    },
                    render: function(){
                        return (
                            <td onClick={this.updatePaymentStatus} disabled={this.state.loading}>
                                <div className={"payment-status " + this.state.paymentStatus}>
                                    {i18n.t('scheduling:payment-status.' + this.state.paymentStatus)}
                                </div>
                            </td>);
                    }
                });

                var CustomerAttendanceStatus = React.createClass({
                    attendanceStatusOptions: [undefined, true, false],
                    updateAttendance: function(event){
                        while(this.attendanceStatusOptions[0] !== this.state.hasAttended){
                            this.attendanceStatusOptions.push(this.attendanceStatusOptions.shift());
                        }
                        this.attendanceStatusOptions.push(this.attendanceStatusOptions.shift());
                        this.setState({
                            hasAttended: this.attendanceStatusOptions[0],
                            attendanceLogo: getAttendanceLogo(this.attendanceStatusOptions[0])
                        });
                        scope.startCourseLoading();
                        this.saveAttendanceStatus();
                    },
                    saveAttendanceStatus: _.debounce(function(){
                        var self = this;
                        this.setState({loading: true})
                        this.updateBooking({
                            commandName: 'BookingSetAttendance',
                            hasAttended: this.state.hasAttended
                        }).then({},scope.handleErrors).finally(function(){
                            self.setState({loading: false})
                            scope.stopCourseLoading();
                        });
                    }, 1000),
                    updateBooking: function(updateCommand){
                        scope.startCourseLoading(true);
                        return coachSeekAPIService.save({section: 'Bookings', id: this.props.bookingId}, updateCommand).$promise;
                    },
                    getInitialState: function(){
                        return {
                            hasAttended: this.props.hasAttended,
                            attendanceLogo: getAttendanceLogo(this.props.hasAttended)
                        };
                    },
                    render: function(){
                        return (
                            <td className="course-session-attendance" onClick={this.updateAttendance} disabled={this.state.loading}>
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
        }
    }]);