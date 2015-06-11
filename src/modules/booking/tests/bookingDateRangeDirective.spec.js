describe('Booking Date Range Directive', function(){
    let('booking', function(){
        return {
            sessions: this.sessions,
            course: this.course
        }
    });

    let('sessions', function(){
        return [];
    });

    let('course', function(){
        return null;
    });

    let('startDate', function(){
        return moment();
    });
    beforeEach(function(){
        scope = $rootScope.$new();
        $injector.get("currentBooking").booking = this.booking;
        createDirective(scope, '<booking-date-range></booking-date-range>');
        $bookingDateRange = $testRegion.find('p');
    });
    describe('when nothing is selected', function(){
        it('should display nothing', function(){
            expect($bookingDateRange.text()).to.equal('')
        });
    });
    describe('when a course is selected', function(){
        describe('and all the sessions are in the future', function(){
            let('sessions', function(){
                var sessions = [];
                _.times(3, function(index){
                    sessions.push({
                        timing: {
                            startDate: moment().add(index + 1, 'day').format('YYYY-MM-DD'),
                            startTime: '12:00'
                        }
                    });
                });
                return sessions;
            });

            let('course', function(){
                return {
                    timing: {
                        startDate: moment().add(1, 'day').format('YYYY-MM-DD'),
                        startTime: '12:00'
                    },
                    repetition: {
                        sessionCount: 3,
                        repeatFrequency: 'd'
                    }
                }
            });

            it('should display the correct range', function(){
                var startDate = moment().add(1, 'day').format('dddd Do MMM');
                var endDate = moment().add(3, 'day').format('dddd Do MMM');
                expect($bookingDateRange.text()).to.equal(startDate + ' – ' + endDate)
            });
        });
        describe('and some of the session are in the past', function(){
            let('sessions', function(){
                var sessions = [];
                _.times(3, function(index){
                    sessions.push({
                        timing: {
                            startDate: moment().add(index - 1, 'day').format('YYYY-MM-DD'),
                            startTime: '12:00'
                        }
                    });
                });
                return sessions;
            });

            let('course', function(){
                return {
                    timing: {
                        startDate: moment().add(-1, 'day').format('YYYY-MM-DD'),
                        startTime: '12:00'
                    },
                    repetition: {
                        sessionCount: 3,
                        repeatFrequency: 'd'
                    }
                }
            });

            it('should display the correct range', function(){
                var startDate = moment().add(-1, 'day').format('dddd Do MMM');
                var endDate = moment().add(1, 'day').format('dddd Do MMM');
                expect($bookingDateRange.text()).to.equal(startDate + ' – ' + endDate)
            });
        });
        describe('and the course is a session', function(){
            let('sessions', function(){
                return [];
            });
            let('course', function(){
                return {
                    timing: {
                        startDate: moment().add(1, 'day').format('YYYY-MM-DD'),
                        startTime: '12:00'
                    },
                    repetition: {
                        sessionCount: 1
                    }
                }
            });
            it('should display a single date', function(){
                var startDate = moment().add(1, 'day').format('dddd Do MMM');
                expect($bookingDateRange.text()).to.equal(startDate);
            });
        });

    });
    describe('when individual sessions are selected', function(){
        let('course', function(){
            return null;
        });

        describe('when there are multiple sessions', function(){
            let('sessions', function(){
                var sessions = [];
                _.times(7, function(index){
                    sessions.push({
                        timing: {
                            startDate: moment().add(index, 'day').format('YYYY-MM-DD'),
                            startTime: '12:00'
                        }
                    });
                });
                return _.shuffle(sessions);
            });
            it('should display the correct date range', function(){
                var startDate = moment().format('dddd Do MMM');
                var endDate = moment().add(6, 'day').format('dddd Do MMM');
                expect($bookingDateRange.text()).to.equal(startDate + ' – ' + endDate)
            });
        });
        describe('when there is one sessions', function(){
            let('sessions', function(){
                var sessions = [];
                _.times(1, function(index){
                    sessions.push({
                        timing: {
                            startDate: moment().add(index, 'day').format('YYYY-MM-DD'),
                            startTime: '12:00'
                        }
                    });
                });
                return sessions;
            });
            it('should display the correct date range', function(){
                var startDate = moment().format('dddd Do MMM');
                expect($bookingDateRange.text()).to.equal(startDate)
            });
        });
    });
});
