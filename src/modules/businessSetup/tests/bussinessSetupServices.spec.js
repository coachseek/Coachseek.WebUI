describe('bussinessSetup Services', function(){

    var templateUrl = 'businessSetup/partials/servicesView.html',
        $serviceItemView,
        $serviceListView,
        self,
        scope,
        coachSeekAPIService;
        
    beforeEach(function(){
        coachSeekAPIService = $injector.get('coachSeekAPIService');
        scope = $rootScope.$new();

        self = this;

        self.let('services', function(){
            return [];
        });

        getServicesStub = this.sinon.stub(coachSeekAPIService, 'getServices', function(){
            var deferred = $q.defer();
            deferred.resolve(self.services);
            return deferred.promise;
        });
        createServiceStub = this.sinon.stub(coachSeekAPIService, 'createService', function(){
            var deferred = $q.defer();
            deferred.resolve([{}]);
            return deferred.promise;
        });
    });
    it('should make a call to getServices', function(){
        createViewWithController(scope, templateUrl, 'servicesCtrl');
        expect(getServicesStub).to.be.calledOnce;
    });
    describe('and there are no services', function(){
        beforeEach(function(){
            createViewWithController(scope, templateUrl, 'servicesCtrl');
            $serviceItemView = $testRegion.find('.service-item-view');
        });
        it('should not show the service list view', function(){
            expect($testRegion.find('.service-list-view').hasClass('ng-hide')).to.be.true;
        });
        it('should show the service item view', function(){
            expect($testRegion.find('.service-item-view').hasClass('ng-hide')).to.be.false;
        });
        it('should attempt to create a service', function(){
            expect(createServiceStub).to.be.calledOnce;
        });
        it('should not show the cancel button', function(){
            expect($serviceItemView.find('.cancel-service').hasClass('ng-hide')).to.be.true;
        });
    });
    describe('and there are one or more services', function(){
        beforeEach(function(){
            self.let('firstService', function(){
                return {
                    name: "Test",
                    description: "User",
                    booking: {
                        studentCapacity: 8
                    },
                    pricing: {
                        sessionPrice: 43,
                        coursePrice: 69
                    },
                    repititon: {
                        repeatFrequency: 2
                    }
                }
            })

            self.let('services', function(){
                return [self.firstService, {}];
            });

            createViewWithController(scope, templateUrl, 'servicesCtrl');
            $serviceListView = $testRegion.find('.service-list-view');
            $serviceItemView = $testRegion.find('.service-item-view');
        });
        it('should show the service list view', function(){
            expect($serviceListView.hasClass('ng-hide')).to.be.false;
        });
        it('should have as many list entries as service', function(){
            expect($serviceListView.find('.service-details').length).to.equal(self.services.length)
        })
        it('should not show the service item view', function(){
            expect($serviceItemView.hasClass('ng-hide')).to.be.true;
        });


        describe('when clicking the edit button', function(){
            beforeEach(function(){
                $serviceListView.find('.edit-service').first().trigger('click');
            });
            it('should not show the service list view', function(){
                expect($serviceListView.hasClass('ng-hide')).to.be.true;
            });
            it('should show the service item view', function(){
                expect($serviceItemView.hasClass('ng-hide')).to.be.false;
            });
            it('should show the cancel button', function(){
                expect($serviceItemView.find('.cancel-service').hasClass('ng-hide')).to.be.false;
            });
            describe('when changing the repeatFrequency to -1 or null', function(){
                it('should set the coursePrice to null', function(){
                    scope.item.repititon.repeatFrequency = null;
                    scope.$apply();

                    expect(scope.item.pricing.coursePrice).to.equal(null);
                })
            });
            describe('when clicking the save button', function(){
                var saveServiceStub;
                beforeEach(function(){
                    saveServiceStub = this.sinon.stub(coachSeekAPIService, 'saveService', function(){
                        var deferred = $q.defer();
                        deferred.resolve([{}]);
                        return deferred.promise;
                    });
                });
                describe('when the form is invalid', function(){
                    describe('when the name is invalid', function(){
                        it('should display an invalid input alert', function(){
                            scope.item.name = null;
                            scope.$apply();
                            $serviceItemView.find('.save-service').trigger('click');

                            expect($rootScope.alerts[0].type).to.equal('warning');
                            expect($rootScope.alerts[0].message).to.equal('businessSetup:name-invalid');
                        });
                    });
                    describe('when the studentCapacity is invalid', function(){
                        it('should display an invalid input alert', function(){
                            scope.item.booking.studentCapacity = -1;
                            scope.$apply();
                            $serviceItemView.find('.save-service').trigger('click');

                            expect($rootScope.alerts[0].type).to.equal('warning');
                            expect($rootScope.alerts[0].message).to.equal('businessSetup:studentCapacity-invalid');
                        });
                    });
                    describe('when the sessionPrice is invalid', function(){
                        it('should display an invalid input alert', function(){
                            scope.item.pricing.sessionPrice = -1;
                            scope.$apply();
                            $serviceItemView.find('.save-service').trigger('click');

                            expect($rootScope.alerts[0].type).to.equal('warning');
                            expect($rootScope.alerts[0].message).to.equal('businessSetup:sessionPrice-invalid');
                        });
                    });
                    describe('when the coursePrice is invalid', function(){
                        it('should display an invalid input alert', function(){
                            scope.item.pricing.coursePrice = -1;
                            scope.$apply();
                            $serviceItemView.find('.save-service').trigger('click');

                            expect($rootScope.alerts[0].type).to.equal('warning');
                            expect($rootScope.alerts[0].message).to.equal('businessSetup:coursePrice-invalid');
                        });
                    });
                    describe('and the sessionPrice and coursePrice are invalid', function(){
                        it('should display an alert for both', function(){
                            scope.item.pricing.sessionPrice = -1;
                            scope.item.pricing.coursePrice = -1;
                            scope.$apply();
                            $serviceItemView.find('.save-service').trigger('click');

                            expect($rootScope.alerts[0].type).to.equal('warning');
                            expect($rootScope.alerts[0].message).to.equal('businessSetup:sessionPrice-invalid');
                            expect($rootScope.alerts[1].type).to.equal('warning');
                            expect($rootScope.alerts[1].message).to.equal('businessSetup:coursePrice-invalid');
                        });
                    });
                });
                describe('when the name already exists', function(){
                    beforeEach(function(){
                        scope.itemList.push(angular.copy(self.firstService));
                        $serviceItemView.find('.save-service').trigger('click');
                    });
                    it('should display an alert', function(){
                        expect($rootScope.alerts[0].type).to.equal('warning');
                        expect($rootScope.alerts[0].message).to.equal('businessSetup:service-already-exists');
                    });
                });
                describe('when the name is new', function(){
                    beforeEach(function(){
                        $serviceItemView.find('.save-service').trigger('click');
                    });
                    it('should attempt to save coach', function(){
                        expect(saveServiceStub).to.be.calledOnce;
                    });
                    it('should show the coach list view', function(){
                        expect($serviceListView.hasClass('ng-hide')).to.be.false;
                    });
                    it('should not show the coach edit view', function(){
                        expect($serviceItemView.hasClass('ng-hide')).to.be.true;
                    });
                });
            });
            describe('when clicking the cancel button', function(){
                beforeEach(function(){
                    scope.item = {
                            name: "dumbnew",
                            description: "userguy"
                    }
                    scope.$apply();

                    $rootScope.alerts.push({type: 'warning', message: 'test alert'});

                    $serviceItemView.find('.cancel-service').trigger('click');
                });
                it('should reset all edits made', function(){
                    var unsavedService = scope.itemList.pop();

                    expect(unsavedService.name).to.equal(self.firstService.name);
                    expect(unsavedService.description).to.equal(self.firstService.description);
                });
                it('should remove alert if present', function(){
                    expect($rootScope.alerts.length).to.equal(0);
                });
            });
        });
        describe('when creating a new service', function(){
            var initServiceListLength;
            beforeEach(function(){
                initServiceListLength = scope.itemList.length;

                $serviceListView.find('.create-service').trigger('click');
            });
            it('should attempt to create a service', function(){
                expect(createServiceStub).to.be.calledOnce;
            });
            it('should not show the service list view', function(){
                expect($testRegion.find('.service-list-view').hasClass('ng-hide')).to.be.true;
            });
            it('should show the service item view', function(){
                expect($testRegion.find('.service-item-view').hasClass('ng-hide')).to.be.false;
            });
            it('should show the cancel button', function(){
                expect($serviceItemView.find('.cancel-button').hasClass('ng-hide')).to.be.false;
            });
            it('should set the newItem flag to true', function(){
                expect(scope.newItem).to.be.true;
            });
            describe('when clicking the cancel button and coach is new', function(){
                beforeEach(function(){
                    $serviceItemView.find('.cancel-service').trigger('click');
                });
                it('should discard the new coach', function(){
                    expect(scope.itemList.length).to.equal(initServiceListLength);
                });
            })
        });
    });
    describe('when navigating to scheduling before adding a service', function(){
        beforeEach(function(){

            createViewWithController(scope, 'businessSetup/partials/businessSetup.html', 'servicesCtrl');
            $state.go('businessSetup.services');
            scope.$digest();

            // anchor tags dont listen to $.trigger('click') for some reason. assholes.
            $state.go('businessSetup.scheduling');
            scope.$digest();
        });
        it('should not allow navigation', function(){
            expect($location.path()).to.equal('/business-setup/services');
        });
        it('should show a warning message', function(){
            expect($rootScope.alerts[0].type).to.equal('warning');
            expect($rootScope.alerts[0].message).to.equal('businessSetup:add-services-warning');
        });
        describe('after adding a service', function(){
            beforeEach(function(){
                scope.itemList = [{}];

                $state.go('businessSetup.scheduling');
                scope.$digest();
            });
            it('should allow navigation', function(){
                expect($location.path()).to.equal('/business-setup/scheduling');
            });
        });
    });
});