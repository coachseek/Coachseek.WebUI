describe('colorPicker directive', function(){
    
    let('currentColor', function(){
        return 'green';
    });
    
    var scope;
    beforeEach(function(){
        scope = $rootScope.$new();

        scope.currentColor = this.currentColor;
        // must wrap here in because if the directives replace
        // is set to true we just get a commented out element
        createDirective(scope, '<div><color-picker current-color="currentColor"></color-picker></div>');
    });
    it('should set the selected color to the current color on scope', function(){
        $currentColor = angular.element($testRegion.find('.selected'));
        expect($currentColor.hasClass(this.currentColor)).to.be.true;
    });
    describe('when clicking on another color', function(){
        var $secondColor;
        beforeEach(function(){
            $secondColor = angular.element($testRegion.find('li:nth-child(2)'));
            $secondColor.triggerHandler('click');
        });
        it('should set the currentColor to the new color', function(){
            expect($secondColor.hasClass(scope.currentColor)).to.be.true;
        });
    });
});