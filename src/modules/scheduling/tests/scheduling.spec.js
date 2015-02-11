describe('Scheduling Module', function() {

    var templateUrl = 'scheduling/partials/schedulingView.html';
    describe('when navigating to scheduling', function(){
        var viewAttrs;
        beforeEach(function(){
            $state.go('scheduling');
            $rootScope.$digest();
        });
        it('should map to correct template', function(){
            expect($state.current.templateUrl).to.equal(templateUrl);
        });
        it('should map to the correct controller', function(){
            expect($state.current.controller).to.equal('schedulingCtrl');
        });
    });


    describe('when loading the calendar', function(){

        let('coach', function(){
            return {
                firstName: "Test",
                lastName: "User",
                email: "test@example.com",
                phone: "9090909"
            };
        });

        let('coaches', function(){
            return [this.coach];
        });

        let('coachesPromise', function(){
            var deferred = $q.defer();
            deferred.resolve(this.coaches);
            return deferred.promise;
        });

        let('location', function(){
            return {
                name: "Test",
                description: "Location"
            };
        });

        let('locations', function(){
            return [this.location];
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
                service: this.serviceOne,
                location: this.location,
                coach: this.coach,
                timing: {
                    duration: this.serviceOne.duration,
                    startTime: this.dateOne.format('HH:mm'),
                    startDate: this.dateOne.format('YYYY-MM-DD')
                },
                repetition: this.serviceOne.repetition
            }
        });

        let('sessionTwo', function(){
            return {
                service: this.serviceTwo,
                location: this.location,
                coach: this.coach,
                timing: {
                    duration: this.serviceTwo.duration,
                    startTime: this.dateTwo.format('HH:mm'),
                    startDate: this.dateTwo.format('YYYY-MM-DD')
                },
                repetition: this.serviceTwo.repetition
            }
        });

        let('sessionThree', function(){
            return {
                service: this.serviceOne,
                location: this.location,
                coach: this.coach,
                timing: {
                    duration: this.serviceOne.duration,
                    startTime: this.dateThree.format('HH:mm'),
                    startDate: this.dateThree.format('YYYY-MM-DD')
                },
                repetition: this.serviceOne.repetition
            }
        });

        let('sessions', function(){
            return [this.sessionOne, this.sessionTwo];
        });

        let('nextMonthSessions', function(){
            return [this.sessionThree];
        });

        let('sessionsPromise', function(){
            var deferred = $q.defer();
            deferred.resolve(this.sessions);
            return deferred.promise;
        });

        let('nextMonthSessionsPromise', function(){
            var deferred = $q.defer();
            deferred.resolve(this.nextMonthSessions);
            return deferred.promise;
        });

        var getStub,
            self,
            $servicesList,
            $firstService,
            $calendar,
            scope,
            coachSeekAPIService;

        beforeEach(function(){
            self = this;

            coachSeekAPIService = $injector.get('coachSeekAPIService');
            scope = $rootScope.$new();

            getStub = this.sinon.stub(coachSeekAPIService, 'get', function(param){
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
                    case 'Sessions':
                        return {$promise: self.sessionsPromise};
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
            $servicesList = $testRegion.find('.services-list');
            $firstService = $servicesList.find('.service-details').first();

            // must render here or calendar does nothing because of elementVisible()
            // function on 7212 of fullcalendar.js
            $calendar.fullCalendar('render')
            // fuuuuuuuck. this has to be here because all event listeners have a $timeout
            // attached to them and the tests do not wait. could possibly use done() instead?
            $timeout.flush();
        });
        describe('when sessions are loading', function(){
            let('sessionsPromise', function(){
                return $q.defer().promise;
            });
            it('should show the loading view', function(){
                expect($testRegion.find('.calendar-loading').hasClass('ng-hide')).to.be.false;
            });
        });
        describe('while services are loading', function(){
            let('servicesPromise', function(){
                return $q.defer().promise;
            });
            it('should not allow the calendar to exist', function(){
                expect($calendar.length).to.equal(0);
            });
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
            expect(scope.calendarView.name).to.equal('agendaWeek');
            expect($calendar.find('.fc-view').hasClass('fc-agendaWeek-view')).to.be.true;
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
                    startDate: scope.calendarView.intervalStart.clone().startOf('month').format('YYYY-MM-DD'),
                    endDate: scope.calendarView.intervalStart.clone().endOf('month').format('YYYY-MM-DD'),
                    locationId: '',
                    coachId: '',
                    section: 'Sessions'
                };
                expect(getStub).to.be.calledWith(getSessionsParams);
            });
            it('should load as many sessions that are returned in sessions GET', function(){
                // This won't work if view is changed or repeat frequncy is set to w
                // because the sessions may not be in the range of the calendar view
                // so it has not rendered them
                var numSessions  = 0;
                _.forEach(this.sessions, function(session){
                    numSessions += session.service.repetition.sessionCount;
                });

                expect($testRegion.find('.fc-content').length).to.equal(numSessions);
            });
        });
        describe('when changing the calendar view', function(){
            describe('to month view', function(){
                beforeEach(function(){
                    getStub.restore();
                    getStub = this.sinon.stub(coachSeekAPIService, 'get');

                    $calendar.find('.fc-month-button').trigger('click');
                    $timeout.flush();
                });
                // don't really need to test this but whatever
                it('should change the view', function(){
                    expect(scope.calendarView.name).to.equal('month');
                    expect($calendar.find('.fc-view').hasClass('fc-month-view')).to.be.true;
                });
                it('shouldnt NOT make a call to GET sessions (this month already GOTten)', function(){
                    expect(getStub).to.not.be.called;
                });
                describe('and then to a new month', function(){
                    beforeEach(function(){
                        getStub.restore();
                        getStub = this.sinon.stub(coachSeekAPIService, 'get', function(){
                            return {$promise: self.nextMonthSessionsPromise}
                        });

                        $calendar.find('.fc-next-button').trigger('click');
                        $timeout.flush();
                    });
                    it('should GET a new month', function(){
                        var getSessionsParams = {
                            startDate: scope.calendarView.intervalStart.clone().startOf('month').format('YYYY-MM-DD'),
                            endDate: scope.calendarView.intervalStart.clone().endOf('month').format('YYYY-MM-DD'),
                            locationId: '',
                            coachId: '',
                            section: 'Sessions'
                        };
                        expect(getStub).to.be.calledWith(getSessionsParams);
                    });
                    it('should load as many sessions that are returned in sessions GET', function(){
                        // This won't work if view is changed or repeat frequncy is set to w
                        // because the sessions may not be in the range of the calendar view
                        // so it has not rendered them
                        var numSessions  = 0;
                        _.forEach(this.nextMonthSessions, function(session){
                            numSessions += session.service.repetition.sessionCount;
                        });
                        expect($testRegion.find('.fc-content').length).to.equal(numSessions);
                    });
                    describe('and then switching to `today`', function(){
                        beforeEach(function(){
                            getStub.restore();
                            getStub = this.sinon.stub(coachSeekAPIService, 'get');

                            $calendar.find('.fc-today-button').trigger('click');
                            $timeout.flush();
                        });
                        it('shouldnt NOT make a call to GET sessions (this month already GOTten)', function(){
                            expect(getStub).to.not.be.called;
                        });
                    });
                });
            });
            describe('to day view', function(){
                beforeEach(function(){
                    getStub.restore();
                    getStub = this.sinon.stub(coachSeekAPIService, 'get');

                    $calendar.find('.fc-agendaDay-button').trigger('click');
                    $timeout.flush();
                });
                // don't really need to test this but whatever
                it('should change the view', function(){
                    expect(scope.calendarView.name).to.equal('agendaDay');
                    expect($calendar.find('.fc-view').hasClass('fc-agendaDay-view')).to.be.true;
                });
                it('shouldnt NOT make a call to GET sessions (this month already GOTten)', function(){
                    expect(getStub).to.not.be.called;
                });
                it('should add the description to the session content', function(){
                    expect($calendar.find('.fc-description').text()).to.equal(this.serviceOne.description);
                });
                describe('and then switching it back to week view', function(){
                    beforeEach(function(){
                        $calendar.find('.fc-agendaWeek-button').trigger('click');
                        $timeout.flush();
                    });
                    // don't really need to test this but whatever
                    it('should change the view', function(){
                        expect(scope.calendarView.name).to.equal('agendaWeek');
                        expect($calendar.find('.fc-view').hasClass('fc-agendaWeek-view')).to.be.true;
                    });
                    it('shouldnt NOT make a call to GET sessions (this month already GOTten)', function(){
                        expect(getStub).to.not.be.called;
                    });
                    it('should remove the description to the session content', function(){
                        expect($calendar.find('.fc-description').text()).to.equal('');
                    });
                });
                describe('and then switching it to month view', function(){
                    beforeEach(function(){
                        $calendar.find('.fc-month-button').trigger('click');
                        $timeout.flush();
                    });
                    // don't really need to test this but whatever
                    it('should change the view', function(){
                        expect(scope.calendarView.name).to.equal('month');
                        expect($calendar.find('.fc-view').hasClass('fc-month-view')).to.be.true;
                    });
                    it('shouldnt NOT make a call to GET sessions (this month already GOTten)', function(){
                        expect(getStub).to.not.be.called;
                    });
                    it('should remove the description to the session content', function(){
                        expect($calendar.find('.fc-description').text()).to.equal('');
                    });
                });
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