describe('Booking Customer Details View', function(){
    let('business', function(){
        return {
            domain: "bizname"
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

    let('customer', function(){
        return {
            firstName: 'One',
            lastName: 'Cuss',
            phone: '8829323',
            email: 'one@guy.com'
        }
    });

    let('anonGetPromise', function(){
        return $q.defer().promise;
    });

    let('anonCustomersSavePromise', function(){
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
    });

    let('anonGetCustomFieldPromise', function(){
        return $q.defer().promise;
    });

    let('subdomain', function(){
        return 'testsubdomain';
    });

    var self, anonStub, anonSaveStub, anonGetCustomFieldsStub, $stateStub;
    beforeEach(function(){
        self = this;
        self.anonCustomersSavePromise = this.anonCustomersSavePromise;
        self.anonGetCustomFieldPromise = this.anonGetCustomFieldPromise;
        $injector.get('currentBooking').filters = this.filters;
        $injector.get('currentBooking').customer = this.customer;
        $injector.get('sessionService').business = this.business;

        locationStub.restore();
        this.sinon.stub($injector.get('$location'), 'host', function(){
            return self.subdomain;
        });

        $stateStub = this.sinon.stub($state, 'go');

        onlineBookingAPIFactory = $injector.get('onlineBookingAPIFactory');

        anonSaveStub = this.sinon.stub(onlineBookingAPIFactory.anon(), 'save', function(){
            return {$promise: self.anonCustomersSavePromise};
        });

        anonGetCustomFieldsStub = this.sinon.stub(onlineBookingAPIFactory.anon(), 'getCustomFields', function(){
            return {$promise: self.anonGetCustomFieldPromise}
        });

        anonStub = this.sinon.stub(onlineBookingAPIFactory, 'anon', function(){
            return {
                save: anonSaveStub,
                getCustomFields: anonGetCustomFieldsStub
            }
        });

        var bookingScope = $rootScope.$new();
        var scope = bookingScope.$new();
        createViewWithController(bookingScope, 'booking/partials/booking.html', 'bookingCtrl');
        createViewWithController(scope, 'booking/partials/bookingCustomerDetailsView.html', 'bookingCustomerDetailsCtrl');
        $rootScope.$apply();
    });
    describe('when there is no location selected', function(){
        let('filters', function(){
            return {};
        });
        it('should navigate to selection view', function(){
            expect($stateStub).to.be.calledWith('booking.selection');
        });
    });
    describe('when location and service have been selected', function(){
        describe('when the customer form is valid', function(){
            it('should NOT disable the continue button', function(){
                expect($testRegion.find('.booking-customer-details button.continue-button').attr('disabled')).to.equal(undefined)
            });
            describe('and the continue button is clicked', function(){
                beforeEach(function(){
                    $testRegion.find('.booking-customer-details button.continue-button').trigger('click');
                });
                it('should make a call to save the customer', function(){
                    expect(anonStub).to.be.calledWith(this.business.domain);
                    expect(anonSaveStub).to.be.calledWith({ section: 'Customers' }, this.customer);
                });
                it('should make a call to get the customerNotes', function(){
                    expect(anonStub).to.be.calledWith(this.business.domain);
                    expect(anonGetCustomFieldsStub).to.be.calledWith({});
                });
                describe('when there are active customerNotes', function(){
                    let('anonGetCustomFieldPromise', function(){
                        var deferred = $q.defer();
                        deferred.resolve([{isActive:true}, {isActive:true}]);
                        return deferred.promise;
                    });
                    it('should navigate to the customer notes page', function(){
                        expect($stateStub).to.be.calledWith('booking.notes');
                    });
                });
                describe('when there are NO active customerNotes', function(){
                    let('anonGetCustomFieldPromise', function(){
                        var deferred = $q.defer();
                        deferred.resolve([{isActive:false}]);
                        return deferred.promise;
                    });
                    it('should navigate to the booking confirmation page', function(){
                        expect($stateStub).to.be.calledWith('booking.confirmation');
                    });
                });
            });
        });
        describe('when the customer form is NOT valid', function(){
            let('customer', function(){
                return {
                    phone: '8829323',
                    email: 'one@guy.com'
                }
            });

            it('should disable the continue button', function(){
                expect($testRegion.find('.booking-customer-details button.continue-button').attr('disabled')).to.equal('disabled')
            });
        });
    });
});