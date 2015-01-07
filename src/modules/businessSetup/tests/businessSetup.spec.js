describe('BusinessSetup Module', function() {

    var scope,
        coachSeekAPIService;

    beforeEach(function() {
        coachSeekAPIService = $injector.get('coachSeekAPIService');
        scope = $rootScope.$new();
    });
    describe('businessSetup states', function() {
        describe('when navigating to businessSetup.business', function(){
            var viewAttrs;
            beforeEach(function(){
                $state.go('businessSetup.business');
                $rootScope.$digest();

                viewAttrs = $state.current.views['list-item-view'];
            });
            it('should map to correct template', function(){
                expect(viewAttrs.templateUrl).to.equal('businessSetup/partials/businessView.html');
            });
            it('should map to the correct controller', function(){
                expect(viewAttrs.controller).to.equal('businessCtrl');
            });
        });
        describe('when navigating to businessSetup.services', function(){
            var viewAttrs;
            beforeEach(function(){
                $state.go('businessSetup.services');
                $rootScope.$digest();

                viewAttrs = $state.current.views['list-item-view'];
            });
            it('should map to correct template', function(){
                expect(viewAttrs.templateUrl).to.equal('businessSetup/partials/servicesView.html');
            });
            it('should map to the correct controller', function(){
                expect(viewAttrs.controller).to.equal('servicesCtrl');
            });
        });
        describe('when navigating to businessSetup.coachList', function(){
            var viewAttrs;
            beforeEach(function(){
                $state.go('businessSetup.coachList');
                $rootScope.$digest();

                viewAttrs = $state.current.views['list-item-view'];
            });
            it('should map to correct template', function(){
                expect(viewAttrs.templateUrl).to.equal('businessSetup/partials/coachesView.html');
            });
            it('should map to the correct controller', function(){
                expect(viewAttrs.controller).to.equal('coachesCtrl');
            });
        });
        describe('when navigating to businessSetup.locations', function(){
            var viewAttrs;
            beforeEach(function(){
                $state.go('businessSetup.locations');
                $rootScope.$digest();

                viewAttrs = $state.current.views['list-item-view'];
            });
            it('should map to correct template', function(){
                expect(viewAttrs.templateUrl).to.equal('businessSetup/partials/locationsView.html');
            });
            it('should map to the correct controller', function(){
                expect(viewAttrs.controller).to.equal('locationsCtrl');
            });
        });
    });
}); 