describe('CoachSeekApp Module', function() {
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

            $rootScope.addAlert(this.alertOne);
            $rootScope.addAlert(this.alertTwo);
        });

        describe('when calling addAlert() with new alerts', function(){
            it('should set them on the $rootScope', function(){
                expect($rootScope.alerts.length).to.equal(2);
            })
        });
        describe('when calling addAlert() with existing alerts', function(){
            it('should not add them to alerts', function(){
                $rootScope.addAlert(this.alertOne);

                expect($rootScope.alerts.length).to.equal(2);
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