describe('timeSlot directive', function(){

    let('monday', function(){
        return { 
            isAvailable: true,
            startTime: '11:00',
            finishTime: '11:00'
        }
    });

    var scope,
        $weekdays,
        $monday;
    beforeEach(function(){
        scope = $rootScope.$new();
        scope.item = {
                firstName: "NEWEST",
                lastName: "USER",
                email: "aaron.smith@example.com",
                phone: "021 99 88 77",
                workingHours: {
                     monday: this.monday,
                     tuesday: {
                         isAvailable: false
                     }, 
                     wednesday: {
                         isAvailable: true
                     }
                 }
        };
        // must wrap here in because if the directives replace
        // is set to true we just get a commented out element
        createDirective(scope, '<div><time-slot></time-slot></div>');

        $weekdays = $testRegion.find('.weekday');
        $monday = $testRegion.find('.weekday').first();
    });
    it('should have as many entries as days', function(){
        expect($weekdays.length).to.equal(7);
    });

    describe('when clicking on the toggle available switch', function(){
        var $mondayToggleSwitch;
        beforeEach(function(){
            $mondayToggleSwitch = $monday.find('button');
            $mondayToggleSwitch.trigger('click');
        });
        describe('when time range is invalid', function(){

            // let('monday', function(){
            //     return { 
            //         isAvailable: true,
            //         startTime: '12:00',
            //         finishTime: '11:00'
            //     }
            // });

            // it('should NOT set isAvailable to false', function(){
            //     expect(scope.item.workingHours['monday'].isAvailable).to.be.true;
            // });
            // it('should NOT hide the toggle switch', function(){
            //     var $mondayTimeRange = $testRegion.find('time-range-picker').first();
            //     expect($mondayTimeRange.hasClass('ng-hide')).to.be.false;                   
            // });
        });
        describe('when the time range is valid', function(){

            let('monday', function(){
                return { 
                    isAvailable: true,
                    startTime: '10:00',
                    finishTime: '11:00'
                }
            });

            it('should set isAvailable to false', function(){
                expect(scope.item.workingHours['monday'].isAvailable).to.be.false;
            });
            it('should hide the toggle switch', function(){
                var $mondayTimeRange = $testRegion.find('time-range-picker').first();
                expect($mondayTimeRange.hasClass('ng-hide')).to.be.true;                   
            });
            it('the day should be valid', function(){
                var $mondayTimeRange = $testRegion.find('time-range-picker').first();
                expect($mondayTimeRange.hasClass('ng-invalid')).to.be.false;                
            });
            describe('when clicking on the toggle available switch again', function(){
                it('should set isAvailable to true', function(){
                    $mondayToggleSwitch.trigger('click');
                    expect(scope.item.workingHours['monday'].isAvailable).to.be.true;
                });
            });
        });
    });
    describe('time validation', function(){
        describe('when times are the same', function(){
            it('the day should be invalid', function(){
                var $mondayTimeRange = $testRegion.find('time-range-picker').first();
                expect($mondayTimeRange.hasClass('ng-invalid')).to.be.true;                
            });
        });
        describe('when there is negative time between the times', function(){
            it('the day should be invalid', function(){
                scope.item.workingHours.monday.startTime = "12:00";
                scope.$apply();

                var $mondayTimeRange = $testRegion.find('time-range-picker').first();
                expect($mondayTimeRange.hasClass('ng-invalid')).to.be.true;                
            });
        });
        describe('when there is ample time between times', function(){
            it('the day should be vaild', function(){
                scope.item.workingHours.monday.startTime = "9:00";
                scope.$apply();

                var $mondayTimeRange = $testRegion.find('time-range-picker').first();
                expect($mondayTimeRange.hasClass('ng-invalid')).to.be.false;                
            });  
        })
    });
});