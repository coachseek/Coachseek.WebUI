describe('bussinessSetup Services', function(){

    let('service', function(){
        return {
            name: "Test",
            description: "Service",
            booking: {
                studentCapacity: 8
            },
            pricing: {
                sessionPrice: 43,
                coursePrice: 69
            },
            repetition: {
                repeatFrequency: 2
            }
        };
    });

    let('services', function(){
        return [this.service];
    });

    let('promise', function(){
        var deferred = $q.defer();
        deferred.resolve(this.services);
        return deferred.promise;
    });

    let('savepromise', function(){
        var deferred = $q.defer();
        deferred.resolve(this.services);
        return deferred.promise;
    });

    let('isNewService', function(){
        return null;
    });

    var templateUrl = 'businessSetup/partials/servicesView.html',
        $serviceItemView,
        $serviceListView,
        serviceDefaults,
        getServicesStub,
        self,
        scope,
        coachSeekAPIService;
        
    beforeEach(function(){
        self = this;

        coachSeekAPIService = $injector.get('coachSeekAPIService');
        serviceDefaults = $injector.get('serviceDefaults');
        scope = $rootScope.$new();

        $state.current.data = this.isNewService;

        getServicesStub = this.sinon.stub(coachSeekAPIService, 'query', function(){
            return {$promise: self.promise};
        });

        createViewWithController(scope, templateUrl, 'servicesCtrl');
        $serviceListView = $testRegion.find('.service-list-view');
        $serviceItemView = $testRegion.find('.service-item-view');
    });
    it('should make a call to getServices', function(){
        expect(getServicesStub).to.be.calledOnce;
    });
    describe('when navigating from businessSetup.servicesEdit', function(){

        let('isNewService', function(){
            return {
                newService: true
            };
        });

        it('should show the edit view', function(){
            expect($serviceItemView.hasClass('ng-hide')).to.be.false;
        });
        it('should create a new service', function(){
            expect(scope.item).to.eql(serviceDefaults);
        });
    });
    describe('during loading', function(){
        
        let('promise', function(){
            return $q.defer().promise;
        });

        it('should disable the create item button while loading', function(){
            expect($serviceListView.find('.create-item').attr('disabled')).to.equal('disabled');
        });
    });

    describe('and there are no services', function(){

        let('services', function(){
            return [];
        });

        it('should not show the service list view', function(){
            expect($serviceListView.hasClass('ng-hide')).to.be.true;
        });
        it('should show the service item view', function(){
            expect($serviceItemView.hasClass('ng-hide')).to.be.false;
        });
        it('should set the list item to default value', function(){
            expect(scope.item).to.eql(serviceDefaults);
        });
        it('should not show the cancel button', function(){
            expect($serviceItemView.find('.cancel-button').hasClass('ng-hide')).to.be.true;
        });
    });
    describe('and there are one or more services', function(){

        let('services', function(){
            return [this.service];
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
                $serviceListView.find('.edit-item').first().trigger('click');
            });
            it('should not show the service list view', function(){
                expect($serviceListView.hasClass('ng-hide')).to.be.true;
            });
            it('should show the service item view', function(){
                expect($serviceItemView.hasClass('ng-hide')).to.be.false;
            });
            it('should show the cancel button', function(){
                expect($serviceItemView.find('.cancel-button').hasClass('ng-hide')).to.be.false;
            });
            describe('when changing the sessionCount to less than 2', function(){
                beforeEach(function(){
                    scope.item.repetition.sessionCount = 1;
                    scope.$digest();
                });
                it('should set the coursePrice to null', function(){
                    expect(scope.item.pricing.coursePrice).to.equal(undefined);
                });
                it('should hide the coursePrice field', function(){
                    expect($serviceItemView.find('.course-price').hasClass('ng-hide')).to.be.true;
                });

                describe('and then changing the sessionCount to 2 or more', function(){
                    it('should show the coursePrice field', function(){
                        scope.item.repetition.sessionCount = 69;
                        scope.$digest();

                        expect($serviceItemView.find('.coursePrice').hasClass('ng-hide')).to.be.false;
                    });
                });
            });
            describe('when clicking the save button', function(){
                var saveServiceStub;
                beforeEach(function(){
                    self.savepromise = this.savepromise;

                    saveServiceStub = this.sinon.stub(coachSeekAPIService, 'save', function(){
                        return {$promise: self.savepromise};
                    });
                });

                describe('during save', function(){

                    let('savepromise', function(){
                        return $q.defer().promise;
                    });

                    beforeEach(function(){
                        $serviceItemView.find('.save-button').trigger('click');
                    });
                    it('should disable the save item button while loading', function(){
                        expect($serviceItemView.find('.save-button').attr('disabled')).to.equal('disabled');
                    });
                    it('should show `saving...` on the save button'
                    // These fail intermittently. It's more important that the buttion is disabled
                    // I think i18next intermittently compiles too slow
                    //     , function(){
                    //     var saveButtonText = $serviceItemView.find('.save-button').text();
                    //     expect(saveButtonText).to.equal(i18n.t('saving'));
                    // }
                    );
                });
                describe('when the form is invalid', function(){
                    describe('when the name is invalid', function(){
                        it('should display an invalid input alert', function(){
                            scope.item.name = null;
                            scope.$digest();
                            $serviceItemView.find('.save-button').trigger('click');

                            expect($rootScope.alerts[0].type).to.equal('warning');
                            expect($rootScope.alerts[0].message).to.equal('businessSetup:name-invalid');
                        });
                    });
                    describe('when the studentCapacity is invalid', function(){
                        it('should display an invalid input alert', function(){
                            scope.item.booking.studentCapacity = -1;
                            scope.$digest();
                            $serviceItemView.find('.save-button').trigger('click');

                            expect($rootScope.alerts[0].type).to.equal('warning');
                            expect($rootScope.alerts[0].message).to.equal('businessSetup:studentCapacity-invalid');
                        });
                    });
                    describe('when the coursePrice is invalid', function(){
                        it('should display an invalid input alert', function(){
                            scope.item.pricing.coursePrice = -1;
                            scope.$digest();
                            $serviceItemView.find('.save-button').trigger('click');

                            expect($rootScope.alerts[0].type).to.equal('warning');
                            expect($rootScope.alerts[0].message).to.equal('businessSetup:coursePrice-invalid');
                        });
                    });
                    describe('when the sessionPrice is invalid', function(){
                        it('should display an invalid input alert', function(){
                            scope.item.pricing.sessionPrice = -1;
                            scope.$digest();
                            $serviceItemView.find('.save-button').trigger('click');

                            expect($rootScope.alerts[0].type).to.equal('warning');
                            expect($rootScope.alerts[0].message).to.equal('businessSetup:sessionPrice-invalid');
                        });
                    });
                    describe('and the coursePrice and sessionPrice are invalid', function(){
                        it('should display an alert for both', function(){
                            scope.item.pricing.coursePrice = -1;
                            scope.item.pricing.sessionPrice = -1;
                            scope.$digest();
                            $serviceItemView.find('.save-button').trigger('click');

                            expect($rootScope.alerts[0].type).to.equal('warning');
                            expect($rootScope.alerts[0].message).to.equal('businessSetup:sessionPrice-invalid');
                            expect($rootScope.alerts[1].type).to.equal('warning');
                            expect($rootScope.alerts[1].message).to.equal('businessSetup:coursePrice-invalid');
                        });
                    });
                });
                describe('when the name already exists', function(){
                    it('should display an alert', function(){
                        // have to change name to get $watch to run otherwise
                        // it recognizes that the name hasn't changed and doesn't run
                        scope.itemList.push(this.service);
                        scope.item.name = "Interim";
                        scope.$digest();

                        scope.item.name = "Test";
                        scope.$digest();
                        $serviceItemView.find('.save-button').trigger('click');

                        expect($rootScope.alerts[0].type).to.equal('warning');
                        expect($rootScope.alerts[0].message).to.equal('businessSetup:name-invalid');
                    });
                });
                describe('when the name is new', function(){
                    beforeEach(function(){
                        $serviceItemView.find('.save-button').trigger('click');
                    });
                    it('should attempt to save service', function(){
                        expect(saveServiceStub).to.be.calledOnce;
                    });
                    it('should show the services list view', function(){
                        expect($serviceListView.hasClass('ng-hide')).to.be.false;
                    });
                    it('should not show the service edit view', function(){
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
                    scope.$digest();

                    $rootScope.alerts.push({type: 'warning', message: 'test alert'});

                    $serviceItemView.find('.cancel-button').trigger('click');
                });
                it('should reset all edits made', function(){
                    var unsavedService = scope.itemList.pop();

                    expect(unsavedService.name).to.equal(this.service.name);
                    expect(unsavedService.description).to.equal(this.service.description);
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

                $serviceListView.find('.create-item').trigger('click');
            });
            it('should set the list item to default value', function(){
                expect(scope.item).to.eql(serviceDefaults);
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
            describe('when clicking the cancel button and service is new', function(){
                beforeEach(function(){
                    $serviceItemView.find('.cancel-button').trigger('click');
                });
                it('should discard the new service', function(){
                    expect(scope.itemList.length).to.equal(initServiceListLength);
                });
            })
        });
    });
});