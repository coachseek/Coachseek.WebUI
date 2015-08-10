describe('Booking Module', function() {
    let('business', function(){
        return {
            name: "BIZ NAME",
            domain: this.domain,
            currency: "USD"
        }
    });

    let('domain', function(){
        return 'bizname';
    });

    let('anonGetPromise', function(){
        var defer = $.Deferred();
        return defer.resolve(this.business)
    });

    var anonStub, anonGetStub, scope;
    beforeEach(function(){
        scope = $rootScope.$new();

        var self = this;
        self.business = this.business;
        locationStub.restore();
        this.sinon.stub($injector.get('$location'), 'host', function(){
            return self.business.domain;
        });

        onlineBookingAPIFactory = $injector.get('onlineBookingAPIFactory');
        anonGetStub = this.sinon.stub(onlineBookingAPIFactory.anon(), 'get', function(){
            return {$promise: self.anonGetPromise};
        });

        anonStub = this.sinon.stub(onlineBookingAPIFactory, 'anon', function(){
            return {
                get: anonGetStub
            }
        });
    });

    describe('booking states', function() {
        describe('when navigating to bookingAdmin', function(){
            let('domain', function(){
                return 'app-testing';
            });

            var viewAttrs;
            beforeEach(function(){
                $state.go('bookingAdmin');
                $rootScope.$digest();
            });
            it('should attempt to bring up the login modal', function(){
                expect(loginModalSpy).to.be.calledOnce;
            });
            it('should map to correct template', function(){
                expect($state.current.templateUrl).to.equal('booking/partials/bookingAdminView.html');
            });
            it('should map to the correct controller', function(){
                expect($state.current.controller).to.equal('bookingAdminCtrl');
            });
        });
        describe('when navigating to booking.selection', function(){
            var viewAttrs;
            beforeEach(function(){
                $state.go('booking.selection');
                $rootScope.$digest();

                viewAttrs = $state.current.views['booking-view'];
            });
            it('should NOT attempt to bring up the login modal', function(){
                expect(loginModalSpy).to.be.not.be.called;
            });
            it('should map to correct template', function(){
                expect(viewAttrs.templateUrl).to.equal('booking/partials/bookingSelectionView.html');
            });
            it('should map to the correct controller', function(){
                expect(viewAttrs.controller).to.equal('bookingSelectionCtrl');
            });
        });
        describe('when navigating to booking.details', function(){
            var viewAttrs;
            beforeEach(function(){
                $injector.get('sessionService').business = {};
                $state.go('booking.details');
                $rootScope.$digest();

                viewAttrs = $state.current.views['booking-view'];
            });
            it('should NOT attempt to bring up the login modal', function(){
                expect(loginModalSpy).to.be.not.be.called;
            });
            it('should map to correct template', function(){
                expect(viewAttrs.templateUrl).to.equal('booking/partials/bookingCustomerDetailsView.html');
            });
            it('should map to the correct controller', function(){
                expect(viewAttrs.controller).to.equal('bookingCustomerDetailsCtrl');
            });
        });
        describe('when navigating to booking.confirmation', function(){
            var viewAttrs;
            beforeEach(function(){
                $injector.get('sessionService').business = {};
                $state.go('booking.confirmation');
                $rootScope.$digest();

                viewAttrs = $state.current.views['booking-view'];
            });
            it('should NOT attempt to bring up the login modal', function(){
                expect(loginModalSpy).to.be.not.be.called;
            });
            it('should map to correct template', function(){
                expect(viewAttrs.templateUrl).to.equal('booking/partials/bookingConfirmationView.html');
            });
            it('should map to the correct controller', function(){
                expect(viewAttrs.controller).to.equal('bookingConfirmationCtrl');
            });
        });
    });
});