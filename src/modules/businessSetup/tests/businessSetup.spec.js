describe('BusinessSetup Module', function() {

    var scope,
        coachSeekAPIService,
        templateUrl = 'businessSetup/partials/coachListView.html';

    beforeEach(function() {
        coachSeekAPIService = $injector.get('coachSeekAPIService');
        scope = $rootScope.$new();
    });
    describe('businessSetup routes', function() {
        it('should map routes to controllers', function() {
            expect($route.routes['/business-setup/coach-list'].controller).to.equal('coachListCtrl');
            expect($route.routes['/business-setup/coach-services'].controller).to.equal('coachServicesCtrl');
            expect($route.routes['/business-setup/locations'].controller).to.equal('locationsCtrl');
        });
        it('should map routes to templates', function(){
            expect($route.routes['/business-setup/coach-list'].templateUrl).to.equal('businessSetup/partials/coachListView.html');
            expect($route.routes['/business-setup/coach-services'].templateUrl).to.equal('businessSetup/partials/coachServices.html');
            expect($route.routes['/business-setup/locations'].templateUrl).to.equal('businessSetup/partials/locations.html');
        });
        it('should default to root', function(){
            expect($route.routes[null].redirectTo).to.equal('/');
        });
    });
    describe('when the page loads', function(){
        var $coachListView, $coachEditView, getCoachesStub, createCoachStub, self;
        beforeEach(function(){
            self = this;
            self.let('coaches', function(){
                return [];
            });

            getCoachesStub = this.sinon.stub(coachSeekAPIService, 'getCoaches', function(){
                var deferred = $q.defer();
                deferred.resolve(self.coaches);
                return deferred.promise;
            });
            createCoachStub = this.sinon.stub(coachSeekAPIService, 'createCoach', function(){
                var deferred = $q.defer();
                deferred.resolve([{}]);
                return deferred.promise;
            });
        });
        it('should attempt to call getCoaches', function(){
            createViewWithController(scope, templateUrl, 'coachListCtrl');
            expect(getCoachesStub).to.be.calledOnce;
        });
        describe('when getCoaches throws an error', function(){
            var errorMessage = "errorMessage";
            beforeEach(function(){
                getCoachesStub.restore();
                getCoachesStub = this.sinon.stub(coachSeekAPIService, 'getCoaches', function(){
                    var deferred = $q.defer();
                    deferred.reject(new Error(errorMessage));
                    return deferred.promise;
                });
            });
            it('should throw', function(){
                expect(createViewWithController(scope, templateUrl, 'coachListCtrl')).to.throw;
            });
            it('should display an error message', function(){
                createViewWithController(scope, templateUrl, 'coachListCtrl');
                expect($rootScope.alerts[0].type).to.equal('danger');
                expect($rootScope.alerts[0].message).to.equal('businessSetup:' + errorMessage + '-invalid');
            });
        });
        describe('and there are no coaches', function(){
            beforeEach(function(){
                createViewWithController(scope, templateUrl, 'coachListCtrl');
                $coachEditView = $testRegion.find('.coach-edit-view');
            });
            it('should not show the coach list view', function(){
                expect($testRegion.find('.coach-list-view').hasClass('ng-hide')).to.be.true;
            });
            it('should show the coach edit view', function(){
                expect($testRegion.find('.coach-edit-view').hasClass('ng-hide')).to.be.false;
            });
            it('should attempt to create a coach', function(){
                expect(createCoachStub).to.be.calledOnce;
            });
            it('should not show the cancel button', function(){
                expect($coachEditView.find('.cancel-button').hasClass('ng-hide')).to.be.true;
            });
        });
        describe('and there are one or more coaches', function(){
            beforeEach(function(){
                self.let('firstCoach', function(){
                    return {
                        firstName: "Test",
                        lastName: "User",
                        email: "test@example.com",
                        phone: "9090909"
                    }
                })

                self.let('coaches', function(){
                    return [self.firstCoach, {}];
                });

                createViewWithController(scope, templateUrl, 'coachListCtrl');
                $coachListView = $testRegion.find('.coach-list-view');
                $coachEditView = $testRegion.find('.coach-edit-view');
            });
            it('should show the coach list view', function(){
                expect($coachListView.hasClass('ng-hide')).to.be.false;
            });
            it('should have as many list entries as coaches', function(){
                expect($coachListView.find('.coach-details').length).to.equal(self.coaches.length)
            })
            it('should not show the coach edit view', function(){
                expect($coachEditView.hasClass('ng-hide')).to.be.true;
            });


            describe('when clicking the edit button', function(){
                beforeEach(function(){
                    $coachListView.find('.edit-coach').first().trigger('click');
                });
                it('should not show the coach list view', function(){
                    expect($coachListView.hasClass('ng-hide')).to.be.true;
                });
                it('should show the coach edit view', function(){
                    expect($coachEditView.hasClass('ng-hide')).to.be.false;
                });
                it('should show the cancel button', function(){
                    expect($coachEditView.find('.cancel-button').hasClass('ng-hide')).to.be.false;
                });
                describe('when clicking the save button', function(){
                    var saveCoachStub;
                    beforeEach(function(){
                        saveCoachStub = this.sinon.stub(coachSeekAPIService, 'saveCoach', function(){
                            var deferred = $q.defer();
                            deferred.resolve([{}]);
                            return deferred.promise;
                        });
                    });
                    describe('when saveCoach throws an error', function(){
                        var errorMessage = "errorMessage";
                        beforeEach(function(){
                            saveCoachStub.restore();
                            saveCoachStub = this.sinon.stub(coachSeekAPIService, 'saveCoach', function(){
                                var deferred = $q.defer();
                                deferred.reject(new Error(errorMessage));
                                return deferred.promise;
                            });
                        });
                        it('should throw', function(){
                            expect($coachEditView.find('.save-coach').trigger('click')).to.throw;
                        });
                        it('should display an error message', function(){
                            $coachEditView.find('.save-coach').trigger('click');
                            expect($rootScope.alerts[0].type).to.equal('danger');
                            expect($rootScope.alerts[0].message).to.equal('businessSetup:' + errorMessage + '-invalid');
                        });
                    });
                    describe('when the form is invalid', function(){
                        describe('when the firstName is invalid', function(){
                            it('should display an invalid input alert', function(){
                                scope.coach.firstName = null;
                                scope.$apply();
                                $coachEditView.find('.save-coach').trigger('click');

                                expect($rootScope.alerts[0].type).to.equal('warning');
                                expect($rootScope.alerts[0].message).to.equal('businessSetup:firstName-invalid');
                            });
                        });
                        describe('when the lastName is invalid', function(){
                            it('should display an invalid input alert', function(){
                                scope.coach.lastName = null;
                                scope.$apply();
                                $coachEditView.find('.save-coach').trigger('click');

                                expect($rootScope.alerts[0].type).to.equal('warning');
                                expect($rootScope.alerts[0].message).to.equal('businessSetup:lastName-invalid');
                            });
                        });
                        describe('when the phone is invalid', function(){
                            it('should display an invalid input alert', function(){
                                scope.coach.phone = null;
                                scope.$apply();
                                $coachEditView.find('.save-coach').trigger('click');

                                expect($rootScope.alerts[0].type).to.equal('warning');
                                expect($rootScope.alerts[0].message).to.equal('businessSetup:phone-invalid');
                            });
                        });
                        describe('when the email is invalid', function(){
                            it('should display an invalid input alert', function(){
                                scope.coach.email = "badEmail.com";
                                scope.$apply();
                                $coachEditView.find('.save-coach').trigger('click');

                                expect($rootScope.alerts[0].type).to.equal('warning');
                                expect($rootScope.alerts[0].message).to.equal('businessSetup:email-invalid');
                            });
                        });
                        describe('when a timeRange is invalid', function(){
                            it('should display an invalid input alert', function(){
                                scope.coachForm.$setValidity('timeRange', false);
                                $coachEditView.find('.save-coach').trigger('click');

                                expect($rootScope.alerts[0].type).to.equal('warning');
                                expect($rootScope.alerts[0].message).to.equal('businessSetup:timeRange-invalid');
                            });
                        });
                    });
                    describe('when the coach name already exists', function(){
                        beforeEach(function(){
                            scope.coachList.push(angular.copy(self.firstCoach));
                            $coachEditView.find('.save-coach').trigger('click');
                        });
                        it('should display an alert', function(){
                            expect($rootScope.alerts[0].type).to.equal('warning');
                            expect($rootScope.alerts[0].message).to.equal('businessSetup:name-already-exists');
                        });
                    });
                    describe('when the coach name is new', function(){
                        beforeEach(function(){
                            $coachEditView.find('.save-coach').trigger('click');
                        });
                        it('should attempt to save coach', function(){
                            expect(saveCoachStub).to.be.calledOnce;
                        });
                        it('should show the coach list view', function(){
                            expect($coachListView.hasClass('ng-hide')).to.be.false;
                        });
                        it('should not show the coach edit view', function(){
                            expect($coachEditView.hasClass('ng-hide')).to.be.true;
                        });
                    });
                });
                describe('when clicking the cancel button', function(){
                    var coachLoaded;
                    beforeEach(function(){
                        scope.coach = {
                                firstName: "dumbnew",
                                lastName: "userguy",
                                email: "dude@dude.com",
                                phone: "021 99 88 77"
                        }
                        scope.$apply();

                        $rootScope.alerts.push({type: 'warning', message: 'test alert'});

                        $coachEditView.find('.cancel-button').trigger('click');
                    });
                    it('should reset all edits made', function(){
                        var unsavedCoach = scope.coachList.pop();

                        expect(unsavedCoach.firstName).to.equal(self.firstCoach.firstName);
                        expect(unsavedCoach.lastName).to.equal(self.firstCoach.lastName);
                        expect(unsavedCoach.email).to.equal(self.firstCoach.email);
                        expect(unsavedCoach.phone).to.equal(self.firstCoach.phone);
                    });
                    it('should remove alert if present', function(){
                        expect($rootScope.alerts.length).to.equal(0);
                    });
                });
            });
            describe('when creating a new coach', function(){
                var initCoachListLength;
                beforeEach(function(){
                    initCoachListLength = scope.coachList.length;

                    $coachListView.find('.create-coach').trigger('click');
                });
                it('should attempt to create a coach', function(){
                    expect(createCoachStub).to.be.calledOnce;
                });
                it('should not show the coach list view', function(){
                    expect($testRegion.find('.coach-list-view').hasClass('ng-hide')).to.be.true;
                });
                it('should show the coach edit view', function(){
                    expect($testRegion.find('.coach-edit-view').hasClass('ng-hide')).to.be.false;
                });
                it('should show the cancel button', function(){
                    expect($coachEditView.find('.cancel-button').hasClass('ng-hide')).to.be.false;
                });
                it('should set the newCoach flag to true', function(){
                    expect(scope.newCoach).to.be.true;
                });
                describe('when createCoach throws an error', function(){
                    var errorMessage = "errorMessage";
                    beforeEach(function(){
                        createCoachStub.restore();
                        createCoachStub = this.sinon.stub(coachSeekAPIService, 'createCoach', function(){
                            var deferred = $q.defer();
                            deferred.reject(new Error(errorMessage));
                            return deferred.promise;
                        });
                    });
                    it('should throw', function(){
                        expect($coachListView.find('.create-coach').trigger('click')).to.throw;
                    });
                    it('should display an error message', function(){
                        $coachListView.find('.create-coach').trigger('click');
                        expect($rootScope.alerts[0].type).to.equal('danger');
                        expect($rootScope.alerts[0].message).to.equal('businessSetup:' + errorMessage + '-invalid');
                    });
                });
                describe('when clicking the cancel button and coach is new', function(){
                    beforeEach(function(){
                        $coachEditView.find('.cancel-button').trigger('click');
                    });
                    it('should discard the new coach', function(){
                        expect(scope.coachList.length).to.equal(initCoachListLength);
                    });
                })
            });
        });
        describe('when navigating to services before adding a coach', function(){
            beforeEach(function(){

                createViewWithController(scope, templateUrl, 'coachListCtrl');
                $location.path('/business-setup/coach-list');

                // anchor tags dont listen to $.trigger('click') for some reason. assholes.
                $testRegion.find('.nav-to-services')[0].click();
            });
            it('should not allow navigation', function(){
                expect($location.path()).to.equal('/business-setup/coach-list');
            });
            it('should show a warning message', function(){
                expect($rootScope.alerts[0].type).to.equal('warning');
                expect($rootScope.alerts[0].message).to.equal('businessSetup:add-coach-warning');
            });
            describe('after adding a coach', function(){
                beforeEach(function(){
                    scope.coachList = [{}];
                    $testRegion.find('.nav-to-services')[0].click();
                });
                it('should allow navigation', function(){
                    expect($location.path()).to.equal('/business-setup/coach-services');
                });
            });
        });
    });
    describe('timeSlot directive', function(){
        beforeEach(function(){

            scope.weekdays = ['monday', 'tuesday', 'wednesday'];
            scope.coach = {
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
            expect($weekdays.length).to.equal(_.size(scope.coach.workingHours));
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
                expect($tuesday.find('time-range-picker').attr('disabled')).to.equal('disabled');
            });
        });
        describe('when clicking on the toggle available switch', function(){
            var $mondayToggleSwitch;
            beforeEach(function(){
                var $monday = $testRegion.find('.weekday').first();
                $mondayToggleSwitch = $monday.find('.toggle-switch');
                $mondayToggleSwitch.trigger('click');
            });
            it('should set isAvailable to false', function(){
                expect(scope.coach.workingHours['monday'].isAvailable).to.be.false;
            });
            it('the day should be valid', function(){
                var $mondayTimeRange = $testRegion.find('time-range-picker').first();
                expect($mondayTimeRange.hasClass('ng-invalid')).to.be.false;                
            });
            describe('when clicking on the toggle available switch again', function(){
                it('should set isAvailable to true', function(){
                    $mondayToggleSwitch.trigger('click');
                    expect(scope.coach.workingHours['monday'].isAvailable).to.be.true;
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
                    scope.coach.workingHours.monday.startTime = "12:00";
                    scope.$apply();

                    var $mondayTimeRange = $testRegion.find('time-range-picker').first();
                    expect($mondayTimeRange.hasClass('ng-invalid')).to.be.true;                
                });
            });
            describe('when there is ample time between times', function(){
                it('the day should be vaild', function(){
                    scope.coach.workingHours.monday.startTime = "9:00";
                    scope.$apply();

                    var $mondayTimeRange = $testRegion.find('time-range-picker').first();
                    expect($mondayTimeRange.hasClass('ng-invalid')).to.be.false;                
                });  
            })
        });
    });
    describe('timePicker directive', function(){
        describe('when default time is not provided', function(){
            beforeEach(function(){
                scope.testTime = "";

                createDirective(scope, '<div><time-picker time="testTime"></time-picker></div>');
            });
            it('should set default time if time not provided', function(){
                expect(scope.testTime).to.equal('0:00');
            });
        });
        describe('when default time is provided', function(){
            var $timePicker;
            beforeEach(function(){
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
}); 