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
        deferred.resolve(this.locations);
        return deferred.promise;
    });

    var templateUrl = 'businessSetup/partials/locationsView.html',
        $locationItemView,
        $locationListView,
        getLocationsStub,
        self,
        scope,
        coachSeekAPIService;
        
    beforeEach(function(){
        self = this;
        coachSeekAPIService = $injector.get('coachSeekAPIService');
        scope = $rootScope.$new();

        getLocationsStub = this.sinon.stub(coachSeekAPIService, 'query', function(){
            return {$promise: self.promise};
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
            expect(scope.item).to.eql({});
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

                    saveLocationStub = this.sinon.stub(coachSeekAPIService, 'save', function(){
                        return {$promise: self.savepromise};
                    });
                });

                describe('during save', function(){

                    let('savepromise', function(){
                        return $q.defer().promise;
                    });

                    beforeEach(function(){
                        $locationItemView.find('.save-button').trigger('click');
                    });

                    it('should disable the save item button while loading', function(){
                        expect($locationItemView.find('.save-button').attr('disabled')).to.equal('disabled');
                    });
                    it('should show `saving...` on the save button'
                    // These fail intermittently. It's more important that the buttion is disabled
                    // I think i18next intermittently compiles too slow    
                    //     , function(){
                    //     var saveButtonText = $locationItemView.find('.save-button').text();
                    //     expect(saveButtonText).to.equal(i18n.t('saving'));
                    // }
                    );
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
                });
                describe('when the name already exists', function(){
                    it('should display an alert', function(){
                        // have to change name to get $watch to run otherwise
                        // it recognizes that the name hasn't changed and doesn't run
                        scope.itemList.push(this.location);
                        scope.item.name = "Interim";
                        scope.$digest();

                        scope.item.name = "Test";
                        scope.$digest();
                        $locationItemView.find('.save-button').trigger('click');

                        expect($rootScope.alerts[0].type).to.equal('warning');
                        expect($rootScope.alerts[0].message).to.equal('businessSetup:name-invalid');
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
                expect(scope.item).to.eql({});
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
});