describe('bookingDiscountCodes Directive', function(){
    let('business', function(){
        return {
            domain: 'bizdomain',
            name: 'BIZBALLZ',
            payment: {
                isOnlinePaymentEnabled: false,
                paymentProvider: "PayPal",
                useProRataPricing: true
            }
        }
    });

    let('discountCodes', function(){
        return [{}, {}]
    });

    var scope, queryStub, saveStub;
    beforeEach(function(){
        var self = this;
        scope = $rootScope.$new();
        scope.business = this.business;

        queryStub = this.sinon.stub($injector.get('coachSeekAPIService'), 'query', function(){
            var deferred = $q.defer();
            deferred.resolve(self.discountCodes);
            return {$promise: deferred.promise};
        });

        saveStub = this.sinon.stub($injector.get('coachSeekAPIService'), 'save', function(){
            var deferred = $q.defer();
            deferred.resolve({});
            return {$promise: deferred.promise};
        });

        createDirective(scope, '<manage-discount-codes></manage-discount-codes>');
    });
    it('should attempt to get existing discount codes', function(){
        expect(queryStub).to.be.calledWith({section: 'DiscountCodes'});
    });
    it('should hide the new discount code form', function(){
        expect($testRegion.find('.new-discount-code-container').hasClass('ng-hide')).to.be.true;
    });
    it('should show as many bookingDiscounts as are returned', function(){
        expect(_.size($testRegion.find('booking-discount-code'))).to.equal(_.size(this.discountCodes));
    });
    describe('when clicking on the add discount button', function(){
        let('discountCodes', function(){
            return []
        });
        beforeEach(function(){
            $testRegion.find('.show-add-discount-code button').trigger('click');
        });
        it('should show the new discount code form', function(){
            expect($testRegion.find('.new-discount-code-container').hasClass('ng-hide')).to.be.false;
        });
        describe('and then clicking the cancel button', function(){
            beforeEach(function(){
                $testRegion.find('.new-discount-code-container i.fa-times').trigger('click');
            });
            it('should hide the new discount form', function(){
                expect($testRegion.find('.new-discount-code-container').hasClass('ng-hide')).to.be.true;
            });
        });
        describe('when saving the new discount form', function(){
            describe('and the form is invalid', function(){
                beforeEach(function(){
                    $testRegion.find('.new-discount-code-container .code-input-container input').val('').trigger('input');
                    $testRegion.find('.new-discount-code-save-container button.save-button').trigger('click');
                });
                it('should not save the discount code', function(){
                    expect(saveStub).to.not.be.called;
                });
            });
            describe('and the form is valid', function(){
                var discountCode;
                beforeEach(function(){
                    discountCode = "BOOBS";
                    $testRegion.find('.new-discount-code-container .discount-input-container input').val(10).trigger('input');
                    $testRegion.find('.new-discount-code-container .code-input-container input').val(discountCode).trigger('input');
                    $testRegion.find('.new-discount-code-save-container button.save-button').trigger('click');
                });
                it('should save the discount code', function(){
                    expect(saveStub).to.be.calledWith({section: 'DiscountCodes'}, {code:discountCode, discountPercent: 10});
                });
                it('should hide the new discount code form', function(){
                    expect($testRegion.find('.new-discount-code-container').hasClass('ng-hide')).to.be.true;
                });
            });
        });
    });
});