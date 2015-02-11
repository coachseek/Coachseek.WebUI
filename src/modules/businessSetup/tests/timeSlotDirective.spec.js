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
                        startTime: '11:00',
                        finishTime: '12:00',
                        isAvailable: false 
                     }, 
                     wednesday: {
                        startTime: '11:00',
                        finishTime: '12:00',
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

    describe('when clicking on the start time to edit', function(){
        
        let('monday', function(){
            return { 
                isAvailable: true,
                startTime: '11:30',
                finishTime: '12:15'
            }
        });

        beforeEach(function(){
            $monday.find('.time-picker-time.start').trigger('click');
        });
        it('should show the time picker with the clicked time', function(){
            var $timePicker = $monday.find('.time-picker');
            var timeArray = this.monday.startTime.split(":");

            expect($monday.find('.time-picker-container').hasClass('ng-hide')).to.be.false;
            expect($timePicker.find('.hours .display').text().trim()).to.equal(timeArray[0]);
            expect($timePicker.find('.minutes .display').text().trim()).to.equal(timeArray[1]);
        });
        describe('when clicking on the end time to edit', function(){
            it('should change the timepicker to the other time', function(){
                $monday.find('.time-picker-time.finish').trigger('click');

                var $timePicker = $monday.find('.time-picker');
                var timeArray = this.monday.finishTime.split(":");

                expect($monday.find('.time-picker-container').hasClass('ng-hide')).to.be.false;
                expect($timePicker.find('.hours .display').text().trim()).to.equal(timeArray[0]);
                expect($timePicker.find('.minutes .display').text().trim()).to.equal(timeArray[1]);
            });
        });
        describe('when clicking the save button', function(){
            describe('when the time range is valid', function(){
                it('should hide the timepicker', function(){
                    $monday.find('.time-picker-save-button').trigger('click');

                    expect($monday.find('.time-picker-container').hasClass('ng-hide')).to.be.true;
                });
            });
            describe('when the time range is NOT valid', function(){
                beforeEach(function(){
                    scope.item.workingHours.monday.startTime = "9:00";
                    scope.item.workingHours.monday.finishTime = "8:00";
                    scope.$digest();

                    $monday.find('.time-picker-save-button').trigger('click');
                })
                it('should not hide the timepicker', function(){
                    expect($monday.find('.time-picker-container').hasClass('ng-hide')).to.be.false;
                });
                it('should display an error message', function(){
                    expect($rootScope.alerts[0].type).to.equal('warning');
                    expect($rootScope.alerts[0].message).to.equal('businessSetup:timeRange-invalid');
                });
            });
        });
        describe('when clicking the cancel button', function(){
            var mondayCopy;
            beforeEach(function(){
                mondayCopy = angular.copy(this.monday);
            });
            describe('when the time range is valid', function(){
                beforeEach(function(){
                    scope.item.workingHours.monday.startTime = "09:00";
                    scope.$digest();

                    $monday.find('.time-picker-cancel-button').trigger('click');
                });
                it('should reset both time ranges', function(){
                    var $timePicker = $monday.find('.time-picker');
                    var timeArray = mondayCopy.startTime.split(":");

                    expect($timePicker.find('.hours .display').text().trim()).to.equal(timeArray[0]);
                    expect($timePicker.find('.minutes .display').text().trim()).to.equal(timeArray[1]);
                });
                it('should hide the time picker', function(){
                    expect($monday.find('.time-picker-container').hasClass('ng-hide')).to.be.true;
                });
            });
            describe('when the time range is NOT valid', function(){
                beforeEach(function(){
                    scope.item.workingHours.monday.startTime = "9:00";
                    scope.item.workingHours.monday.finishTime = "8:00";
                    scope.$digest();

                    $monday.find('.time-picker-cancel-button').trigger('click');
                })
                it('should reset both time ranges', function(){
                    var $timePicker = $monday.find('.time-picker');
                    var timeArray = mondayCopy.startTime.split(":");

                    expect($timePicker.find('.hours .display').text().trim()).to.equal(timeArray[0]);
                    expect($timePicker.find('.minutes .display').text().trim()).to.equal(timeArray[1]);
                });
                it('should hide the time picker', function(){
                    expect($monday.find('.time-picker-container').hasClass('ng-hide')).to.be.true;
                });
            });

        });
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
                scope.$digest();

                var $mondayTimeRange = $testRegion.find('time-range-picker').first();
                expect($mondayTimeRange.hasClass('ng-invalid')).to.be.true;                
            });
        });
        describe('when there is ample time between times', function(){
            describe('and the hour is the same', function(){
                it('the day should be vaild', function(){
                    scope.item.workingHours.monday.startTime = "11:00";
                    scope.item.workingHours.monday.finishTime = "11:30";
                    scope.$digest();

                    var $mondayTimeRange = $testRegion.find('time-range-picker').first();
                    expect($mondayTimeRange.hasClass('ng-invalid')).to.be.false;                
                });
            });
            describe('and the hour is different', function(){
                it('the day should be vaild', function(){
                    scope.item.workingHours.monday.startTime = "9:00";
                    scope.$digest();

                    var $mondayTimeRange = $testRegion.find('time-range-picker').first();
                    expect($mondayTimeRange.hasClass('ng-invalid')).to.be.false;                
                });  
            });
        })
    });
});