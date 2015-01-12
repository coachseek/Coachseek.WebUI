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
            repititon: {
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

    var templateUrl = 'businessSetup/partials/servicesView.html',
        $serviceItemView,
        $serviceListView,
        self,
        scope,
        coachSeekAPIService;
        
    beforeEach(function(){
        self = this;

        coachSeekAPIService = $injector.get('coachSeekAPIService');
        scope = $rootScope.$new();

        getServicesStub = this.sinon.stub(coachSeekAPIService, 'getServices', function(){
            return self.promise;
        });
        createServiceStub = this.sinon.stub(coachSeekAPIService, 'createService', function(){
            return self.promise;
        });

        createViewWithController(scope, templateUrl, 'servicesCtrl');
        $serviceListView = $testRegion.find('.service-list-view');
        $serviceItemView = $testRegion.find('.service-item-view');
    });
    it('should make a call to getServices', function(){
        expect(getServicesStub).to.be.calledOnce;
    });
    describe('during loading', function(){
        
        let('promise', function(){
            return $q.defer().promise;
        });

        it('should disable the create item button while loading', function(){
            expect($serviceListView.find('.create-item').attr('disabled')).to.equal('disabled');
        });
    });

    describe('when getService throws an error', function(){
        var errorMessage = "errorMessage";

        let('promise', function(){
            var deferred = $q.defer();
            deferred.reject(new Error(errorMessage));
            return deferred.promise;
        });


        it('should throw', function(){
            expect(createViewWithController(scope, templateUrl, 'servicesCtrl')).to.throw;
        });

        it('should display an error message', function(){
            expect($rootScope.alerts[0].type).to.equal('danger');
            expect($rootScope.alerts[0].message).to.equal('businessSetup:' + errorMessage);
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
        it('should attempt to create a service', function(){
            expect(createServiceStub).to.be.calledOnce;
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
            describe('when changing the repeatFrequency to -1 or null', function(){
                it('should set the coursePrice to null', function(){
                    scope.item.repititon.repeatFrequency = null;
                    scope.$digest();

                    expect(scope.item.pricing.coursePrice).to.equal(null);
                })
            });
            describe('when clicking the save button', function(){
                var saveServiceStub;
                beforeEach(function(){
                    self.savepromise = this.savepromise;

                    saveServiceStub = this.sinon.stub(coachSeekAPIService, 'saveService', function(){
                        return self.savepromise;
                    });
                });

                describe('during save', function(){

                    let('savepromise', function(){
                        return $q.defer().promise;
                    });

                    it('should disable the save item button while loading', function(){
                        $serviceItemView.find('.save-button').trigger('click');
                        expect($serviceItemView.find('.save-button').attr('disabled')).to.equal('disabled');
                    });
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
                    describe('when the coursePriceMin is invalid', function(){
                        it('should display an invalid input alert', function(){
                            scope.item.pricing.coursePriceMin = -1;
                            scope.$digest();
                            $serviceItemView.find('.save-button').trigger('click');

                            expect($rootScope.alerts[0].type).to.equal('warning');
                            expect($rootScope.alerts[0].message).to.equal('businessSetup:coursePriceMin-invalid');
                        });
                    });
                    describe('when the coursePriceMax is invalid', function(){
                        it('should display an invalid input alert', function(){
                            scope.item.pricing.coursePriceMax = -1;
                            scope.$digest();
                            $serviceItemView.find('.save-button').trigger('click');

                            expect($rootScope.alerts[0].type).to.equal('warning');
                            expect($rootScope.alerts[0].message).to.equal('businessSetup:coursePriceMax-invalid');
                        });
                    });
                    describe('and the coursePriceMin and coursePriceMax are invalid', function(){
                        it('should display an alert for both', function(){
                            scope.item.pricing.coursePriceMin = -1;
                            scope.item.pricing.coursePriceMax = -1;
                            scope.$digest();
                            $serviceItemView.find('.save-button').trigger('click');

                            expect($rootScope.alerts[0].type).to.equal('warning');
                            expect($rootScope.alerts[0].message).to.equal('businessSetup:coursePriceMin-invalid');
                            expect($rootScope.alerts[1].type).to.equal('warning');
                            expect($rootScope.alerts[1].message).to.equal('businessSetup:coursePriceMax-invalid');
                        });
                    });
                });
                describe('when the name already exists', function(){
                    beforeEach(function(){
                        scope.itemList.push(angular.copy(self.service));
                        $serviceItemView.find('.save-button').trigger('click');
                    });
                    it('should display an alert', function(){
                        expect($rootScope.alerts[0].type).to.equal('warning');
                        expect($rootScope.alerts[0].message).to.equal('businessSetup:service-already-exists');
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