describe('BusinessSetup Business', function(){
    
    var scope,
        coachSeekAPIService;

    beforeEach(function() {
        coachSeekAPIService = $injector.get('coachSeekAPIService');
        scope = $rootScope.$new();
    });

    describe('when the page loads', function(){

        var $businessListView, 
            $businessEditView,
            getBusinessStub,
            createBusinessStub,
            self,
            templateUrl = 'businessSetup/partials/businessView.html';
            
        beforeEach(function(){
            self = this;
            self.let('business', function(){
                return {};
            });

            getBusinessStub = this.sinon.stub(coachSeekAPIService, 'getBusiness', function(){
                var deferred = $q.defer();
                deferred.resolve(self.business);
                return deferred.promise;
            });
            createBusinessStub = this.sinon.stub(coachSeekAPIService, 'createBusiness', function(){
                var deferred = $q.defer();
                deferred.resolve([{}]);
                return deferred.promise;
            });
        });
        it('should attempt to call getBusiness', function(){
            createViewWithController(scope, templateUrl, 'businessCtrl');
            expect(getBusinessStub).to.be.calledOnce;
        });
        describe('when getBusiness throws an error', function(){
            var errorMessage = "errorMessage";
            beforeEach(function(){
                getBusinessStub.restore();
                getBusinessStub = this.sinon.stub(coachSeekAPIService, 'getBusiness', function(){
                    var deferred = $q.defer();
                    deferred.reject(new Error(errorMessage));
                    return deferred.promise;
                });
            });
            it('should throw', function(){
                expect(createViewWithController(scope, templateUrl, 'businessCtrl')).to.throw;
            });
            it('should display an error message', function(){
                createViewWithController(scope, templateUrl, 'businessCtrl');
                expect($rootScope.alerts[0].type).to.equal('danger');
                expect($rootScope.alerts[0].message).to.equal('businessSetup:' + errorMessage);
            });
        });
        describe('and there is no existing business', function(){
            beforeEach(function(){
                createViewWithController(scope, templateUrl, 'businessCtrl');
                $businessEditView = $testRegion.find('.business-item-view');
            });
            it('should not show the business list view', function(){
                expect($testRegion.find('.business-list-view').hasClass('ng-hide')).to.be.true;
            });
            it('should show the business edit view', function(){
                expect($testRegion.find('.business-item-view').hasClass('ng-hide')).to.be.false;
            });
            it('should attempt to create a business', function(){
                expect(createBusinessStub).to.be.calledOnce;
            });
            it('should not show the cancel button', function(){
                expect($businessEditView.find('.cancel-button').hasClass('ng-hide')).to.be.true;
            });
        });
        describe('and there is a business', function(){
            beforeEach(function(){
                self.let('firstBusiness', function(){
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
                    }
                })

                self.let('business', function(){
                    return [self.firstBusiness];
                });

                createViewWithController(scope, templateUrl, 'businessCtrl');
                $businessListView = $testRegion.find('.business-list-view');
                $businessEditView = $testRegion.find('.business-item-view');
            });
            it('should show the business list view', function(){
                expect($businessListView.hasClass('ng-hide')).to.be.false;
            });
            it('should not show the business edit view', function(){
                expect($businessEditView.hasClass('ng-hide')).to.be.true;
            });


            describe('when clicking the edit button', function(){
                beforeEach(function(){
                    $businessListView.find('.edit-business').first().trigger('click');
                });
                it('should not show the business list view', function(){
                    expect($businessListView.hasClass('ng-hide')).to.be.true;
                });
                it('should show the business edit view', function(){
                    expect($businessEditView.hasClass('ng-hide')).to.be.false;
                });
                it('should show the cancel button', function(){
                    expect($businessEditView.find('.cancel-button').hasClass('ng-hide')).to.be.false;
                });
                describe('when clicking the save button', function(){
                    var saveBusinessStub;
                    beforeEach(function(){
                        saveBusinessStub = this.sinon.stub(coachSeekAPIService, 'saveBusiness', function(){
                            var deferred = $q.defer();
                            deferred.resolve([{}]);
                            return deferred.promise;
                        });
                    });
                    describe('when the form is invalid', function(){
                        describe('when the name is invalid', function(){
                            it('should display an invalid input alert', function(){
                                scope.item.business.name = null;
                                scope.$apply();
                                $businessEditView.find('.save-business').trigger('click');

                                expect($rootScope.alerts[0].type).to.equal('warning');
                                expect($rootScope.alerts[0].message).to.equal('businessSetup:name-invalid');
                            });
                        });
                        describe('when the firstName is invalid', function(){
                            it('should display an invalid input alert', function(){
                                scope.item.admin.firstName = null;
                                scope.$apply();
                                $businessEditView.find('.save-business').trigger('click');

                                expect($rootScope.alerts[0].type).to.equal('warning');
                                expect($rootScope.alerts[0].message).to.equal('businessSetup:firstName-invalid');
                            });
                        });
                        describe('when the lastName is invalid', function(){
                            it('should display an invalid input alert', function(){
                                scope.item.admin.lastName = null;
                                scope.$apply();
                                $businessEditView.find('.save-business').trigger('click');

                                expect($rootScope.alerts[0].type).to.equal('warning');
                                expect($rootScope.alerts[0].message).to.equal('businessSetup:lastName-invalid');
                            });
                        });
                        describe('when the email is invalid', function(){
                            it('should display an invalid input alert', function(){
                                scope.item.admin.email = "badEmail.com";
                                scope.$apply();
                                $businessEditView.find('.save-business').trigger('click');

                                expect($rootScope.alerts[0].type).to.equal('warning');
                                expect($rootScope.alerts[0].message).to.equal('businessSetup:email-invalid');
                            });
                        });
                        describe('when the password is invalid', function(){
                            it('should display an invalid input alert', function(){
                                scope.item.admin.password = "short";
                                scope.$apply();
                                $businessEditView.find('.save-business').trigger('click');

                                expect($rootScope.alerts[0].type).to.equal('warning');
                                expect($rootScope.alerts[0].message).to.equal('businessSetup:password-invalid');
                            });
                        });
                    });
                    describe('when all inputs are valid', function(){
                        beforeEach(function(){
                            $businessEditView.find('.save-business').trigger('click');
                        });
                        it('should attempt to save business', function(){
                            expect(saveBusinessStub).to.be.calledOnce;
                        });
                        it('should show the business list view', function(){
                            expect($businessListView.hasClass('ng-hide')).to.be.false;
                        });
                        it('should not show the business edit view', function(){
                            expect($businessEditView.hasClass('ng-hide')).to.be.true;
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
                        scope.$apply();

                        $rootScope.alerts.push({type: 'warning', message: 'test alert'});

                        $businessEditView.find('.cancel-button').trigger('click');
                    });
                    it('should reset all edits made', function(){
                        var unsavedBusiness = scope.itemList.pop();

                        expect(unsavedBusiness.firstName).to.equal(self.firstBusiness.firstName);
                        expect(unsavedBusiness.lastName).to.equal(self.firstBusiness.lastName);
                        expect(unsavedBusiness.email).to.equal(self.firstBusiness.email);
                        expect(unsavedBusiness.phone).to.equal(self.firstBusiness.phone);
                    });
                    it('should remove alert if present', function(){
                        expect($rootScope.alerts.length).to.equal(0);
                    });
                });
            });
        });
        describe('when navigating before adding a business', function(){
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
});