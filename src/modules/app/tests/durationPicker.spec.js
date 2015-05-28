describe('durationPicker directive', function(){

    let('duration', function(){
        return 75;
    });
    
    var scope,
        $durationPicker;
    beforeEach(function(){
        scope = $rootScope.$new();
        scope.duration = this.duration;
        // must wrap here in because if the directives replace
        // is set to true we just get a commented out element
        createDirective(scope, '<div><duration-picker duration="duration"></duration-picker></div>');
        $durationPicker = $testRegion.find('duration-picker');
    });
    it('should show the duration in HH:MM', function(){
        expect($durationPicker.find('input').val()).to.equal('01:15');
    });
    describe('when clicking on the input', function(){
        beforeEach(function(){
            angular.element($durationPicker.find('input')).triggerHandler('click');
        });
        it('should show the timepicker', function(){
            expect($durationPicker.find('.time-picker-container').hasClass('ng-hide')).to.be.false;
        });
        it('should add `editing` class to duration picker container', function(){
            expect($durationPicker.find('.duration-picker-container').hasClass('editing')).to.be.true;
        });
        describe('when changing the time', function(){
            beforeEach(function(){
                $durationPicker.find('.hours .increase').trigger('click');
            });
            it('should set a new duration', function(){
                expect(scope.duration).to.equal(135);
            });
            describe('and then hitting the cancel buttion', function(){
                beforeEach(function(){
                    $durationPicker.find('.time-picker-cancel-button').trigger('click');
                });
                it('should reset the duration', function(){
                    expect(scope.duration).to.equal(75);
                });
                it('should hide the timepicker', function(){
                    expect($durationPicker.find('.time-picker-container').hasClass('ng-hide')).to.be.true;
                });
            });
            describe('and then hitting the save buttion', function(){
                beforeEach(function(){
                    $durationPicker.find('.time-picker-save-button').trigger('click');
                });
                it('should reset the duration', function(){
                    expect(scope.duration).to.equal(135);
                });
                it('should hide the timepicker', function(){
                    expect($durationPicker.find('.time-picker-container').hasClass('ng-hide')).to.be.true;
                });
            });
        });
        describe('when attempting to change the durat to 00:00', function(){
            describe('when time is 1:00', function(){
                let('duration', function(){
                    return 60;
                });
                beforeEach(function(){
                    $durationPicker.find('.hours .decrease').trigger('click');
                });
                it('should not change the time', function(){
                    expect($durationPicker.find('input').val()).to.equal('01:00');
                    expect(scope.duration).to.equal(this.duration);
                });
            });
            describe('when time is 00:15', function(){
                let('duration', function(){
                    return 15;
                });
                beforeEach(function(){
                    $durationPicker.find('.minutes .decrease').trigger('click');
                });
                it('should not change the time', function(){
                    expect($durationPicker.find('input').val()).to.equal('00:15');
                    expect(scope.duration).to.equal(this.duration);
                });
            }) 
        });
    });
});