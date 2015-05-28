describe('BusinessSetup Business', function(){
    
    let('business', function(){
        return {
            name: "West Coast Toast",
            domain: "westcoasttoast",
            currency: "USD"
        };
    });

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
        self,
        coachSeekAPIService,
        scope,
        templateUrl = 'businessSetup/partials/businessView.html';
        
    beforeEach(function(){
        self = this;
        coachSeekAPIService = $injector.get('coachSeekAPIService');
        scope = $rootScope.$new();
        scope.currentUser = {
            business: this.business
        };

        getBusinessStub = this.sinon.stub(coachSeekAPIService, 'query', function(){
            return {$promise: self.promise};
        });

        createViewWithController(scope, templateUrl, 'businessCtrl');
        $businessListView = $testRegion.find('.business-list-view');
        $businessItemView = $testRegion.find('.business-item-view');
    });
    it('should set business on the scope', function(){
        expect(scope.business).to.equal(this.business);
    });
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
            });
            describe('when the form is invalid', function(){
                describe('when the name is invalid', function(){
                    it('should display an invalid input alert', function(){
                        scope.business.name = null;
                        scope.$digest();
                        $businessItemView.find('.save-button').trigger('click');

                        expect($rootScope.alerts[0].type).to.equal('warning');
                        expect($rootScope.alerts[0].message).to.equal('businessSetup:name-invalid');
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
                it('should set the business on $rootScope', function(){
                    expect(scope.currentUser.business).to.eql(this.business);
                });
            });
        });
        describe('when clicking the cancel button', function(){
            beforeEach(function(){
                scope.business = {
                    name: "New Dumb",
                    currency: "BLAH"
                }
                scope.$digest();

                $rootScope.alerts.push({type: 'warning', message: 'test alert'});

                $businessItemView.find('.cancel-button').trigger('click');
            });
            it('should reset all edits made', function(){
                var unsavedBusiness = scope.business;

                expect(unsavedBusiness.name).to.equal(this.business.name);
                expect(unsavedBusiness.domain).to.equal(this.business.domain);
                expect(unsavedBusiness.currency).to.equal(this.business.currency);
            });
            it('should remove alert if present', function(){
                expect($rootScope.alerts.length).to.equal(0);
            });
        });
    });
});