describe('Booking Selection View', function(){
    let('business', function(){
        return {
            name: "BIZ NAME",
            domain: "bizname",
            currency: "USD"
        }
    });

    let('dateOne', function(){
        return moment()
    });
    let('dateTwo', function(){
        return moment().add(1, 'days').add(1, 'hours');
    });

    let('dateThree', function(){
        return moment().add(1, 'months');
    });

    let('locationOne', function(){
        return {
            name: "One",
            id: 'location_1'
        };
    });

    let('locationTwo', function(){
        return {
            name: "Two",
            id: 'location_2'
        };
    });

    let('serviceOne', function(){
        return {
            name: "A Toast Making",
            id: "service_01"
        };
    });

    let('serviceTwo', function(){
        return {
            name: "B Roast Making",
            id: "service_02"
        };
    });

    let('courses', function(){
        return [];
    });

    let('sessions', function(){
        return [];
    });

    let('events', function(){
        return {
            sessions: this.sessions,
            courses: this.courses
        }
    });

    let('anonGetPromise', function(){
        return $q.defer().promise;
    });

    let('subdomain', function(){
        return 'testsubdomain';
    });

    var anonStub, anonGetStub, bookingScope, scope;
    beforeEach(function(){
        var self = this;
        $rootScope.business = this.business;
        locationStub.restore();
        this.sinon.stub($injector.get('$location'), 'host', function(){
            return self.subdomain;
        });

        onlineBookingAPIFactory = $injector.get('onlineBookingAPIFactory');
        anonGetStub = this.sinon.stub(onlineBookingAPIFactory.anon(), 'get', function(){
            return {$promise: self.anonGetPromise};
        });

        anonStub = this.sinon.stub(onlineBookingAPIFactory, 'anon', function(){
            return {
                get: anonGetStub
            }
        });

        bookingScope = $rootScope.$new();
        scope = bookingScope.$new();
        createViewWithController(bookingScope, 'booking/partials/booking.html', 'bookingCtrl');
        createViewWithController(scope, 'booking/partials/bookingSelectionView.html', 'bookingSelectionCtrl');
        $rootScope.$apply();
    });
    describe("when the events have not yet been retrieved", function(){
        it('should attempt to get the events', function(){
            var params = {
                endDate: moment().add(12, 'week').format('YYYY-MM-DD'),
                startDate: moment().add(1, 'day').format('YYYY-MM-DD'),
                section: 'Sessions'
            };
            expect(anonStub).to.be.calledWith(this.business.domain);
            expect(anonGetStub).to.be.calledWith(params)
        });
        it('should show the loading screen', function(){
            expect($testRegion.find('loading-animation').hasClass('ng-hide')).to.be.false;
        });
        it('should hide the selections', function(){
            expect($testRegion.find('.booking-selection-container').hasClass('ng-hide')).to.be.true;
        });
        describe('when retrieving events is succesful', function(){
            let('anonGetPromise', function(){
                var deferred = $q.defer();
                deferred.resolve(this.events);
                return deferred.promise;
            });

            describe('when there are no events', function(){
                it('should hide the loading animation', function(){
                    expect($testRegion.find('loading-animation').hasClass('ng-hide')).to.be.true;
                });
                it('should show the no events message', function(){
                    expect($testRegion.find('.no-events-message').hasClass('ng-hide')).to.be.false;
                });
            });
            describe('when there are events', function(){
                let('courses', function(){
                    return [{
                        service: this.serviceOne,
                        location: this.locationOne,
                        timing: {
                            duration: 60,
                            startTime: '12:00',
                            startDate: '2015-06-03'
                        },
                        repetition: 2,
                        booking: {
                            bookings: []
                        },
                        pricing: {
                            coursePrice: 150.0
                        },
                        sessions: [{}, {}]                    
                    }]
                });
                let('sessions', function(){
                    return [{
                        service: this.serviceOne,
                        location: this.locationOne,
                        timing: {
                            duration: 60,
                            startTime: '12:00',
                            startDate: '2015-06-12'
                        },
                        repetition: 1,
                        booking: {
                            bookings: []
                        },
                        pricing: {
                            sessionPrice: 15.00
                        }
                    }, {
                        service: this.serviceTwo,
                        location: this.locationTwo,
                        timing: {
                            duration: 60,
                            startTime: '12:00',
                            startDate: '2015-06-14'
                        },
                        repetition: 1,
                        booking: {
                            bookings: []
                        },
                        pricing: {
                            sessionPrice: 20.50
                        }
                    }]
                });
                it('should populate the locations list', function(){
                    var options = $testRegion.find('.location-selection option').text();
                    expect(options).to.contain(this.locationOne.name);
                    expect(options).to.contain(this.locationTwo.name);
                });
                it('should populate the services list', function(){
                    var options = $testRegion.find('.service-selection option').text();
                    expect(options).to.contain(this.serviceOne.name);
                    expect(options).to.contain(this.serviceTwo.name);
                });
                it('should disable the service select', function(){
                    var $serviceSelect = $testRegion.find('.service-selection select');
                    expect($serviceSelect.attr('disabled')).to.equal('disabled')
                });
                it('should disable the continue button', function(){
                    var $continueButton = $testRegion.find('.continue-button');
                    expect($continueButton.attr('disabled')).to.equal('disabled')
                });
                describe('when choosing a location', function(){
                    beforeEach(function(){
                        var $locationSelect = $testRegion.find('.location-selection select');
                        $locationSelect.val(1);
                        angular.element($locationSelect).triggerHandler('change');
                    });
                    it('should enable the service select', function(){
                        var $serviceSelect = $testRegion.find('.service-selection select');
                        expect($serviceSelect.attr('disabled')).to.equal(undefined)
                    });
                    it('should disable the continue button', function(){
                        var $continueButton = $testRegion.find('.continue-button');
                        expect($continueButton.attr('disabled')).to.equal('disabled')
                    });
                    describe('when choosing a service', function(){
                        var anonCoachseekStub, anonCoachseekGetStub, serviceDescription = "BOOBIES";
                        beforeEach(function(){
                            var anonCoachseekAPIFactory = $injector.get('anonCoachseekAPIFactory')
                            anonCoachseekGetStub = this.sinon.stub(anonCoachseekAPIFactory.anon(), 'get', function(){
                                var deferred = $q.defer();
                                deferred.resolve({
                                    description: serviceDescription
                                });
                                return {$promise: deferred.promise};
                            });

                            anonCoachseekStub = this.sinon.stub(anonCoachseekAPIFactory, 'anon', function(){
                                return {
                                    get: anonCoachseekGetStub
                                }
                            });

                            var $serviceSelect = $testRegion.find('.service-selection select');
                            $serviceSelect.val(0);
                            angular.element($serviceSelect).triggerHandler('change');
                            scope.$apply();
                        });
                        it('should attempt to get the service description', function(){
                            expect(anonCoachseekStub).to.be.calledWith(this.business.domain);
                            expect(anonCoachseekGetStub).to.be.calledWith({section: 'Services', id: this.serviceTwo.id});
                        });
                        it('should set service description', function(){
                            expect($testRegion.find('.service-description div').text()).to.equal(serviceDescription);
                        });
                        it('should disable the continue button', function(){
                            var $continueButton = $testRegion.find('.continue-button');
                            expect($continueButton.attr('disabled')).to.equal('disabled')
                        });
                    });
                });
            });
        });
    });
    describe('when events have already been retrieved', function(){

    });
});