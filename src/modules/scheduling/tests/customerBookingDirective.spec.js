describe('customerBooking directive', function(){

    let('currentEvent', function(){
        return {
            session: {
                booking: {
                    bookings: [this.booking]
                }
            }
        };
    });

    let('booking', function(){
        return {
            id: '69',
            customer: {
                firstName: 'User',
                lastName: 'Guy'
            },
            paymentStatus: 'paid',
            hasAttended: true
        }
    });

    let('deletePromise', function(){
        return $q.defer().promise;
    });

    let('updatePromise', function(){
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
    });

    var scope,
        $customerBooking;

    beforeEach(function(){
        scope = $rootScope.$new();
        self.deletePromise = this.deletePromise;
        self.updatePromise = this.updatePromise;
        scope.currentEvent = this.currentEvent;
        scope.booking = this.booking;

        createDirective(scope, '<customer-booking></customer-booking>');
        $customerBooking = $testRegion.find('customer-booking');
    });
    it('should set the attendance checkmark', function(){
       expect($customerBooking.find('.attending-checkbox i').hasClass('fa-check')).to.equal(this.booking.hasAttended);
    });
    it('should set the payment status', function(){
       expect($customerBooking.find('.payment-status').hasClass(this.booking.paymentStatus)).to.be.true;
    });
    describe('if payment status is not set', function(){
            let('booking', function(){
                return {
                    id: '69',
                    customer: {
                        firstName: 'User',
                        lastName: 'Guy'
                    },
                    hasAttended: true
                }
            });
            it('should set paymentStatus to `awaiting-invoice`', function(){
               expect($customerBooking.find('.payment-status').hasClass('awaiting-invoice')).to.be.true;
            });
    });
    it('should set the customer name', function(){
        expect($customerBooking.find('.item-title').text()).to.equal(this.booking.customer.firstName + " " + this.booking.customer.lastName);
    });
    describe('when clicking deleteStudent', function(){
        var self, deleteStub, $deleteStudent;
        beforeEach(function(){
            self = this;
            deleteStub = this.sinon.stub($injector.get('coachSeekAPIService'), 'delete', function(){
                return {$promise: self.deletePromise};
            });
            $deleteStudent = $customerBooking.find('.delete-booking');
            $deleteStudent.trigger('click');
        });
        it('should call delete method', function(){
            expect(deleteStub).to.be.calledWith({section: 'Bookings', id: this.booking.id});
        });
        describe('while loading', function(){
            it('should set bookingLoading to true', function(){
                expect(scope.bookingLoading).to.be.true;
            });
            it('should show the loading ellipsis', function(){
                expect($customerBooking.find('ellipsis-animated').hasClass('ng-hide')).to.be.false;
            });
        });
        describe('when delete is successful', function(){
            let('deletePromise', function(){
                var deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            });
            it('should hide the loading ellipsis', function(){
                expect($customerBooking.find('ellipsis-animated').hasClass('ng-hide')).to.be.true;
            });
            it('should set bookingLoading to false', function(){
                expect(scope.bookingLoading).to.be.false;
            });
            it('should to remove customer from UI', function(){
                expect(_.size(scope.currentEvent.session.booking.bookings)).to.be.equal(0);
            });
        });
        describe('when delete fails', function(){
            let('deletePromise', function(){
                var deferred = $q.defer();
                deferred.reject({data: {message:"error-message"}});
                return deferred.promise;
            });
            it('should hide the loading ellipsis', function(){
                expect($customerBooking.find('ellipsis-animated').hasClass('ng-hide')).to.be.true;
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
    describe('when changing payment status', function(){
        var self, updateStub;
        beforeEach(function(){
            self = this;
            coachSeekAPIService = $injector.get('coachSeekAPIService');

            updateStub = this.sinon.stub(coachSeekAPIService, 'save', function(){
                return {$promise: self.updatePromise};
            });
            $customerBooking.find('.payment-status').trigger('click');
        });
        it('should change the payment status to `overdue`', function(){
           expect($customerBooking.find('.payment-status').hasClass('overdue')).to.be.true;
        });
        it('should not attempt to save', function(){
            expect(updateStub).to.not.be.called;
        });
        describe('and then changing payment status again', function(){
            beforeEach(function(){
                $customerBooking.find('.payment-status').trigger('click');
            });
            it('should set paymentStatus to `awaiting-invoice`', function(){
               expect($customerBooking.find('.payment-status').hasClass('awaiting-invoice')).to.be.true;
            });
            it('should not attempt to save', function(){
                expect(updateStub).to.not.be.called;
            });
            describe('and then waiting 1 second', function(){
                beforeEach(function(){
                    clock.tick(1000);
                    $timeout.flush()
                });
                it('should attempt to save', function(){
                    expect(updateStub).to.be.calledWith({section: 'Bookings', id: scope.booking.id}, {
                        commandName: 'BookingSetPaymentStatus',
                        paymentStatus: scope.paymentStatus
                    });
                });
                describe('while saving', function(){
                    let('updatePromise', function(){
                        return $q.defer().promise;
                    });

                    it('should show loading', function(){ 
                        expect(scope.bookingLoading).to.be.true;
                    });
                });
                describe('after successful save', function(){
                    it('should set the paymentStatus on the booking', function(){
                        expect(scope.booking.paymentStatus).to.equal('awaiting-invoice');
                    });
                    it('should set bookingLoading to false', function(){
                        expect(scope.bookingLoading).to.be.false;
                    });
                });
            });
        });
    });
    describe('when changing the attendance', function(){
        var self, updateStub;
        beforeEach(function(){
            self = this;
            coachSeekAPIService = $injector.get('coachSeekAPIService');

            updateStub = this.sinon.stub(coachSeekAPIService, 'save', function(){
                return {$promise: self.updatePromise};
            });
            $customerBooking.find('.attending-checkbox').trigger('click');
        });
        describe('when changing hasAttended to FALSE', function(){
            it('should make a call to the API', function(){
                expect(updateStub).to.be.calledWith({section: 'Bookings', id: scope.booking.id}, {
                    commandName: 'BookingSetAttendance',
                    hasAttended: false
                });
            });
            describe('while attendance is saving', function(){
                let('updatePromise', function(){
                    return $q.defer().promise;
                });

                it('should show loading', function(){ 
                    expect(scope.bookingLoading).to.be.true;
                });
            });
            describe('when attendance update is successful', function(){

                it('should hide the checkmark', function(){
                    expect($customerBooking.find('.attending-checkbox i').hasClass('fa-check')).to.be.false;
                });
                it('should set bookingLoading to false', function(){
                    expect(scope.bookingLoading).to.be.false;
                });
            });

            describe('and then changing hasAttended to TRUE', function(){
                beforeEach(function(){
                    $customerBooking.find('.attending-checkbox').trigger('click');
                });
               it('should make a call to the API', function(){
                   expect(updateStub).to.be.calledWith({section: 'Bookings', id: scope.booking.id}, {
                       commandName: 'BookingSetAttendance',
                       hasAttended: true
                   });
               });
               describe('while attendance is saving', function(){
                   let('updatePromise', function(){
                       return $q.defer().promise;
                   });

                   it('should show loading', function(){ 
                       expect(scope.bookingLoading).to.be.true;
                   });
               });
               describe('when attendance update is successful', function(){

                   it('should show the checkmark', function(){
                       expect($customerBooking.find('.attending-checkbox i').hasClass('fa-check')).to.be.true;
                   });
                   it('should set bookingLoading to false', function(){
                       expect(scope.bookingLoading).to.be.false;
                   });
               }); 
            });
        });
    });
})