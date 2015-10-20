describe('selectOverlay directive', function(){
    
    let('selectedOption', function(){
        return 'boobs';
    });

    let('placeholder', function(){
        return 'choose your favorite body part';
    });

    var scope, $selectOverlayText;
    beforeEach(function(){
        scope = $rootScope.$new();
        scope.prefix = "app:";
        scope.selectedOption = this.selectedOption;
        scope.placeholder = this.placeholder;
        createDirective(scope, '<select-overlay i18n-prefix="prefix" selected-option="selectedOption" placeholder="placeholder"></select-overlay>');
        $selectOverlayText = $testRegion.find('.select-overlay-text').attr('ng-i18next');
    });
    describe('when there is a placeholder and a selected option', function(){
        it('should show the selected option', function(){
            expect($selectOverlayText).to.equal('[i18next]' + scope.prefix + this.selectedOption);
        });
    });
    describe('when there is a placeholder and a selected option is 0', function(){
        let('selectedOption', function(){
            return 0;
        });
        it('should show the selected option', function(){
            expect($selectOverlayText).to.equal('[i18next]' + scope.prefix + this.selectedOption);
        });
    });
    describe('when there is a placeholder and and option has NOT been selected', function(){
        let('selectedOption', function(){
            return undefined;
        });
        it('should show the selected placeholder', function(){
            expect($selectOverlayText).to.equal('[i18next]' + this.placeholder);
        });
    });
    describe('when there is a selected option and NOT a placeholder', function(){
        let('placeholder', function(){
            return null;
        });
        it('should show the selected option', function(){
            expect($selectOverlayText).to.equal('[i18next]' + scope.prefix + this.selectedOption);
        });
    });
    describe('when there is NOT a placeholder OR a selected option', function(){
        let('selectedOption', function(){
            return undefined;
        });
        let('placeholder', function(){
            return null;
        });
        it('should show blank text', function(){
            expect($selectOverlayText).to.equal('[i18next]');
        });
    });
});