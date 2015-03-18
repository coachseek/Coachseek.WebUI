describe('Customers Module', function() {
    describe('when navigating to customers', function(){
        beforeEach(function(){
            $state.go('customers');
            $rootScope.$digest();
        });
        it('should attempt to bring up the login modal if not logged in', function(){
            expect(loginModalStub).to.be.calledOnce;
        });
        it('should map to correct template', function(){
            expect($state.current.templateUrl).to.equal('customers/partials/customersView.html');
        });
        it('should map to the correct controller', function(){
            expect($state.current.controller).to.equal('customersCtrl');
        });
    });
});