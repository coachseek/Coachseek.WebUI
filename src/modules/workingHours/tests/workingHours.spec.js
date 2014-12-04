describe('WorkingHours Module', function() {

    var scope,
        coachSeekAPIService,
        templateUrl = 'workingHours/partials/coachListView.html';

    beforeEach(function() {
        coachSeekAPIService = $injector.get('coachSeekAPIService');
        scope = $rootScope.$new();
    });
    describe('workingHours routes', function() {
        it('should map routes to controllers', function() {
            expect($route.routes['/registration/coach-list'].controller).to.equal('coachListCtrl');
        });
        it('should map routes to templates', function(){
            expect($route.routes['/registration/coach-list'].templateUrl).to.equal('workingHours/partials/coachListView.html');
        });
        it('should default to root', function(){
            expect($route.routes[null].redirectTo).to.equal('/');
        });
    });
    describe('when the page loads', function(){
        var $coachListView, $coachEditView, getCoachesStub, self;
        beforeEach(function(){
            self = this;
            self.let('coaches', function(){
                return [];
            });

            getCoachesStub = this.sinon.stub(coachSeekAPIService, 'getCoaches', function(){
                return $.Deferred().resolve(self.coaches);
            });

        });
        it('should attempt to call getCoaches', function(){
            createViewWithController(scope, templateUrl, 'coachListCtrl');
            expect(getCoachesStub).to.be.calledOnce;
        })
        describe('and there are no coaches', function(){
            var createCoachStub;
            beforeEach(function(){
                createCoachStub = this.sinon.stub(coachSeekAPIService, 'createCoach', function(){
                    return $.Deferred().resolve([{}]);
                });

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
            describe('when clicking the cancel button', function(){
                it('should remove the coach if new and never been saved', function(){
                    $coachEditView.find('.cancel-button').trigger('click');
                    expect(scope.coachList.length).to.equal(0);
                });
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
                describe('when clicking the save button', function(){
                    var saveCoachStub;
                    beforeEach(function(){
                        saveCoachStub = this.sinon.stub(coachSeekAPIService, 'saveCoach', function(){
                            return $.Deferred().resolve([{}]);
                        });
                    });
                    });
                    it('should attempt to save coach', function(){
                        expect(saveCoachStub).to.be.calledOnce;
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

                        $rootScope.alert = {type: 'warning', message: 'test alert'};

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
                        expect($rootScope.alert).to.be.null;
                    });
                });
            });
        });
        describe('when navigating to services before adding a coach', function(){
            beforeEach(function(){

                createViewWithController(scope, templateUrl, 'coachListCtrl');
                $location.path('/registration/coach-list');
                // anchor tags dont listen to $.trigger('click') for some reason. assholes.
                $testRegion.find('.nav-to-services')[0].click();
            });
            it('should not allow navigation', function(){
                expect($location.path()).to.equal('/registration/coach-list');
            });
            it('should show a warning message', function(){
                expect($rootScope.alert.type).to.equal('warning');
                expect($rootScope.alert.message).to.equal('workingHours:add-coach-warning');
            });
            describe('after adding a coach', function(){
                beforeEach(function(){
                    scope.coachList = [{}];
                    $testRegion.find('.nav-to-services')[0].click();
                });
                it('should allow navigation', function(){
                    expect($location.path()).to.equal('/registration/coach-services');
                });
            });
        });
    });
    describe('time slot derective', function(){
        beforeEach(function(){

            scope.weekdays = ['monday', 'tuesday', 'wednesday'];
            scope.coach = {
                    firstName: "NEWEST",
                    lastName: "USER",
                    email: "aaron.smith@example.com",
                    phone: "021 99 88 77",
                     workingHours: {
                         monday: { 
                             isAvailable: true
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
            var $weekdays = $testRegion.find('.workingHours-weekday');
            expect($weekdays.length).to.equal(_.size(scope.coach.workingHours));
        });
        describe('when a day is available', function(){
            it('should enable the time spinner', function(){
                var $monday = $testRegion.find('.workingHours-weekday').first();
                expect($monday.find('.workingHours-timepicker').attr('disabled')).to.equal(undefined);
            });
        });
        describe('when a day is unavailable', function(){
            it('should disable the time spinner', function(){
                var $tuesday = $testRegion.find('.workingHours-weekday:nth-child(2)');
                expect($tuesday.find('.workingHours-timepicker').attr('disabled')).to.equal('disabled');
            });
        });
        describe('when clicking on the toggle available switch', function(){
            var $mondayToggleSwitch;
            beforeEach(function(){
                var $monday = $testRegion.find('.workingHours-weekday').first();
                $mondayToggleSwitch = $monday.find('.toggle-switch');
                $mondayToggleSwitch.trigger('click');
            });
            it('should set isAvailable to false', function(){
                expect(scope.coach.workingHours['monday'].isAvailable).to.be.false;
            });
            describe('when clicking on the toggle available switch again', function(){
                it('should set isAvailable to true', function(){
                    $mondayToggleSwitch.trigger('click');
                    expect(scope.coach.workingHours['monday'].isAvailable).to.be.true;
                })
            });
        });
    });
});