describe('CRUDService', function(){
    var scope,
        CRUDService,
        coachSeekAPIService, 
        $activityIndicator,

        AIStartStub,
        AIStopStub,

        APIFunctionName = "getCoaches",
        errorMessage = "ERROR BRO",
        initData = {};

    beforeEach(function(){
        scope = $rootScope.$new();
        CRUDService = $injector.get('CRUDService');
        coachSeekAPIService = $injector.get('coachSeekAPIService');
        $activityIndicator = $injector.get('$activityIndicator');


        AIStartStub = this.sinon.stub($activityIndicator, 'startAnimating');
        AIStopStub = this.sinon.stub($activityIndicator, 'stopAnimating');
    });
    describe('when calling get()', function(){
        it('should start the activity indicator', function(){
            CRUDService.get(APIFunctionName, scope)
            expect(AIStartStub).to.be.calledOnce;
        });
        describe('when API call is successful', function(){
            var APIreturn;
            beforeEach(function(){
                this.sinon.stub(coachSeekAPIService, APIFunctionName, function(){
                    var deferred = $q.defer();
                    deferred.resolve(APIreturn);
                    return deferred.promise;
                });
            });
            describe('and there is no existing data', function(){
                var createItemStub;
                beforeEach(function(){
                    APIreturn = [];
                    scope.createItem = function(){};
                    createItemStub = this.sinon.stub(scope, 'createItem');
                    CRUDService.get(APIFunctionName, scope);
                    // Must call apply here because we are not using a template
                    // and $q promise resolution is not propogated automatically
                    $rootScope.$apply();
                });
                it('should set the itemList on the scope', function(){
                    expect(scope.itemList.length).to.equal(APIreturn.length)
                });
                it('should call attempt to creat a new item', function(){
                    expect(createItemStub).to.be.calledOnce;
                });
                it('should stop the activity indicator', function(){
                    expect(AIStopStub).to.be.calledOnce;
                });
            });
            describe('and there is existing data', function(){
                beforeEach(function(){
                    APIreturn = [{},{}];
                    CRUDService.get(APIFunctionName, scope);
                    // Must call apply here because we are not using a template
                    // and $q promise resolution is not propogated automatically
                    $rootScope.$apply();
                })
                it('should set the itemList on the scope', function(){
                    expect(scope.itemList).to.equal(APIreturn)
                });
                it('should stop the activity indicator', function(){
                    expect(AIStopStub).to.be.calledOnce;
                });
            });
        });
        describe('when API call throws an error', function(){
            beforeEach(function(){
                this.sinon.stub(coachSeekAPIService, APIFunctionName, function(){
                    var deferred = $q.defer();
                    deferred.reject(new Error(errorMessage));
                    return deferred.promise;
                });

                CRUDService.get(APIFunctionName, scope);
                $rootScope.$apply();
            });
            it('should display an error message', function(){
                expect($rootScope.alerts[0].type).to.equal('danger');
                expect($rootScope.alerts[0].message).to.equal('businessSetup:' + errorMessage);
            });
            it('should stop the activity indicator', function(){
                expect(AIStopStub).to.be.calledOnce;
            });

        });
    });
    describe('when calling create()', function(){
        it('should start the activity indicator', function(){
            CRUDService.create(APIFunctionName, scope)
            expect(AIStartStub).to.be.calledOnce;
        });
        describe('when API call is successful', function(){
            beforeEach(function(){
                this.sinon.stub(coachSeekAPIService, APIFunctionName, function(){
                    var deferred = $q.defer();
                    deferred.resolve([]);
                    return deferred.promise;
                });
                scope.editItem = function(){};
                editItemStub = this.sinon.stub(scope, 'editItem');
                CRUDService.create(APIFunctionName, scope);
                // Must call apply here because we are not using a template
                // and $q promise resolution is not propogated automatically
                $rootScope.$apply();
            });
            it('should set the newItem to true', function(){
                expect(scope.newItem).to.equal(true)
            });
            it('should call attempt to creat a new item', function(){
                expect(editItemStub).to.be.calledOnce;
            });
            it('should stop the activity indicator', function(){
                expect(AIStopStub).to.be.calledOnce;
            });
        });
        describe('when API call throws an error', function(){
            beforeEach(function(){
                this.sinon.stub(coachSeekAPIService, APIFunctionName, function(){
                    var deferred = $q.defer();
                    deferred.reject(new Error(errorMessage));
                    return deferred.promise;
                });
                CRUDService.create(APIFunctionName, scope);
                $rootScope.$apply();
            });
            it('should display an error message', function(){
                expect($rootScope.alerts[0].type).to.equal('danger');
                expect($rootScope.alerts[0].message).to.equal('businessSetup:' + errorMessage);
            });
            it('should stop the activity indicator', function(){
                expect(AIStopStub).to.be.calledOnce;
            });

        });
    });
    describe('when calling update()', function(){
        it('should start the activity indicator', function(){
            CRUDService.update(APIFunctionName, scope, {})
            expect(AIStartStub).to.be.calledOnce;
        });
        describe('when API call is successful', function(){
            var removeAlertsStub;
            beforeEach(function(){
                scope.itemList = [];
                scope.removeAlerts = function(){};

                this.sinon.stub(coachSeekAPIService, APIFunctionName, function(){
                    var deferred = $q.defer();
                    deferred.resolve('data');
                    return deferred.promise;
                });
                removeAlertsStub = this.sinon.stub(scope, 'removeAlerts')

                CRUDService.update(APIFunctionName, scope, initData);
                // Must call apply here because we are not using a template
                // and $q promise resolution is not propogated automatically
                $rootScope.$apply();
            });
            it('should add the item back to the itemList', function(){
                expect(scope.itemList[0]).to.equal(initData)
            });
            it('should set reset the to the list view state', function(){
                expect(scope.item).to.equal(null);
                expect(scope.newItem).to.equal(null);
                expect(scope.itemCopy).to.equal(null);
                expect(removeAlertsStub).to.be.calledOnce;
            });
            it('should stop the activity indicator', function(){
                expect(AIStopStub).to.be.calledOnce;
            });
        });
        describe('when API call throws an error', function(){
            beforeEach(function(){
                this.sinon.stub(coachSeekAPIService, APIFunctionName, function(){
                    var deferred = $q.defer();
                    deferred.reject(new Error(errorMessage));
                    return deferred.promise;
                });
                CRUDService.update(APIFunctionName, scope, {});
                $rootScope.$apply();
            });
            it('should display an error message', function(){
                expect($rootScope.alerts[0].type).to.equal('danger');
                expect($rootScope.alerts[0].message).to.equal('businessSetup:' + errorMessage);
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
            scope.itemCopy = initData;
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

                expect(scope.itemList[0]).to.equal(initData);
            });
        });
    });
    describe('when calling validateForm()', function(){

    });
});