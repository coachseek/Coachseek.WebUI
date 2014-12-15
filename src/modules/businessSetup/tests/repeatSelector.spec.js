describe.only('repeatSelector directive', function(){
    var scope;
    beforeEach(function(){
        scope = $rootScope.$new();

        this.let('sessionCount', function(){
            return 12;
        });

        this.let('repeatFrequency', function(){
            return 'w';
        });

        scope.sessionCount = this.sessionCount;
        scope.repeatFrequency = this.repeatFrequency;
        // must wrap here in because if the directives replace
        // is set to true we just get a commented out element
        createDirective(scope, '<div><repeat-selector repeat-frequency="repeatFrequency" session-count="sessionCount"></repeat-selector></div>');
    });
    it('should set the session count in the template', function(){
        var $sessionCount = $testRegion.find('.session-count');

        expect(parseFloat($sessionCount.text())).to.equal(this.sessionCount)
    });
    it('should set the repeat frequency count in the template', function(){
        var $repeatFrequency = $testRegion.find('.repeat-frequency');
        $repeatFrequency.get(0).click();

        $repeatFrequencySelected = $testRegion.find('form [selected]');
        expect($repeatFrequencySelected.text()).to.equal('week');
    });
    describe('when changing the sessionCount', function(){
        it('should set the sessionCount to the scope', function(){
            $sessionCount = $testRegion.find('.session-count');
            $sessionCount.get(0).click();

            $testRegion.find('input').val(130)
            $testRegion.find('button[type=submit]').get(0).click()
            
            expect(scope.sessionCount).to.equal(130);
        });
        describe('and then submittting the change', function(){

        });
        describe('and then cancelling the change', function(){

        });
    });
    describe('when changing the repeat frequency', function(){
        beforeEach(function(){
            var $repeatFrequency = $testRegion.find('.repeat-frequency');
            $repeatFrequency.get(0).click();
        });
        describe('when changing it to days', function(){
            it('should set the session count to 2', function(){

            });
        });
        describe('when changing it to weeks', function(){
            it('should set the session count to 2', function(){

            });
        });
        describe('when changing it to once', function(){
            it('should set the session count to null', function(){

            });
        });
        describe('when changing it to forever', function(){
            it('should set the session count to -1', function(){

            });
        });
    });
});