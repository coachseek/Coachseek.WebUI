describe('Scheduling Module', function() {

    var scope,
        coachSeekAPIService,
        templateUrl = 'scheduling/partials/schedulingView.html';

    beforeEach(function() {
        coachSeekAPIService = $injector.get('coachSeekAPIService');
        scope = $rootScope.$new();
    });
    describe('when navigating to scheduling', function(){
        var viewAttrs;
        beforeEach(function(){
            $state.go('scheduling');
            $rootScope.$digest();
        });
        it('should map to correct template', function(){
            expect($state.current.templateUrl).to.equal(templateUrl);
        });
        it('should map to the correct controller', function(){
            expect($state.current.controller).to.equal('schedulingCtrl');
        });
    });
    describe('when loading the calendar', function(){

        let('service', function(){
            return {
                businessId: "8786bcd0-3b14-4f7b-92db-198527a5b949",
                id: _.uniqueId('service_'),
                name: "Toast Making w",
                description: "I show you how to make goddamn toast, son.",
                timing: {
                    duration: "0:30"
                },
                booking: {
                    studentCapacity: 8
                },
                presentation: {
                    color: '#00A578'
                },
                repetition: {
                    sessionCount: 4,
                    repeatFrequency: 'w'
                },
                pricing: {
                    sessionPrice: 15.00,
                    coursePrice: 150.0
                }
            };
        });

        let('services', function(){
            return [this.service,{},{}];
        });

        let('promise', function(){
            var deferred = $q.defer();
            deferred.resolve({data:this.services});
            return deferred.promise;
        });

        var getServicesStub,
            self,
            $servicesList,
            $calendar;

        beforeEach(function(){
            self = this;
            getServicesStub = this.sinon.stub(coachSeekAPIService, 'getServices', function(){
                return self.promise;
            });
            createViewWithController(scope, templateUrl, 'schedulingCtrl');
            $servicesList = $testRegion.find('.services-list')
            $calendar = $testRegion.find('.calendar')
        });
        it('should attempt to get existing services', function(){
            expect(getServicesStub).to.be.calledOnce;
        });
        it('should load as many services in the service list', function(){
            expect(_.size($servicesList.find('.service-details'))).to.equal(_.size(this.services))
        });
        describe('each service', function(){
            var $firstService;
            beforeEach(function(){
                $firstService = $servicesList.find('.service-details').first();
            });
            it('should set the title', function(){
                var firstServiceTitle = $firstService.find('.service-name').text();
                expect(firstServiceTitle).to.equal(this.service.name);
            });
            it('should set the description', function(){
                var firstServiceDescription = $firstService.find('.service-description').text();
                expect(firstServiceDescription).to.equal(this.service.description);
            })
            it('should set the color on the tile dot', function(){
                var firstServiceColor = $firstService.find('.color-circle').css('background-color');
                var hex = this.service.presentation.color;
                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                // 'rgb(0, 165, 120)'
                var presentationRGB = 'rgb(' + parseInt(result[1], 16) + ', ' 
                                             + parseInt(result[2], 16) + ', ' 
                                             + parseInt(result[3], 16) + ')';

                expect(firstServiceColor).to.equal(presentationRGB)
            });
        });
    });
});