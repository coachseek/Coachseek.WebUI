describe('Scheduling Module', function() {

    var templateUrl = 'scheduling/partials/schedulingView.html';
    describe('when navigating to scheduling', function(){
        beforeEach(function(){
            $state.go('scheduling');
            $rootScope.$digest();
        });
        it('should attempt to bring up the login modal if not logged in', function(){
            expect(loginModalStub).to.be.calledOnce;
        });
        it('should map to correct template', function(){
            expect($state.current.templateUrl).to.equal(templateUrl);
        });
        it('should map to the correct controller', function(){
            expect($state.current.controller).to.equal('schedulingCtrl');
        });
    });

    describe('when loading the calendar initially', function(){

        let('coach', function(){
            return {
                name: "First Dude",
                id: "coach_1",
                email: "test@example.com",
                phone: "9090909"
            };
        });

        let('coachTwo', function(){
            return {
                name: "New Guy",
                id: "coach_2",
                email: "test@exaple.com",
                phone: "900909"
            }; 
        })

        let('coaches', function(){
            return [this.coach, this.coachTwo];
        });

        let('coachesPromise', function(){
            var deferred = $q.defer();
            deferred.resolve(this.coaches);
            return deferred.promise;
        });

        let('location', function(){
            return {
                name: "Test",
                description: "Location",
                id: 'location_1'
            };
        });

        let('locationTwo', function(){
            return {
                name: "Two",
                description: "Location",
                id: 'location_2'
            };
        });

        let('locations', function(){
            return [this.location, this.locationTwo];
        });

        let('locationsPromise', function(){
            var deferred = $q.defer();
            deferred.resolve(this.locations);
            return deferred.promise;
        });

        let('serviceOne', function(){
            return {
                name: "A Toast Making",
                id: "service_01",
                description: "I show you how to make goddamn toast, son.",
                timing: {
                    duration: "0:30"
                },
                booking: {
                    studentCapacity: 8
                },
                presentation: {
                    colour: 'green'
                },
                repetition: {
                    sessionCount: 4,
                    repeatFrequency: 'd'
                },
                pricing: {
                    sessionPrice: 15.00,
                    coursePrice: 150.0
                }
            };
        });

        let('serviceTwo', function(){
            return {
                name: "B Roast Making",
                id: "service_02",
                description: "I show you how to make goddamn roast, son.",
                timing: {
                    duration: "1:00"
                },
                booking: {
                    studentCapacity: 12
                },
                presentation: {
                    colour: 'orange'
                },
                repetition: {
                    sessionCount: 1,
                    repeatFrequency: undefined
                },
                pricing: {
                    sessionPrice: 15.00,
                    coursePrice: 250.0
                }
            };
        });

        let('services', function(){
            return [this.serviceOne, this.serviceTwo];
        });

        let('servicesPromise', function(){
            var deferred = $q.defer();
            deferred.resolve(this.services);
            return deferred.promise;
        });

        let('dateOne', function(){
            return moment()
        });
        let('dateTwo', function(){
            return moment().add(1, 'days').add(1, 'hours');
        });

        let('dateThree', function(){
            return moment().add(1, 'months');
        });

        let('sessionOne', function(){
            return {
                id: 'session_one',
                service: this.serviceOne,
                location: this.location,
                coach: this.coach,
                timing: {
                    duration: this.serviceOne.duration,
                    startTime: this.dateOne.format('HH:mm'),
                    startDate: this.dateOne.format('YYYY-MM-DD')
                },
                repetition: this.serviceOne.repetition,
                presentation: {
                    colour: this.serviceOne.colour
                },
                booking: {
                    bookings: [{customer: this.customerOne}, {customer: this.customerTwo}]
                },
                pricing: {
                    sessionPrice: 15.00,
                    coursePrice: 250.0
                }
            }
        });

        let('sessionTwo', function(){
            return {
                id: 'session_two',
                service: this.serviceTwo,
                location: this.location,
                coach: this.coachTwo,
                timing: {
                    duration: this.serviceTwo.duration,
                    startTime: this.dateTwo.format('HH:mm'),
                    startDate: this.dateTwo.format('YYYY-MM-DD')
                },
                repetition: this.serviceTwo.repetition,
                presentation: {
                    colour: this.serviceTwo.colour
                },
                booking: {
                    bookings: [{customer: this.customerOne}, {customer: this.customerTwo}]
                },
                pricing: {
                    sessionPrice: 15.00,
                    coursePrice: 250.0
                }
            }
        });

        let('sessionThree', function(){
            return {
                id: 'session_three',
                service: this.serviceOne,
                location: this.location,
                coach: this.coach,
                timing: {
                    duration: this.serviceOne.duration,
                    startTime: this.dateThree.format('HH:mm'),
                    startDate: this.dateThree.format('YYYY-MM-DD')
                },
                repetition: this.serviceOne.repetition,
                presentation: {
                    colour: this.serviceOne.colour
                },
                booking: {
                    bookings: []
                },
                pricing: {
                    sessionPrice: 15.00,
                    coursePrice: 250.0
                }
            }
        });

        let('sessionObject', function(){
            return {
                courses: [{
                    id: 'session_one',
                    service: this.serviceOne,
                    location: this.location,
                    coach: this.coach,
                    timing: {
                        duration: this.serviceOne.duration,
                        startTime: this.dateThree.format('HH:mm'),
                        startDate: this.dateThree.format('YYYY-MM-DD')
                    },
                    repetition: this.serviceOne.repetition,
                    presentation: {
                        colour: this.serviceOne.colour
                    },
                    booking: {
                        bookings: []
                    },
                    sessions: [this.sessionTwo, this.sessionTwo]                     
                }],
                sessions: [this.sessionOne]
            }
        });


        let('customerOne', function(){
            return {
                id: 'one',
                firstName: 'first',
                lastName: 'last'
            }
        });

        let('customerTwo', function(){
            return {
                id: 'two',
                firstName: 'first',
                lastName: 'last'
            }
        });

        let('customerThree', function(){
            return {
                id: 'three',
                firstName: 'first',
                lastName: 'last'
            }
        });

        let('customers', function(){
            return [this.customerOne, this.customerTwo, this.customerThree];
        })

        let('nextMonthSessionObject', function(){
            return this.sessionObject;
        });

        let('sessionsPromise', function(){
            var deferred = $q.defer();
            deferred.resolve(this.sessionObject);
            return deferred.promise;
        });

        let('customersPromise', function(){
            var deferred = $q.defer();
            deferred.resolve(this.customers);
            return deferred.promise;   
        });

        let('nextMonthSessionsPromise', function(){
            var deferred = $q.defer();
            deferred.resolve(this.nextMonthSessionObject);
            return deferred.promise;
        });

        let('updatePromise', function(){
            var deferred = $q.defer();
            deferred.resolve(scope.currentSession);
            return deferred.promise;
        });

        var getStub,
            self,
            $servicesList,
            $firstService,
            $calendar,
            scope,
            coachSeekAPIService,
            getSessionsStub,
            sessionCalendar;

        beforeEach(function(){
            self = this;

            coachSeekAPIService = $injector.get('coachSeekAPIService');
            scope = $rootScope.$new();

            getSessionsStub = this.sinon.stub(coachSeekAPIService, 'get', function(){
                return {$promise: self.sessionsPromise};
            });

            getStub = this.sinon.stub(coachSeekAPIService, 'query', function(param){
                switch (param.section) {
                    case 'Coaches':
                        return {$promise: self.coachesPromise};
                        break;
                    case 'Locations':
                        return {$promise: self.locationsPromise};
                        break;
                    case 'Services':
                        return {$promise: self.servicesPromise};
                        break;
                    case 'Customers':
                        return {$promise: self.customersPromise};
                        break;
                    default:
                        throw new Error('NADA');
                        break;
                }
            });

            // must append to body here or calendar does nothing because of elementVisible()
            // function on 7212 of fullcalendar.js
            $testRegion.appendTo('body');
            createViewWithController(scope, templateUrl, 'schedulingCtrl');
            $calendar = $testRegion.find('.calendar');
            $servicesList = $testRegion.find('.services-list-container');
            $firstService = $servicesList.find('.service-details').first();

            // must render here or calendar does nothing because of elementVisible()
            // function on 7212 of fullcalendar.js
            $calendar.fullCalendar('render');
            sessionCalendar = $injector.get('uiCalendarConfig').calendars.sessionCalendar;
            // fuuuuuuuck. this has to be here because all event listeners have a $timeout
            // attached to them and the tests do not wait. could possibly use done() instead?
            $timeout.flush();
        });
        it('should attempt to get existing services, locations, and coaches', function(){
            expect(getStub).to.be.calledWith({section: 'Coaches'})
            expect(getStub).to.be.calledWith({section: 'Locations'})
            expect(getStub).to.be.calledWith({section: 'Services'})
        });
        it('should load as many services in the service list', function(){
            expect(_.size($servicesList.find('.service-details'))).to.equal(_.size(this.services))
        });
        it('should load the agendaWeek view', function(){
            expect($calendar.find('.fc-view').hasClass('fc-agendaWeek-view')).to.be.true;
        });
        it('should show the service list', function(){
            expect($servicesList.hasClass('closed')).to.be.false;
        });
        describe('when sessions are loading', function(){
            let('sessionsPromise', function(){
                return $q.defer().promise;
            });
            it('should show the loading view', function(){
                expect($testRegion.find('.calendar-loading').hasClass('ng-hide')).to.be.false;
            });
        });
        it('should load the coaches into the coach selector', function(){
            var $coachOptions = $testRegion.find('.coach-list option');
            _.forEach($coachOptions, function(coachOption, index){
                // UNDEFINED OPTION (ALL COACHES)
                var $coachOption = $(coachOption);
                if(index === 0){
                    expect($coachOption.val()).to.equal("");
                    expect($coachOption.text()).to.equal("");
                // COACH NAMES
                } else {
                    expect($coachOption.val()).to.equal(self.coaches[index - 1].id);
                    expect($coachOption.text()).to.equal(self.coaches[index - 1].name);
                }
            });
        });
        it('should load the locations into the location selector', function(){
            var $locationOptions = $testRegion.find('.location-list option');
            _.forEach($locationOptions, function(locationOption, index){
                // UNDEFINED OPTION (ALL LOCATIONS)
                var $locationOption = $(locationOption);
                if(index === 0){
                    expect($locationOption.val()).to.equal("");
                    expect($locationOption.text()).to.equal("");
                // LOCATION NAMES
                } else {
                    expect($locationOption.val()).to.equal(self.locations[index - 1].id);
                    expect($locationOption.text()).to.equal(self.locations[index - 1].name);
                }
            });
        })
        it('should NOT show the session modal', function(){
            expect($testRegion.find('.session-modal').hasClass('ng-hide')).to.be.true;
        });
        describe('when loading the list of services', function(){
            it('should set the title', function(){
                var firstServiceTitle = $firstService.find('.service-name').text();
                expect(firstServiceTitle).to.equal(this.serviceOne.name);
            });
            it('should set the color on the tile dot', function(){
                var $colourCircle = $firstService.find('.colour-circle');
                expect($colourCircle.hasClass(this.serviceOne.presentation.colour)).to.equal(true)
            });
        });
        describe('when GETting the sessions', function(){
            it('should make a call to get', function(){
                var getSessionsParams = {
                    startDate: sessionCalendar.fullCalendar('getView').start.clone().format('YYYY-MM-DD'),
                    endDate: sessionCalendar.fullCalendar('getView').end.clone().format('YYYY-MM-DD'),
                    locationId: '',
                    coachId: '',
                    section: 'Sessions',
                    useNewSearch: true
                };
                expect(getSessionsStub).to.be.calledWith(getSessionsParams);
            });
            it('should load as many sessions that are returned in sessions GET', function(){
                // This won't work if view is changed or repeat frequncy is set to w
                // because the sessions may not be in the range of the calendar view
                // so it has not rendered them
                // TODO - Check this on scope.events? These are going to fail sometimes based on what
                //          Day it is in the real world. that aint gonna cut it.
                expect($testRegion.find('.fc-content').length).to.equal(this.sessionObject.sessions.length + this.sessionObject.courses[0].sessions.length);
            });
        });
        describe('when clicking on a session in the calendar', function(){

            var $calendarEvent, $sessionModal;
            beforeEach(function(){
                $calendarEvent = $calendar.find('.fc-event');
                $calendarEvent.trigger('click');
                $timeout.flush();
                $sessionModal = $testRegion.find('.session-modal');
            });
            it('should show the session modal', function(){
                expect($sessionModal.hasClass('ng-hide')).to.be.false;
            });
            it('should hide the session form', function(){
                expect($sessionModal.find('modal-session-form').hasClass('ng-hide')).to.be.true;
            });
            it('should show the attendance list', function(){
                expect(scope.currentTab).to.equal('attendance');
                expect($sessionModal.find('modal-session-attendance-list').hasClass('ng-hide')).to.be.false;
            });
            it('should set the currentEvent on the scope', function(){
                expect(scope.currentEvent).to.exist;
            });
            it('should disable the session list', function(){
                expect($servicesList.find('.services-list').attr('disabled')).to.equal('disabled');
            });
            describe('the session modal', function(){
                it('should load the coach into the coach list', function(){
                    var $coachOptions = $testRegion.find('.form-input .coaches option');
                    _.forEach($coachOptions, function(coachOption, index){
                        var $coachOption = $(coachOption);
                        expect($coachOption.val()).to.equal(self.coaches[index].id);
                        expect($coachOption.text()).to.equal(self.coaches[index].name);
                    });
                });
                it('should load the locations into the location list', function(){
                    var $locationOptions = $testRegion.find('.form-input .locations option');
                    _.forEach($locationOptions, function(locationOption, index){
                        var $locationOption = $(locationOption);
                        expect($locationOption.val()).to.equal(self.locations[index].id);
                        expect($locationOption.text()).to.equal(self.locations[index].name);
                    });
                });
                describe('when changing the session in the modal', function(){

                    var updateStub;
                    beforeEach(function(){
                        self.updatePromise = this.updatePromise;
                        updateStub = this.sinon.stub(coachSeekAPIService, 'save', function(){
                            return {$promise: self.updatePromise}
                        });
                    });
                    describe('and then saving', function(){
                        describe('while saving', function(){
                            beforeEach(function(){
                                updateStub.restore();
                                updateStub = this.sinon.stub(coachSeekAPIService, 'save', function(){
                                    return {$promise: $q.defer().promise}
                                });
                                $sessionModal.find('.save-button').trigger('click');
                            });
                            it('should start calendar loading', function(){
                                expect(scope.calendarLoading).to.be.true;
                            });
                            it('should set the locations and coaches inputs to touched', function(){
                                expect(scope.currentSessionForm.coaches.$touched).to.be.true;
                                expect(scope.currentSessionForm.locations.$touched).to.be.true;
                            });
                        });
                        describe('when the form is valid', function(){
                            beforeEach(function(){
                                _.assign(scope.currentEvent.session, {
                                    location: {
                                        id: 'location_2'
                                    },
                                    coach: {
                                        id: 'coach_1'
                                    },
                                    timing: {
                                        duration: 90
                                    }
                                });
                                scope.$digest();
                                $sessionModal.find('.save-button').trigger('click');
                            });
                            it('should attempt to save the session', function(){
                                expect(updateStub).to.be.calledWith({section: 'Sessions'}, scope.currentEvent.session);
                            });
                            it('should hide the session modal', function(){
                                expect($sessionModal.hasClass('ng-hide')).to.be.true;
                            });
                            it('should enable the session list', function(){
                                expect($servicesList.attr('disabled')).to.equal(undefined);
                            });
                        });
                        describe('when the form is invalid', function(){
                            beforeEach(function(){
                                _.assign(scope.currentEvent.session, {
                                    coach: {
                                        id: ''
                                    },
                                    location: {
                                        id: ''
                                    }
                                });
                                scope.$digest();
                                $sessionModal.find('.save-button').trigger('click');
                            });
                            it('should NOT attempt to save the session', function(){
                                expect(updateStub).to.not.be.called;
                            });
                            it('should show error messages', function(){
                                expect($sessionModal.find('.error-messages.locations .required').length).not.equal(0);
                                expect($sessionModal.find('.error-messages.coaches .required').length).not.equal(0);
                            });
                            it('should disable the session list', function(){
                                expect($servicesList.find('.services-list').attr('disabled')).to.equal('disabled');
                            });
                        });
                    });
                    describe('and then cancelling with the cancel button', function(){
                        beforeEach(function(){
                            $sessionModal.find('.form-input .duration').trigger('input');
                            $sessionModal.find('.cancel-button').trigger('click');
                        });
                        it('should NOT attempt to save the session', function(){
                            expect(updateStub).to.not.be.called;
                        });
                        it('should hide the session modal', function(){
                            expect($sessionModal.hasClass('ng-hide')).to.be.true;
                        });
                        it('should set the form to untouched and pristine', function(){
                            expect(scope.currentSessionForm.$pristine).to.be.true;
                            expect($sessionModal.find('form').hasClass('ng-dirty')).to.be.false;
                        });
                        it('should enable the session list', function(){
                            expect($servicesList.attr('disabled')).to.equal(undefined);
                        });
                    });
                    describe('and then cancelling with the `X` button', function(){
                        beforeEach(function(){
                            $sessionModal.find('.form-input .duration').trigger('input');
                            $sessionModal.find('i.fa-times').trigger('click');
                        });
                        it('should NOT attempt to save the session', function(){
                            expect(updateStub).to.not.be.called;
                        });
                        it('should hide the session modal', function(){
                            expect($sessionModal.hasClass('ng-hide')).to.be.true;
                        });
                        it('should set the form to untouched and pristine', function(){
                            expect(scope.currentSessionForm.$pristine).to.be.true;
                            expect($sessionModal.find('form').hasClass('ng-dirty')).to.be.false;
                        });
                        it('should enable the session list', function(){
                            expect($servicesList.attr('disabled')).to.equal(undefined);
                        });
                    });
                });
                describe('when deleting the session', function(){

                    let('deletePromise', function(){
                        var deferred = $q.defer();
                        deferred.resolve();
                        return deferred.promise;
                    });

                    var self, deleteStub, sessionOrCourseModalSpy;
                    beforeEach(function(){
                        self = this;
                        self.deletePromise = this.deletePromise;
                        loginModalStub.restore();
                        sessionOrCourseModal = $injector.get('$modal');
                        sessionOrCourseModalSpy = this.sinon.spy(sessionOrCourseModal, 'open');

                        deleteStub = this.sinon.stub($injector.get('coachSeekAPIService'), 'delete', function(){
                            return {$promise: self.deletePromise};
                        });
                        $sessionModal.find('.delete-session').trigger('click');
                    })
                    describe('when the session is in a course', function(){
                        it('should bring up the session or course modal', function(){
                            expect(sessionOrCourseModalSpy).to.be.calledOnce;
                        });
                        describe('when clicking the session button', function(){
                            beforeEach(function(){
                                $('.modal .session-button').trigger('click');
                            });
                            it('should call delete with the session id', function(){
                                expect(deleteStub).to.be.calledWith({section: 'Sessions', id: scope.currentEvent.session.id})
                            });
                            describe('and deletion is successful', function(){
                                it('should hide the session modal', function(){
                                    expect($sessionModal.hasClass('ng-hide')).to.be.true;
                                });
                                it('should enable the session list', function(){
                                    expect($servicesList.attr('disabled')).to.equal(undefined);
                                });
                                it('should show a success message', function(){
                                    expect($rootScope.alerts[0].type).to.equal('success');
                                    expect($rootScope.alerts[0].message).to.equal('scheduling:delete-session-success');
                                    expect($rootScope.alerts[0].name).to.equal(scope.currentEvent.session.service.name);
                                    expect($rootScope.alerts[0].startDate).to.equal(scope.currentEvent.start.format("MMMM Do YYYY, h:mm a"));
                                })
                            });
                            describe('and deletion fails', function(){

                                let('deletePromise', function(){
                                    var deferred = $q.defer();
                                    deferred.reject({data: {message:"error-message"}});
                                    return deferred.promise;
                                });

                                it('should show an error message', function(){
                                    expect($rootScope.alerts[0].type).to.equal('danger');
                                    expect($rootScope.alerts[0].message).to.equal('error-message');
                                });
                            });
                        });

                        describe('when clicking the course button', function(){
                            beforeEach(function(){
                                $('.modal .course-button').trigger('click');
                            });

                            it('should call delete with the course id', function(){
                                expect(deleteStub).to.be.calledWith({section: 'Sessions', id: scope.currentEvent.course.id})
                            });
                            describe('and deletion is successful', function(){
                                it('should hide the session modal', function(){
                                    expect($sessionModal.hasClass('ng-hide')).to.be.true;
                                });
                                it('should enable the session list', function(){
                                    expect($servicesList.attr('disabled')).to.equal(undefined);
                                });
                                it('should show a success message', function(){
                                    expect($rootScope.alerts[0].type).to.equal('success');
                                    expect($rootScope.alerts[0].message).to.equal('scheduling:delete-session-success');
                                    expect($rootScope.alerts[0].name).to.equal(scope.currentEvent.session.service.name);
                                    expect($rootScope.alerts[0].startDate).to.equal(scope.currentEvent.start.format("MMMM Do YYYY, h:mm a"));
                                })
                            });
                            describe('and deletion fails', function(){

                                let('deletePromise', function(){
                                    var deferred = $q.defer();
                                    deferred.reject({data: {message:"error-message"}});
                                    return deferred.promise;
                                });

                                it('should show an error message', function(){
                                    expect($rootScope.alerts[0].type).to.equal('danger');
                                    expect($rootScope.alerts[0].message).to.equal('error-message');
                                });
                            });
                        });
                    });
                    describe('when the session is not in a course', function(){
                        let('sessionObject', function(){
                            return {
                                courses: [],
                                sessions: [this.sessionOne]
                            }
                        });

                        it('should not bring up the session or course modal', function(){
                            expect(sessionOrCourseModalSpy).to.not.be.called;
                        });

                        it('should call delete with the session id', function(){
                            expect(deleteStub).to.be.calledWith({section: 'Sessions', id: scope.currentEvent.session.id})
                        });
                        describe('and deletion is successful', function(){
                            it('should hide the session modal', function(){
                                expect($sessionModal.hasClass('ng-hide')).to.be.true;
                            });
                            it('should enable the session list', function(){
                                expect($servicesList.attr('disabled')).to.equal(undefined);
                            });
                            it('should show a success message', function(){
                                expect($rootScope.alerts[0].type).to.equal('success');
                                expect($rootScope.alerts[0].message).to.equal('scheduling:delete-session-success');
                                expect($rootScope.alerts[0].name).to.equal(scope.currentEvent.session.service.name);
                                expect($rootScope.alerts[0].startDate).to.equal(scope.currentEvent.start.format("MMMM Do YYYY, h:mm a"));
                            })
                        });
                        describe('and deletion fails', function(){

                            let('deletePromise', function(){
                                var deferred = $q.defer();
                                deferred.reject({data: {message:"error-message"}});
                                return deferred.promise;
                            });

                            it('should show an error message', function(){
                                expect($rootScope.alerts[0].type).to.equal('danger');
                                expect($rootScope.alerts[0].message).to.equal('error-message');
                            });
                        });
                    });
                });
            });
            describe('the attendance tab', function(){
                var $attendanceList;
                beforeEach(function(){
                    $sessionModal.find('.session-modal-nav .attendance').trigger('click');
                    $attendanceList = $sessionModal.find('modal-session-attendance-list');
                });
                it('should show the student list', function(){
                    expect(scope.currentTab).to.equal('attendance');
                    expect($attendanceList.hasClass('ng-hide')).to.be.false;
                });
                it('should hide the customer list', function(){ 
                    expect($attendanceList.find('.customer-list').hasClass('ng-hide')).to.be.true;
                });
                it('should show the student list', function(){
                    expect($attendanceList.find('.student-list').hasClass('ng-hide')).to.be.false;
                });
                it('should have as many students as are in bookings', function(){
                    expect($attendanceList.find('customer-booking').length).to.equal(this.sessionTwo.booking.bookings.length);
                });
                it('should show a list of all the customers', function(){
                    expect($attendanceList.find('modal-customer-details').length).to.equal(this.customers.length);
                });
                describe('when clicking the "ADD STUDENT" button', function(){
                    beforeEach(function(){
                        $attendanceList.find('.create-item').trigger('click');
                    });
                    it('should hide the student list', function(){
                        expect($attendanceList.find('.student-list').hasClass('ng-hide')).to.be.true;
                    });
                    it('should show the customer list', function(){
                        expect($attendanceList.find('.customer-list').hasClass('ng-hide')).to.be.false;
                    });
                    describe('and then clicking the back arrow', function(){
                        beforeEach(function(){
                            $attendanceList.find('.back-arrow').trigger('click');
                        });
                        it('should hide the customer list', function(){ 
                            expect($attendanceList.find('.customer-list').hasClass('ng-hide')).to.be.true;
                        });
                        it('should show the student list', function(){
                            expect($attendanceList.find('.student-list').hasClass('ng-hide')).to.be.false;
                        });
                    });
                });
            });
        });
        describe('when filtering the calendar by coach', function(){
            var $coachSelector, fullCalendarSpy;
            beforeEach(function(){
                fullCalendarSpy = this.sinon.spy($.fn, 'fullCalendar');

                $coachSelector = $testRegion.find('.coach-list select').val(this.coachTwo.id);
                angular.element($coachSelector).triggerHandler('change');
                $timeout.flush();
            });
            it('should attempt to refetch all events', function(){
                expect(fullCalendarSpy).to.be.calledWith('refetchEvents');
            });
            it('should make a call to the API with the new coach ID', function(){
                var getSessionsParams = {
                    startDate: sessionCalendar.fullCalendar('getView').start.clone().format('YYYY-MM-DD'),
                    endDate: sessionCalendar.fullCalendar('getView').end.clone().format('YYYY-MM-DD'),
                    locationId: '',
                    coachId: this.coachTwo.id,
                    section: 'Sessions',
                    useNewSearch: true
                };
                expect(getSessionsStub).to.be.calledWith(getSessionsParams);
            });
        });
        describe('when filtering the calendar by location', function(){
            var $locationSelector, fullCalendarSpy;
            beforeEach(function(){
                fullCalendarSpy = this.sinon.spy($.fn, 'fullCalendar');

                $locationSelector = $testRegion.find('.location-list select').val(this.locationTwo.id);
                angular.element($locationSelector).triggerHandler('change');
                $timeout.flush();
            });
            it('should attempt to refetch all events', function(){
                expect(fullCalendarSpy).to.be.calledWith('refetchEvents');
            });
            it('should make a call to the API with the new location ID', function(){
                var getSessionsParams = {
                    startDate: sessionCalendar.fullCalendar('getView').start.clone().format('YYYY-MM-DD'),
                    endDate: sessionCalendar.fullCalendar('getView').end.clone().format('YYYY-MM-DD'),
                    locationId: this.locationTwo.id,
                    coachId: '',
                    section: 'Sessions',
                    useNewSearch: true
                };
                expect(getSessionsStub).to.be.calledWith(getSessionsParams);
            });
        });
        describe('when changing the calendar view', function(){
            describe('to month view', function(){
                beforeEach(function(){
                    getSessionsStub.restore();
                    getSessionsStub = this.sinon.stub(coachSeekAPIService, 'get', function(){
                        return {$promise: self.sessionsPromise}
                    });

                    $calendar.find('.fc-month-button').trigger('click');
                    $timeout.flush();
                });
                // don't really need to test this but whatever
                it('should change the view', function(){
                    expect($calendar.find('.fc-view').hasClass('fc-month-view')).to.be.true;
                });
                it('should GET a new month', function(){
                    var getSessionsParams = {
                        startDate: sessionCalendar.fullCalendar('getView').start.clone().format('YYYY-MM-DD'),
                        endDate: sessionCalendar.fullCalendar('getView').end.clone().format('YYYY-MM-DD'),
                        locationId: '',
                        coachId: '',
                        section: 'Sessions',
                        useNewSearch: true
                    };
                    expect(getSessionsStub).to.be.calledWith(getSessionsParams);
                });
                it('should NOT add the location to the session content', function(){
                    expect($calendar.find('.fc-location').first().text()).to.equal('');
                });
                describe('and then to a new month', function(){
                    beforeEach(function(){
                        getSessionsStub.restore();
                        getSessionsStub = this.sinon.stub(coachSeekAPIService, 'get', function(){
                            return {$promise: self.nextMonthSessionsPromise}
                        });

                        $calendar.find('.fc-next-button').trigger('click');
                        $timeout.flush();
                    });
                    it('should GET a new month', function(){
                        var getSessionsParams = {
                            startDate: sessionCalendar.fullCalendar('getView').start.clone().format('YYYY-MM-DD'),
                            endDate: sessionCalendar.fullCalendar('getView').end.clone().format('YYYY-MM-DD'),
                            locationId: '',
                            coachId: '',
                            section: 'Sessions',
                            useNewSearch: true
                        };
                        expect(getSessionsStub).to.be.calledWith(getSessionsParams);
                    });
                    it('should load as many sessions that are returned in sessions GET', function(){
                        // This won't work if view is changed or repeat frequncy is set to w
                        // because the sessions may not be in the range of the calendar view
                        // so it has not rendered them
                        expect($testRegion.find('.fc-content').length).to.equal(this.sessionObject.sessions.length + this.sessionObject.courses[0].sessions.length);
                    });
                    describe('and then switching to `today`', function(){
                        beforeEach(function(){
                            getSessionsStub.restore();
                            getSessionsStub = this.sinon.stub(coachSeekAPIService, 'get', function(){
                                return {$promise: self.nextMonthSessionsPromise}
                            });

                            $calendar.find('.fc-today-button').trigger('click');
                            $timeout.flush();
                        });
                        it('shouldnt make a call to GET sessions', function(){
                            var getSessionsParams = {
                                startDate: sessionCalendar.fullCalendar('getView').start.clone().format('YYYY-MM-DD'),
                                endDate: sessionCalendar.fullCalendar('getView').end.clone().format('YYYY-MM-DD'),
                                locationId: '',
                                coachId: '',
                                section: 'Sessions',
                                useNewSearch: true
                            };
                            expect(getSessionsStub).to.be.calledWith(getSessionsParams);
                        });
                    });
                    describe('and then switching to `week`', function(){
                        beforeEach(function(){
                            getSessionsStub.restore();
                            getSessionsStub = this.sinon.stub(coachSeekAPIService, 'get');

                            $calendar.find('.fc-agendaWeek-button').trigger('click');
                            $timeout.flush();
                        });
                        it('shouldnt NOT make a call to GET sessions (this month already GOTten)', function(){
                            expect(getSessionsStub).to.not.be.called;
                        });
                    });
                });
            });
            describe('to day view', function(){
                beforeEach(function(){
                    getSessionsStub.restore();
                    getSessionsStub = this.sinon.stub(coachSeekAPIService, 'get');

                    $calendar.find('.fc-agendaDay-button').trigger('click');
                    $timeout.flush();
                });
                // don't really need to test this but whatever
                it('should change the view', function(){
                    expect($calendar.find('.fc-view').hasClass('fc-agendaDay-view')).to.be.true;
                });
                it('shouldnt NOT make a call to GET sessions (this month already GOTten)', function(){
                    expect(getSessionsStub).to.not.be.called;
                });
                it('should add the location to the session content', function(){
                    expect($calendar.find('.fc-location').first().text()).to.equal(this.location.name);
                });
                describe('and then switching it back to week view', function(){
                    beforeEach(function(){
                        $calendar.find('.fc-agendaWeek-button').trigger('click');
                        $timeout.flush();
                    });
                    // don't really need to test this but whatever
                    it('should change the view', function(){
                        expect($calendar.find('.fc-view').hasClass('fc-agendaWeek-view')).to.be.true;
                    });
                    it('shouldnt NOT make a call to GET sessions (this month already GOTten)', function(){
                        expect(getSessionsStub).to.not.be.called;
                    });
                    it('should add the location to the session content', function(){
                        expect($calendar.find('.fc-location').first().text()).to.equal(this.location.name);
                    });
                });
                describe('and then switching it to month view', function(){
                    beforeEach(function(){
                        getSessionsStub.restore();
                        getSessionsStub = this.sinon.stub(coachSeekAPIService, 'get', function(){
                            return {$promise: self.nextMonthSessionsPromise}
                        });

                        $calendar.find('.fc-month-button').trigger('click');
                        $timeout.flush();
                    });
                    // // don't really need to test this but whatever
                    it('should change the view', function(){
                        expect($calendar.find('.fc-view').hasClass('fc-month-view')).to.be.true;
                    });
                    it('should GET a new month', function(){
                        var getSessionsParams = {
                            startDate: sessionCalendar.fullCalendar('getView').start.clone().format('YYYY-MM-DD'),
                            endDate: sessionCalendar.fullCalendar('getView').end.clone().format('YYYY-MM-DD'),
                            locationId: '',
                            coachId: '',
                            section: 'Sessions',
                            useNewSearch: true
                        };
                        expect(getSessionsStub).to.be.calledWith(getSessionsParams);
                    });
                    it('should NOT add the location to the session content', function(){
                        expect($calendar.find('.fc-location').first().text()).to.equal('');
                    });
                });
            });
        });
        describe('when toggling the service drawer', function(){
            beforeEach(function(){
                $servicesList.find('.toggle-service-drawer').trigger('click');
            });
            it('should hide the service list', function(){
                expect($servicesList.hasClass('closed')).to.be.true;
            });
        });

        // describe('when dragging a service from the list to the calendar', function(){

        //     beforeEach(function(){
        //         $firstService.simulate('drag');
        //         // $(document).trigger('dragstop')
        //         // console.log('here')
        //         // $(document).trigger('dragstart');
        //         // var drop = jQuery.Event( "dragstop", {dataService: this.serviceOne});

        //         // $calendar.find('.fc-view').trigger(drop);
        //     });
        //     describe('and the date saves', function(){
        //         it('should add the event to the calendar', function(){

        //         });
        //     });

        //     describe('and the event does NOT save', function(){
        //         it('shold not add the event to the calendar', function(){

        //         });
        //     })
        // });
        // describe('when dragging a service from the list and dropping outside the calendar', function(){

        // });
    });
});