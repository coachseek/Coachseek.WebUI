describe('Booking Customer Notes View', function(){
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

    let('customerID', function(){
        return 'customer_id';
    });

    let('customer', function(){
        return {
            id: this.customerID,
            customFields: [
                {key: 'noteone', value: 'boobs'},
                {key: 'notetwo', value: 'moreboobs'}
            ]
        }
    });

    let('customerNotes', function(){
        return [{
            key: 'noteone',
            isRequired: true
        },{
            key: 'notetwo',
            isRequired: false
        }]
    });

    let('anonSavePromise', function(){
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
    });

    let('subdomain', function(){
        return 'testsubdomain';
    });

    var self, anonStub, anonSaveStub, $stateStub, scope;
    beforeEach(function(){
        self = this;
        self.anonSavePromise = this.anonSavePromise;
        $injector.get('currentBooking').filters = this.filters;
        $injector.get('currentBooking').customerId = this.customerId;
        $injector.get('currentBooking').customerNotes = this.customerNotes;
        $injector.get('currentBooking').customFields = this.customer.customFields;
        $injector.get('sessionService').business = this.business;

        locationStub.restore();
        this.sinon.stub($injector.get('$location'), 'host', function(){
            return self.subdomain;
        });

        $stateStub = this.sinon.stub($state, 'go');

        onlineBookingAPIFactory = $injector.get('onlineBookingAPIFactory');

        anonSaveStub = this.sinon.stub(onlineBookingAPIFactory.anon(), 'save', function(){
            return {$promise: self.anonSavePromise};
        });

        anonStub = this.sinon.stub(onlineBookingAPIFactory, 'anon', function(){
            return {
                save: anonSaveStub
            }
        });

        var bookingScope = $rootScope.$new();
        scope = bookingScope.$new();
        createViewWithController(bookingScope, 'booking/partials/booking.html', 'bookingCtrl');
        createViewWithController(scope, 'booking/partials/bookingCustomerNotes.html', 'bookingCustomerNotesCtrl');
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
    describe('when there are no customerNotes', function(){
        let('customerNotes', function(){
            return [];
        });
        it('should navigate to selection view', function(){
            expect($stateStub).to.be.calledWith('booking.details');
        });
    });
    describe('when location and service have been selected', function(){
        describe('when all required fields have been filled out', function(){
            it('should enable the continue button', function(){
                expect($testRegion.find('.booking-customer-notes button.continue-button').attr('disabled')).to.equal(undefined);
            });
            describe('and then clicking the continue button', function(){
                beforeEach(function(){
                    $testRegion.find('.booking-customer-notes button.continue-button').trigger('click');
                });
                it('should attempt to save the customer notes', function(){
                    expect(anonStub).to.be.calledWith(this.business.domain);
                    expect(anonSaveStub).to.be.calledWith({ section: 'Customers', id: this.customerId }, {customFields: this.customer.customFields});
                });
                it('should navigate to booking confirmation view', function(){
                    expect($stateStub).to.be.calledWith('booking.confirmation');
                });
            })
        });
        describe('when all required fields have NOT been filled out', function(){
            let('customer', function(){
                return {
                    id: this.customerID,
                    customFields: [
                        {key: 'noteone'},
                        {key: 'notetwo', value: 'moreboobs'}
                    ]
                }
            });
            it('should disabled the continue button', function(){
                expect($testRegion.find('.booking-customer-notes button.continue-button').attr('disabled')).to.equal('disabled')
            });
        });
    });
});