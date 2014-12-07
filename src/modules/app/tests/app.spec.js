describe('App Module', function() {
    it('should set $rootScope.alerts to an empty array', function(){
        expect($rootScope.alerts).to.be.empty;
    });
    describe('global alert system', function(){

        beforeEach(function(){
            this.let('alertOne', function(){
                return {
                    type: 'warning',
                    message: 'alert one'
                }
            });

            this.let('alertTwo', function(){
                return {
                    type: 'warning',
                    message: 'alert two'
                }
            });

            this.let('alertThree', function(){
                return {
                    type: 'error',
                    message: 'alert three'
                }
            })

            $rootScope.addAlert(this.alertOne);
            $rootScope.addAlert(this.alertTwo);
            $rootScope.addAlert(this.alertThree);
        });

        describe('when calling addAlert() with new alerts', function(){
            it('should set them on the $rootScope', function(){
                expect($rootScope.alerts.length).to.equal(3);
            })
        });
        describe('when calling addAlert() with existing alerts', function(){
            it('should not add them to alerts', function(){
                $rootScope.addAlert(this.alertOne);

                expect($rootScope.alerts.length).to.equal(3);
            });
        });
        describe('when calling closeAlert(index)', function(){
            it('should remove the correct alert', function(){
                $rootScope.closeAlert(1);

                expect(_.contains($rootScope.alerts, this.alertOne)).to.be.true;
                expect(_.contains($rootScope.alerts, this.alertThree)).to.be.true;
            });
        });
        describe('when calling removeAlerts()', function(){
            it('should erase all alerts from $rootScope', function(){
                $rootScope.removeAlerts()

                expect($rootScope.alerts).to.be.empty;
            })
        });
    });
});