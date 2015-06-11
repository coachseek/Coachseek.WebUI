angular.module('booking.controllers', [])
    .controller('bookingCtrl', ['$scope', '$state', 'onlineBookingAPIFactory', 'currentBooking',
      function($scope, $state, onlineBookingAPIFactory, currentBooking){
        $scope.currentBooking = currentBooking;

        $scope.selectEvent = function (event) {
            if($scope.selectedEvent !== event){
                currentBooking.resetBooking()
                $scope.selectedEvent = event;
                $scope.availableSessions = _.filter(event.sessions, function(session){
                    return !$scope.isBefore(session) && $scope.getSessionSpacesAvailable(session) > 0
                });
                if(!event.sessions || (event.pricing.coursePrice && !event.pricing.sessionPrice)) $scope.toggleEntireCourse();
            }
        };

        $scope.closeEvent = function(){
            event.stopPropagation();
            currentBooking.resetBooking();
            delete $scope.selectedEvent;
        };

        $scope.toggleSessionSelect = function(session){
            if(_.includes(currentBooking.booking.sessions, session)){
                currentBooking.booking.sessions = _.without(currentBooking.booking.sessions, session);
            } else {
                currentBooking.booking.sessions.push(session);
            }

            if(_.size(currentBooking.booking.sessions) === _.size($scope.availableSessions) ){
                currentBooking.booking.course = $scope.selectedEvent;   
            } else {
                currentBooking.booking.course = null;   
            }
        };

        //TODO don't set course if all arent available?
        $scope.toggleEntireCourse = function(){
            if(currentBooking.booking.course === $scope.selectedEvent){
                currentBooking.resetBooking();
            } else {
                currentBooking.booking = {
                    course: $scope.selectedEvent,
                    sessions: $scope.availableSessions
                }
            }
        };

        $scope.getSessionSpacesAvailable = function(session){
            var spacesAvailable = session.booking.studentCapacity - session.booking.bookingCount;
            return spacesAvailable > 0 ? spacesAvailable : 0;
        };

        $scope.isBefore = function(session){
            return moment(session.timing.startDate, "YYYY-MM-DD").isBefore(moment());
        };

    }])
    .controller('bookingSelectionCtrl', ['$scope', 'anonCoachseekAPIFactory', 'currentBooking',
      function($scope, anonCoachseekAPIFactory, currentBooking){
        var locationEvents,
            serviceEvents,
            allEvents;

        $scope.locations = [];
        $scope.services = [];

        $scope.$watch('currentBooking.filters.service', function(newService){
            if(_.size(newService)){
                $scope.loadingSessions = true;
                anonCoachseekAPIFactory.anon($scope.business.domain).get({section: 'Services', id: newService.id})
                    .$promise.then(function(service){
                        $scope.serviceDescription = service.description;
                    }, $scope.handleErrors).finally(function(){
                        $scope.loadingSessions = false;
                });
            }
        });

        $scope.filterByLocation = function (resetBooking) {
            if(resetBooking){
                currentBooking.resetBooking();
                delete currentBooking.filters.service;
            }

            delete $scope.selectedEvent;
            delete $scope.serviceDescription;

            locationEvents = _.filter(currentBooking.allEvents, function(event){
                return event.location.id === $scope.currentBooking.filters.location.id;
            });
            $scope.services = [];
            _.each(locationEvents, function(event){
                if(!serviceAlreadyAdded(event.service.id)) {
                    $scope.services.push(event.service);
                }
            });
            filterEvents();
        };

        $scope.filterByService = function (resetBooking) {
            if(resetBooking) currentBooking.resetBooking();
            delete $scope.selectedEvent;
            delete $scope.serviceDescription;

            serviceEvents = _.filter(currentBooking.allEvents, function(event){
                return event.service.id === $scope.currentBooking.filters.service.id;
            });
            filterEvents();
        };


        function filterEvents(){
            $scope.events = _.intersection(locationEvents, serviceEvents)
        };

        $scope.disableContinue = function(){
            return _.isEmpty(currentBooking.booking.sessions) && _.isEmpty(currentBooking.booking.course);
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

        function getNewDate(timing){
            return moment(timing.startDate, "YYYY-MM-DD");
        };

        function buildLocationsAndServices(){
            _.each(currentBooking.allEvents, function(event){
                if(!locationAlreadyAdded(event.location.id)) {
                    $scope.locations.push(event.location);
                }

                if(!serviceAlreadyAdded(event.service.id)) {
                    $scope.services.push(event.service);
                }
            });
        }

        if(!currentBooking.allEvents){
            delete $scope.serviceDescription;

            $scope.loadingSessions = true;            
            currentBooking.getAllEvents($scope.business.domain).then(function(events){
                currentBooking.allEvents = _.sortBy(_.union(events.courses, events.sessions),function(event){
                    return getNewDate(event.timing).valueOf();
                });
                $scope.eventsExist = _.size(currentBooking.allEvents);
                buildLocationsAndServices();
            }, $scope.handleErrors).finally(function(){
                $scope.loadingSessions = false;
            });
        } else {
            $scope.eventsExist = _.size(currentBooking.allEvents);
            buildLocationsAndServices();
            $scope.filterByLocation();
            $scope.filterByService();
        }
    }])
    .controller('bookingCustomerDetailsCtrl', ['$scope', '$state', 'currentBooking', function($scope, $state, currentBooking){
        if(!currentBooking.filters.location){
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
    .controller('bookingConfirmationCtrl', ['$scope', '$q', '$state', 'onlineBookingAPIFactory', 'currentBooking',
      function($scope, $q, $state, onlineBookingAPIFactory, currentBooking){
        $scope.bookingConfirmed = false;

        if(!currentBooking.filters.location){
            $state.go('booking.selection');
        }

        $scope.processBooking = function () {
            $scope.processingBooking = true;
            onlineBookingAPIFactory.anon($scope.business.domain)
                .save({ section: 'Customers' }, currentBooking.customer).$promise
                    .then(function (customer) {
                        $q.all(getSessionsToBook(customer)).then(function () {
                            $scope.bookingConfirmed = true;
                        }, $scope.handleErrors).finally(function(){
                            $scope.processingBooking = false;
                        });
                }, $scope.handleErrors);
        };

        function getSessionsToBook(customer){
            if(currentBooking.booking.course && _.size($scope.availableSessions) === _.size(currentBooking.booking.course.sessions)){
                return getBookingCall(currentBooking.booking.course, customer)
            } else if (currentBooking.booking.sessions){
                var bookingPromises = [];
                _.each(currentBooking.booking.sessions, function(session){
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


        $scope.resetBookings = function () {
            currentBooking.resetBooking();
            currentBooking.filters = {};
            delete currentBooking.allEvents;
            $state.go('booking.selection');
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