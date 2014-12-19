describe('bussinessSetup Locations', function(){

    var templateUrl = 'businessSetup/partials/locationsView.html',
        $locationItemView,
        $locationListView,
        self,
        scope,
        coachSeekAPIService;
        
    beforeEach(function(){
        coachSeekAPIService = $injector.get('coachSeekAPIService');
        scope = $rootScope.$new();

        self = this;

        self.let('locations', function(){
            return [];
        });

        getLocationsStub = this.sinon.stub(coachSeekAPIService, 'getLocations', function(){
            var deferred = $q.defer();
            deferred.resolve(self.locations);
            return deferred.promise;
        });
        createLocationStub = this.sinon.stub(coachSeekAPIService, 'createLocation', function(){
            var deferred = $q.defer();
            deferred.resolve([{}]);
            return deferred.promise;
        });
    });
    it('should make a call to getLocations', function(){
        createViewWithController(scope, templateUrl, 'locationsCtrl');
        expect(getLocationsStub).to.be.calledOnce;
    });
    describe('and there are no locations', function(){
        beforeEach(function(){
            createViewWithController(scope, templateUrl, 'locationsCtrl');
            $locationItemView = $testRegion.find('.location-item-view');
        });
        it('should not show the location list view', function(){
            expect($testRegion.find('.location-list-view').hasClass('ng-hide')).to.be.true;
        });
        it('should show the location item view', function(){
            expect($testRegion.find('.location-item-view').hasClass('ng-hide')).to.be.false;
        });
        it('should attempt to create a location', function(){
            expect(createLocationStub).to.be.calledOnce;
        });
        it('should not show the cancel button', function(){
            expect($locationItemView.find('.cancel-location').hasClass('ng-hide')).to.be.true;
        });
    });
    describe('and there are one or more locations', function(){
        beforeEach(function(){
            self.let('firstLocation', function(){
                return {
                    businessId: "8786bcd0-3b14-4f7b-92db-198527a5b949",
                    id: null,
                    name: "THE LAB",
                    address: "1800 taylor ave n",
                    city: "Seattle",
                    state: "WA",
                    country: "USA"
                }
            })

            self.let('locations', function(){
                return [self.firstLocation, {}];
            });

            createViewWithController(scope, templateUrl, 'locationsCtrl');
            $locationListView = $testRegion.find('.location-list-view');
            $locationItemView = $testRegion.find('.location-item-view');
        });
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
                $locationListView.find('.edit-location').first().trigger('click');
            });
            it('should not show the location list view', function(){
                expect($locationListView.hasClass('ng-hide')).to.be.true;
            });
            it('should show the location item view', function(){
                expect($locationItemView.hasClass('ng-hide')).to.be.false;
            });
            it('should show the cancel button', function(){
                expect($locationItemView.find('.cancel-location').hasClass('ng-hide')).to.be.false;
            });
            describe('when clicking the save button', function(){
                var saveLocationStub;
                beforeEach(function(){
                    saveLocationStub = this.sinon.stub(coachSeekAPIService, 'saveLocation', function(){
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
                            $locationItemView.find('.save-location').trigger('click');

                            expect($rootScope.alerts[0].type).to.equal('warning');
                            expect($rootScope.alerts[0].message).to.equal('businessSetup:name-invalid');
                        });
                    });
                    describe('when the studentCapacity is invalid', function(){
                        
                    });
                });
                describe('when the name already exists', function(){
                    beforeEach(function(){
                        scope.itemList.push(angular.copy(self.firstLocation));
                        $locationItemView.find('.save-location').trigger('click');
                    });
                    it('should display an alert', function(){
                        expect($rootScope.alerts[0].type).to.equal('warning');
                        expect($rootScope.alerts[0].message).to.equal('businessSetup:location-already-exists');
                    });
                });
                describe('when the name is new', function(){
                    beforeEach(function(){
                        $locationItemView.find('.save-location').trigger('click');
                    });
                    it('should attempt to save coach', function(){
                        expect(saveLocationStub).to.be.calledOnce;
                    });
                    it('should show the coach list view', function(){
                        expect($locationListView.hasClass('ng-hide')).to.be.false;
                    });
                    it('should not show the coach edit view', function(){
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
                    scope.$apply();

                    $rootScope.alerts.push({type: 'warning', message: 'test alert'});

                    $locationItemView.find('.cancel-location').trigger('click');
                });
                it('should reset all edits made', function(){
                    var unsavedLocation = scope.itemList.pop();

                    expect(unsavedLocation.name).to.equal(self.firstLocation.name);
                    expect(unsavedLocation.description).to.equal(self.firstLocation.description);
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

                $locationListView.find('.create-location').trigger('click');
            });
            it('should attempt to create a location', function(){
                expect(createLocationStub).to.be.calledOnce;
            });
            it('should not show the location list view', function(){
                expect($testRegion.find('.location-list-view').hasClass('ng-hide')).to.be.true;
            });
            it('should show the location item view', function(){
                expect($testRegion.find('.location-item-view').hasClass('ng-hide')).to.be.false;
            });
            it('should show the cancel button', function(){
                expect($locationItemView.find('.cancel-button').hasClass('ng-hide')).to.be.false;
            });
            it('should set the newItem flag to true', function(){
                expect(scope.newItem).to.be.true;
            });
            describe('when clicking the cancel button and coach is new', function(){
                beforeEach(function(){
                    $locationItemView.find('.cancel-location').trigger('click');
                });
                it('should discard the new coach', function(){
                    expect(scope.itemList.length).to.equal(initLocationListLength);
                });
            })
        });
    });
    describe('when navigating before adding a location', function(){
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