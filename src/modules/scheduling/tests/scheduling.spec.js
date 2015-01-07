describe.only('Scheduling Module', function() {

    var scope,
        coachSeekAPIService,
        templateUrl = 'scheduling/partials/schedulingView.html';

    beforeEach(function() {
        coachSeekAPIService = $injector.get('coachSeekAPIService');
        scope = $rootScope.$new();
    });
    describe('when navigating to scheduling', function(){
        var viewAttrs;
        beforeEach(function(){
            $state.go('scheduling');
            $rootScope.$digest();
        });
        it('should map to correct template', function(){
            expect($state.current.templateUrl).to.equal(templateUrl);
        });
        it('should map to the correct controller', function(){
            expect($state.current.controller).to.equal('schedulingCtrl');
        });
    });
    describe('when loading the calendar', function(){
        var getServicesStub;
        beforeEach(function(){
            getServicesStub = this.sinon.stub(coachSeekAPIService, 'getServices', function(){
                var deferred = $q.defer();
                deferred.resolve([{},{}]);
                return deferred.promise;
            });
        });
        it('should attempt to get existing services', function(){
            createViewWithController(scope, templateUrl, 'schedulingCtrl');
            expect(getServicesStub).to.be.calledOnce;
        });
    })
});