describe('repeatSelector directive', function(){
    var scope;
    
    let('sessionCount', function(){
        return 12;
    });

    let('repeatFrequency', function(){
        return 'w';
    });

    var $repeatDropdown,
        $frequencySelector,
        $repeatFrequency;
    beforeEach(function(){
        scope = $rootScope.$new();
        scope.sessionCount = this.sessionCount;
        scope.repeatFrequency = this.repeatFrequency;
        // must wrap here in because if the directives replace
        // is set to true we just get a commented out element
        createDirective(scope, '<div><repeat-selector repeat-frequency="repeatFrequency" session-count="sessionCount"></repeat-selector></div>');

        $repeatDropdown = $testRegion.find('.repeatable-dropdown');
        $frequencySelector = $testRegion.find('.frequency-selector');
        $repeatFrequency = $testRegion.find('.repeat-frequency');
    });
    describe('when loading the repeatSelector', function(){
        it('should set the session count in the template', function(){
            var $sessionCount = $testRegion.find('.session-count');
            expect(parseFloat($sessionCount.val())).to.equal(this.sessionCount)
        });

        describe('when repeatFrequency is set to `w`', function(){
            it('should set the dropdown value to `yes`', function(){
                expect($repeatDropdown.val()).to.equal('1');
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

                it('should set the dropdown value to `yes`', function(){
                    expect($repeatDropdown.val()).to.equal('1');
                });
                it('should set the repeat frequency to `d`', function(){
                    expect($repeatFrequency.val()).to.equal('d');
                });
            });
            describe('and the sessionCount is less than 2', function(){
                
                let('sessionCount', function(){
                    return 1;
                });

                it('should set the dropdown value to `no`', function(){
                    expect($repeatDropdown.val()).to.equal('0');
                });
                it('should set the repeat frequency to null', function(){
                    //TODO – is this correct? Angular puts ? undefined:undefined ? if it
                    //      does not detect a null value in a select element
                    expect($repeatFrequency.val()).to.equal('? undefined:undefined ?');
                });
            });
        });
    });
    describe('when changing the value to `Yes`', function(){

        let('sessionCount', function(){
            return 1;
        });

        beforeEach(function(){
            $repeatDropdown.val(1);
            angular.element($repeatDropdown).triggerHandler('change');
        });
        it('should set the sessionCount to 2', function(){
            expect(scope.sessionCount).to.equal(2);
        });
        it('should set the repeatFrequency to `d`', function(){
            expect(scope.repeatFrequency).to.equal('d');
        });
        it('should show the frequency selector', function(){
            expect($frequencySelector.hasClass('ng-hide')).to.be.false;
        });
        describe('when setting the dropdown value to `no`', function(){

            beforeEach(function(){
                $repeatDropdown.val(0);
                angular.element($repeatDropdown).triggerHandler('change');
            });
            it('should set the sessionCount to 1', function(){
                expect(scope.sessionCount).to.equal(1);
            });
            it('should set the repeatFrequency to null', function(){
                expect(scope.repeatFrequency).to.equal(undefined);
            });
            it('should hide the frequency selector', function(){
                expect($frequencySelector.hasClass('ng-hide')).to.be.true;
            });
        });
    });
    describe('when changing the sessionCount', function(){
        var $sessionCount;
        beforeEach(function(){
            $sessionCount = $testRegion.find('.session-count');
            $sessionCount.val(22);
            angular.element($sessionCount).triggerHandler('change');
        });
        it('should set the sessionCount to the scope', function(){
            expect(scope.sessionCount).to.equal(22);
        });
        beforeEach(function(){
                angular.element($sessionCount).triggerHandler('focus');
        });
        describe('when the sessionCount is focused', function(){

            describe('and the sessionCount is less than 2', function(){
                beforeEach(function(){
                    $sessionCount.val(undefined);
                    angular.element($sessionCount).triggerHandler('change');
                });

                it('should NOT hide the frequency selector', function(){
                    expect($frequencySelector.hasClass('ng-hide')).to.be.false;
                });
                describe('and the sessionCount is blurred', function(){
                    it('should hide the frequency selector', function(){
                        angular.element($sessionCount).triggerHandler('blur');
                        expect($frequencySelector.hasClass('ng-hide')).to.be.true;
                    });
                });
            })

            describe('and the sessionCount is greater than 1', function(){
                beforeEach(function(){
                    $sessionCount.val(22);
                    angular.element($sessionCount).triggerHandler('change');
                });
                it('should NOT hide the frequency selector', function(){
                    expect($frequencySelector.hasClass('ng-hide')).to.be.false;
                });
                describe('and the sessionCount is blurred', function(){
                    it('should NOT hide the frequency selector', function(){
                        angular.element($sessionCount).triggerHandler('blur');
                        expect($frequencySelector.hasClass('ng-hide')).to.be.false;
                    });
                });
            })
        });
    });
    describe('when changing the repeat frequency', function(){
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