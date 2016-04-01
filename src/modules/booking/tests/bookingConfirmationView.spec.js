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

    let('anonPricingEnquiryStubPromise', function(){
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

    let('discountPrice', function(){
        return null;
    });

    var self, anonStub, anonSaveStub, scope;
    beforeEach(function(){
        self = this;
        self.anonCustomersSavePromise = this.anonCustomersSavePromise;
        self.anonPricingEnquiryStubPromise = this.anonPricingEnquiryStubPromise;
        self.anonBookingsSavePromise = this.anonBookingsSavePromise;
        self.discountPrice = this.discountPrice;
        self.business = this.business;
        self.currentBooking = this.currentBooking;
        $injector.get('currentBooking').filters = this.filters;
        $injector.get('currentBooking').customer = this.customer;
        $injector.get('currentBooking').booking = this.booking;
        $injector.get('currentBooking').discountPrice = self.discountPrice;
        $injector.get('sessionService').business = self.business;
        $injector.get('sessionService').currentBooking = this.currentBooking;

        locationStub.restore();
        this.sinon.stub($injector.get('$location'), 'host', function(){
            return self.subdomain;
        });

        var onlineBookingAPIFactory = $injector.get('onlineBookingAPIFactory');

        anonSaveStub = this.sinon.stub(onlineBookingAPIFactory.anon(), 'save', function(apiCall){
            if(apiCall.section === "Bookings") {
                return {$promise: self.anonBookingsSavePromise}
            } else if (apiCall.section === "Customers"){
                return {$promise: self.anonCustomersSavePromise}
            }
        });

        anonPricingEnquiryStub = this.sinon.stub(onlineBookingAPIFactory.anon(), 'pricingEnquiry', function(apiCall){
            return {$promise: self.anonPricingEnquiryStubPromise}
        });

        anonStub = this.sinon.stub(onlineBookingAPIFactory, 'anon', function(){
            return {
                save: anonSaveStub,
                pricingEnquiry: anonPricingEnquiryStub
            }
        });

        var bookingScope = $rootScope.$new();
        scope = bookingScope.$new();
        createViewWithController(bookingScope, 'booking/partials/booking.html', 'bookingCtrl');
        createViewWithController(scope, 'booking/partials/bookingConfirmationView.html', 'bookingConfirmationCtrl');
    });
    it('should hide the booking confirmation view', function(){
        expect($testRegion.find('.booking-confirmed').hasClass('ng-hide')).to.be.true;
    });
    it('should show the apply discount code input', function(){
        expect($testRegion.find('apply-discount-code').hasClass('ng-hide')).to.be.false;
    });
    it('should hide the discount applied price', function(){
        expect($testRegion.find('.applied-discount-price').hasClass('ng-hide')).to.be.true;
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
        describe('when there is no discountPrice', function(){
            it('should make a call to get the price', function(){
                expect(anonStub).to.be.calledWith(this.business.domain);
                expect(anonPricingEnquiryStub).to.be.calledWith({}, {sessions: this.sessions});
            });

            describe('and the pricing enquiry is successful', function(){
                let('anonPricingEnquiryStubPromise', function(){
                    var deferred = $q.defer();
                    deferred.resolve({price: 69.34});
                    return deferred.promise;
                });
                it('should set the price as the total price', function(){
                    expect($injector.get('currentBooking').totalPrice).to.equal("69.34")
                });
                it('should then make a call to `Bookings`', function(){
                    expect(anonSaveStub).to.be.calledWith({ section: 'Bookings' }, {customer: this.customer, sessions: this.sessions});
                });

                describe('and the Bookings API call is successful', function(){
                    let('anonBookingsSavePromise', function(){
                        var deferred = $q.defer();
                        deferred.resolve([this.booking]);
                        return deferred.promise;
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

            describe('and the pricing enquiry fails', function(){
                let('anonPricingEnquiryStubPromise', function(){
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
        describe('when there has been a discountPrice applied', function(){
            let('discountPrice', function(){
                return {
                    amount: 80,
                    currency: 'USD',
                    discountPercent: 20
                }
            });
            it('should hide the apply discount code input', function(){
                expect($testRegion.find('apply-discount-code').hasClass('ng-hide')).to.be.true;
            });
            it('should show the discount applied price', function(){
                expect($testRegion.find('.applied-discount-price').hasClass('ng-hide')).to.be.false;
            });
            it('should NOT make a call to get the price', function(){
                expect(anonPricingEnquiryStub).to.not.be.called;
            });
            it('should then make a call to `Bookings`', function(){
                expect(anonSaveStub).to.be.calledWith({ section: 'Bookings' }, {customer: this.customer, sessions: this.sessions});
            });

            describe('and the Bookings API call is successful', function(){
                let('anonBookingsSavePromise', function(){
                    var deferred = $q.defer();
                    deferred.resolve([this.booking]);
                    return deferred.promise;
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
    });
    describe('when clicking on the PayPal pay now button', function(){
        var submitStub;
        beforeEach(function(){
            submitStub = this.sinon.stub($.fn, 'submit');
            $testRegion.find('paypal-payment-button button').trigger('click');
        });

        describe('and there is no discountPrice', function(){
            it('should make a call to get the price', function(){
                expect(anonStub).to.be.calledWith(this.business.domain);
                expect(anonPricingEnquiryStub).to.be.calledWith({}, {sessions: this.sessions});
            });

            describe('and the pricing enquiry is successful', function(){
                let('anonPricingEnquiryStubPromise', function(){
                    var deferred = $q.defer();
                    deferred.resolve({price: 69.0000});
                    return deferred.promise;
                });
                it('should set the price as the total price', function(){
                    expect($injector.get('currentBooking').totalPrice).to.equal("69.00")
                });
                it('should then make a call to `Bookings`', function(){
                    expect(anonSaveStub).to.be.calledWith({ section: 'Bookings' }, {customer: this.customer, sessions: this.sessions});
                });

                describe('and the Bookings API call is successful', function(){
                    let('anonBookingsSavePromise', function(){
                        var deferred = $q.defer();
                        deferred.resolve([this.booking]);
                        return deferred.promise;
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
            describe('and the pricing enquiry fails', function(){
                let('anonPricingEnquiryStubPromise', function(){
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
        describe('and a discountPrice has been applied', function(){
            let('discountPrice', function(){
                return {
                    amount: 80,
                    currency: 'USD',
                    discountPercent: 20
                }
            });
            it('should hide the apply discount code input', function(){
                expect($testRegion.find('apply-discount-code').hasClass('ng-hide')).to.be.true;
            });
            it('should show the discount applied price', function(){
                expect($testRegion.find('.applied-discount-price').hasClass('ng-hide')).to.be.false;
            });
            it('should NOT make a call to get the price', function(){
                expect(anonPricingEnquiryStub).to.not.be.called;
            });
            it('should then make a call to `Bookings`', function(){
                expect(anonSaveStub).to.be.calledWith({ section: 'Bookings' }, {customer: this.customer, sessions: this.sessions});
            });

            describe('and the Bookings API call is successful', function(){
                let('anonBookingsSavePromise', function(){
                    var deferred = $q.defer();
                    deferred.resolve([this.booking]);
                    return deferred.promise;
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
        })
    });
    describe('when coming back from a successful payment', function(){
        let('currentBooking', function(){
            return {
                customer: this.customer,
                filters: this.filters,
                booking: {
                    course: _.first(this.sessions)
                },
                discountPrice: {
                    amount: 80,
                    currency: 'USD',
                    discountPercent: 20,
                    orignalPrice: 100
                }
            }
        });
        it('should show the booking confirmation', function(){
            expect($testRegion.find('.booking-confirmed').hasClass('ng-hide')).to.be.false;
        });
        it('should hide the pay now/pay later/change booking buttons', function(){
            expect($testRegion.find('.button-container').hasClass('ng-hide')).to.be.true;
        });
        it('should hide the apply discount code input', function(){
            expect($testRegion.find('apply-discount-code').hasClass('ng-hide')).to.be.true;
        });
        it('should show the discount applied price', function(){
            expect($testRegion.find('.applied-discount-price').hasClass('ng-hide')).to.be.false;
        });
    });
});