describe('BusinessSetup Coach List', function(){
    
    var scope,
        coachSeekAPIService;

    beforeEach(function() {
        coachSeekAPIService = $injector.get('coachSeekAPIService');
        scope = $rootScope.$new();
    });

    describe('when the page loads', function(){

        var $coachListView, 
            $coachEditView,
            getCoachesStub,
            createCoachStub,
            self,
            templateUrl = 'businessSetup/partials/coachesView.html';
            
        beforeEach(function(){
            self = this;
            self.let('coaches', function(){
                return [];
            });

            getCoachesStub = this.sinon.stub(coachSeekAPIService, 'getCoaches', function(){
                var deferred = $q.defer();
                deferred.resolve(self.coaches);
                return deferred.promise;
            });
            createCoachStub = this.sinon.stub(coachSeekAPIService, 'createCoach', function(){
                var deferred = $q.defer();
                deferred.resolve([{}]);
                return deferred.promise;
            });
        });
        it('should attempt to call getCoaches', function(){
            createViewWithController(scope, templateUrl, 'coachesCtrl');
            expect(getCoachesStub).to.be.calledOnce;
        });
        describe('when getCoaches throws an error', function(){
            var errorMessage = "errorMessage";
            beforeEach(function(){
                getCoachesStub.restore();
                getCoachesStub = this.sinon.stub(coachSeekAPIService, 'getCoaches', function(){
                    var deferred = $q.defer();
                    deferred.reject(new Error(errorMessage));
                    return deferred.promise;
                });
            });
            it('should throw', function(){
                expect(createViewWithController(scope, templateUrl, 'coachesCtrl')).to.throw;
            });
            it('should display an error message', function(){
                createViewWithController(scope, templateUrl, 'coachesCtrl');
                expect($rootScope.alerts[0].type).to.equal('danger');
                expect($rootScope.alerts[0].message).to.equal('businessSetup:' + errorMessage);
            });
        });
        describe('and there are no coaches', function(){
            beforeEach(function(){
                createViewWithController(scope, templateUrl, 'coachesCtrl');
                $coachEditView = $testRegion.find('.coach-item-view');
            });
            it('should not show the coach list view', function(){
                expect($testRegion.find('.coach-list-view').hasClass('ng-hide')).to.be.true;
            });
            it('should show the coach edit view', function(){
                expect($testRegion.find('.coach-item-view').hasClass('ng-hide')).to.be.false;
            });
            it('should attempt to create a coach', function(){
                expect(createCoachStub).to.be.calledOnce;
            });
            it('should not show the cancel button', function(){
                expect($coachEditView.find('.cancel-button').hasClass('ng-hide')).to.be.true;
            });
        });
        describe('and there are one or more coaches', function(){
            beforeEach(function(){
                self.let('firstCoach', function(){
                    return {
                        firstName: "Test",
                        lastName: "User",
                        email: "test@example.com",
                        phone: "9090909"
                    }
                })

                self.let('coaches', function(){
                    return [self.firstCoach, {}];
                });

                createViewWithController(scope, templateUrl, 'coachesCtrl');
                $coachListView = $testRegion.find('.coach-list-view');
                $coachEditView = $testRegion.find('.coach-item-view');
            });
            it('should show the coach list view', function(){
                expect($coachListView.hasClass('ng-hide')).to.be.false;
            });
            it('should have as many list entries as coaches', function(){
                expect($coachListView.find('.coach-details').length).to.equal(self.coaches.length)
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
                        saveCoachStub = this.sinon.stub(coachSeekAPIService, 'saveCoach', function(){
                            var deferred = $q.defer();
                            deferred.resolve([{}]);
                            return deferred.promise;
                        });
                    });
                    describe('when the form is invalid', function(){
                        describe('when the firstName is invalid', function(){
                            it('should display an invalid input alert', function(){
                                scope.item.firstName = null;
                                scope.$apply();
                                $coachEditView.find('.save-button').trigger('click');

                                expect($rootScope.alerts[0].type).to.equal('warning');
                                expect($rootScope.alerts[0].message).to.equal('businessSetup:firstName-invalid');
                            });
                        });
                        describe('when the lastName is invalid', function(){
                            it('should display an invalid input alert', function(){
                                scope.item.lastName = null;
                                scope.$apply();
                                $coachEditView.find('.save-button').trigger('click');

                                expect($rootScope.alerts[0].type).to.equal('warning');
                                expect($rootScope.alerts[0].message).to.equal('businessSetup:lastName-invalid');
                            });
                        });
                        describe('when the phone is invalid', function(){
                            it('should display an invalid input alert', function(){
                                scope.item.phone = null;
                                scope.$apply();
                                $coachEditView.find('.save-button').trigger('click');

                                expect($rootScope.alerts[0].type).to.equal('warning');
                                expect($rootScope.alerts[0].message).to.equal('businessSetup:phone-invalid');
                            });
                        });
                        describe('when the email is invalid', function(){
                            it('should display an invalid input alert', function(){
                                scope.item.email = "badEmail.com";
                                scope.$apply();
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
                        beforeEach(function(){
                            scope.itemList.push(angular.copy(self.firstCoach));
                            $coachEditView.find('.save-button').trigger('click');
                        });
                        it('should display an alert', function(){
                            expect($rootScope.alerts[0].type).to.equal('warning');
                            expect($rootScope.alerts[0].message).to.equal('businessSetup:name-already-exists');
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
                        scope.$apply();

                        $rootScope.alerts.push({type: 'warning', message: 'test alert'});

                        $coachEditView.find('.cancel-button').trigger('click');
                    });
                    it('should reset all edits made', function(){
                        var unsavedCoach = scope.itemList.pop();

                        expect(unsavedCoach.firstName).to.equal(self.firstCoach.firstName);
                        expect(unsavedCoach.lastName).to.equal(self.firstCoach.lastName);
                        expect(unsavedCoach.email).to.equal(self.firstCoach.email);
                        expect(unsavedCoach.phone).to.equal(self.firstCoach.phone);
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
                it('should attempt to create a coach', function(){
                    expect(createCoachStub).to.be.calledOnce;
                });
                it('should not show the coach list view', function(){
                    expect($testRegion.find('.coach-list-view').hasClass('ng-hide')).to.be.true;
                });
                it('should show the coach edit view', function(){
                    expect($testRegion.find('.coach-item-view').hasClass('ng-hide')).to.be.false;
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
        describe('when navigating to services before adding a coach', function(){
            beforeEach(function(){

                createViewWithController(scope, 'businessSetup/partials/businessSetup.html', 'coachesCtrl');
                $state.go('businessSetup.coachList');
                scope.$digest();

                // anchor tags dont listen to $.trigger('click') for some reason. assholes.
                $state.go('businessSetup.services');
                scope.$digest();
            });
            it('should not allow navigation', function(){
                expect($location.path()).to.equal('/business-setup/coach-list');
            });
            it('should show a warning message', function(){
                expect($rootScope.alerts[0].type).to.equal('warning');
                expect($rootScope.alerts[0].message).to.equal('businessSetup:add-coach-warning');
            });
            describe('after adding a coach', function(){
                beforeEach(function(){
                    scope.itemList = [{}];

                    $state.go('businessSetup.services');
                    scope.$digest();
                });
                it('should allow navigation', function(){
                    expect($location.path()).to.equal('/business-setup/services');
                });
            });
        });
    });
});