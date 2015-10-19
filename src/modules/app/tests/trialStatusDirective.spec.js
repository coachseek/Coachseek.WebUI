describe("trialStatus Directive", function(){
    let("trialDaysLeft", function(){
        return 12;
    });

    var scope;
    beforeEach(function(){
        scope = $rootScope.$new();
        _.set(scope, 'currentUser.trialDaysLeft', this.trialDaysLeft);
        createDirective(scope, '<trial-status trial-days-left="currentUser.trialDaysLeft"></trial-status>');
        $trialStatus = $testRegion.find('.trial-status');
    });
    it('should include the amount of days in the message', function(){
        expect($trialStatus.find('span').attr('ng-i18next')).to.equal("[i18next]({count:trialDaysLeft})trial-live");
    });
    describe('when there are trial days left', function(){
        it('should have the `trial-live` class', function(){
            expect($trialStatus.hasClass('trial-live')).to.be.true;
        });
        it('should show the close button', function(){
            expect($trialStatus.find('i.fa-close').length).to.not.equal(0);
        });
        describe('when clicking the close button', function(){
            beforeEach(function(){
                $testRegion.find('i.fa-close').trigger('click');
            });
            it('should remove the trial message banner', function(){
                expect($testRegion.find('.trial-status').length).to.equal(0);
            });
        });
    });
    describe('when there are 0 (or less) trial days left', function(){
        let("trialDaysLeft", function(){
            return 0;
        });
        it('should have the `trial-license-expired` class', function(){
            expect($trialStatus.hasClass('trial-license-expired')).to.be.true;
        })
        it('should NOT show the close button', function(){
            expect($trialStatus.find('i.fa-close').length).to.equal(0);
        })
    });
});