describe('repeatSelector directive', function(){
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
        beforeEach(function(){
            $sessionCount = $testRegion.find('.session-count');
            $sessionCount.get(0).click();

            $testRegion.find('input').val(130);
            angular.element($testRegion.find('input')).triggerHandler('change');
        });
        describe('and then submittting the change', function(){
            it('should set the sessionCount to the scope', function(){
                var $form = angular.element($testRegion.find('form'))
                $form.triggerHandler('submit');

                expect(scope.sessionCount).to.equal(130);
            });
        });
        describe('and then cancelling the change', function(){
            it('should set the sessionCount to the scope', function(){
                $("button[type='button']").trigger('click')

                expect(scope.sessionCount).to.equal(this.sessionCount);
            });
        });
    });
    describe('when changing the repeat frequency', function(){

        // Reference for <select> element
        // xeditable changes values to [0, 1, 2, 3] in DOM

        //     [{value: 'w', text: 'week'},
        //     {value: 'd', text: 'day'},
        //     {value: null, text: 'once'},
        //     {value: -1, text: 'forever'}];
        var $repeatFrequency;
        beforeEach(function(){
            $repeatFrequency = $testRegion.find('.repeat-frequency');
            $repeatFrequency.get(0).click();
        });
        describe('when changing it to days', function(){
            beforeEach(function(){
                $testRegion.find('select').val('1');
                angular.element($testRegion.find('select')).triggerHandler('change');
            });
            it('should set not reset the sessionCount', function(){
                expect(scope.sessionCount).to.equal(this.sessionCount);
            });
            it('should set the repeatFrequency to "d"', function(){
                expect(scope.repeatFrequency).to.equal("d")
            });
            describe('and then changing it back to weeks', function(){
                beforeEach(function(){
                    $repeatFrequency.get(0).click();

                    $testRegion.find('select').val('0');
                    angular.element($testRegion.find('select')).triggerHandler('change');
                });
                it('should set not reset the sessionCount', function(){
                    expect(scope.sessionCount).to.equal(this.sessionCount);
                });
                it('should set the repeatFrequency to "w"', function(){
                    expect(scope.repeatFrequency).to.equal("w")
                });
            });
        });
        describe('when changing it to once', function(){
            beforeEach(function(){
                $testRegion.find('select').val('2');
                angular.element($testRegion.find('select')).triggerHandler('change');
            });
            it('should set the session count to null', function(){
                expect(scope.sessionCount).to.equal(null);
            });
            it('should set the repeatFrequency to null', function(){
                expect(scope.repeatFrequency).to.equal(null)
            });
            describe('and then changing it back to days', function(){
                beforeEach(function(){
                    $repeatFrequency.get(0).click();

                    $testRegion.find('select').val('1');
                    angular.element($testRegion.find('select')).triggerHandler('change');
                });
                it('should reset the sessionCount to 2', function(){
                    expect(scope.sessionCount).to.equal(2);
                });
                it('should set the repeatFrequency to "d"', function(){
                    expect(scope.repeatFrequency).to.equal("d")
                });
            });
        });
        describe('when changing it to forever', function(){
            beforeEach(function(){
                $testRegion.find('select').val('3');
                angular.element($testRegion.find('select')).triggerHandler('change');
            });
            it('should set the session count to 1', function(){
                expect(scope.sessionCount).to.equal(-1);
            });
            it('should set the repeatFrequency to -1', function(){
                expect(scope.repeatFrequency).to.equal(-1)
            });
            describe('and then changing it back to weeks', function(){
                beforeEach(function(){
                    $repeatFrequency.get(0).click();

                    $testRegion.find('select').val('0');
                    angular.element($testRegion.find('select')).triggerHandler('change');
                });
                it('should reset the sessionCount to 2', function(){
                    expect(scope.sessionCount).to.equal(2);
                });
                it('should set the repeatFrequency to "w"', function(){
                    expect(scope.repeatFrequency).to.equal("w")
                });
            });
        });
    });
});