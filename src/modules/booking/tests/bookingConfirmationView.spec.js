//TODO test clicking New Booking button
describe('Booking Confirmation View', function(){
    let('business', function(){
        return {
            name: "BIZ NAME",
            domain: "bizname",
            currency: "USD",
            payment: this.payment
        }
    });

    let('filters', function(){
        return {
            location:{
                name:"Shark Tank"
            },
            service:{
                name:"How to DO STUFF"
            }
        }
    });

    let('sessions', function(){
        var sessions = [];
        _.times(3, function(index){
            sessions.push({
                id: 'id_' + index,
                timing: {
                    startDate: moment().add(index + 1, 'day').format('YYYY-MM-DD'),
                    startTime: '12:00'
                },
                pricing: {
                    sessionPrice: 12
                },
                repetition: {
                    sessionCount: 1
                }
            });
        });
        return sessions;
    });

    let('customer', function(){
        return {
            firstName: 'One',
            lastName: 'Cuss',
            phone: '8829323',
            email: 'one@guy.com'
        }
    });

    let('booking', function(){
        return {
            id: '69',
            customer: this.customer,
            sessions: this.sessions
        }
    });

    let('anonGetPromise', function(){
        return $q.defer().promise;
    });

    let('anonCustomersSavePromise', function(){
        return $q.defer().promise;
    });

    let('anonBookingsSavePromise', function(){
        return $q.defer().promise;
    });

    let('subdomain', function(){
        return 'testsubdomain';
    });

    let('currentBooking', function(){
        return null
    });

    var self, anonStub, anonSaveStub;
    beforeEach(function(){
        self = this;
        self.anonCustomersSavePromise = this.anonCustomersSavePromise;
        self.anonBookingsSavePromise = this.anonBookingsSavePromise;
        $injector.get('currentBooking').filters = this.filters;
        $injector.get('currentBooking').customer = this.customer;
        $injector.get('currentBooking').booking = this.booking;
        $injector.get('sessionService').business = this.business;
        $injector.get('sessionService').currentBooking = this.currentBooking;

        locationStub.restore();
        this.sinon.stub($injector.get('$location'), 'host', function(){
            return self.subdomain;
        });

        onlineBookingAPIFactory = $injector.get('onlineBookingAPIFactory');

        anonSaveStub = this.sinon.stub(onlineBookingAPIFactory.anon(), 'save', function(apiCall){
            if(apiCall.section === "Bookings") {
                return {$promise: self.anonBookingsSavePromise}
            } else if (apiCall.section === "Customers"){
                return {$promise: self.anonCustomersSavePromise}
            }
        })

        anonStub = this.sinon.stub(onlineBookingAPIFactory, 'anon', function(thing){
            return {
                save: anonSaveStub
            }
        });

        var bookingScope = $rootScope.$new();
        var scope = bookingScope.$new();
        createViewWithController(bookingScope, 'booking/partials/booking.html', 'bookingCtrl');
        createViewWithController(scope, 'booking/partials/bookingConfirmationView.html', 'bookingConfirmationCtrl');
        $rootScope.$apply();
    });
    it('should hide the booking confirmation view', function(){
        expect($testRegion.find('.booking-confirmed').hasClass('ng-hide')).to.be.true;
    });
    describe('pay now/pay later buttons', function(){
        describe('when online payments are turned OFF', function(){
            let('payment', function(){
                return {
                    isOnlinePaymentEnabled: false
                }
            });

            it('should only show the pay later button', function(){
                expect($testRegion.find('paypal-payment-button').hasClass('ng-hide')).to.be.true;
                expect($testRegion.find('.pay-later').hasClass('ng-hide')).to.be.false;
            });
        });
        describe('when online payments are turned ON', function(){
            let('payment', function(){
                return {
                    isOnlinePaymentEnabled: true,
                    forceOnlinePayment: false
                }
            });

            it('should show the pay now and pay later buttons', function(){
                expect($testRegion.find('paypal-payment-button').hasClass('ng-hide')).to.be.false;
                expect($testRegion.find('.pay-later').hasClass('ng-hide')).to.be.false;
            });
            describe('and force online payment is turned on', function(){
                let('payment', function(){
                    return {
                        isOnlinePaymentEnabled: true,
                        forceOnlinePayment: true
                    }
                });

                it('should only show the pay now button', function(){
                    expect($testRegion.find('paypal-payment-button').hasClass('ng-hide')).to.be.false;
                    expect($testRegion.find('.pay-later').hasClass('ng-hide')).to.be.true;
                });
            });
        });
    });
    describe('when clicking on the pay later button', function(){
        beforeEach(function(){
            $testRegion.find('.pay-later').trigger('click');
        });
        it('should make a call to save the customer', function(){
            expect(anonStub).to.be.calledWith(this.business.domain);
            expect(anonSaveStub).to.be.calledWith({ section: 'Customers' }, this.customer)
        });
        describe('while loading', function(){
            it('should show the loading animation', function(){
                expect($testRegion.find('loading-animation').hasClass('ng-hide')).to.be.false;
            });
            it('should show `Processing Booking` message', function(){
                expect($testRegion.find('.loading-messages .processing').hasClass('ng-hide')).to.be.false;
            });
        });
        describe('and the Customers API call is successful', function(){
            // TODO these will change with new cherrypicking data structure
            // describe('when a course is selected')
            // describe('when multiple sessions are selected')
            let('anonCustomersSavePromise', function(){
                var deferred = $q.defer();
                deferred.resolve(this.customer);
                return deferred.promise;
            });

            describe('and the Bookings API call is successful', function(){
                let('anonBookingsSavePromise', function(){
                    var deferred = $q.defer();
                    deferred.resolve([this.booking]);
                    return deferred.promise;
                });

                it('should then make a call to `Bookings`', function(){
                    expect(anonSaveStub).to.be.calledWith({ section: 'Bookings' }, {customer: this.customer, sessions: this.sessions, paymentStatus: 'pending-payment'});
                });
                it('should show the booking confirmation', function(){
                    expect($testRegion.find('.booking-confirmed').hasClass('ng-hide')).to.be.false;                
                });
                it('should hide the pay now/pay later/change booking buttons', function(){
                    expect($testRegion.find('.button-container').hasClass('ng-hide')).to.be.true;                
                });
            });

            describe('and the Bookings API call fails', function(){
                let('anonBookingsSavePromise', function(){
                    var deferred = $q.defer();
                    deferred.reject({data: [{message: "error"}]});
                    return deferred.promise;
                });
                it('should show an error message', function(){
                    expect($rootScope.alerts[0].type).to.equal('danger');
                    expect($rootScope.alerts[0].message).to.equal('error');
                });
                it('should show the button container', function(){
                    expect($testRegion.find('.button-container').hasClass('ng-hide')).to.be.false;
                });
            });

        });
        describe('and the Customers API call fails', function(){
            let('anonCustomersSavePromise', function(){
                var deferred = $q.defer();
                deferred.reject({data: [{message: "error"}]});
                return deferred.promise;
            });
            it('should show an error message', function(){
                expect($rootScope.alerts[0].type).to.equal('danger');
                expect($rootScope.alerts[0].message).to.equal('error');
            });
            it('should show the button container', function(){
                expect($testRegion.find('.button-container').hasClass('ng-hide')).to.be.false;
            });
        });
    });
    describe('when clicking on the PayPal pay now button', function(){
        var submitStub;
        beforeEach(function(){
            submitStub = this.sinon.stub($.fn, 'submit');
            $testRegion.find('paypal-payment-button button').trigger('click');
        });

        it('should make a call to save the customer', function(){
            expect(anonStub).to.be.calledWith(this.business.domain);
            expect(anonSaveStub).to.be.calledWith({ section: 'Customers' }, this.customer)
        });
        describe('while loading', function(){
            it('should show the loading animation', function(){
                expect($testRegion.find('loading-animation').hasClass('ng-hide')).to.be.false;
            });
            it('should show `Processing Booking` message', function(){
                expect($testRegion.find('.loading-messages .processing').hasClass('ng-hide')).to.be.false;
            });
        });
        describe('and the Customers API call is successful', function(){
            let('anonCustomersSavePromise', function(){
                var deferred = $q.defer();
                deferred.resolve(this.customer);
                return deferred.promise;
            });

            describe('and the Bookings API call is successful', function(){
                let('anonBookingsSavePromise', function(){
                    var deferred = $q.defer();
                    deferred.resolve([this.booking]);
                    return deferred.promise;
                });

                it('should then make a call to `Bookings`', function(){
                    expect(anonSaveStub).to.be.calledWith({ section: 'Bookings' }, {customer: this.customer, sessions: this.sessions, paymentStatus: 'pending-payment'});
                });
                it('should hide the pay now/pay later/change booking buttons', function(){
                    expect($testRegion.find('.button-container').hasClass('ng-hide')).to.be.true;                
                });
                it('should attempt to submit PayPal form', function(){
                    $timeout.flush();
                    expect(submitStub).to.be.calledOnce;
                });
            });

            describe('and the Bookings API call fails', function(){
                let('anonBookingsSavePromise', function(){
                    var deferred = $q.defer();
                    deferred.reject({data: [{message: "error"}]});
                    return deferred.promise;
                });

                it('should NOT attempt to submit PayPal form', function(){
                    $timeout.flush();
                    expect(submitStub).to.not.be.calledOnce;
                });
                it('should show an error message', function(){
                    expect($rootScope.alerts[0].type).to.equal('danger');
                    expect($rootScope.alerts[0].message).to.equal('error');
                });
                it('should show the button container', function(){
                    expect($testRegion.find('.button-container').hasClass('ng-hide')).to.be.false;
                });
            });
        });
        describe('and the Customers API call fails', function(){
            let('anonCustomersSavePromise', function(){
                var deferred = $q.defer();
                deferred.reject({data: [{message: "error"}]});
                return deferred.promise;
            });

            it('should NOT attempt to submit PayPal form', function(){
                $timeout.flush();
                expect(submitStub).to.not.be.calledOnce;
            });
            it('should show an error message', function(){
                expect($rootScope.alerts[0].type).to.equal('danger');
                expect($rootScope.alerts[0].message).to.equal('error');
            });
            it('should show the button container', function(){
                expect($testRegion.find('.button-container').hasClass('ng-hide')).to.be.false;
            });
        });
    });
    describe('when coming back from a successful payment', function(){
        let('currentBooking', function(){
            return {
                customer: this.customer,
                filters: this.filters,
                booking: {
                    course: _.first(this.sessions)
                }
            }
        });
        it('should show the booking confirmation', function(){
            expect($testRegion.find('.booking-confirmed').hasClass('ng-hide')).to.be.false;                
        });
        it('should hide the pay now/pay later/change booking buttons', function(){
            expect($testRegion.find('.button-container').hasClass('ng-hide')).to.be.true;                
        });
    });
});