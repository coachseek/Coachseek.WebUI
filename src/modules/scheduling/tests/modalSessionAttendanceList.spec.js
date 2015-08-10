describe('modalSessionAttendanceList directive', function(){

    let('currentEvent', function(){
        return {
            _id: 'eventOne_id',
            session: this.sessionOne
        };
    });

    let('eventTwo', function(){
        return {
            _id: 'eventTwo_id',
            session: this.sessionTwo,
            course: this.course
        }
    });

    let('sessionOne', function(){
        return {
            id: 'session_one',
            booking: {
                bookings: this.sessionOneBookings
            },
            service: {
                name: 'service name'
            }
        };
    });

    let('sessionOneBookings', function(){
        return [this.sessionBookingOne]
    });

    let('sessionBookingOne', function(){
        return {
            customer: {id: 'one'},
            parentId: "course_booking_id"
        };
    });

    let('sessionTwo', function(){
        return {
            id: 'session_two',
            booking: {
                bookings: [this.sessionBookingTwo]
            },
            service: {
                name: 'service name'
            }
        };
    });

    let('sessionBookingTwo', function(){
        return {
            customer: {id: 'one'},
            parentId: "course_booking_id"
        };
    });

    let('course', function(){
        return {
            id: 'course_one',
            booking: {
                bookings: this.courseBookings
            },
            service: {
                name: 'service name'
            },
            sessions: [this.sessionOne, this.sessionTwo]
        }
    });

    let('customerOne', function(){
        return {
            id: 'one',
            firstName: 'Dude',
            lastName: 'Guy'
        }
    })

    let('queryCustomersPromise', function(){
        var deferred = $q.defer();
        deferred.resolve([this.customerOne]);
        return deferred.promise;
    });

    let('getSessionPromise', function(){
        var deferred = $q.defer();
        deferred.resolve(this.sessionOne);
        return deferred.promise;
    });

    let('updatePromise', function(){
        return $q.defer().promise;
    });

    let('currentCourseEvents', function(){
        return [this.currentEvent, this.eventTwo]
    });

    var scope,
        self,
        $studentList,
        $customerList,
        queryCustomersStub,
        fullCalendarStub;
    beforeEach(function(){
        self = this;
        scope = $rootScope.$new();
        self.sessionOneBookings = this.sessionOneBookings;
        scope.currentEvent = this.currentEvent;
        self.sessionBookingTwo = this.sessionBookingTwo;
        scope.currentCourseEvents = this.currentCourseEvents;

        queryCustomersStub = this.sinon.stub($injector.get('coachSeekAPIService'), 'query', function(){
            return {$promise: self.queryCustomersPromise};
        });
        var fullCalendar = $injector.get('uiCalendarConfig').calendars;
        fullCalendar.sessionCalendar = {
            fullCalendar: function(){}
        }
        fullCalendarStub = this.sinon.stub($injector.get('uiCalendarConfig').calendars.sessionCalendar, 'fullCalendar', function(){
            return [{}];
        });

        createDirective(scope, '<modal-session-attendance-list></modal-session-attendance-list>');
        $studentList = $testRegion.find('.student-list');
        $customerList = $testRegion.find('.customer-list');
    });

    it('should attempt to get current customers', function(){
        expect(queryCustomersStub).to.be.calledWith({section: 'Customers'});
    });
    it('should show the student list', function(){
        expect($studentList.hasClass('ng-hide')).to.be.false;
    });
    it('should hide the customer list', function(){
        expect($customerList.hasClass('ng-hide')).to.be.true;
    });
    it('should hide no customers message', function(){
        expect($testRegion.find('.no-customers').hasClass('ng-hide')).to.be.true;
    });
    describe('if there are no customers', function(){
        let('queryCustomersPromise', function(){
            var deferred = $q.defer();
            deferred.resolve([]);
            return deferred.promise;
        });
        it('should show no customers message', function(){
            expect($testRegion.find('.no-customers').hasClass('ng-hide')).to.be.false;
        });
    });
    describe('when showing the customer list', function(){
        var updateBookingStub, getSessionStub, $modalCustomerDetails, studentScope;
        beforeEach(function(){
            self = this;
            self.updatePromise = this.updatePromise;
            self.getSessionPromise = this.getSessionPromise;

            updateBookingStub = this.sinon.stub($injector.get('coachSeekAPIService'), 'save', function(){
                return {$promise: self.updatePromise};
            });

            getSessionStub = this.sinon.stub($injector.get('coachSeekAPIService'), 'get', function(){
                return {$promise: self.getSessionPromise}
            });

            updateStandaloneSpy = this.sinon.spy(scope, 'updateStandaloneSession');

            $testRegion.find('.show-customer-list').trigger('click');
            $modalCustomerDetails = $testRegion.find('modal-customer-details');
            studentScope = angular.element($testRegion.find('modal-customer-details').first()).scope();
        });
        it('should hide the student list', function(){
            expect($studentList.hasClass('ng-hide')).to.be.true;
        });
        it('should show the customer list', function(){
            expect($customerList.hasClass('ng-hide')).to.be.false;
        });
        describe('when the currentEvent is NOT in a course', function(){
            let('currentCourseEvents', function(){
                return undefined
            });

            it('should NOT show the add to course column', function(){
                expect($modalCustomerDetails.find('.add-student.to-course').length).to.equal(0);
            });
            describe('when session bookings[] contains the customer', function(){
                it('should set the isSessionStudent flag to truthy', function(){
                    expect(studentScope.isSessionStudent).to.be.ok;
                });
                it('should disable the add to session/course buttons', function(){
                    expect($modalCustomerDetails.find('li.customer-details').first().attr('disabled')).to.equal('disabled')
                })
            });
            describe('when session bookings[] does not contain the customer', function(){
                    let('sessionBookingOne', function(){
                        return {
                            customer: {id: 'two'},
                            parentId: "course_booking_id"
                        };
                    });

                it('should set the isSessionStudent flag to falsy', function(){
                    expect(studentScope.isSessionStudent).to.not.be.ok;
                });
                it('should NOT disable the add to session/course buttons', function(){
                    expect($modalCustomerDetails.find('li.customer-details').first().attr('disabled')).to.equal(undefined)
                })

                describe('when clicking addStudent to session', function(){
                    var self, $addStudent;
                    beforeEach(function(){
                        $addStudent = $modalCustomerDetails.find('.add-student.to-session');
                        $addStudent.trigger('click');
                    });
                    it('should call update method', function(){
                        var bookingObject = {
                            sessions: [{
                                id: this.currentEvent.session.id,
                                name: this.currentEvent.session.service.name
                            }],
                            customer: {
                                id: this.customerOne.id,
                                firstName: this.customerOne.firstName,
                                lastName: this.customerOne.lastName
                            }
                        }
                        expect(updateBookingStub).to.be.calledWith({section: 'Bookings'}, bookingObject);
                    });
                    describe('while loading', function(){
                        it('should set bookingLoading to true', function(){
                            expect(studentScope.bookingLoading).to.be.true;
                        });
                        it('should hide the button', function(){
                            expect($addStudent.hasClass('ng-hide')).to.be.true;
                        });
                        it('should show the loading ellipsis', function(){
                            expect($modalCustomerDetails.find('ellipsis-animated').hasClass('ng-hide')).to.be.false;
                        });
                        it('should set isSessionStudent to falsy', function(){
                            expect(studentScope.isSessionStudent).to.not.be.ok;
                        })
                    });
                    describe('when update is successful', function(){
                        let('updatePromise', function(){
                            var deferred = $q.defer();
                            deferred.resolve(this.sessionBookingOne);
                            return deferred.promise;
                        });

                        it('should attempt to get/set fullCalendar event', function(){
                            expect(updateStandaloneSpy).to.be.calledOnce;
                            expect(fullCalendarStub).to.be.calledWith('clientEvents', this.currentEvent._id);
                        });
                        it('should show the add student button', function(){
                            expect($addStudent.hasClass('ng-hide')).to.be.false;
                        });
                        it('should hide the loading ellipsis', function(){
                            expect($modalCustomerDetails.find('ellipsis-animated').hasClass('ng-hide')).to.be.true;
                        });
                        it('should set bookingLoading to false', function(){
                            expect(studentScope.bookingLoading).to.be.false;
                        });
                    });
                    describe('when update fails', function(){
                        let('updatePromise', function(){
                            var deferred = $q.defer();
                            deferred.reject({data: {message:"error-message"}});
                            return deferred.promise;
                        });
                        it('should show the add student button', function(){
                            expect($addStudent.hasClass('ng-hide')).to.be.false;
                        });
                        it('should hide the loading ellipsis', function(){
                            expect($modalCustomerDetails.find('ellipsis-animated').hasClass('ng-hide')).to.be.true;
                        });
                        it('should set bookingLoading to false', function(){
                            expect(studentScope.bookingLoading).to.be.false;
                        });
                        it('should show an error message', function(){
                            expect($rootScope.alerts[0].type).to.equal('danger');
                            expect($rootScope.alerts[0].message).to.equal('error-message');
                        });
                        it('should set isSessionStudent to falsy', function(){
                            expect(studentScope.isSessionStudent).to.not.be.ok;
                        })
                    });
                });
            });
        });
        describe('when currentEvent is in a course', function(){

            let('currentEvent', function(){
                return {
                    session: self.sessionOne,
                    course: self.course
                };
            });

            it('should show the add to course column', function(){
                expect($modalCustomerDetails.find('.add-student.to-course').length).to.equal(1);
            });

            describe('when booking is NOT part of a course booking', function(){

                let('sessionTwo', function(){
                    return {
                        id: 'session_two',
                        booking: {
                            bookings: []
                        },
                        service: {
                            name: 'service name'
                        }
                    };
                });

                it('should set the isSessionStudent flag to truthy', function(){
                    expect(studentScope.isSessionStudent).to.be.ok;
                });
                it('should set the isCourseStudent flag to falsy', function(){
                    expect(studentScope.isCourseStudent).to.not.be.ok;
                });
            });

            describe('when booking is part of a course booking', function(){
                it('should set the isSessionStudent flag to falsy', function(){
                    expect(studentScope.isSessionStudent).to.not.be.ok;
                });
                it('should set the isCourseStudent flag to truthy', function(){
                    expect(studentScope.isCourseStudent).to.be.ok;
                });
                it('should disable the add to session/course buttons', function(){
                    expect($modalCustomerDetails.find('li.customer-details').first().attr('disabled')).to.equal('disabled')
                })
            });

            describe('when the currentEvent has no bookings', function(){
                let('sessionOneBookings', function(){
                    return []
                });

                it('should set the isSessionStudent and isCourseStudent flags to falsy', function(){
                    expect(studentScope.isSessionStudent).to.not.be.ok;
                    expect(studentScope.isCourseStudent).to.not.be.okay;
                });
                it('should NOT disable the add to session/course buttons', function(){
                    expect($modalCustomerDetails.find('li.customer-details').first().attr('disabled')).to.equal(undefined)
                })
                describe('when clicking addStudent to session', function(){
                    var self, $addStudent;
                    beforeEach(function(){
                        $addStudent = $modalCustomerDetails.find('.add-student.to-session');
                        $addStudent.trigger('click');
                    });
                    it('should call update method', function(){
                        var bookingObject = {
                            sessions: [{
                                id: this.currentEvent.session.id,
                                name: this.currentEvent.session.service.name
                            }],
                            customer: {
                                id: this.customerOne.id,
                                firstName: this.customerOne.firstName,
                                lastName: this.customerOne.lastName
                            }
                        }
                        expect(updateBookingStub).to.be.calledWith({section: 'Bookings'}, bookingObject);
                    });
                    describe('while loading', function(){
                        it('should set bookingLoading to true', function(){
                            expect(studentScope.bookingLoading).to.be.true;
                        });
                        it('should hide the button', function(){
                            expect($addStudent.hasClass('ng-hide')).to.be.true;
                        });
                        it('should show the loading ellipsis', function(){
                            expect($modalCustomerDetails.find('ellipsis-animated').hasClass('ng-hide')).to.be.false;
                        });
                    });
                    describe('when update is successful', function(){
                        let('updatePromise', function(){
                            var deferred = $q.defer();
                            deferred.resolve(this.sessionBookingOne);
                            return deferred.promise;
                        });

                        let('sessionOneBookings', function(){
                            return [this.sessionBookingOne]
                        });

                        it('should attempt to get/set fullCalendar event', function(){
                            expect(updateStandaloneSpy).to.be.calledOnce;
                            expect(fullCalendarStub).to.be.calledWith('clientEvents', this.currentEvent._id);
                        });
                        it('should show the add student button', function(){
                            expect($addStudent.hasClass('ng-hide')).to.be.false;
                        });
                        it('should hide the loading ellipsis', function(){
                            expect($modalCustomerDetails.find('ellipsis-animated').hasClass('ng-hide')).to.be.true;
                        });
                        it('should set bookingLoading to false', function(){
                            expect(studentScope.bookingLoading).to.be.false;
                        });
                    });
                    describe('when update fails', function(){
                        let('updatePromise', function(){
                            var deferred = $q.defer();
                            deferred.reject({data: {message:"error-message"}});
                            return deferred.promise;
                        });
                        it('should show the add student button', function(){
                            expect($addStudent.hasClass('ng-hide')).to.be.false;
                        });
                        it('should hide the loading ellipsis', function(){
                            expect($modalCustomerDetails.find('ellipsis-animated').hasClass('ng-hide')).to.be.true;
                        });
                        it('should set bookingLoading to false', function(){
                            expect(studentScope.bookingLoading).to.be.false;
                        });
                        it('should show an error message', function(){
                            expect($rootScope.alerts[0].type).to.equal('danger');
                            expect($rootScope.alerts[0].message).to.equal('error-message');
                        });
                    });
                });

                describe('when clicking the add to course button', function(){
                    var updateCourseSpy, $addStudent;
                    beforeEach(function(){
                        updateCourseSpy = this.sinon.spy(scope, 'updateCourse');

                        $addStudent = $modalCustomerDetails.find('.add-student.to-course');
                        $addStudent.trigger('click');
                    });
                    it('should call update method', function(){
                        var bookingObject = {
                            sessions: this.course.sessions,
                            customer: {
                                id: this.customerOne.id,
                                firstName: this.customerOne.firstName,
                                lastName: this.customerOne.lastName
                            }
                        }
                        expect(updateBookingStub).to.be.calledWith({section: 'Bookings'}, bookingObject);
                    });
                    describe('while loading', function(){
                        it('should set bookingLoading to true', function(){
                            expect(studentScope.bookingLoading).to.be.true;
                        });
                        it('should hide the button', function(){
                            expect($addStudent.hasClass('ng-hide')).to.be.true;
                        });
                        it('should show the loading ellipsis', function(){
                            expect($modalCustomerDetails.find('ellipsis-animated').hasClass('ng-hide')).to.be.false;
                        });
                    });
                    describe('when update is successful', function(){
                        let('updatePromise', function(){
                            var deferred = $q.defer();
                            deferred.resolve(this.sessionBookingOne);
                            return deferred.promise;
                        });

                        it('should attempt to get/set fullCalendar event', function(){
                            expect(updateCourseSpy).to.be.calledOnce;
                            expect(fullCalendarStub).to.be.calledWith('clientEvents', this.currentEvent._id);
                            expect(fullCalendarStub).to.be.calledWith('clientEvents', this.eventTwo._id);
                        });
                        it('should show the add student button', function(){
                            expect($addStudent.hasClass('ng-hide')).to.be.false;
                        });
                        it('should hide the loading ellipsis', function(){
                            expect($modalCustomerDetails.find('ellipsis-animated').hasClass('ng-hide')).to.be.true;
                        });
                    });
                    describe('when update fails', function(){
                        let('updatePromise', function(){
                            var deferred = $q.defer();
                            deferred.reject({data: {message:"error-message"}});
                            return deferred.promise;
                        });
                        it('should show the add student button', function(){
                            expect($addStudent.hasClass('ng-hide')).to.be.false;
                        });
                        it('should hide the loading ellipsis', function(){
                            expect($modalCustomerDetails.find('ellipsis-animated').hasClass('ng-hide')).to.be.true;
                        });
                        it('should set bookingLoading to false', function(){
                            expect(studentScope.bookingLoading).to.be.false;
                        });
                        it('should show an error message', function(){
                            expect($rootScope.alerts[0].type).to.equal('danger');
                            expect($rootScope.alerts[0].message).to.equal('error-message');
                        });
                    });
                });
            });
        });
    });
})