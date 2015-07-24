describe('Booking Admin Page', function(){
    let('business', function(){
        return {
            domain: 'bizdomain',
            payment: {
                isOnlinePaymentEnabled: false
            }
        }
    });

    let('savePromise', function(){
        var deferred = $q.defer();
        deferred.resolve();
        return {$promise: deferred.promise};
    });

    let('currentUserEmail', function(){
        return 're@d.e';
    });

    let('environment', function(){
        return 'dev';
    });

    var scope;
    beforeEach(function(){
        scope = $rootScope.$new();
        _.set(scope, 'currentUser.email', this.currentUserEmail)
        $injector.get('sessionService').business = this.business;
        $injector.get('ENV').name = this.environment;
        createViewWithController(scope, 'booking/partials/bookingAdminView.html', 'bookingAdminCtrl');
    });
    it('should show the `Online booking` and `Payment` tabs', function(){
        expect($testRegion.find('.booking-admin-nav-container').hasClass('ng-hide')).to.be.false;
    });
    it('should set the default view to `Online Booking` tab', function(){
        expect(scope.activeTab).to.equal('onlineBooking');
    });
    it('should show the online booking with the correct subdomain', function(){
        expect($testRegion.find('.booking-url').val()).to.equal(this.business.domain + '.testing.coachseek.com');
    });
    it('should show the online booking button with the correct subdomain', function(){
        $timeout.flush();
        expect($testRegion.find('.booking-button-html').val()).to.contain(this.business.domain + '.testing');
    });
    describe('when then environment is production', function(){
        let('environment', function(){
            return 'prod';
        })
        it('should NOT show the `Online booking` and `Payment` tabs', function(){
            expect($testRegion.find('.booking-admin-nav-container').hasClass('ng-hide')).to.be.true;
        });
        it('should show the online booking with the correct subdomain', function(){
            expect($testRegion.find('.booking-url').val()).to.equal(this.business.domain + '.coachseek.com');
        });
        it('should show the online booking button with the correct subdomain', function(){
            $timeout.flush();
            expect($testRegion.find('.booking-button-html').val()).to.contain(this.business.domain);
        });
    });
    describe('when the user is not on the feature whitelist', function(){
        let('environment', function(){
            return 'prod';
        });
        let('currentUserEmail', function(){
            return 'fake@user.com';
        });

        it('should NOT show the `Online booking` and `Payment` tabs', function(){
            expect($testRegion.find('.booking-admin-nav-container').hasClass('ng-hide')).to.be.true;
        });
    });
    describe('when clicking on the payments tab', function(){
        var saveStub;
        beforeEach(function(){
            var self = this;
            self.savePromise = this.savePromise;
            var coachSeekAPIService = $injector.get('coachSeekAPIService');
            saveStub = this.sinon.stub(coachSeekAPIService, 'save', function(){
                return self.savePromise;
            });
            $testRegion.find('.booking-nav.payments').trigger('click');
        });
        it('should show the `Payments` tab', function(){
            expect(scope.activeTab).to.equal('payments');
        });
        describe('when online payments are OFF', function(){
            it('should NOT show the force payment toggle switch or merchant form', function(){
                $forcePaymentMerchantContainer = $testRegion.find('.force-payment-merchant-form-container');
                expect($forcePaymentMerchantContainer.hasClass('ng-hide')).to.be.true;
            });
            describe('when turning online payments ON', function(){
                beforeEach(function(){
                    $testRegion.find('.enable-payment .toggle-bg').trigger('click');
                });
                it('should show the force payment toggle switch and merchant form', function(){
                    $forcePaymentMerchantContainer = $testRegion.find('.force-payment-merchant-form-container');
                    expect($forcePaymentMerchantContainer.hasClass('ng-hide')).to.be.false;
                });
                it('should not make a save call to the API', function(){
                    expect(saveStub).to.not.be.called;
                });
                describe('and the merchant identifier is NOT set', function(){
                    it('should disable the save button', function(){
                        expect($testRegion.find('.save-button ').attr('disabled')).to.equal('disabled')
                    });
                });
                describe('and the merchant identifier is set', function(){
                    let('business', function(){
                        return {
                            domain: 'bizdomain',
                            payment: {
                                merchantAccountIdentifier: 'dude@duder.com',
                                isOnlinePaymentEnabled: false
                            }
                        }
                    });
                    it('should show the saved button in a `Save details` state', function(){
                        expect($testRegion.find('.save-button .save-text').text()).to.contain('Save details')
                    });
                    describe('saving the current details', function(){
                        beforeEach(function(){
                            $testRegion.find('.save-button').trigger('click');
                        });
                        it('should make a save call to the API', function(){
                            expect(saveStub).to.be.calledWith({section: "Business"}, this.business)
                        });
                        it('should set the saved button to a `Saved` state', function(){
                            expect($testRegion.find('.save-button .save-text').text()).to.contain('Saved')
                        });
                        describe('while saving', function(){
                            let('savePromise', function(){
                                var deferred = $q.defer();
                                return {$promise: deferred.promise};
                            });
                            it('should disable the save button', function(){
                                expect($testRegion.find('.save-button ').attr('disabled')).to.equal('disabled')
                            });
                        });
                    });
                });
            });
        });
        describe('when online payments are ON', function(){
            let('business', function(){
                return {
                    domain: 'bizdomain',
                    payment:{
                        isOnlinePaymentEnabled: true
                    }
                }
            }); 
            it('should SHOW the force payment toggle switch and merchant form', function(){
                $forcePaymentMerchantContainer = $testRegion.find('.force-payment-merchant-form-container');
                expect($forcePaymentMerchantContainer.hasClass('ng-hide')).to.be.false;
            });
            describe('and the merchant identifier is NOT set', function(){
                it('should disable the save button', function(){
                    expect($testRegion.find('.save-button ').attr('disabled')).to.equal('disabled')
                });
            });
            describe('and the merchant identifier is set to true', function(){
                let('business', function(){
                    return {
                        domain: 'bizdomain',
                        payment:{
                            merchantAccountIdentifier: 'dude@duder.com',
                            isOnlinePaymentEnabled: true
                        }
                    }
                });
                it('should show the saved button in a `Saved` state', function(){
                    expect($testRegion.find('.save-button .save-text').text()).to.contain('Saved')
                })
            });
            describe('when turning online payments OFF', function(){
                beforeEach(function(){
                    $testRegion.find('.enable-payment .toggle-bg').trigger('click');
                });
                it('should HIDE the force payment toggle switch and merchant form', function(){
                    $forcePaymentMerchantContainer = $testRegion.find('.force-payment-merchant-form-container');
                    expect($forcePaymentMerchantContainer.hasClass('ng-hide')).to.be.true;
                });
                describe('autosave behavior', function(){
                    it('should make a save call to the API', function(){
                        expect(saveStub).to.be.calledWith({section: "Business"}, this.business)
                    });
                    describe('while autosaving', function(){
                        let('savePromise', function(){
                            var deferred = $q.defer();
                            return {$promise: deferred.promise};
                        });
                        it('should disable the online booking toggle switch', function(){
                            expect($testRegion.find('.toggle-switch-container.enable-payment toggle-switch').attr('disabled')).to.equal('disabled')
                        });
                    });
                });
            });
            describe('and the merchant identifier is set to false', function(){
               let('business', function(){
                   return {
                        domain: 'bizdomain',
                        payment: {
                            merchantAccountIdentifier: 'dude@duder.com',
                            isOnlinePaymentEnabled: false
                        }
                   }
               });
               describe('and then turning online payments ON and back to OFF', function(){
                   beforeEach(function(){
                       $testRegion.find('.enable-payment .toggle-bg').trigger('click');
                       $testRegion.find('.enable-payment .toggle-bg').trigger('click');
                   });
                   it('should not make a save call to the API', function(){
                        expect(saveStub).to.not.be.called;
                   });
                });
            });
        });
    });
});