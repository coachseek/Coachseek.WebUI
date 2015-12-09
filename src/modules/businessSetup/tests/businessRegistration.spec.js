describe('BusinessSetup Register', function(){
    let('business', function(){
        return {
            name: "West Coast Toast"
        }
    });

    let('admin', function(){
        return {
            email: "test@test.com",
            password: "password",
            firstName: "firstName",
            lastName: "lastName",
            phone: '1800BOOBS'
        }
    });

    let('newBusiness', function(){
        return {
            admin: this.admin,
            business: _.assign(this.business, {id: 'bizId'}) 
        };
    });

    let('savepromise', function(){
        var deferred = $q.defer();
        deferred.resolve(this.newBusiness);
        return deferred.promise;
    });

    let('location', function(){
        return {country_code: null};
    });

    var coachSeekAPIService,
        scope,
        templateUrl = 'businessSetup/partials/businessRegistrationView.html';
        
    beforeEach(function(){
        self = this;
        self.savepromise = this.savepromise;
        coachSeekAPIService = $injector.get('coachSeekAPIService');
        scope = $rootScope.$new();
        saveBusinessStub = this.sinon.stub(coachSeekAPIService, 'save', function(){
            return {$promise: self.savepromise};
        });

        this.sinon.stub($, 'getJSON', function(){
            return {done: self.sinon.stub().callsArgWith(0, self.location)};
        });

        createViewWithController(scope, templateUrl, 'businessRegistrationCtrl');
        scope.business = this.business;
        scope.admin = this.admin;
        scope.$digest()
    });
    describe('when hitting the save button', function(){
        var setupCurrentUserSpy, heapIdentifySpy, heapTrackSpy, $stateStub;
        beforeEach(function(){
            setupCurrentUserSpy = this.sinon.spy(scope, 'setupCurrentUser');
            heapIdentifySpy = this.sinon.spy(heap, 'identify');
            heapTrackSpy = this.sinon.spy(heap, 'track');
            $stateStub = this.sinon.stub($state, 'go');

            $testRegion.find('.save-button').trigger('click');
        });
        describe('and the form is valid', function(){
            it('should attempt to save the new business', function(){
                expect(saveBusinessStub).to.be.calledWith({section: 'businessRegistration'}, {admin: this.admin, business: this.business})
            });
            describe('when the country is not found or null', function(){
                it('should set the currency to USD', function(){
                    expect(this.business.currency).to.equal('USD');
                });
            });
            describe('when the country is New Zealand', function(){
                let('location', function(){
                    return {country_code: 'NZ'};
                });

                it('should set the currency to NZD', function(){
                    expect(this.business.currency).to.equal('NZD');
                });
            });
            describe('when the country is Australia', function(){
                let('location', function(){
                    return {country_code: 'AU'};
                });

                it('should set the currency to AUD', function(){
                    expect(this.business.currency).to.equal('AUD');
                });
            });

            var EUCountries = ['AT','BE','CY','EE','FI','FR','DE','GR','IE','IT','LV','LT','LU','MT','NL','PT','SK','SI', 'ES'];
            _.each(EUCountries, function(country){
                describe('when the country is in the EU (' + country + ')', function(){
                    let('location', function(){
                        return {country_code: country};
                    });

                    it('should set the currency to EUR', function(){
                        expect(this.business.currency).to.equal('EUR');
                    });
                });
            });

            describe('when the country is Great Britain', function(){
                let('location', function(){
                    return {country_code: 'GB'};
                });

                it('should set the currency to GBP', function(){
                    expect(this.business.currency).to.equal('GBP');
                });
            });

            describe('when the country is Sweden', function(){
                let('location', function(){
                    return {country_code: 'SE'};
                });

                it('should set the currency to SEK', function(){
                    expect(this.business.currency).to.equal('SEK');
                });
            });

            describe('when the country is South Africa', function(){
                let('location', function(){
                    return {country_code: 'ZA'};
                });

                it('should set the currency to ZAR', function(){
                    expect(this.business.currency).to.equal('ZAR');
                });
            });

            describe('when the country is United States', function(){
                let('location', function(){
                    return {country_code: 'US'};
                });

                it('should set the currency to USD', function(){
                    expect(this.business.currency).to.equal('USD');
                });
            });

            describe('when the country is China', function(){
                let('location', function(){
                    return {country_code: 'CN'};
                });

                it('should set the currency to CNY', function(){
                    expect(this.business.currency).to.equal('CNY');
                });
            });

            describe('when the country is Singapore', function(){
                let('location', function(){
                    return {country_code: 'SG'};
                });

                it('should set the currency to SGD', function(){
                    expect(this.business.currency).to.equal('SGD');
                });
            });

            describe('when the country is not a country', function(){
                let('location', function(){
                    return {country_code: 'BOOBS'};
                });

                it('should set the currency to USD', function(){
                    expect(this.business.currency).to.equal('USD');
                });
            });

            describe('and the save is successful', function(){
                it('attempt to set up current user', function(){
                    expect(setupCurrentUserSpy).to.be.calledWith({
                        email: this.admin.email,
                        password: this.admin.password,
                        firstName: this.admin.firstName,
                        lastName: this.admin.lastName,
                        trialDaysLeft: -15
                    }, this.business);
                });
                it('should navigate to scheduling page', function(){
                    expect($stateStub).to.be.calledWith('scheduling');
                });
                it('should setup heap', function(){
                    expect(heapIdentifySpy).to.be.calledWith({
                        handle: this.newBusiness.business.id,
                        businessName: this.business.name,
                        email: this.admin.email
                    })
                });
                it('should send a New User Signup event to Heap', function(){
                    expect(heapTrackSpy).to.be.calledWith('New User Sign Up');
                });
            });
            describe('and the save fails', function(){
                let('savepromise', function(){
                    var deferred = $q.defer();
                    deferred.reject({data: [{code: 'error'}]});
                    return deferred.promise;
                });
                it('should show an error message', function(){
                    expect($rootScope.alerts[0].type).to.equal('danger');
                    expect($rootScope.alerts[0].code).to.equal('error');
                });
            });
        });
        describe('and the form is invalid', function(){
            let('business', function(){
                return {}
            });
            it('should not attempt to save the new business', function(){
                expect(saveBusinessStub).to.not.be.called;
            });
        });
    });
});