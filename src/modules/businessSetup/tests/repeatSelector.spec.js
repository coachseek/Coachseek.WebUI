describe.only('repeatSelector directive', function(){
    var scope;
    
    let('sessionCount', function(){
        return 12;
    });

    let('repeatFrequency', function(){
        return 'w';
    });

    beforeEach(function(){
        scope = $rootScope.$new();
        scope.sessionCount = this.sessionCount;
        scope.repeatFrequency = this.repeatFrequency;
        // must wrap here in because if the directives replace
        // is set to true we just get a commented out element
        createDirective(scope, '<div><repeat-selector repeat-frequency="repeatFrequency" session-count="sessionCount"></repeat-selector></div>');
    });
    describe('when loading the repeatSelector', function(){
        it('should set the session count in the template', function(){
            var $sessionCount = $testRegion.find('.session-count');
            expect(parseFloat($sessionCount.val())).to.equal(this.sessionCount)
        });

        var $repeatCheckbox,
            $repeatFrequency;
        beforeEach(function(){
            $repeatCheckbox = $testRegion.find('.repeat-checkbox');
            $repeatFrequency = $testRegion.find('.repeat-frequency');
        });

        describe('when repeatFrequency is set to `w`', function(){
            it('should check the checkbox', function(){
                $testRegion.appendTo('body');
                expect($repeatCheckbox.attr('checked')).to.equal('checked');
            });
            it('should set the repeat frequency to `w`', function(){
                expect($repeatFrequency.val()).to.equal('w');
            });
        });
        describe('when repeatFrequency is not set', function(){

            let('repeatFrequency', function(){
                return null;
            });

            describe('and the sessionCount is greater than 1', function(){

                it('should check the checkbox', function(){
                    expect($repeatCheckbox.attr('checked')).to.equal('checked');
                });
                it('should set the repeat frequency to `d`', function(){
                    expect($repeatFrequency.val()).to.equal('d');
                });
            });
            describe('and the sessionCount is less than 2', function(){
                
                let('sessionCount', function(){
                    return 1;
                });

                it('should NOT check the checkbox', function(){
                    expect($repeatCheckbox.attr('checked')).to.equal(undefined);
                });
                it('should set the repeat frequency to null', function(){
                    //TODO – is this correct? Angular puts ? object:null ? if it
                    //      does not detect a null value in a select element
                    expect($repeatFrequency.val()).to.equal('? object:null ?');
                });
            });
        });
    });
    describe('when checking the checkbox', function(){

        let('sessionCount', function(){
            return 1;
        });

        var $repeatCheckbox;
        beforeEach(function(){
            $repeatCheckbox = $testRegion.find('.repeat-checkbox');
            $repeatCheckbox.get(0).click();
        });
        it('should set the sessionCount to 2', function(){
            expect(scope.sessionCount).to.equal(2);
        });
        it('should set the repeatFrequency to `d`', function(){
            expect(scope.repeatFrequency).to.equal('d');
        });
        describe('when unchecking the checkbox', function(){

            beforeEach(function(){
                $repeatCheckbox.get(0).click();
            });
            it('should set the sessionCount to 1', function(){
                expect(scope.sessionCount).to.equal(1);
            });
            it('should set the repeatFrequency to null', function(){
                expect(scope.repeatFrequency).to.equal(null);
            });
        });
    });
    describe('when changing the sessionCount', function(){
        beforeEach(function(){
            $sessionCount = $testRegion.find('.session-count');
            $sessionCount.val(130);
            angular.element($sessionCount).triggerHandler('change');
        });
        it('should set the sessionCount to the scope', function(){
            expect(scope.sessionCount).to.equal(130);
        });
    });
    describe('when changing the repeat frequency', function(){
        var $repeatFrequency;
        beforeEach(function(){
            $repeatFrequency = $testRegion.find('.repeat-frequency');
        });
        describe('when changing it to days', function(){
            beforeEach(function(){
                $repeatFrequency.val('d');
                angular.element($repeatFrequency).triggerHandler('change');
            });
            it('should set not reset the sessionCount', function(){
                expect(scope.sessionCount).to.equal(this.sessionCount);
            });
            it('should set the repeatFrequency to "d"', function(){
                expect(scope.repeatFrequency).to.equal("d")
            });
            describe('and then changing it back to weeks', function(){
                beforeEach(function(){
                    $repeatFrequency.val('w');
                    angular.element($repeatFrequency).triggerHandler('change');
                });
                it('should set not reset the sessionCount', function(){
                    expect(scope.sessionCount).to.equal(this.sessionCount);
                });
                it('should set the repeatFrequency to "w"', function(){
                    expect(scope.repeatFrequency).to.equal("w")
                });
            });
        });
    });
});