angular.module('booking.controllers', [])
    .controller('bookingAdminCtrl', ['$scope', '$templateCache', '$compile', function($scope, $templateCache, $compile){
        var markup = $templateCache.get('booking/partials/bookNowButton.html');
        var view = $compile(markup)($scope);
        _.defer(function(){
            $scope.buttonHTML = view.get(0).outerHTML;
            $scope.$apply();
        })

    }])
    .controller('bookingCtrl', ['$scope', '$state', 'onlineBookingAPIFactory',
      function($scope, $state, onlineBookingAPIFactory){
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
                startDate: moment().format('YYYY-MM-DD'),
                locationId: $scope.filters.location ? $scope.filters.location.id : undefined,
                serviceId: $scope.filters.service ? $scope.filters.service.id : undefined,
                section: 'Sessions'
            };

            $scope.loadingSessions = true;
            return onlineBookingAPIFactory.anon($scope.business.domain)
                    .get(params).$promise.then(function(events){
                        $scope.allEvents = _.union(events.courses, events.sessions);
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

        $scope.toggleEntireCourse = function(){
            if($scope.booking.course === $scope.selectedEvent){
                $scope.booking.course = null;
                $scope.booking.sessions = [];
            } else {
                $scope.booking.course = $scope.selectedEvent;
                $scope.booking.sessions = $scope.availableSessions;
            }
        };

        $scope.calculateTotalPrice = function(){
            var course = $scope.booking.course;
            if(course){
                // STANDALONE SESSION
                if(!course.sessions) {
                    return course.pricing.sessionPrice                    
                // COURSE IN PAST
                } else if($scope.isBefore(course)){
                    if(course.pricing.coursePrice && !course.pricing.sessionPrice){
                        //PRO RATE
                        var numSessionsInFuture = _.size(_.filter(course.sessions, function(session){return !$scope.isBefore(session)}));
                        return (course.pricing.coursePrice / course.repetition.sessionCount * numSessionsInFuture).toFixed(2);
                    } else {
                        return (_.size($scope.availableSessions) * course.pricing.sessionPrice).toFixed(2);
                    }
                // COURSE IN FUTURE
                } else {
                    if(course.pricing.coursePrice){
                        return course.pricing.coursePrice.toFixed(2);
                    } else {
                        return (_.size($scope.availableSessions) * course.pricing.sessionPrice).toFixed(2);   
                    }
                }
            // ONLY COURSE SESSIONS SELECTED
            } else if ($scope.booking.sessions){
                return _.sum($scope.booking.sessions, 'pricing.sessionPrice').toFixed(2);   
            //NOTHING SELECTED
            } else {
                return "0.00"
            }
        };

        $scope.isBefore = function(session){
            return getNewDate(session.timing).isBefore(moment());
        };

        function getNewDate(timing){
            return moment(timing.startDate + " " + timing.startTime, "YYYY-MM-DD HH:mm")
        };

        // TODO this is nasty. pare this down.
        $scope.calculateBookingDateRange = function(){
            if($scope.booking.course){
                var course = $scope.booking.course;
                var dateRange = getNewDateRange(course.timing, course.repetition);
                if(_.size($scope.booking.sessions)){
                    return dateRange.start.format('dddd Do MMM') + " – " + dateRange.end.format('dddd Do MMM');                
                } else {
                    return dateRange.start.format('dddd Do MMM');
                }
            } else if ($scope.booking.sessions) {
                var dates = [];
                _.each($scope.booking.sessions, function(session){
                    dates.push(getNewDate(session.timing));
                });

                dates = _.sortBy(dates, function(date){return date.valueOf();});
                if(_.size(dates) === 1 ){
                    return _.first(dates).format('dddd Do MMM');
                } else if (_.size(dates)){
                    var dateRange = moment.range(_.first(dates), _.last(dates));
                    return dateRange.start.format('dddd Do MMM') + " – " + dateRange.end.format('dddd Do MMM');
                }
            }
        };

        $scope.resetBookings = function () {
            $scope.booking = {};
            $scope.filters = {};

            $state.go('booking.location');
        };

        $scope.filterByLocation = function () {
            $scope.locationEvents = _.filter($scope.allEvents, function(event){
                return event.location.id === $scope.filters.location.id;
            });
        };

        $scope.filterByService = function () {
            $scope.booking.course = null;
            $scope.booking.sessions = [];
            $scope.selectedEvent = null;
            $scope.events = _.filter($scope.locationEvents, function(event){
                return event.service.id === $scope.filters.service.id;
            });
        };

        function getNewDate(timing){
            return moment(timing.startDate, "YYYY-MM-DD");
        };

        function getNewDateRange(timing, repetition){
            var startDate = moment(timing.startDate + " " + timing.startTime, "YYYY-MM-DD HH:mm");
            var endDate = startDate.clone().add(repetition.sessionCount - 1, repetition.repeatFrequency);
            return moment.range(startDate, endDate);
        };
    }])
    .controller('bookingLocationCtrl', ['$scope', function($scope){
        function locationAlreadyAdded(locationId){
            return _.find($scope.locations, function(location){
                return location.id === locationId
            });
        };

        if(!$scope.allEvents){
            $scope.filterAllSessions().then(function(){
                _.each($scope.allEvents, function(event){
                    if(!locationAlreadyAdded(event.location.id)) {
                        $scope.locations.push(event.location);
                    }
                });
            });
        }
    }])
    .controller('bookingServicesCtrl', ['$scope', '$state', function($scope, $state){
        $scope.backToLocation = function ($event) {
            $scope.filters.service = null;
            $scope.filters.course = null;
            $scope.$parent.booking = {};
            $scope.$parent.services = [];
            $scope.$parent.events = [];

            $state.go('booking.location');
        };

        $scope.disableContinue = function(){
            return _.isEmpty($scope.booking.sessions) && _.isEmpty($scope.booking.course);
        }

        function serviceAlreadyAdded(serviceId){
            return _.find($scope.services, function(service){
                return service.id === serviceId
            });
        };

        if(!$scope.filters.location || !$scope.locationEvents){
            $state.go('booking.location');
        } else if(!_.size($scope.services)) {
            _.each($scope.locationEvents, function(event){
                if($scope.filters.location.id === event.location.id && !serviceAlreadyAdded(event.service.id)) {
                    $scope.services.push(event.service);
                }
            });
        }
    }])
    .controller('bookingCustomerDetailsCtrl', ['$scope', '$state', function($scope, $state){
        if(!$scope.filters.location){
            $state.go('booking.location');
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

        if(!$scope.filters.location){
            $state.go('booking.location');
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
    }]);
