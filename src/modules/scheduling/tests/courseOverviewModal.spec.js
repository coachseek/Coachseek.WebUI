describe('courseOverviewModal Directive', function(){

    let('customerOne', function(){
        return {
            id: 'customer_1',
            email: 'asap@rocky.com',
            firstName: 'A$AP',
            lastName: '$ROCKY' //make this one come first
        }
    });

    let('customerTwo', function(){
        return {
            id: 'customer_2',
            firstName: 'A$AP',
            lastName: 'FERG'
        }
    });

    let('courseBookingOne', function(){
        return {
            customer: this.customerOne,
            id: 'course_booking_one',
            paymentStatus: 'pending-invoice'
        }
    });

    let('courseBookingTwo', function(){
        return {
            customer: this.customerTwo,
            id: 'course_booking_two',
            paymentStatus: 'pending-invoice'
        }
    });

    let('sessionBookingOne', function(){
        return {
            customer: this.customerOne,
            id: 'booking_one',
            paymentStatus: 'pending-invoice',
            parentId: 'course_booking_one',
            id: "session_0"
        }
    });

    let('sessionBookingTwo', function(){
        return {
            customer: this.customerTwo,
            id: 'booking_two',
            paymentStatus: 'pending-invoice',
            parentId: 'course_booking_one',
            id: "session_0"
        }
    });

    let('sessionBookingThree', function(){
        return {
            customer: this.customerOne,
            id: 'booking_three',
            paymentStatus: 'pending-invoice',
            parentId: 'course_booking_two',
            id: "session_1"
        }
    });

    let('sessionBookingFour', function(){
        return {
            customer: this.customerTwo,
            id: 'booking_four',
            paymentStatus: 'pending-invoice',
            parentId: 'course_booking_Two',
            id: "session_1"
        }
    });

    let('sessionBookings', function(){
        return [
            [this.sessionBookingOne, this.sessionBookingTwo],
            [this.sessionBookingThree, this.sessionBookingFour]
        ];
    });

    let('courseId', function(){
        return 'course_0'
    });

    let('sessions', function(){
        var sessions = [];
        var sessionBookings = this.sessionBookings;
        var parentId = this.courseId
        _.times(2, function(index){
            sessions.push({
                id: 'session_' + index,
                timing: {
                    startDate: moment().add(index + 1, 'day').format('YYYY-MM-DD'),
                    startTime: '12:00'
                },
                pricing: {
                    sessionPrice: 12
                },
                repetition: {
                    sessionCount: 1
                },
                booking: {
                    studentCapacity: 10,
                    bookingCount: _.size(sessionBookings[index]),
                    bookings: sessionBookings[index]
                },
                parentId: parentId
            });
        });
        return sessions;
    });

    let('courseBookings', function(){
        return [this.courseBookingOne, this.courseBookingTwo];
    });

    let('course', function(){
        return {
            id: this.courseId,
            booking: {
                studentCapacity: 10,
                bookingCount: _.size(this.courseBookings),
                bookings: this.courseBookings
            },
            sessions: this.sessions
        };
    });

    let('currentEvent', function(){
        return {
            session: this.sessions[0],
            course: this.course
        };
    });

    let('bookingManagerPromise', function(){
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
    });

    var self, scope, queryStub, saveStub, $courseOverviewModal, scrollbarSpy;
    beforeEach(function(){
        self = this;
        scope = $rootScope.$new();
        var coachSeekAPIService = $injector.get('coachSeekAPIService');

        queryStub = this.sinon.stub(coachSeekAPIService, 'query', function(){
            var deferred = $q.defer();
            deferred.resolve();
            return {$promise: deferred.promise};
        });

        scrollbarSpy = this.sinon.spy($.fn, 'scrollbar');

        createDirective(scope, '<course-overview-modal></course-overview-modal>');
        $courseOverviewModal = $testRegion.find('course-overview-modal');
        scope.currentEvent = self.currentEvent;
        //must switch modal tab because session data table doesn't load until we switch the tab
        scope.modalTab = "attendance";
        $rootScope.$digest();
    });
    it('should attempt to GET customers', function(){
        expect(queryStub).to.be.calledWith({section: 'Customers'});
    });
    it('should attempt to set up scrollbarjs', function(){
        expect(scrollbarSpy).to.be.calledWith({
                                                "autoScrollSize": false,
                                                "scrollx": $('.external-scroll_x'),
                                                "scrolly": null
                                            });
        expect(scrollbarSpy).to.be.calledWith({
                                                "autoScrollSize": false,
                                                "scrollx": null,
                                                "scrolly": $('.external-scroll_y')
                                            });
    });
    it('should set the correct headers on the sessions', function(){
        var $sessionHeaders = $testRegion.find('.session-headers li');
        _.each($sessionHeaders, function(header, i){
            var date = moment(self.sessions[i].timing.startDate, "YYYY-MM-DD")
            expect($(header).find('span').first().text()).to.equal(date.format("MMM Do"))
            expect($(header).find('span:nth-child(2)').text()).to.contain(self.sessions[i].booking.bookingCount + "/" + self.sessions[i].booking.studentCapacity);
        });
    });
    describe('when there are no customer bookings', function(){
        let('courseBookings', function(){
            return [];
        });
        it('should open the customer list drawer', function(){
            expect(scope.showCustomers).to.be.true;
            expect($courseOverviewModal.find('.customer-list').hasClass('showing')).to.be.true;
            expect($courseOverviewModal.find('.show-customer-list-button').hasClass('showing')).to.be.true;
        });
    });
    describe('when the customer has more than one booking', function(){
        let('duplicateBooking', function(){
            return {
                customer: this.customerTwo,
                'id': 'duplicate-booking'
            }
        });

        let('courseBookings', function(){
            return [this.courseBookingOne, this.courseBookingTwo, this.duplicateBooking]
        });
        it('should as many unique customers names as are in the course', function(){
            var numCustomerNames = _.size($courseOverviewModal.find('table.customer-names tr'));
            var numCustomerDataRows = _.size($courseOverviewModal.find('table.session-data tr'));
            var numUniqCourseBookings = _.size(_.uniqBy(this.courseBookings, 'customer.id'))

            expect(numCustomerNames).to.equal(numUniqCourseBookings);
            expect(numCustomerDataRows).to.equal(numUniqCourseBookings);
        });

    });
    describe('the customer name list', function(){
        var $customerNames;
        beforeEach(function(){
            $customerNames = $courseOverviewModal.find('table.customer-names tr')
        });
        describe('customer mail to link', function(){
            it('should enable the email to link if there is an email', function(){
                expect($customerNames.first().find('.mail-to a').attr('disabled')).to.equal(undefined);
                expect($customerNames.first().find('.mail-to a').attr('ng-href')).to.equal('mailto:' + this.customerOne.email)
            });
            it('should disable the email to link if there is no email', function(){
                expect($($customerNames[1]).find('.mail-to a').attr('disabled')).to.equal('disabled');
            });
        });
        describe('when clicking on the delete booking icon', function(){
            var sessionOrCourseModalSpy, deleteFromCourseStub, deleteFromSessionStub;
            beforeEach(function(){
                modalStub.restore();
                sessionOrCourseModalSpy = this.sinon.spy($injector.get('$modal'), 'open');
                deleteFromCourseStub = this.sinon.stub($injector.get('bookingManager'), 'removeFromCourse', function(){
                    return self.bookingManagerPromise;
                });
                deleteFromSessionStub = this.sinon.stub($injector.get('bookingManager'), 'removeFromSession', function(){
                    return self.bookingManagerPromise;
                });

                $customerNames.first().find('td.delete-booking').trigger('click');
            });
            describe('when the currentEvent is in a course', function(){
                describe('and the customer is in this session', function(){
                    it('should bring up the session or course modal', function(){
                        expect(sessionOrCourseModalSpy).to.be.calledOnce;
                        expect(_.size($('.session-or-course-modal'))).to.equal(1);
                        expect(_.size($('.remove-from-course-modal'))).to.equal(0);
                    });
                    describe('when clicking on the session button', function(){
                        beforeEach(function(){
                            $('.session-or-course-modal .session-button').trigger('click');
                        });
                        it('should attempt to delete the booking from this session', function(){
                            expect(deleteFromSessionStub).to.be.calledWith(this.currentEvent.session.booking.bookings[0].id);
                        });
                        describe('when the delete is successful', function(){
                            it('should attempt to set courseBookingData')
                        });
                        describe('when the delete is NOT successful', function(){
                            it('should NOT attempt to set courseBookingData')
                            it('it should stop the loading indicator')
                        });
                    });
                    describe('when clicking on the course button', function(){
                        beforeEach(function(){
                            $('.session-or-course-modal .course-button').trigger('click');
                        });
                        it('should attempt to delete the booking from the entire course for that customer', function(){
                            expect(deleteFromCourseStub).to.be.calledWith([this.sessionBookingOne, this.sessionBookingThree]);
                        });
                        describe('when the delete is successful', function(){
                            it('should attempt to set courseBookingData')
                        });
                        describe('when the delete is NOT successful', function(){
                            it('should NOT attempt to set courseBookingData')
                            it('it should stop the loading indicator')
                        });
                    });
                    describe('when cancelling the action', function(){
                        beforeEach(function(){
                            $('.session-or-course-modal span.fa-close').trigger('click');
                        });
                        it('should not attempt to delete anything', function(){
                            expect(deleteFromSessionStub).to.be.not.be.called;
                            expect(deleteFromCourseStub).to.be.not.be.called;
                        });
                    });
                });
                describe('and the customer is NOT in the session', function(){
                    let('sessionBookingOne', function(){
                        return {}
                    });
                    it('should bring up the removeFromCourseModal', function(){
                        expect(sessionOrCourseModalSpy).to.be.calledOnce;
                        expect(_.size($('.session-or-course-modal'))).to.equal(0);
                        expect(_.size($('.remove-from-course-modal'))).to.equal(1);
                    });
                    describe('and clicking the `yes` button', function(){
                        beforeEach(function(){
                            $('.remove-from-course-modal .remove-button').trigger('click');
                        });
                        it('should attempt to delete the booking from the entire course', function(){
                            expect(deleteFromCourseStub).to.be.calledWith([this.sessionBookingThree]);
                        });
                    });
                    describe('when cancelling the action', function(){
                        beforeEach(function(){
                            $('.remove-from-course-modal span.fa-close').trigger('click');
                        });
                        it('should not attempt to delete anything', function(){
                            expect(deleteFromSessionStub).to.be.not.be.called;
                            expect(deleteFromCourseStub).to.be.not.be.called;
                        });
                    });
                });
            });
            describe('when the currentEvent is not in a course', function(){
                let('currentEvent', function(){
                    return {
                        session: this.sessions[0]
                    };
                });
                it('should bring up the removeFromCourseModal', function(){
                    expect(sessionOrCourseModalSpy).to.be.calledOnce;
                    expect(_.size($('.session-or-course-modal'))).to.equal(0);
                    expect(_.size($('.remove-from-course-modal'))).to.equal(1);
                });
                describe('and clicking the `yes` button', function(){
                    beforeEach(function(){
                        $('.remove-from-course-modal .remove-button').trigger('click');
                    });
                    it('should attempt to delete the booking from the entire course', function(){
                        expect(deleteFromSessionStub).to.be.calledWith(this.currentEvent.session.booking.bookings[0].id);
                    });
                });
            });
        });
    });
    describe('the customer data row', function(){
        var $firstCustomerRow, updateBookingStub;
        beforeEach(function(){
            // first customer is in first session but not in second
            $testRegion.appendTo('body');
            $firstCustomerRow = $courseOverviewModal.find('react-customer-data-table tr').first();
            updateBookingStub = this.sinon.stub($injector.get('bookingManager'), 'updateBooking', function(){
                return self.bookingManagerPromise;
            });
        });
        describe('when the ATTENDANCE data is showing', function(){
            describe('when the student is in the session', function(){
                it('should show a the attendance status for the sessions the student is in', function(){
                    expect(_.size($firstCustomerRow.find('button.add-student'))).to.equal(0);
                    expect(_.size($firstCustomerRow.find('div.attending-checkbox'))).to.equal(2);
                });
                it('should show the correct UI', function(){
                    expect($firstCustomerRow.find('div.attending-checkbox').first().hasClass('undefined')).to.be.true;
                });
                describe('when changing the attendance status', function(){
                    beforeEach(function(){
                        $firstCustomerRow.find('td').first().trigger('click');
                    });
                    it('should change the status in the UI', function(){
                        expect($firstCustomerRow.find('div.attending-checkbox').first().hasClass('true')).to.be.true;
                    });
                    it('should not attempt to save the attendance status', function(){
                        expect(updateBookingStub).to.not.be.called;
                    });
                    describe('and then waiting 1000ms', function(){
                        beforeEach(function(){
                            clock.tick(1000);
                        });
                        it('should attempt to save the attendance status', function(){
                            expect(updateBookingStub).to.be.calledWith(this.sessionBookingOne.id, {
                                commandName: 'BookingSetAttendance',
                                hasAttended: true
                            });
                        });
                    })
                });
            });
            describe('when the student is not in the session', function(){
                let('sessionBookingOne', function(){
                    return {}
                });
                it('should show a + for the sessions the student is not in', function(){
                    expect(_.size($firstCustomerRow.find('button.add-student'))).to.equal(1);
                });
                it('should show the attendance status for the sessions the student is in', function(){
                    expect(_.size($firstCustomerRow.find('div.attending-checkbox'))).to.equal(1);
                });
                describe('and then clicking the add to session button', function(){
                    var addBookingStub;
                    beforeEach(function(){
                        addBookingStub = this.sinon.stub($injector.get('bookingManager'), 'addToSession', function(){
                            return self.bookingManagerPromise;
                        });
                        $firstCustomerRow.find('td').first().trigger('click');
                    });
                    it('should attempt to add the student to the session', function(){
                        expect(addBookingStub).to.be.calledWith(this.customerOne, this.sessions[0].id);
                    });
                })
            });
        });
        describe('when the PAYMENT data is showing', function(){
            beforeEach(function(){
                scope.modalTab = "payment";
                $rootScope.$digest();
                $testRegion.appendTo('body');
            })
            describe('when the student is in the session', function(){
                it('should show a the payment status for the sessions the student is in', function(){
                    expect(_.size($firstCustomerRow.find('button.add-student'))).to.equal(0);
                    expect(_.size($firstCustomerRow.find('div.payment-status'))).to.equal(2);
                });
                it('should show the correct UI', function(){
                    expect($firstCustomerRow.find('div.payment-status').first().hasClass('pending-invoice')).to.be.true;
                });
                describe('and then changing the payment status', function(){
                    beforeEach(function(){
                        $firstCustomerRow.find('td').first().trigger('click');
                        $firstCustomerRow.find('td').first().trigger('click');
                    });
                    it('should change the status in the UI', function(){
                        expect($firstCustomerRow.find('div.payment-status').first().hasClass('paid')).to.be.true;
                    });
                    it('should not attempt to save the payment status', function(){
                        expect(updateBookingStub).to.not.be.called;
                    });
                    describe('and then waiting 1000ms', function(){
                        beforeEach(function(){
                            clock.tick(1000);
                        });
                        it('should attempt to save the payment status', function(){
                            expect(updateBookingStub).to.be.calledWith(this.sessionBookingOne.id, {
                                commandName: 'BookingSetPaymentStatus',
                                paymentStatus: 'paid'
                            });
                        });
                    })
                });
            });
            describe('when the student is not in the session', function(){
                let('sessionBookingOne', function(){
                    return {}
                });
                it('should show a + for the sessions the student is not in', function(){
                    expect(_.size($firstCustomerRow.find('button.add-student'))).to.equal(1);
                });
                it('should show the payment status for the sessions the student is in', function(){
                    expect(_.size($firstCustomerRow.find('div.payment-status'))).to.equal(1);
                });
                describe('and then clicking the add to session button', function(){
                    var addBookingStub;
                    beforeEach(function(){
                        addBookingStub = this.sinon.stub($injector.get('bookingManager'), 'addToSession', function(){
                            return self.bookingManagerPromise;
                        });
                        $firstCustomerRow.find('td').first().trigger('click');
                    });
                    it('should attempt to add the student to the session', function(){
                        expect(addBookingStub).to.be.calledWith(this.customerOne, this.sessions[0].id);
                    });
                })
            });
        });
    });
});