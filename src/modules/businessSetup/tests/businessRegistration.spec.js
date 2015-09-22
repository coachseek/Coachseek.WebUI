describe('BusinessSetup Register', function(){
    let('business', function(){
        return {
            name: "West Coast Toast",
            sport: "tiddlywinks",
            currency: "USD"
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