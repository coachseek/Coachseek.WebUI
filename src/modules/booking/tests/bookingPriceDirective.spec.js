describe('Booking Price Directive', function(){
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

    beforeEach(function(){
        scope = $rootScope.$new();
        scope.business = {
            currency: "USD"
        }
        scope.availableSessions = this.booking.sessions;

        $injector.get("currentBooking").booking = this.booking;
        createDirective(scope, '<booking-price></booking-price>');
        $bookingPrice = $testRegion.find('booking-price h4');
    });
    describe('when nothing is selected', function(){
        it('should return $0.00 USD', function(){
            expect($bookingPrice.text()).to.contain('0.00 ' + scope.business.currency);
        });
    });
    describe('when a course is selected', function(){
        describe('and it is a single session', function(){
            let('sessions', function(){
                return null;
            });

            let('course', function(){
                return {
                    pricing: {
                        sessionPrice: 10
                    },
                    timing: {
                        startDate: moment().add(1, 'day').format('YYYY-MM-DD'),
                        startTime: '12:00'
                    },
                    sessions: this.sessions
                }
            });
            it('should show a the session price', function(){
                expect($bookingPrice.text()).to.contain('10.00 ' + scope.business.currency);
            });
        });
        describe('and the course has already started', function(){
            let('sessions', function(){
                var sessions = [];
                _.times(3, function(index){
                    sessions.push({
                        timing: {
                            startDate: moment().add(index, 'day').format('YYYY-MM-DD'),
                            startTime: '12:00'
                        }
                    });
                });
                return sessions;
            });

            describe('and there is only a course price', function(){
                let('course', function(){
                    return {
                        pricing: {
                            coursePrice: 10
                        },
                        timing: {
                            startDate: moment().format('YYYY-MM-DD'),
                            startTime: '12:00'
                        },
                        repetition: {
                            sessionCount: 3
                        },
                        sessions: this.sessions
                    }
                });

                describe('and some sessions are in the past', function(){
                    it('should show the prorated course price', function(){
                        expect($bookingPrice.text()).to.contain('6.67 ' + scope.business.currency);
                    });
                });
            });
            describe('when a sessionPrice exists', function(){
                let('course', function(){
                    return {
                        pricing: {
                            sessionPrice: 5
                        },
                        timing: {
                            startDate: moment().add(-1, 'day').format('YYYY-MM-DD'),
                            startTime: '12:00'
                        },
                        sessions: this.sessions
                    }
                });
                it('should add together the sessions prices', function(){
                    expect($bookingPrice.text()).to.contain('15.00 ' + scope.business.currency);
                });
            });
        });
        describe('when the course is in the future', function(){
            describe('and there is a coursePrice', function(){
                let('course', function(){
                    return {
                        pricing: {
                            coursePrice: 10
                        },
                        timing: {
                            startDate: moment().add(1, 'day').format('YYYY-MM-DD'),
                            startTime: '12:00'
                        },
                        repetition: {
                            sessionCount: 3
                        },
                        sessions: this.sessions
                    }
                });

                it('should return the coursePrice', function(){
                    expect($bookingPrice.text()).to.contain('10.00 ' + scope.business.currency);
                });
            });
            describe('and there is no coursePrice', function(){
                let('sessions', function(){
                    return [{}, {}, {}]
                });
                let('course', function(){
                    return {
                        pricing: {
                            sessionPrice: 10
                        },
                        timing: {
                            startDate: moment().add(1, 'day').format('YYYY-MM-DD'),
                            startTime: '12:00'
                        },
                        repetition: {
                            sessionCount: 3
                        },
                        sessions: this.sessions
                    }
                });

                it('should return the accumulated session prices', function(){
                    expect($bookingPrice.text()).to.contain('30.00 ' + scope.business.currency);
                });
            });
        });
    });
    describe('when only sessions are selected', function(){
        let('sessions', function(){
            var sessions = [];
            _.times(3, function(index){
                sessions.push({
                    timing: {
                        startDate: moment().add(index + 1, 'day').format('YYYY-MM-DD'),
                        startTime: '12:00'
                    },
                    pricing: {
                        sessionPrice: 10
                    }
                });
            });
            return sessions;
        });

        let('course', function(){
            return null;
        });
        it('should add up session prices', function(){
            expect($bookingPrice.text()).to.contain('30.00 ' + scope.business.currency);
        });
    });
});