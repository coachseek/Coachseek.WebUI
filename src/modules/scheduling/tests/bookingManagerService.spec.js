describe('Booking Manager Services', function(){
    let('customer', function(){
        return {
            id: 'customer_0'
        }
    });

    let('sessions', function(){
        var sessions = [];
        _.times(2, function(index){
            sessions.push({
                id: 'session_' + index,
                service: {
                    name: 'i mean whatever, bro'
                },
                booking: {
                    bookings : [{
                        id: 'session_booking_0',
                        parentId: 'course_booking_0'
                    }, {
                        id: 'session_booking_1',
                        parentId: 'course_booking_0'
                    }]
                }
            });
        });
        return sessions;
    });

    let('course', function(){
        return {
            id: 'course_0',
            sessions: this.sessions
        }
    })

    let('currentEvent', function(){
        return {
            course: this.course,
            session: this.sessions[0]
        }
    });

    let('getStubPromise', function(){
        var deferred = $q.defer();
        deferred.resolve(this.course);
        return {$promise: deferred.promise};
    });

    var bookingManager, uiCalendarConfig, saveStub, getStub, deleteStub;
    beforeEach(function(){
        var self = this;
        var coachSeekAPIService = $injector.get('coachSeekAPIService');
        bookingManager = $injector.get('bookingManager');
        $injector.get('currentEventService').event = this.currentEvent;

        saveStub = this.sinon.stub(coachSeekAPIService, 'save', function(){
            var deferred = $q.defer();
            deferred.resolve();
            return {$promise: deferred.promise};
        });

        getStub = this.sinon.stub(coachSeekAPIService, 'get', function(){
            return self.getStubPromise
        });

        deleteStub = this.sinon.stub(coachSeekAPIService, 'delete', function(){
          var deferred = $q.defer();
          deferred.resolve();
          return {$promise: deferred.promise};
        })

        var scope = $rootScope.$new();
        _.assign(scope, {
            events: [],
            uiConfig: {}
        })
        createDirective(scope, '<div ui-calendar="uiConfig.calendar" ng-model="events" calendar="sessionCalendar"></div>')
    });
    describe('when adding a student to a course', function(){
        beforeEach(function(){
            bookingManager.addToCourse(this.customer);
            $rootScope.$apply();
        });
        it('should attempt to add the customer to the course', function(){
            expect(saveStub).to.be.calledWith({section: 'Bookings'}, {
                sessions: this.sessions,
                customer: this.customer
            });
        });
        describe('when adding the customer is successful', function(){
            it('should attempt to get the updated course', function(){
                expect(getStub).to.be.calledWith({section: 'Sessions', id: this.course.id})
            });
        });
    });
    describe('when adding a student to a single session', function(){
        let('currentEvent', function(){
            return {
                session: this.sessions[1]
            }
        });

        let('getStubPromise', function(){
            var deferred = $q.defer();
            deferred.resolve(self.session[1]);
            return {$promise: deferred.promise};
        });

        var session;
        beforeEach(function(){
            session = this.sessions[1];
            bookingManager.addToSession(this.customer, session.id);
            $rootScope.$apply();
        });
        it('should attempt to add the customer to the session', function(){
            expect(saveStub).to.be.calledWith({section: 'Bookings'}, {
                sessions: [{id:session.id}],
                customer: this.customer
            });
        });
        describe('when adding the customer is successful', function(){
            it('should attempt to get the updated session', function(){
                expect(getStub).to.be.calledWith({section: 'Sessions', id: session.id})
            });
        });
    });
    describe('when removing a student from a course', function(){
        var bookings;
        beforeEach(function(){
            bookings = this.sessions[1].booking.bookings;
            bookingManager.removeFromCourse(bookings);
            $rootScope.$apply();
        });
        it('should call delete for each course booking', function(){
            _.each(bookings, function(booking){
                expect(deleteStub).to.be.calledWith({section: 'Bookings', id: booking.parentId});
            })
        });
        describe('when deleting the bookings is successful', function(){
            it('should attempt to get the updated course', function(){
                expect(getStub).to.be.calledWith({section: 'Sessions', id: this.course.id})
            });
        });
    });
    describe('when removing a student from a single session', function(){
        let('currentEvent', function(){
            return {
                session: this.sessions[1]
            }
        });

        var session, booking;
        beforeEach(function(){
            session = this.sessions[1];
            booking = session.booking.bookings[0];
            bookingManager.removeFromSession(booking.id);
            $rootScope.$apply();
        });
        it('should attempt to delete the booking', function(){
            expect(deleteStub).to.be.calledWith({section: 'Bookings', id: booking.id});
        });
        describe('when deleting the booking is successful', function(){
            it('should attempt to get the updated session', function(){
                expect(getStub).to.be.calledWith({section: 'Sessions', id: session.id})
            });
        });
    });
    describe('when calling updateBooking', function(){
        describe('when currentEvent is in a course', function(){
            var session, booking, updateCommand;
            beforeEach(function(){
                session = this.sessions[1];
                booking = session.booking.bookings[0];
                updateCommand = {fakeass: "weezy"};
                bookingManager.updateBooking(booking.id, updateCommand);
                $rootScope.$apply();
            });
            it('should attempt to update the booking', function(){
                expect(saveStub).to.be.calledWith({section: 'Bookings', id: booking.id}, updateCommand)
            });
            describe('when the update is successful', function(){
                it('should attempt to get the updated course', function(){
                    expect(getStub).to.be.calledWith({section: 'Sessions', id: this.course.id})
                });
            });
        });

        describe('when currentEvent is NOT in a course', function(){
            let('currentEvent', function(){
                return {
                    session: this.sessions[1]
                }
            });

            var session, booking, updateCommand;
            beforeEach(function(){
                session = this.sessions[1];
                booking = session.booking.bookings[0];
                updateCommand = {fakeass: "weezy"};
                bookingManager.updateBooking(booking.id, updateCommand);
                $rootScope.$apply();
            });
            it('should attempt to update the booking', function(){
                expect(saveStub).to.be.calledWith({section: 'Bookings', id: booking.id}, updateCommand)
            });
            describe('when the update is successful', function(){
                it('should attempt to get the updated session', function(){
                    expect(getStub).to.be.calledWith({section: 'Sessions', id: session.id})
                });
            });
        });
    });
});