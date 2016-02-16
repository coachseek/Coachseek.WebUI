describe('applyDiscountCode Directive', function(){
    let('business', function(){
        return {
            domain: "bizname"
        }
    });

    let('discountCode', function(){
        return 'BOOBS'
    });

    let('anonPricingEnquiryStubPromise', function(){
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
    })

    var scope, anonStub, anonPricingEnquiryStub;
    beforeEach(function(){
        var self = this;
        scope = $rootScope.$new();
        scope.business = this.business;
        scope.discountCode = this.discountCode;
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
                expect(anonPricingEnquiryStub).to.be.calledOnce;
                // expect(anonPricingEnquiryStub).to.be.calledWith({}, {sessions: this.sessions});
            });
            // describe('when the discount code is verfied');
            // describe('when the discount code is NOT verfied');
        });
    });
});