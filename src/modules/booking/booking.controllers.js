angular.module('booking.controllers', [])
    .controller('bookingCtrl', ['$scope', '$state', 'onlineBookingAPIFactory', 'anonCoachseekAPIFactory',
      function($scope, $state, onlineBookingAPIFactory, anonCoachseekAPIFactory){
        $scope.booking = {};
        $scope.customerDetails = {};
        $scope.filters = {};
        $scope.locations = [];
        $scope.services = [];

        $scope.filterAllSessions = function () {
            $scope.selectedEvent = null;
            $scope.booking = {};
            $scope.events = [];
            var params = {
                endDate: moment().add(12, 'week').format('YYYY-MM-DD'),
                startDate: moment().add(1, 'day').format('YYYY-MM-DD'),
                locationId: $scope.filters.location ? $scope.filters.location.id : undefined,
                serviceId: $scope.filters.service ? $scope.filters.service.id : undefined,
                section: 'Sessions'
            };

            $scope.loadingSessions = true;
            return onlineBookingAPIFactory.anon($scope.business.domain)
                    .get(params).$promise.then(function(events){
                        $scope.allEvents = _.sortBy(_.union(events.courses, events.sessions),function(event){
                            return getNewDate(event.timing).valueOf();
                        });
                        $scope.eventsExist = _.size($scope.allEvents);
                    }, $scope.handleErrors).finally(function(){
                        $scope.loadingSessions = false;
                    });
        };

        $scope.selectEvent = function (event) {
            if($scope.selectedEvent !== event){
                $scope.booking.course = null;
                $scope.booking.sessions = [];
                $scope.selectedEvent = event;
                $scope.availableSessions = _.filter(event.sessions, function(session){
                    return !$scope.isBefore(session) && $scope.getSessionSpacesAvailable(session) > 0
                });
                if(!event.sessions || (event.pricing.coursePrice && !event.pricing.sessionPrice)) $scope.toggleEntireCourse();
            }
        };

        $scope.getSessionSpacesAvailable = function(session){
            var spacesAvailable = session.booking.studentCapacity - session.booking.bookingCount;
            return spacesAvailable > 0 ? spacesAvailable : 0;
        };

        $scope.closeEvent = function(){
            event.stopPropagation();
            $scope.booking.course = null;
            $scope.booking.sessions = [];
            $scope.selectedEvent = null;
        };

        $scope.toggleSessionSelect = function(session){
            if(_.includes($scope.booking.sessions, session)){
                $scope.booking.sessions = _.without($scope.booking.sessions, session);
            } else {
                $scope.booking.sessions.push(session);
            }

            if(_.size($scope.booking.sessions) === _.size($scope.availableSessions) ){
                $scope.booking.course = $scope.selectedEvent;   
            } else {
                $scope.booking.course = null;   
            }
        };

        //TODO don't set course if all arent available?
        $scope.toggleEntireCourse = function(){
            if($scope.booking.course === $scope.selectedEvent){
                $scope.booking.course = null;
                $scope.booking.sessions = [];
            } else {
                $scope.booking.course = $scope.selectedEvent;
                $scope.booking.sessions = $scope.availableSessions;
            }
        };

        $scope.isBefore = function(session){
            return getNewDate(session.timing).isBefore(moment());
        };

        function getNewDate(timing){
            return moment(timing.startDate, "YYYY-MM-DD");
        };

        $scope.resetBookings = function () {
            $scope.booking = {};
            $scope.filters = {};
            delete $scope.serviceDescription;
            $scope.filterAllSessions();

            $state.go('booking.selection');
        };

        $scope.$watch('filters.service', function(newService){
            if(newService){
                $scope.loadingSessions = true;
                anonCoachseekAPIFactory.anon($scope.business.domain)
                    .get({section: 'Services', id: newService.id}).$promise.then(function(service){
                        $scope.serviceDescription = service.description;
                    }, $scope.handleErrors).finally(function(){
                        $scope.loadingSessions = false;
                    });
            }
        });

        $scope.filterByLocation = function () {
            $scope.booking.sessions = [];
            delete $scope.booking.course;
            delete $scope.selectedEvent;
            delete $scope.serviceDescription;

            $scope.locationEvents = _.filter($scope.allEvents, function(event){
                return event.location.id === $scope.filters.location.id;
            });
            $scope.services = [];
            _.each($scope.locationEvents, function(event){
                if(!serviceAlreadyAdded(event.service.id)) {
                    $scope.services.push(event.service);
                }
            });
            $scope.filterEvents();
        };

        $scope.filterByService = function () {
            $scope.booking.sessions = [];
            delete $scope.booking.course;
            delete $scope.selectedEvent;

            $scope.serviceEvents = _.filter($scope.allEvents, function(event){
                return event.service.id === $scope.filters.service.id;
            });
            $scope.filterEvents();
        };

        $scope.disableContinue = function(){
            return _.isEmpty($scope.booking.sessions) && _.isEmpty($scope.booking.course);
        }

        function serviceAlreadyAdded(serviceId){
            return _.find($scope.services, function(service){
                return service.id === serviceId
            });
        };

        function locationAlreadyAdded(locationId){
            return _.find($scope.locations, function(location){
                return location.id === locationId
            });
        };

        $scope.filterEvents = function(){
            $scope.events = _.intersection($scope.locationEvents, $scope.serviceEvents)
        };

        $scope.filterAllSessions().then(function(){
            _.each($scope.allEvents, function(event){
                if(!locationAlreadyAdded(event.location.id)) {
                    $scope.locations.push(event.location);
                }

                if(!serviceAlreadyAdded(event.service.id)) {
                    $scope.services.push(event.service);
                }
            });
        });
    }])
    .controller('bookingCustomerDetailsCtrl', ['$scope', '$state', function($scope, $state){
        if(!$scope.disableContinue()){
            $state.go('booking.selection');
        }
    }])
    .controller('bookingPaymentCtrl', ['$scope', function($scope){
      // GARRET PLAYS HERE
      //TODO: Grab booking detail data
      //and attach to the hidden forms as ng-values..
      
      //inititate paypal processing
      //I don't think we'll need a post here...
      $scope.initPaypalPayment = function () {
        if ($scope.coursePaymentPrice === null) {
          return;
        } else {
          //TODO: Post to paypal return callback to confirmation page
        }
            
      };
      
      //Post booking as unpayed
      $scope.payLaterCall = function () {
        
      };
    }])
    .controller('bookingConfirmationCtrl', ['$scope', '$q', '$state', 'onlineBookingAPIFactory',
      function($scope, $q, $state, onlineBookingAPIFactory){
        $scope.bookingConfirmed = false;

        if(!$scope.disableContinue()){
            $state.go('booking.selection');
        }

        $scope.processBooking = function () {
            $scope.processingBooking = true;
            onlineBookingAPIFactory.anon($scope.business.domain)
                .save({ section: 'Customers' }, $scope.customerDetails).$promise
                    .then(function (customer) {
                        $q.all(getSessionsToBook(customer)).then(function () {
                            $scope.bookingConfirmed = true;
                        }, $scope.handleErrors).finally(function(){
                            $scope.processingBooking = false;
                        });
                }, $scope.handleErrors);
        };

        function getSessionsToBook(customer){
            if($scope.booking.course && _.size($scope.availableSessions) === _.size($scope.booking.course.sessions)){
                return getBookingCall($scope.booking.course, customer)
            } else if ($scope.booking.sessions){
                var bookingPromises = [];
                _.each($scope.booking.sessions, function(session){
                    bookingPromises.push(getBookingCall(session, customer));
                });
                return bookingPromises;
            }
        };

        function getBookingCall(session, customer){
            var bookingData = {
                customer: customer,
                session: session,
                paymentStatus: "awaiting-invoice",
                hasAttended: false
            }
            return onlineBookingAPIFactory.anon($scope.business.domain).save({ section: 'Bookings' }, bookingData).$promise;
        };
    }])
    .controller('bookingAdminCtrl', ['$scope', '$templateCache', '$compile', function($scope, $templateCache, $compile){
        var markup = $templateCache.get('booking/partials/bookNowButton.html');
        var view = $compile(markup)($scope);
        _.defer(function(){
            $scope.buttonHTML = view.get(0).outerHTML;
            $scope.$apply();
        })
    }]);