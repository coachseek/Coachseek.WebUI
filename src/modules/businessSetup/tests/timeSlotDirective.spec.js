describe('timeSlot directive', function(){
    var scope;
    beforeEach(function(){
        scope = $rootScope.$new();

        scope.weekdays = ['monday', 'tuesday', 'wednesday'];
        scope.item = {
                firstName: "NEWEST",
                lastName: "USER",
                email: "aaron.smith@example.com",
                phone: "021 99 88 77",
                workingHours: {
                     monday: { 
                         isAvailable: true,
                         startTime: '11:00',
                         finishTime: '11:00'
                     },
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
    });
    it('should have as many entries as days', function(){
        var $weekdays = $testRegion.find('.weekday');
        expect($weekdays.length).to.equal(_.size(scope.item.workingHours));
    });
    describe('when a day is available', function(){
        it('should enable the time spinner', function(){
            var $monday = $testRegion.find('.weekday').first();
            expect($monday.find('time-range-picker').attr('disabled')).to.equal(undefined);
        });
    });
    describe('when a day is unavailable', function(){
        it('should disable the time spinner', function(){
            var $tuesday = $testRegion.find('.weekday:nth-child(2)');
            expect($tuesday.find('time-range-picker').hasClass('ng-hide')).to.be.true;
        });
    });
    describe('when clicking on the toggle available switch', function(){
        var $mondayToggleSwitch;
        beforeEach(function(){
            var $monday = $testRegion.find('.weekday').first();
            $mondayToggleSwitch = $monday.find('button');
            $mondayToggleSwitch.trigger('click');
        });
        it('should set isAvailable to false', function(){
            expect(scope.item.workingHours['monday'].isAvailable).to.be.false;
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
            it('the day should be invalid', function(){
                $mondayToggleSwitch.trigger('click');
                var $mondayTimeRange = $testRegion.find('time-range-picker').first();
                expect($mondayTimeRange.hasClass('ng-invalid')).to.be.true;                
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