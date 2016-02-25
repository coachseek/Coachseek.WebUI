describe('bookingDiscountCode Directive', function(){
    let('business', function(){
        return {
            name: 'BIZBALLZ'
        }
    });

    let('discountCode', function(){
        return {
            id: 'code_id',
            code: 'BOOBS',
            discountPercent: 31,
            isActive: true
        }
    });

    var scope, saveStub;
    beforeEach(function(){
        scope = $rootScope.$new();
        scope.business = this.business;
        scope.discountCode = this.discountCode;

        saveStub = this.sinon.stub($injector.get('coachSeekAPIService'), 'save', function(){
            var deferred = $q.defer();
            deferred.resolve({});
            return {$promise: deferred.promise};
        });

        createDirective(scope, '<booking-discount-code></booking-discount-code>');
    });
    it('should set the correct state on the template', function(){
        expect($testRegion.find('.discount-code-display .discount-percent').text()).to.equal(this.discountCode.discountPercent+'%');
        expect($testRegion.find('.discount-code-display .discount-code').text()).to.equal(this.discountCode.code);
        expect($testRegion.find('toggle-switch input').prop('checked')).to.equal(this.discountCode.isActive);
    });
    it('should initial hide the edit form and show the display code', function(){
        expect($testRegion.find('.edit-code-container').hasClass('ng-hide')).to.be.true;
        expect($testRegion.find('.display-code-container').hasClass('ng-hide')).to.be.false;
    });
    describe('when clicking on the display code container', function(){
        beforeEach(function(){
            $testRegion.find('.display-code-container').trigger('click');
        });
        it('should show the edit form and hide the display view', function(){
            expect($testRegion.find('.edit-code-container').hasClass('ng-hide')).to.be.false;
            expect($testRegion.find('.display-code-container').hasClass('ng-hide')).to.be.true;
        });
        describe('when clicking the save button', function(){
            beforeEach(function(){
                $testRegion.find('.edit-code-container i.fa-save').trigger('click');
            });
            describe('and the input is valid', function(){
                it('should attempt to save the code', function(){
                    expect(saveStub).to.be.calledWith({ section: "DiscountCodes" }, this.discountCode);
                });
            });
            describe('and the input is invalid', function(){
                 let('discountCode', function(){
                     return {
                         id: 'code_id',
                         code: '',
                         discountPercent: 31,
                         isActive: true
                     }
                 });
                it('should NOT attempt to save the note', function(){
                    expect(saveStub).to.not.be.called;
                });
            });
        });
        describe('when hitting enter button', function(){
            beforeEach(function(){
                var e = jQuery.Event("keydown");
                e.which = 13; // # Some key code value
                $testRegion.find('.edit-code-container form').trigger(e);
            });
            describe('and the input is valid', function(){
                it('should attempt to save the code', function(){
                    expect(saveStub).to.be.calledWith({ section: "DiscountCodes" }, this.discountCode);
                });
            });
            describe('and the input is invalid', function(){
                 let('discountCode', function(){
                     return {
                         id: 'code_id',
                         code: '',
                         discountPercent: 31,
                         isActive: true
                     }
                 });
                it('should NOT attempt to save the code', function(){
                    expect(saveStub).to.not.be.called;
                });
            });
        });
        describe('when blurring the input', function(){
            beforeEach(function(){
                $testRegion.find('.edit-code-container form').trigger('blur');
            });
            describe('and the input is valid', function(){
                it('should attempt to save the code', function(){
                    expect(saveStub).to.be.calledWith({ section: "DiscountCodes" }, this.discountCode);
                });
            });
            describe('and the input is invalid', function(){
                 let('discountCode', function(){
                     return {
                         id: 'code_id',
                         code: '',
                         discountPercent: 31,
                         isActive: true
                     }
                 });
                it('should NOT attempt to save the code', function(){
                    expect(saveStub).to.not.be.called;
                });
            });
        });
        describe('when hitting esc', function(){
            beforeEach(function(){
                $testRegion.find('.edit-code-container form input').val('BOOBS').trigger('input');
                var e = jQuery.Event("keydown");
                e.which = 27; // # Some key code value
                $testRegion.find('.edit-code-container form').trigger(e);
            });
            it('should cancel the edit', function(){
                expect($testRegion.find('.code-input-container input').val()).to.equal(this.discountCode.code);
            });
            it('should NOT attempt to save the code', function(){
                //in reality it saves because focus is blurred but at least it saves the old state
                expect(saveStub).to.not.be.called;
            });
        });
    });
    describe('when changing the isActive toggle', function(){
        beforeEach(function(){
            $testRegion.find('.edit-code-container form input').val('BOOBS').trigger('input');
            $testRegion.find('toggle-switch input').trigger('click');
        });
        it('should cancel any edits', function(){
            expect($testRegion.find('.discount-input-container input').val()).to.equal(this.discountCode.discountPercent+'');
            expect($testRegion.find('.code-input-container input').val()).to.equal(this.discountCode.code);
        });
        it('should close the edit form', function(){
            expect($testRegion.find('.edit-code-container').hasClass('ng-hide')).to.be.true;
            expect($testRegion.find('.display-code-container').hasClass('ng-hide')).to.be.false;
        });
        it('should attempt to save the code', function(){
            expect(saveStub).to.be.calledWith({ section: "DiscountCodes" }, this.discountCode);
        });
        it('should disable discount percentage and code name', function(){
            expect($testRegion.find('.discount-code-display').attr('disabled')).to.equal('disabled');
        });
        it('should leave isActive switch enabled', function(){
            expect($testRegion.find('toggle-switch').attr('disabled')).to.equal(undefined);
        });
    });
});