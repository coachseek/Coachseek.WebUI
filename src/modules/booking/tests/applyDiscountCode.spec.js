describe('applyDiscountCode Directive', function(){
    let('business', function(){
        return {
            domain: "bizname"
        }
    });

    let('discountCode', function(){
        return 'BOOBS'
    });

    let('discountPercent', function(){
        return 20;
    });

    let('originalPrice', function(){
        return 100;
    });

    let('discountPrice', function(){
        return {
            amount: this.originalPrice * ((100 - this.discountPercent)/100),
            currency: 'USD',
            discountPercent: this.discountPercent
        }
    })

    let('anonPricingEnquiryStubPromise', function(){
        var deferred = $q.defer();
        deferred.resolve(this.discountPrice);
        return deferred.promise;
    });

    let('sessions', function(){
        var sessions = [];
        _.times(2, function(index){
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

    let('booking', function(){
        return {
            id: '69',
            sessions: this.sessions
        }
    });

    var scope, anonStub, anonPricingEnquiryStub;
    beforeEach(function(){
        var self = this;
        scope = $rootScope.$new();
        scope.business = this.business;
        scope.discountCode = this.discountCode;
        $injector.get('currentBooking').booking = this.booking;
        $injector.get('currentBooking').totalPrice = this.originalPrice;
        self.anonPricingEnquiryStubPromise = this.anonPricingEnquiryStubPromise;

        var onlineBookingAPIFactory = $injector.get('onlineBookingAPIFactory');

        anonPricingEnquiryStub = this.sinon.stub(onlineBookingAPIFactory.anon(), 'pricingEnquiry', function(){
            return {$promise: self.anonPricingEnquiryStubPromise};
        });

        anonStub = this.sinon.stub(onlineBookingAPIFactory, 'anon', function(){
            return {
                pricingEnquiry: anonPricingEnquiryStub
            }
        });

        createDirective(scope, '<apply-discount-code></apply-discount-code>');
    });
    it('should NOT allow error messages to be shown', function(){
        expect(scope.showDiscountErrors).to.be.false;
    });
    describe('when applying the discount code', function(){
        beforeEach(function(){
            $testRegion.find('.save-button').trigger('click');
        });
        describe('when there is no discount code entered', function(){
            let('discountCode', function(){
                return null;
            });
            it('should not attempt to save', function(){
                expect(anonStub).to.not.be.called;
                expect(anonPricingEnquiryStub).to.not.be.called;
            });
            it('should allow error messages to be shown', function(){
                expect(scope.showDiscountErrors).to.be.true;
            });
        });
        describe('when there is a valid discount code entered', function(){
            it('should attempt to varify the discount code', function(){
                expect(anonStub).to.be.calledWith(this.business.domain);
                expect(anonPricingEnquiryStub).to.be.calledWith({}, {sessions: this.sessions, discountCode: this.discountCode});
            });
            describe('when the discount code is verfied', function(){
                it('should set the correct totalPrice on the currentBooking', function(){
                    expect($injector.get('currentBooking').totalPrice).to.equal(this.discountPrice.amount)
                });
                it('should stop the discount code from loading', function(){
                    expect(scope.discountCodeLoading).to.be.false;
                });
                it('should set the originalPrice on the discountPrice', function(){
                    expect($injector.get('currentBooking').discountPrice.originalPrice).to.equal(this.originalPrice)
                });
            });
            describe('when the discount code is NOT verfied', function(){
                let('anonPricingEnquiryStubPromise', function(){
                   var deferred = $q.defer();
                    deferred.reject({data: [{message: "error"}]});
                   return deferred.promise;
                });
                it('should keep the current price', function(){
                    expect($injector.get('currentBooking').totalPrice).to.equal(this.originalPrice);
                });
                it('should stop the discount code from loading', function(){
                    expect(scope.discountCodeLoading).to.be.false;
                });
            });
        });
    });
});