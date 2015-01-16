describe('BusinessSetup Business', function(){
    
    let('business', function(){
        return {
            business: {
                name: "West Coast Toast"
            },
            admin: {
                firstName: "Toast",
                lastName: "Master",
                email: "toastmaster@westcoasttoast.com",
                password: "password"
            }
        };
    });

    let('businesses', function(){
        return [this.business]
    })

    let('promise', function(){
        var deferred = $q.defer();
        deferred.resolve(this.businesses);
        return deferred.promise;
    });

    let('savepromise', function(){
        var deferred = $q.defer();
        deferred.resolve({data:this.business});
        return deferred.promise;
    });

    var $businessListView, 
        $businessItemView,
        businessDefaults,
        getBusinessStub,
        self,
        coachSeekAPIService,
        scope,
        templateUrl = 'businessSetup/partials/businessView.html';
        
    beforeEach(function(){
        self = this;
        coachSeekAPIService = $injector.get('coachSeekAPIService');
        businessDefaults = $injector.get('businessDefaults');
        scope = $rootScope.$new();

        getBusinessStub = this.sinon.stub(coachSeekAPIService, 'getBusiness', function(){
            return self.promise;
        });

        createViewWithController(scope, templateUrl, 'businessCtrl');
        $businessListView = $testRegion.find('.business-list-view');
        $businessItemView = $testRegion.find('.business-item-view');
    });
    it('should attempt to call getBusiness', function(){
        expect(getBusinessStub).to.be.calledOnce;
    });

    describe('and there is no existing business', function(){
        let('businesses', function(){
            return [];
        });

        it('should not show the business list view', function(){
            expect($businessListView.hasClass('ng-hide')).to.be.true;
        });
        it('should show the business edit view', function(){
            expect($businessItemView.hasClass('ng-hide')).to.be.false;
        });
        it('should set the list item to default value', function(){
            expect(scope.item).to.eql(businessDefaults);
        });
        it('should not show the cancel button', function(){
            expect($businessItemView.find('.cancel-button').hasClass('ng-hide')).to.be.true;
        });
    });
    describe('and there is a business', function(){
        it('should show the business list view', function(){
            expect($businessListView.hasClass('ng-hide')).to.be.false;
        });
        it('should not show the business edit view', function(){
            expect($businessItemView.hasClass('ng-hide')).to.be.true;
        });


        describe('when clicking the edit button', function(){
            beforeEach(function(){
                $businessListView.find('.edit-item').first().trigger('click');
            });
            it('should not show the business list view', function(){
                expect($businessListView.hasClass('ng-hide')).to.be.true;
            });
            it('should show the business edit view', function(){
                expect($businessItemView.hasClass('ng-hide')).to.be.false;
            });
            it('should show the cancel button', function(){
                expect($businessItemView.find('.cancel-button').hasClass('ng-hide')).to.be.false;
            });
            describe('when clicking the save button', function(){
                var saveBusinessStub;
                beforeEach(function(){
                    self.savepromise = this.savepromise;

                    saveBusinessStub = this.sinon.stub(coachSeekAPIService, 'saveBusiness', function(){
                        return self.savepromise;
                    });
                });

                describe('during save', function(){

                    let('savepromise', function(){
                        return $q.defer().promise;
                    });

                    it('should disable the save item button while loading', function(){
                        $businessItemView.find('.save-button').trigger('click');
                        expect($businessItemView.find('.save-button').attr('disabled')).to.equal('disabled');
                    });
                });
                describe('when the form is invalid', function(){
                    describe('when the name is invalid', function(){
                        it('should display an invalid input alert', function(){
                            scope.item.business.name = null;
                            scope.$digest();
                            $businessItemView.find('.save-button').trigger('click');

                            expect($rootScope.alerts[0].type).to.equal('warning');
                            expect($rootScope.alerts[0].message).to.equal('businessSetup:name-invalid');
                        });
                    });
                    describe('when the firstName is invalid', function(){
                        it('should display an invalid input alert', function(){
                            scope.item.admin.firstName = null;
                            scope.$digest();
                            $businessItemView.find('.save-button').trigger('click');

                            expect($rootScope.alerts[0].type).to.equal('warning');
                            expect($rootScope.alerts[0].message).to.equal('businessSetup:firstName-invalid');
                        });
                    });
                    describe('when the lastName is invalid', function(){
                        it('should display an invalid input alert', function(){
                            scope.item.admin.lastName = null;
                            scope.$digest();
                            $businessItemView.find('.save-button').trigger('click');

                            expect($rootScope.alerts[0].type).to.equal('warning');
                            expect($rootScope.alerts[0].message).to.equal('businessSetup:lastName-invalid');
                        });
                    });
                    describe('when the email is invalid', function(){
                        it('should display an invalid input alert', function(){
                            scope.item.admin.email = "badEmail.com";
                            scope.$digest();
                            $businessItemView.find('.save-button').trigger('click');

                            expect($rootScope.alerts[0].type).to.equal('warning');
                            expect($rootScope.alerts[0].message).to.equal('businessSetup:email-invalid');
                        });
                    });
                    describe('when the password is invalid', function(){
                        it('should display an invalid input alert', function(){
                            scope.item.admin.password = "short";
                            scope.$digest();
                            $businessItemView.find('.save-button').trigger('click');

                            expect($rootScope.alerts[0].type).to.equal('warning');
                            expect($rootScope.alerts[0].message).to.equal('businessSetup:password-invalid');
                        });
                    });
                });
                describe('when all inputs are valid', function(){
                    beforeEach(function(){
                        $businessItemView.find('.save-button').trigger('click');
                    });
                    it('should attempt to save business', function(){
                        expect(saveBusinessStub).to.be.calledOnce;
                    });
                    it('should show the business list view', function(){
                        expect($businessListView.hasClass('ng-hide')).to.be.false;
                    });
                    it('should not show the business edit view', function(){
                        expect($businessItemView.hasClass('ng-hide')).to.be.true;
                    });
                });
            });
            describe('when clicking the cancel button', function(){
                beforeEach(function(){
                    scope.item = {
                        business: {
                            name: "New Dumb"
                        },
                        admin: {
                            firstName: "Business",
                            lastName: "Thing",
                            email: "newdumb@westcoasttoast.com",
                            password: "passwords"
                        }
                    }
                    scope.$digest();

                    $rootScope.alerts.push({type: 'warning', message: 'test alert'});

                    $businessItemView.find('.cancel-button').trigger('click');
                });
                it('should reset all edits made', function(){
                    var unsavedBusiness = scope.itemList.pop();

                    expect(unsavedBusiness.firstName).to.equal(this.business.firstName);
                    expect(unsavedBusiness.lastName).to.equal(this.business.lastName);
                    expect(unsavedBusiness.email).to.equal(this.business.email);
                    expect(unsavedBusiness.phone).to.equal(this.business.phone);
                });
                it('should remove alert if present', function(){
                    expect($rootScope.alerts.length).to.equal(0);
                });
            });
        });
    });
    describe('when navigating before adding a business', function(){

        let('businesses', function(){
            return [];
        });

        describe('when navigating to locations', function(){
            beforeEach(function(){

                createViewWithController(scope, 'businessSetup/partials/businessSetup.html', 'businessCtrl');
                $state.go('businessSetup.business');
                scope.$digest();

                // anchor tags dont listen to $.trigger('click') for some reason. assholes.
                $state.go('businessSetup.locations');
                scope.$digest();
            });
            it('should not allow navigation', function(){
                expect($location.path()).to.equal('/business-setup/business');
            });
            it('should show a warning message', function(){
                expect($rootScope.alerts[0].type).to.equal('warning');
                expect($rootScope.alerts[0].message).to.equal('businessSetup:add-business-warning');
            });
            describe('after adding a business', function(){
                beforeEach(function(){
                    scope.itemList = [{}];

                    $state.go('businessSetup.locations');
                    scope.$digest();
                });
                it('should allow navigation', function(){
                    expect($location.path()).to.equal('/business-setup/locations');
                });
            });
        });
        describe('when navigating to coachList', function(){
            beforeEach(function(){

                createViewWithController(scope, 'businessSetup/partials/businessSetup.html', 'businessCtrl');
                $state.go('businessSetup.business');
                scope.$digest();

                // anchor tags dont listen to $.trigger('click') for some reason. assholes.
                $state.go('businessSetup.coachList');
                scope.$digest();
            });
            it('should not allow navigation', function(){
                expect($location.path()).to.equal('/business-setup/business');
            });
            it('should show a warning message', function(){
                expect($rootScope.alerts[0].type).to.equal('warning');
                expect($rootScope.alerts[0].message).to.equal('businessSetup:add-business-warning');
            });
            describe('after adding a business', function(){
                beforeEach(function(){
                    scope.itemList = [{}];

                    $state.go('businessSetup.coachList');
                    scope.$digest();
                });
                it('should allow navigation', function(){
                    expect($location.path()).to.equal('/business-setup/coach-list');
                });
            });
        });
        describe('when navigating to services', function(){
            beforeEach(function(){

                createViewWithController(scope, 'businessSetup/partials/businessSetup.html', 'businessCtrl');
                $state.go('businessSetup.business');
                scope.$digest();

                // anchor tags dont listen to $.trigger('click') for some reason. assholes.
                $state.go('businessSetup.services');
                scope.$digest();
            });
            it('should not allow navigation', function(){
                expect($location.path()).to.equal('/business-setup/business');
            });
            it('should show a warning message', function(){
                expect($rootScope.alerts[0].type).to.equal('warning');
                expect($rootScope.alerts[0].message).to.equal('businessSetup:add-business-warning');
            });
            describe('after adding a business', function(){
                beforeEach(function(){
                    scope.itemList = [{}];

                    $state.go('businessSetup.services');
                    scope.$digest();
                });
                it('should allow navigation', function(){
                    expect($location.path()).to.equal('/business-setup/services');
                });
            });
        })
    }); 
});