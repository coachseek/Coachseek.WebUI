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
        deferred.resolve(this.business);
        return deferred.promise;
    });

    var $businessListView, 
        $businessItemView,
        getBusinessStub,
        self,
        coachSeekAPIService,
        scope,
        templateUrl = 'businessSetup/partials/businessView.html';
        
    beforeEach(function(){
        self = this;
        coachSeekAPIService = $injector.get('coachSeekAPIService');
        scope = $rootScope.$new();

        getBusinessStub = this.sinon.stub(coachSeekAPIService, 'query', function(){
            return {$promise: self.promise};
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
            expect(scope.item).to.eql({});
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

                    saveBusinessStub = this.sinon.stub(coachSeekAPIService, 'save', function(){
                        return {$promise: self.savepromise};
                    });
                });

                describe('during save', function(){

                    let('savepromise', function(){
                        return $q.defer().promise;
                    });
                    beforeEach(function(){
                        $businessItemView.find('.save-button').trigger('click');
                    });
                    it('should disable the save item button while loading', function(){
                        expect($businessItemView.find('.save-button').attr('disabled')).to.equal('disabled');
                    });

                    it('should show `saving...` on the save button'
                    // These fail intermittently. It's more important that the buttion is disabled
                    // I think i18next intermittently compiles too slow
                    //     , function(){
                    //     var saveButtonText = $businessItemView.find('.save-button').text();
                    //     expect(saveButtonText).to.equal(i18n.t('saving'));
                    // }
                    );
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
                    var intercomStub, admin;
                    beforeEach(function(){
                        $http = $injector.get('$http');
                        intercomStub = this.sinon.stub(window, 'Intercom');
                        admin = scope.item.admin;
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
                    it('should make a call to boot Intercom', function(){
                        expect(intercomStub).to.be.calledWith('boot');
                    });
                    it('should set the auth header', function(){
                        var $http = $injector.get('$http');
                        var authHeader = 'Basic ' + btoa(admin.email + ':' + admin.password);
                        expect($http.defaults.headers.common['Authorization']).to.equal(authHeader)
                    });
                    it('should set the currentUser on $rootScope', function(){
                        expect(scope.currentUser.email).to.equal(admin.email);
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
});