describe('CRUDService', function(){

    let('promise', function(){
       var deferred = $q.defer();
       deferred.resolve(this.APIreturn);
       return deferred.promise;
    });

    let('APIreturn', function(){
        return this.initData;
    });

    let('initData', function(){
        return [];
    });

    var scope,
        CRUDService,
        coachSeekAPIService, 
        $activityIndicator,

        AIStartStub,
        AIStopStub,
        setPristineStub,

        APIFunctionName = "getCoaches",
        errorMessage1 = "ERROR 1 BRO",
        errorMessage2 = "ERROR 2 BRO";

    beforeEach(function(){
        self = this;
        //WHY DO I NEED THIS??
        self.promise = this.promise;
        scope = $rootScope.$new();

        CRUDService = $injector.get('CRUDService');
        coachSeekAPIService = $injector.get('coachSeekAPIService');
        $activityIndicator = $injector.get('$activityIndicator');

        createDirective(scope, '<form name="itemForm" novalidate></form>');

        AIStartStub = this.sinon.stub($activityIndicator, 'startAnimating');
        AIStopStub = this.sinon.stub($activityIndicator, 'stopAnimating');
        setPristineStub = this.sinon.stub(scope.itemForm, '$setPristine')

        this.sinon.stub(coachSeekAPIService, 'query', function(){
            return {$promise: self.promise};
        });
        this.sinon.stub(coachSeekAPIService, 'save', function(){
            return {$promise: self.promise};
        });
    });
    describe('when calling get()', function(){

        var createItemStub;

        beforeEach(function(){
            scope.createItem = function(){};
            createItemStub = this.sinon.stub(scope, 'createItem');
            CRUDService.get(APIFunctionName, scope);
            // Must call digest here because we are not using a template
            // and $q promise resolution is not propogated automatically
            $rootScope.$digest();
        });

        it('should start the activity indicator', function(){
            expect(AIStartStub).to.be.calledOnce;
        });
        describe('when API call is successful', function(){

            describe('and there is no existing data', function(){

                let('initData', function(){
                    return [];
                });

                it('should set the itemList on the scope', function(){
                    expect(scope.itemList.length).to.equal(this.initData.length)
                });
                it('should call attempt to create a new item', function(){
                    expect(createItemStub).to.be.calledOnce;
                });
                it('should stop the activity indicator', function(){
                    expect(AIStopStub).to.be.calledOnce;
                });
            });
            describe('and there is existing data', function(){
                
                let('initData', function(){
                    return [{}, {}];
                });

                it('should set the itemList on the scope', function(){
                    expect(scope.itemList).to.equal(this.initData)
                });
                it('should stop the activity indicator', function(){
                    expect(AIStopStub).to.be.calledOnce;
                });
            });
        });

        describe('when API call throws an error', function(){
            it('should stop the activity indicator', function(){
                expect(AIStopStub).to.be.calledOnce;
            });
            let('promise', function(){
                var deferred = $q.defer();
                deferred.reject({data: [{message: errorMessage1}, {message: errorMessage2}]});
                return deferred.promise;
            });

            it('should display correct error messages', function(){
                expect($rootScope.alerts[0].type).to.equal('danger');
                expect($rootScope.alerts[0].message).to.equal(errorMessage1);
                
                expect($rootScope.alerts[1].type).to.equal('danger');
                expect($rootScope.alerts[1].message).to.equal(errorMessage2);
            });
        });
    });
    describe('when calling update()', function(){

        var removeAlertsStub, updateSuccess, intercomStub;
        beforeEach(function(){
            scope.itemList = [];
            scope.newItem = true;
            scope.removeAlerts = function(){};

            removeAlertsStub = this.sinon.stub(scope, 'removeAlerts')
            intercomStub = this.sinon.stub(window, 'Intercom');
            scope.$on('updateSuccess', function(){
                updateSuccess = true;
            });
            CRUDService.update(APIFunctionName, scope, this.initData);
            // Must call digest here because we are not using a template
            // and $q promise resolution is not propogated automatically
            $rootScope.$digest();
        });

        it('should start the activity indicator', function(){
            expect(AIStartStub).to.be.calledOnce;
        });
        describe('when API call is successful', function(){

            it('should add the item back to the itemList', function(){
                expect(scope.itemList[0]).to.equal(this.initData)
            });
            it('should set reset the to the list view state', function(){
                expect(scope.item).to.equal(null);
                expect(scope.newItem).to.equal(null);
                expect(scope.itemCopy).to.equal(null);
                expect(removeAlertsStub).to.be.calledOnce;
                expect(setPristineStub).to.be.calledOnce;
            });
            it('should add a success alert', function(){
                expect($rootScope.alerts[0].type).to.equal('success');
                expect($rootScope.alerts[0].message).to.equal('businessSetup:save-success');
            });
            it('should stop the activity indicator', function(){
                expect(AIStopStub).to.be.calledOnce;
            });

            it('should broadcast a updateSuccess event', function(){
                expect(updateSuccess).to.be.true;
            });

            it('should make a call to Intercom', function(){
                var updateObject = {};
                updateObject[APIFunctionName] = scope.itemList.length;
                expect(intercomStub).to.be.calledWith('update', updateObject);
            });
        });
        describe('when API call throws an error', function(){

            let('promise', function(){
                var deferred = $q.defer();
                deferred.reject({data: [{message: errorMessage1}, {message: errorMessage2}]});
                return deferred.promise;
            });

            it('should display an error message', function(){
                expect($rootScope.alerts[0].type).to.equal('danger');
                expect($rootScope.alerts[0].message).to.equal(errorMessage1);
                
                expect($rootScope.alerts[1].type).to.equal('danger');
                expect($rootScope.alerts[1].message).to.equal(errorMessage2);
            });
            it('should stop the activity indicator', function(){
                expect(AIStopStub).to.be.calledOnce;
            });

        });
    });
    describe('when calling cancelEdit()', function(){
        var removeAlertsStub;
        beforeEach(function(){
            scope.itemList = [];
            scope.itemCopy = this.initData;
            scope.removeAlerts = function(){};
            removeAlertsStub = this.sinon.stub(scope, 'removeAlerts')

        });
        it('should set reset the to the list view state', function(){
            scope.newItem = "A COOL THING";
            scope.item = ['a', 'useless', 'array'];
            CRUDService.cancelEdit(scope);

            expect(scope.item).to.equal(null);
            expect(scope.newItem).to.equal(null);
            expect(scope.itemCopy).to.equal(null);
            expect(removeAlertsStub).to.be.calledOnce;
            expect(setPristineStub).to.be.calledOnce;
        });
        describe('when the item is new', function(){
            it('should NOT add the item to the itemList', function(){
                scope.newItem = true;
                CRUDService.cancelEdit(scope);

                expect(scope.itemList[0]).to.be.undefined;
            });
        }); 
        describe('when the item is NOT new', function(){
            it('should add the item to the itemList', function(){
                scope.newItem = false;
                CRUDService.cancelEdit(scope);

                expect(scope.itemList[0]).to.equal(this.initData);
            });
        });
    });
    //TODO
    describe('when calling validateForm()', function(){

    });
});