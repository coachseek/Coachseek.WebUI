describe('timePicker directive', function(){
    describe('when default time is provided', function(){
        var $timePicker,
            scope;
        beforeEach(function(){
            scope = $rootScope.$new();
            
            this.let('testTime', function(){
                return '22:00';
            });

            scope.testTime = this.testTime;

            createDirective(scope, '<div><time-picker time="testTime"></time-picker></div>');
        });
        it('should set time to time provided', function(){
            expect(scope.testTime).to.equal(this.testTime);
        });
        describe('when clicking the increase hour button', function(){
            var $increaseHour;
            beforeEach(function(){
                $increaseHour = $testRegion.find('.increase .hours');
                $increaseHour.trigger('click');
            });
            it('should add an hour to the set time', function(){
                expect(scope.testTime).to.equal('23:00');
            });
            // describe('and the hour is 23', function(){
            //     it('should roll over to 0', function(){
            //         $increaseHour.trigger('click');

            //         expect(scope.testTime).to.equal('0:00');
            //     });
            // });
        });
        describe('when clicking the decrease hour button', function(){
            var $decreaseHour;
            beforeEach(function(){
                $decreaseHour = $testRegion.find('.decrease .hours');
                $decreaseHour.trigger('click');
            });
            it('should add an hour to the set time', function(){
                expect(scope.testTime).to.equal('21:00');
            });
            // describe('and the hour is 0', function(){
            //     it('should roll over to 23', function(){
            //         $decreaseHour.trigger('click');

            //         expect(scope.testTime).to.equal('23:00');
            //     });
            // });
        });
        describe('when clicking the increase minute button', function(){
            var $increaseMinute;
            beforeEach(function(){
                $increaseMinute = $testRegion.find('.increase .minutes');
            });
            it('should increase the time by 15 minutes', function(){
                $increaseMinute.trigger('click');
                expect(scope.testTime).to.equal('22:15');
            });
            // describe('and the minutes are 45', function(){
            //     it('should roll over to next hour', function(){
            //         $timePicker.scope().time = "0:45"
            //         scope.$apply();
            //         // $increaseMinute.trigger('click');
            //         expect(scope.testTime).to.equal('1:00');
            //     });
            // });
        });
        describe('when clicking the decrease minute button', function(){
            var $decreaseMinute;
            beforeEach(function(){
                $decreaseMinute = $testRegion.find('.decrease .minutes');
            });
            it('should reduce the time by 15 minutes', function(){
                $decreaseMinute.trigger('click');
                expect(scope.testTime).to.equal('21:45');
            });
            // describe('and the minutes are 15', function(){
            //     it('should roll over to previous hour', function(){
            //         scope.testTime = "13:15";
            //         scope.$digest();
            //         $decreaseMinute.trigger('click');

            //         expect(scope.testTime).to.equal('12:00');
            //     });
            // });
        });
    });
});