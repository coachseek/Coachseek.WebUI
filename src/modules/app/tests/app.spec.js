describe('App Module', function() {
    it('should set $rootScope.alerts to an empty array', function(){
        expect($rootScope.alerts).to.be.empty;
    });

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
            type: 'error',
            message: 'alert three'
        }
    })


    describe('global alert system', function(){
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
                $timeout.flush();

                expect(_.contains($rootScope.alerts, this.alertOne)).to.be.false;
            });
        });
    });

    describe('login modal', function(){
        describe('when clicking the login button', function(){
            beforeEach(function(){
                createViewWithController($rootScope, 'index.html', 'appCtrl')
                $testRegion.find('li.logout').trigger('click');

                $loginModal = $('.modal');
            });
            afterEach(function(){
                $('.modal-backdrop').remove();
                $loginModal.remove();
            });
            it('should bring up the login modal', function(){
                expect($loginModal.length).to.not.equal(0);
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
                $testRegion.find('li.logout').trigger('click');

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
            it('should not bring up the login modal', function(){
                expect($loginModal.length).to.equal(0);
            });
            it('should attempt to navigate', function(){
                expect($stateStub).to.be.calledWith('businessSetup.business.newUser');
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
                expect($loginModal.length).to.not.equal(0);
            });
            describe('when attempting to login and form is valid', function(){
                let('loginPromise', function(){
                    var deferred = $q.defer();
                    deferred.resolve();
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
                    expect(loginStub).to.be.calledWith({section: 'Locations'});
                });
                describe('when the login is successful', function(){
                    it('should set the auth header', function(){
                        var $http = $injector.get('$http');
                        var authHeader = 'Basic ' + btoa($rootScope.email + ':' + $rootScope.password);
                        expect($http.defaults.headers.common['Authorization']).to.equal(authHeader)
                    });
                    it('should remove the login modal', function(){
                        expect($('.modal').length).to.equal(0);
                    });
                    it('should attempt to navigate', function(){
                        expect($stateStub).to.be.calledWith('scheduling');
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
});