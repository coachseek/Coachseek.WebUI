describe('timePicker directive', function(){
    describe('when default time is provided', function(){
        var $timePicker,
            scope;

        let('testTime', function(){
            return '12:00';
        });
        beforeEach(function(){
            scope = $rootScope.$new();
            scope.testTime = this.testTime;
            createDirective(scope, '<div><time-picker time="testTime"></time-picker></div>');
        });
        it('should set time to time provided', function(){
            expect(scope.testTime).to.equal(this.testTime);
        });
        describe('when clicking the increase hour button', function(){
            beforeEach(function(){
                var $increaseHour = $testRegion.find('.hours .increase');
                $increaseHour.trigger('click');
            });
            it('should add an hour to the set time', function(){
                expect(scope.testTime).to.equal('13:00');
            });

            describe('and the hour is 23', function(){

                let('testTime', function(){
                    return '23:00';
                });

                it('should roll over to 0', function(){
                    expect(scope.testTime).to.equal('00:00');
                });
            });
        });
        describe('when clicking the decrease hour button', function(){
            beforeEach(function(){
                var $decreaseHour = $testRegion.find('.hours .decrease');
                $decreaseHour.trigger('click');
            });
            it('should subtract an hour to the set time', function(){
                expect(scope.testTime).to.equal('11:00');
            });
            describe('and the hour is 0', function(){

                let('testTime', function(){
                    return '0:00';
                });

                it('should roll over to 23', function(){
                    expect(scope.testTime).to.equal('23:00');
                });
            });
        });
        describe('when clicking the increase minute button', function(){
            beforeEach(function(){
                var $increaseMinute = $testRegion.find('.minutes .increase');
                $increaseMinute.trigger('click');
            });
            it('should increase the time by 15 minutes', function(){
                expect(scope.testTime).to.equal('12:15');
            });
            describe('and the minutes are 45', function(){

                let('testTime', function(){
                    return '12:45';
                });

                it('should roll over to next hour', function(){
                    expect(scope.testTime).to.equal('13:00');
                });
            });
        });
        describe('when clicking the decrease minute button', function(){

            let('testTime', function(){
                return '12:15';
            });

            beforeEach(function(){
                var $decreaseMinute = $testRegion.find('.minutes .decrease');
                $decreaseMinute.trigger('click');
            });
            it('should reduce the time by 15 minutes', function(){
                expect(scope.testTime).to.equal('12:00');
            });
            describe('and the minutes are 15', function(){

                let('testTime', function(){
                    return '12:00';
                });

                it('should roll over to previous hour', function(){
                    expect(scope.testTime).to.equal('11:45');
                });
            });
        });
    });
});