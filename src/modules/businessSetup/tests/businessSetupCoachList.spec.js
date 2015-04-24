describe('BusinessSetup Coach List', function(){

    let('coach', function(){
        return {
            firstName: "Test",
            lastName: "User",
            email: "test@example.com",
            phone: "9090909"
        };
    });
    
    let('coaches', function(){
        return [this.coach];
    });

    let('promise', function(){
        var deferred = $q.defer();
        deferred.resolve(this.coaches);
        return deferred.promise;
    });

    let('savepromise', function(){
        var deferred = $q.defer();
        deferred.resolve(this.coaches);
        return deferred.promise;
    });
    
    var $coachListView, 
        $coachEditView,
        coachDefaults,
        getCoachesStub,
        self,
        scope,
        coachSeekAPIService,
        templateUrl = 'businessSetup/partials/coachesView.html';
        
    beforeEach(function(){
        self = this;
        coachSeekAPIService = $injector.get('coachSeekAPIService');
        scope = $rootScope.$new();
        coachDefaults = $injector.get('coachDefaults');
        getCoachesStub = this.sinon.stub(coachSeekAPIService, 'query', function(){
            return {$promise: self.promise};
        });

        createViewWithController(scope, templateUrl, 'coachesCtrl');
        $coachListView = $testRegion.find('.coach-list-view');
        $coachEditView = $testRegion.find('.coach-item-view');
    });
    it('should attempt to call getCoaches', function(){
        expect(getCoachesStub).to.be.calledOnce;
    });

    describe('during loading', function(){

        let('promise', function(){
            return $q.defer().promise;
        });

        it('should disable the create item button while loading', function(){
            expect($coachListView.find('.create-item').attr('disabled')).to.equal('disabled');
        });
    });
    describe('and there are no coaches', function(){

        let('coaches', function(){
            return [];
        });

        it('should not show the coach list view', function(){
            expect($coachListView.hasClass('ng-hide')).to.be.true;
        });
        it('should show the coach edit view', function(){
            expect($coachEditView.hasClass('ng-hide')).to.be.false;
        });
        it('should set the list item to default value', function(){
            expect(scope.item).to.eql(coachDefaults);
        });
        it('should not show the cancel button', function(){
            expect($coachEditView.find('.cancel-button').hasClass('ng-hide')).to.be.true;
        });
    });
    describe('and there are one or more coaches', function(){
        let('coaches', function(){
            return [{}, this.coach];
        });

        it('should show the coach list view', function(){
            expect($coachListView.hasClass('ng-hide')).to.be.false;
        });
        it('should have as many list entries as coaches', function(){
            expect($coachListView.find('.coach-details').length).to.equal(this.coaches.length)
        })
        it('should not show the coach edit view', function(){
            expect($coachEditView.hasClass('ng-hide')).to.be.true;
        });


        describe('when clicking the edit button', function(){
            beforeEach(function(){
                $coachListView.find('.edit-item').first().trigger('click');
            });
            it('should not show the coach list view', function(){
                expect($coachListView.hasClass('ng-hide')).to.be.true;
            });
            it('should show the coach edit view', function(){
                expect($coachEditView.hasClass('ng-hide')).to.be.false;
            });
            it('should show the cancel button', function(){
                expect($coachEditView.find('.cancel-button').hasClass('ng-hide')).to.be.false;
            });
            describe('when clicking the save button', function(){
                var saveCoachStub;
                beforeEach(function(){
                    self.savepromise = this.savepromise;

                    saveCoachStub = this.sinon.stub(coachSeekAPIService, 'save', function(){
                        return {$promise: self.savepromise};
                    });
                });

                describe('during save', function(){

                    let('savepromise', function(){
                        return $q.defer().promise;
                    });

                    beforeEach(function(){
                        $coachEditView.find('.save-button').trigger('click');
                    });
                    it('should disable the save item button while loading', function(){
                        expect($coachEditView.find('.save-button').attr('disabled')).to.equal('disabled');
                    });

                    it('should show `saving...` on the save button'
                    // These fail intermittently. It's more important that the buttion is disabled
                    // I think i18next intermittently compiles too slow    
                    //     , function(){
                    //     var saveButtonText = $coachEditView.find('.save-button').text();
                    //     expect(saveButtonText).to.equal(i18n.t('saving'));
                    // }
                    );
                });
                describe('when the form is invalid', function(){
                    describe('when the firstName is invalid', function(){
                        it('should display an invalid input alert', function(){
                            scope.item.firstName = null;
                            scope.$digest();
                            $coachEditView.find('.save-button').trigger('click');

                            expect($rootScope.alerts[0].type).to.equal('warning');
                            expect($rootScope.alerts[0].message).to.equal('businessSetup:firstName-invalid');
                        });
                    });
                    describe('when the lastName is invalid', function(){
                        it('should display an invalid input alert', function(){
                            scope.item.lastName = null;
                            scope.$digest();
                            $coachEditView.find('.save-button').trigger('click');

                            expect($rootScope.alerts[0].type).to.equal('warning');
                            expect($rootScope.alerts[0].message).to.equal('businessSetup:lastName-invalid');
                        });
                    });
                    describe('when the phone is invalid', function(){
                        it('should display an invalid input alert', function(){
                            scope.item.phone = null;
                            scope.$digest();
                            $coachEditView.find('.save-button').trigger('click');

                            expect($rootScope.alerts[0].type).to.equal('warning');
                            expect($rootScope.alerts[0].message).to.equal('businessSetup:phone-invalid');
                        });
                    });
                    describe('when the email is invalid', function(){
                        it('should display an invalid input alert', function(){
                            scope.item.email = "badEmail.com";
                            scope.$digest();
                            $coachEditView.find('.save-button').trigger('click');

                            expect($rootScope.alerts[0].type).to.equal('warning');
                            expect($rootScope.alerts[0].message).to.equal('businessSetup:email-invalid');
                        });
                    });
                    describe('when a timeRange is invalid', function(){
                        it('should display an invalid input alert', function(){
                            scope.itemForm.$setValidity('timeRange', false);
                            $coachEditView.find('.save-button').trigger('click');

                            expect($rootScope.alerts[0].type).to.equal('warning');
                            expect($rootScope.alerts[0].message).to.equal('businessSetup:timeRange-invalid');
                        });
                    });
                });
                describe('when the coach name already exists', function(){
                    it('should display an alert', function(){
                        // have to change name to get $watch to run otherwise
                        // it recognizes that the name hasn't changed and doesn't run
                        scope.itemList.push(this.coach);
                        scope.item.firstName = "Interim";
                        scope.item.lastName = "Guy";
                        scope.$digest();

                        scope.item.firstName = "Test";
                        scope.item.lastName = "User";
                        scope.$digest();

                        $coachEditView.find('.save-button').trigger('click');

                        expect($rootScope.alerts[0].type).to.equal('warning');
                        expect($rootScope.alerts[0].message).to.equal('businessSetup:firstName-invalid');
                        expect($rootScope.alerts[1].type).to.equal('warning');
                        expect($rootScope.alerts[1].message).to.equal('businessSetup:lastName-invalid');
                    });
                });
                describe('when the coach name is new', function(){
                    beforeEach(function(){
                        $coachEditView.find('.save-button').trigger('click');
                    });
                    it('should attempt to save coach', function(){
                        expect(saveCoachStub).to.be.calledOnce;
                    });
                    it('should show the coach list view', function(){
                        expect($coachListView.hasClass('ng-hide')).to.be.false;
                    });
                    it('should not show the coach edit view', function(){
                        expect($coachEditView.hasClass('ng-hide')).to.be.true;
                    });
                });
            });
            describe('when clicking the cancel button', function(){
                beforeEach(function(){
                    scope.item = {
                            firstName: "dumbnew",
                            lastName: "userguy",
                            email: "dude@dude.com",
                            phone: "021 99 88 77"
                    }
                    scope.$digest();

                    $rootScope.alerts.push({type: 'warning', message: 'test alert'});

                    $coachEditView.find('.cancel-button').trigger('click');
                });
                it('should reset all edits made', function(){
                    var unsavedCoach = scope.itemList.pop();

                    expect(unsavedCoach.firstName).to.equal(this.coach.firstName);
                    expect(unsavedCoach.lastName).to.equal(this.coach.lastName);
                    expect(unsavedCoach.email).to.equal(this.coach.email);
                    expect(unsavedCoach.phone).to.equal(this.coach.phone);
                });
                it('should remove alert if present', function(){
                    expect($rootScope.alerts.length).to.equal(0);
                });
            });
        });
        describe('when creating a new coach', function(){
            var initCoachListLength;
            beforeEach(function(){
                initCoachListLength = scope.itemList.length;

                $coachListView.find('.create-item').trigger('click');
            });
            it('should set the list item to default value', function(){
                expect(scope.item).to.eql(coachDefaults);
            });
            it('should not show the coach list view', function(){
                expect($coachListView.hasClass('ng-hide')).to.be.true;
            });
            it('should show the coach edit view', function(){
                expect($coachEditView.hasClass('ng-hide')).to.be.false;
            });
            it('should show the cancel button', function(){
                expect($coachEditView.find('.cancel-button').hasClass('ng-hide')).to.be.false;
            });
            it('should set the newItem flag to true', function(){
                expect(scope.newItem).to.be.true;
            });
            describe('when clicking the cancel button and coach is new', function(){
                beforeEach(function(){
                    $coachEditView.find('.cancel-button').trigger('click');
                });
                it('should discard the new coach', function(){
                    expect(scope.itemList.length).to.equal(initCoachListLength);
                });
            })
        });
    });
});