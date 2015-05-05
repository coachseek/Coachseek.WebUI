describe('modalCustomerDetails directive', function(){

    let('currentEvent', function(){
        return {
            session: this.session
        };
    });

    let('session', function(){
        return {
            id: 'session_one',
            booking: {
                bookings: this.sessionBookings
            },
            service: {
                name: 'service name'
            }
        };
    });

    let('sessionBookings', function(){
        return [this.sessionBookingOne];
    });

    let('sessionBookingOne', function(){
        return {
            customer: {id: 'one'}
        };
    });

    let('sessionBookingTwo', function(){
        return {
            customer: {id: 'two'}
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
            }
        }
    });

    let('courseBookings', function(){
        return [this.courseBooking];
    });

    let('courseBooking', function(){
        return {
            id: 'course_booking_id',
            customer: {id: 'two'}
        }
    });

    let('item', function(){
        return {
            id: 'one',
            firstName: 'Dude',
            lastName: 'Guy'
        };
    });

    let('updatePromise', function(){
        return $q.defer().promise;
    });
    
    var scope,
        $modalCustomerDetails;
    beforeEach(function(){
        scope = $rootScope.$new();
        scope.currentEvent = this.currentEvent;
        scope.item = this.item;

        createDirective(scope, '<modal-customer-details></modal-customer-details>');
        $modalCustomerDetails = $testRegion.find('modal-customer-details');
    });

    describe('when the currentEvent is NOT in a course', function(){

        it('should NOT show the add to course column', function(){
            expect($modalCustomerDetails.find('.add-student.to-course').hasClass('ng-hide')).to.be.false;
        });

        describe('when session bookings[] contains the customer', function(){
            it('should set the isSessionStudent flag to true', function(){
                expect(scope.isSessionStudent).to.be.true;
            });
        });
        describe('when session bookings[] does not contain the customer', function(){
            let('sessionBookings', function(){
                return [this.sessionBookingTwo];
            });

            it('should not set the isSessionStudent flag to true', function(){
                expect(scope.isSessionStudent).to.be.false;
            });

            describe('when clicking addStudent', function(){
                var self, updateStub, $addStudent;
                beforeEach(function(){
                    self = this;
                    updateStub = this.sinon.stub($injector.get('coachSeekAPIService'), 'save', function(){
                        return {$promise: self.updatePromise};
                    });
                    $addStudent = $modalCustomerDetails.find('.add-student.to-session');
                    $addStudent.trigger('click');
                });
                it('should call update method', function(){
                    var bookingObject = {
                        session: {
                            id: this.currentEvent.session.id,
                            name: this.currentEvent.session.service.name
                        },
                        customer: {
                            id: this.item.id,
                            firstName: this.item.firstName,
                            lastName: this.item.lastName
                        },
                        hasAttended: false,
                        paymentStatus: "awaiting-invoice"
                    }
                    expect(updateStub).to.be.calledWith({section: 'Bookings'}, bookingObject);
                });
                describe('while loading', function(){
                    it('should set bookingLoading to true', function(){
                        expect(scope.bookingLoading).to.be.true;
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
                    it('should set the isSessionStudent flag to true', function(){
                        expect(scope.isSessionStudent).to.be.true;
                    });
                    it('should show the add student button', function(){
                        expect($addStudent.hasClass('ng-hide')).to.be.false;
                    });
                    it('should disable the add student button', function(){
                        expect($addStudent.attr('disabled')).to.equal('disabled');
                    });
                    it('should hide the loading ellipsis', function(){
                        expect($modalCustomerDetails.find('ellipsis-animated').hasClass('ng-hide')).to.be.true;
                    });
                    it('should set bookingLoading to false', function(){
                        expect(scope.bookingLoading).to.be.false;
                    });

                });
                describe('when update fails', function(){
                    let('updatePromise', function(){
                        var deferred = $q.defer();
                        deferred.reject({data: {message:"error-message"}});
                        return deferred.promise;
                    });
                    it('should set the isSessionStudent flag to false', function(){
                        expect(scope.isSessionStudent).to.be.false;
                    });
                    it('should show the add student button', function(){
                        expect($addStudent.hasClass('ng-hide')).to.be.false;
                    });
                    it('should hide the loading ellipsis', function(){
                        expect($modalCustomerDetails.find('ellipsis-animated').hasClass('ng-hide')).to.be.true;
                    });
                    it('should set bookingLoading to false', function(){
                        expect(scope.bookingLoading).to.be.false;
                    });
                    it('should show an error message', function(){
                        expect($rootScope.alerts[0].type).to.equal('danger');
                        expect($rootScope.alerts[0].message).to.equal('error-message');
                    });
                });
            });
        });
    });
    describe('when currentEvent is in a course', function(){

        let('currentEvent', function(){
            return {
                session: this.session,
                course: this.course
            };
        });

        it('should show the add to course column', function(){
            expect($modalCustomerDetails.find('.add-student.to-course').hasClass('ng-hide')).to.be.false;
        });

        describe('when the currentEvent has no bookings', function(){
            let('sessionBookings', function(){
                return [];
            });

            let('courseBookings', function(){
                return [];
            });

            it('should set the isSessionStudent and isCourseStudent flag to false', function(){
                expect(scope.isSessionStudent).to.be.false;
                expect(scope.isCourseStudent).to.be.false;
            });

            describe('when clicking the add to course button', function(){
                describe('and then clicking the add to session button', function(){

                });
            });

            describe('when clicking the add to session button', function(){
                describe('and then clicking the add to course button', function(){

                });
            });
        });
        describe('when session bookings[] contains the customer and has parentId (is part of a course booking)', function(){

            let('sessionBookingOne', function(){
                return {
                    customer: {id: 'one'},
                    parentId: 'course_booking_id'
                };
            });

            let('sessionBookings', function(){
                return [this.sessionBookingOne];
            });

            it('should set the isSessionStudent flag to false', function(){
                expect(scope.isSessionStudent).to.be.false;
            });
            it('should set the isCourseStudent flag to true', function(){
                expect(scope.isCourseStudent).to.be.true;
            });
        });

        describe('when session bookings[] contains the customer but doesnt have a parentId', function(){
            it('should set the isSessionStudent flag to true', function(){
                expect(scope.isSessionStudent).to.be.true;
            });
            it('should set the isCourseStudent flag to false', function(){
                expect(scope.isCourseStudent).to.be.false;
            });
        });
    });
})