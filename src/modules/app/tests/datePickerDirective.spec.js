describe('datePicker directive', function(){
    
    let('date', function(){
        //has to be before 1969 because testing browser date is set to that. LOL.
        return '1959-02-06';
    });

    var scope, $datePicker;
    beforeEach(function(){
        scope = $rootScope.$new();
        scope.date = this.date;
        createDirective(scope, '<date-picker date="date"></date-picker>');
        $datePicker = $testRegion.find('date-picker');
    });
    describe('when date is set', function(){
        it('should display the correct date', function(){
            var date = moment(this.date, "YYYY-MM-DD");
            expect($datePicker.find('input[name=day]').val()).to.contain(date.date())
            expect($datePicker.find('select').val()).to.contain(date.month())
            expect($datePicker.find('input[name=year]').val()).to.contain(date.year())
        });
        describe('and then changing the day', function(){
            var $dayPicker;
            beforeEach(function(){
                $dayPicker = $datePicker.find('input[name=day]');
            });
            describe('to a valid day', function(){
                beforeEach(function(){
                    $dayPicker.val(1);
                    angular.element($dayPicker).triggerHandler('change');
                });
                it('should set the date on the scope', function(){
                    expect(scope.date).to.equal('1959-02-01')
                });
                it('should set the maxMonthDay on the scope', function(){
                    expect($dayPicker.attr('ng-max')).to.contain(moment(scope.date, "YYYY-MM-DD").endOf('month').date())
                });
            });
            describe('to an invalid day', function(){
                beforeEach(function(){
                    $dayPicker.val(41);
                    angular.element($dayPicker).triggerHandler('change');
                });
                it('should NOT reset the date on the scope', function(){
                    expect(scope.date).to.equal('1959-02-06')
                });
            });
        });
        describe('and then changing the month', function(){
            describe('to a valid month', function(){
                var $monthPicker;
                beforeEach(function(){
                    $monthPicker = $datePicker.find('select[name=month]');
                    $monthPicker.val("number:2");
                    angular.element($monthPicker).triggerHandler('change');
                });
                it('should set the date on the scope', function(){
                    expect(scope.date).to.equal('1959-03-06')
                });
                it('should set the maxMonthDay on the scope', function(){
                    expect($datePicker.find('input[name=day]').attr('ng-max')).to.contain(moment(scope.date, "YYYY-MM-DD").endOf('month').date())
                });
            });
        });
        describe('and then changing the year', function(){
            var $yearPicker;
            beforeEach(function(){
                $yearPicker = $datePicker.find('input[name=year]');
            });
            describe('to a valid year', function(){
                beforeEach(function(){
                    $yearPicker.val(1919);
                    angular.element($yearPicker).triggerHandler('change');
                });
                it('should set the date on the scope', function(){
                    expect(scope.date).to.equal('1919-02-06')
                });
                it('should set the maxMonthDay on the scope', function(){
                    expect($datePicker.find('input[name=day]').attr('ng-max')).to.contain(moment(scope.date, "YYYY-MM-DD").endOf('month').date())
                });
            });
            describe('to an invalid year', function(){
                beforeEach(function(){
                    $yearPicker.val(1000);
                    angular.element($yearPicker).triggerHandler('change');
                });
                it('should NOT reset the date on the scope', function(){
                    expect(scope.date).to.equal('1959-02-06')
                });
            });
        });
    });
    describe('when the date is not set', function(){
        let('date', function(){
            return undefined;
        })
        it('should not show anything', function(){
            expect($datePicker.find('input[name=day]').val()).to.equal('')
            expect($datePicker.find('select').val()).to.equal('')
            expect($datePicker.find('input[name=year]').val()).to.equal('')
        });
    });
});