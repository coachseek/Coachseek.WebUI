describe('App Module', function() {
    it('should set $rootScope.alerts to an empty array', function(){
        expect($rootScope.alerts).to.be.empty;
    });

    describe('global alert system', function(){
        let('alertOne', function(){
            return {
                type: 'success',
                message: 'alert one'
            }
        });

        let('alertTwo', function(){
            return {
                type: 'warning',
                message: 'alert two'
            }
        });

        let('alertThree', function(){
            return {
                type: 'danger',
                message: 'alert three'
            }
        })

        beforeEach(function(){
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
        describe('when adding a success alert', function(){
            it('should disappear after 3 seconds', function(){
                expect(this.alertOne.dismissTimeout).to.be.equal(3000);
            });
        });
        describe('when adding any other alert', function(){
            it('should disappear after 5 seconds', function(){
                expect(this.alertTwo.dismissTimeout).to.be.equal(5000);
                expect(this.alertThree.dismissTimeout).to.be.equal(5000);
            });
        });
    });

    describe('login modal', function(){
        var intercomStub;
        beforeEach(function(){
            loginModalStub.restore();
            intercomStub = this.sinon.stub(window, 'Intercom');
        });
        describe('when clicking the login button', function(){
            beforeEach(function(){
                createViewWithController($rootScope, 'index.html', 'appCtrl')
                $testRegion.find('.logout').trigger('click');

                $loginModal = $('.modal');
            });
            afterEach(function(){
                $('.modal-backdrop').remove();
                $loginModal.remove();
            });
            it('should bring up the login modal', function(){
                expect($('body').hasClass('modal-open')).to.be.true;
            });
            describe('when clicking outside the login modal', function(){
                it('should not dismiss the login modal', function(){
                    $('.modal').trigger('click');
                    $timeout.flush();

                    expect($('body').hasClass('modal-open')).to.be.true;
                });
            });
            describe('when hitting the ESC key', function(){
                it('should not dismiss the login modal', function(){
                    var e = jQuery.Event("keydown");
                    e.which = 27; // # Some key code value
                    $(document).trigger(e);
                    $timeout.flush();

                    expect($('body').hasClass('modal-open')).to.be.true;
                });
            });
        });
        describe('when clicking the logout button', function(){
            var $http, $stateStub;
            beforeEach(function(){
                $stateStub = this.sinon.stub($state, 'go');
                $http = $injector.get('$http');
                $http.defaults.headers.common['Authorization'] = 'TEST AUTH';
                $rootScope.currentUser = "TESTUSER";

                createViewWithController($rootScope, 'index.html', 'appCtrl')
                $testRegion.find('.logout').trigger('click');

                $loginModal = $('.modal');
            });
            afterEach(function(){
                $('.modal-backdrop').remove();
                $loginModal.remove();
            });
            it('should unset the currentUser', function(){
                expect($rootScope.currentUser).to.be.undefined;
            });
            it('should unset the auth', function(){
                expect($http.defaults.headers.common['Authorization']).to.equal(null);
            });            
            it('should bring up the login modal', function(){
                expect($('body').hasClass('modal-open')).to.be.true;
            });
            it('should log out of Intercom', function(){
                expect(intercomStub).to.be.calledWith('shutdown');
            });
        });
        describe('when navigating to a page that requires a login', function(){
            var $loginModal, $stateStub;
            beforeEach(function(){
                $state.go('scheduling');
                $rootScope.$digest();
                $loginModal = $('.modal');
                $stateStub = this.sinon.stub($state, 'go');
            });
            afterEach(function(){
                $('.modal-backdrop').remove();
                $loginModal.remove();
            });
            it('should bring up the login modal', function(){
                expect($('body').hasClass('modal-open')).to.be.true;
            });
            describe('when attempting to login and form is valid', function(){
                let('loginPromise', function(){
                    var deferred = $q.defer();
                    deferred.resolve({
                        domain: 'testDomain',
                        name: 'test name'
                    });
                    return {$promise: deferred.promise};
                });

                var loginStub, self;
                beforeEach(function(){
                    self = this;
                    var coachSeekAPIService = $injector.get('coachSeekAPIService');

                    loginStub = this.sinon.stub(coachSeekAPIService, 'get', function(){
                        return self.loginPromise
                    });
                    $rootScope.password = "password"
                    $rootScope.email = "fake@email.com"
                    $rootScope.$apply();

                    $loginModal.find('.save-button').trigger('click');
                    $timeout.flush();
                });
                it('should make a call to the API', function(){
                    expect(loginStub).to.be.calledWith({section: 'Business'});
                });
                describe('when the login is successful', function(){
                    it('should set the auth header', function(){
                        var $http = $injector.get('$http');
                        var authHeader = 'Basic ' + btoa($rootScope.email + ':' + $rootScope.password);
                        expect($http.defaults.headers.common['Authorization']).to.equal(authHeader)
                    });
                    it('should remove the login modal', function(){
                        expect($('body').hasClass('modal-open')).to.be.false;
                    });
                    it('should attempt to navigate', function(){
                        expect($stateStub).to.be.calledWith('scheduling');
                    });
                    it('should make a call to Intercom', function(){
                        expect(intercomStub).to.be.calledWith('boot');
                    });
                });
                describe('when the login is unsuccessful', function(){
                    let('loginPromise', function(){
                        var deferred = $q.defer();
                        deferred.reject({statusText: "error-message"});
                        return {$promise: deferred.promise};
                    });

                    it('should unset the auth header', function(){
                        var $http = $injector.get('$http');
                        expect($http.defaults.headers.common['Authorization']).to.equal(null)
                    });
                    it('should add an alert', function(){
                        expect($rootScope.alerts[0].type).to.equal('danger');
                        expect($rootScope.alerts[0].message).to.equal('error-message');
                    });
                });
            });
        });
    });

    describe('when navigating to comingSoon', function(){
        beforeEach(function(){
            $state.go('comingSoon');
            $rootScope.$digest();
        });
        it('should attempt to bring up the login modal if not logged in', function(){
            expect(loginModalStub).to.be.calledOnce;
        });
        it('should map to correct template', function(){
            expect($state.current.templateUrl).to.equal('app/partials/comingSoon.html');
        });
        it('should map to the correct controller', function(){
            expect($state.current.controller).to.equal('comingSoonCtrl');
        });
    });

    describe('coming soon page', function(){
        var scope;
        beforeEach(function(){
            scope = $rootScope.$new();
            createViewWithController(scope, 'app/partials/comingSoon.html', 'comingSoonCtrl');
        });
        describe('when clicking the save feedback button', function(){
            var intercomStub, textareaContent;
            beforeEach(function(){
                intercomStub = this.sinon.stub(window, 'Intercom');
                textareaContent = "HERE IS SOME STUFF";
                $testRegion.find('textarea').val(textareaContent).trigger('input');
                $testRegion.find('.save-button').trigger('click');
            });
            it('should send feedback to Intercom', function(){
                expect(intercomStub).to.be.calledWith('trackEvent', 'feedback', {feedback: textareaContent})
            });
            it('should set feedbackSent to true', function(){
                expect(scope.feedbackSent).to.be.true;
            });
        });
    });

    describe('when resizing the window', function(){

        let('screenWidth', function(){
            return 301;
        });

        var widthStub, self;
        beforeEach(function(){
            self = this;
            widthStub = this.sinon.stub($.fn, 'width', function(){
                return self.screenWidth;
            });
            $(window).trigger('resize');
        });

        describe('when it is smaller than 768px', function(){
            it('should set isBigScreen to FALSE', function(){
                expect($rootScope.isBigScreen).to.be.false;
            });
            describe('and then changing it to a big screen size', function(){

                let('screenWidth', function(){
                    return 800;
                });

                it('should set isBigScreen to TRUE', function(){
                    expect($rootScope.isBigScreen).to.be.true;
                });
            });
        });
        describe('when it is bigger than 768px', function(){

            let('screenWidth', function(){
                return 800;
            });

            it('should set isBigScreen to TRUE', function(){
                expect($rootScope.isBigScreen).to.be.true;
            });

            describe('and then changing it to a small screen size', function(){

                let('screenWidth', function(){
                    return 301;
                });

                it('should set isBigScreen to FALSE', function(){
                    expect($rootScope.isBigScreen).to.be.false;
                });
            })
        });
    });

    describe('when navigating to an online booking page', function(){
        let('business', function(){
            return {
                name: "BIZ NAME",
                domain: "bizname",
                currency: "USD"
            }
        });

        let('anonGetPromise', function(){
            var defer = $.Deferred();
            return defer.resolve(this.business)
        });

        let('subdomain', function(){
            return 'testsubdomain';
        });

        var anonStub, anonGetStub, redirectStub, stateGoSpy;
        beforeEach(function(){
            var self = this;
            locationStub.restore();
            this.sinon.stub($injector.get('$location'), 'host', function(){
                return self.subdomain;
            });

            stateGoSpy = this.sinon.spy($state, 'go');
            redirectStub = this.sinon.stub($rootScope, 'redirectToApp');

            onlineBookingAPIFactory = $injector.get('onlineBookingAPIFactory');
            anonGetStub = this.sinon.stub(onlineBookingAPIFactory.anon(), 'get', function(){
                return {$promise: self.anonGetPromise};
            });

            anonStub = this.sinon.stub(onlineBookingAPIFactory, 'anon', function(){
                return {
                    get: anonGetStub
                }
            });

            $state.go('booking.selection')
        });
        describe('when subdomain is a businessDomain', function(){
            describe('and a business is not set on the scope', function(){
                it('should attempt to get the business', function(){
                    expect(anonStub).to.be.calledOnce;
                    expect(anonStub).to.be.calledWith('testsubdomain');
                    expect(anonGetStub).to.be.calledOnce;
                    expect(anonGetStub).to.be.calledWith({section: 'Business'});
                });

                describe('when subdomain exists', function(){
                    it('should set business on the scope', function(){
                        expect($rootScope.business).to.eql(this.business)
                    });
                    it('should navigate to booking.selection', function(){
                        expect(stateGoSpy).to.be.calledWith('booking.selection');
                    });
                });
                describe('when subdomain doesnt exist', function(){
                    let('anonGetPromise', function(){
                        var defer = $.Deferred();
                        return defer.reject()
                    });

                    it('should show an error message', function(){
                        expect($rootScope.alerts[0].type).to.equal('warning');
                        expect($rootScope.alerts[0].message).to.equal('businessDomain-invalid');
                    });

                    it('should attempt to redirect to app.coachseek', function(){
                        expect(redirectStub).to.be.calledOnce;
                    });
                })
            });
        });

        describe('when subdomain is aapp', function(){
            let('subdomain', function(){
                return 'app';
            });

            it('should direct to scheduling', function(){
                expect(stateGoSpy).to.be.calledWith('scheduling');
            });
        })

    });

    // describe('when navigating to an unavailable URL', function(){
    //     beforeEach(function(){
    //         $state.go('/url/not/known');
    //         $rootScope.$digest();
    //     });
    //     it('should attempt to bring up the login modal if not logged in', function(){
    //         expect(loginModalStub).to.be.calledOnce;
    //     });
    //     it('should map to scheduling template', function(){
    //         expect($state.current.templateUrl).to.equal('scheduling/partials/schedulingView.html');
    //     });
    //     it('should map to the scheduling controller', function(){
    //         expect($state.current.controller).to.equal('schedulingCtrl');
    //     });
    // });
});