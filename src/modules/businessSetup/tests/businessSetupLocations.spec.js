describe('bussinessSetup Locations', function(){

    let('location', function(){
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

    let('locations', function(){
        return [this.location];
    });

    let('promise', function(){
        var deferred = $q.defer();
        deferred.resolve(this.locations);
        return deferred.promise;
    });

    let('savepromise', function(){
        var deferred = $q.defer();
        deferred.resolve({data:this.locations});
        return deferred.promise;
    });

    var templateUrl = 'businessSetup/partials/locationsView.html',
        $locationItemView,
        $locationListView,
        getLocationsStub,
        locationDefaults,
        self,
        scope,
        coachSeekAPIService;
        
    beforeEach(function(){
        self = this;
        coachSeekAPIService = $injector.get('coachSeekAPIService');
        locationDefaults = $injector.get('locationDefaults');
        scope = $rootScope.$new();

        getLocationsStub = this.sinon.stub(coachSeekAPIService, 'getLocations', function(){
            return self.promise;
        });

        createViewWithController(scope, templateUrl, 'locationsCtrl');
        $locationListView = $testRegion.find('.location-list-view');
        $locationItemView = $testRegion.find('.location-item-view');
    });
    it('should make a call to getLocations', function(){
        expect(getLocationsStub).to.be.calledOnce;
    });

    describe('during loading', function(){
        
        let('promise', function(){
            return $q.defer().promise;
        });

        it('should disable the create item button while loading', function(){
            expect($locationListView.find('.create-item').attr('disabled')).to.equal('disabled');
        });
    });

    describe('and there are no locations', function(){

        let('locations', function(){
            return [];
        });

        it('should not show the location list view', function(){
            expect($locationListView.hasClass('ng-hide')).to.be.true;
        });
        it('should show the location item view', function(){
            expect($locationItemView.hasClass('ng-hide')).to.be.false;
        });
        it('should set the list item to default value', function(){
            expect(scope.item).to.equal(locationDefaults);
        });
        it('should not show the cancel button', function(){
            expect($locationItemView.find('.cancel-button').hasClass('ng-hide')).to.be.true;
        });
    });
    describe('and there are one or more locations', function(){
        it('should show the location list view', function(){
            expect($locationListView.hasClass('ng-hide')).to.be.false;
        });
        it('should have as many list entries as location', function(){
            expect($locationListView.find('.location-details').length).to.equal(self.locations.length)
        })
        it('should not show the location item view', function(){
            expect($locationItemView.hasClass('ng-hide')).to.be.true;
        });


        describe('when clicking the edit button', function(){
            beforeEach(function(){
                $locationListView.find('.edit-item').first().trigger('click');
            });
            it('should not show the location list view', function(){
                expect($locationListView.hasClass('ng-hide')).to.be.true;
            });
            it('should show the location item view', function(){
                expect($locationItemView.hasClass('ng-hide')).to.be.false;
            });
            it('should show the cancel button', function(){
                expect($locationItemView.find('.cancel-button').hasClass('ng-hide')).to.be.false;
            });
            describe('when clicking the save button', function(){
                
                var saveLocationStub;
                beforeEach(function(){
                    self.savepromise = this.savepromise;

                    saveLocationStub = this.sinon.stub(coachSeekAPIService, 'saveLocation', function(){
                        return self.savepromise;
                    });
                });

                describe('during save', function(){

                    let('savepromise', function(){
                        return $q.defer().promise;
                    });

                    it('should disable the save item button while loading', function(){
                        $locationItemView.find('.save-button').trigger('click');
                        expect($locationItemView.find('.save-button').attr('disabled')).to.equal('disabled');
                    });
                });

                describe('when the form is invalid', function(){
                    describe('when the name is invalid', function(){
                        it('should display an invalid input alert', function(){
                            scope.item.name = null;
                            scope.$digest();
                            $locationItemView.find('.save-button').trigger('click');

                            expect($rootScope.alerts[0].type).to.equal('warning');
                            expect($rootScope.alerts[0].message).to.equal('businessSetup:name-invalid');
                        });
                    });
                    describe('when the studentCapacity is invalid', function(){
                        
                    });
                });
                describe('when the name already exists', function(){
                    beforeEach(function(){
                        scope.itemList.push(angular.copy(this.location));
                        $locationItemView.find('.save-button').trigger('click');
                    });
                    it('should display an alert', function(){
                        expect($rootScope.alerts[0].type).to.equal('warning');
                        expect($rootScope.alerts[0].message).to.equal('businessSetup:location-already-exists');
                    });
                });
                describe('when the name is new', function(){
                    beforeEach(function(){
                        $locationItemView.find('.save-button').trigger('click');
                    });
                    it('should attempt to save location', function(){
                        expect(saveLocationStub).to.be.calledOnce;
                    });
                    it('should show the location list view', function(){
                        expect($locationListView.hasClass('ng-hide')).to.be.false;
                    });
                    it('should not show the location edit view', function(){
                        expect($locationItemView.hasClass('ng-hide')).to.be.true;
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

                    $locationItemView.find('.cancel-button').trigger('click');
                });
                it('should reset all edits made', function(){
                    var unsavedLocation = scope.itemList.pop();

                    expect(unsavedLocation.name).to.equal(this.location.name);
                    expect(unsavedLocation.description).to.equal(this.location.description);
                });
                it('should remove alert if present', function(){
                    expect($rootScope.alerts.length).to.equal(0);
                });
            });
        });
        describe('when creating a new location', function(){
            var initLocationListLength;
            beforeEach(function(){
                initLocationListLength = scope.itemList.length;

                $locationListView.find('.create-item').trigger('click');
            });
            it('should set the list item to default value', function(){
                expect(scope.item).to.equal(locationDefaults);
            });
            it('should not show the location list view', function(){
                expect($locationListView.hasClass('ng-hide')).to.be.true;
            });
            it('should show the location item view', function(){
                expect($locationItemView.hasClass('ng-hide')).to.be.false;
            });
            it('should show the cancel button', function(){
                expect($locationItemView.find('.cancel-button').hasClass('ng-hide')).to.be.false;
            });
            it('should set the newItem flag to true', function(){
                expect(scope.newItem).to.be.true;
            });
            describe('when clicking the cancel button and location is new', function(){
                beforeEach(function(){
                    $locationItemView.find('.cancel-button').trigger('click');
                });
                it('should discard the new location', function(){
                    expect(scope.itemList.length).to.equal(initLocationListLength);
                });
            })
        });
    });
    describe('when navigating before adding a location', function(){

        let('locations', function(){
            return [];
        });

        describe('when navigating to coachList', function(){
            beforeEach(function(){

                createViewWithController(scope, 'businessSetup/partials/businessSetup.html', 'locationsCtrl');
                $state.go('businessSetup.locations');
                scope.$digest();

                // anchor tags dont listen to $.trigger('click') for some reason. assholes.
                $state.go('businessSetup.coachList');
                scope.$digest();
            });
            it('should not allow navigation', function(){
                expect($location.path()).to.equal('/business-setup/locations');
            });
            it('should show a warning message', function(){
                expect($rootScope.alerts[0].type).to.equal('warning');
                expect($rootScope.alerts[0].message).to.equal('businessSetup:add-location-warning');
            });
            describe('after adding a location', function(){
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

                createViewWithController(scope, 'businessSetup/partials/businessSetup.html', 'locationsCtrl');
                $state.go('businessSetup.locations');
                scope.$digest();

                // anchor tags dont listen to $.trigger('click') for some reason. assholes.
                $state.go('businessSetup.services');
                scope.$digest();
            });
            it('should not allow navigation', function(){
                expect($location.path()).to.equal('/business-setup/locations');
            });
            it('should show a warning message', function(){
                expect($rootScope.alerts[0].type).to.equal('warning');
                expect($rootScope.alerts[0].message).to.equal('businessSetup:add-location-warning');
            });
            describe('after adding a location', function(){
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