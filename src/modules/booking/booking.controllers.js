angular.module('booking.controllers', [])
    .controller('bookingAdminCtrl', ['$scope', function($scope){
        //SAM ADDS BUTTON STUFF HERE
    }])
    .controller('bookingCtrl', ['$scope', '$state', 'onlineBookingAPIFactory', 'businessDomain',
      function($scope, $state, onlineBookingAPIFactory, businessDomain){
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
            return onlineBookingAPIFactory.anon(businessDomain)
                    .get(params).$promise.then(function(events){
                        $scope.events = events;
                    }, $scope.handleErrors).finally(function(){
                        $scope.loadingSessions = false;
                    });
        };

        $scope.selectEvent = function (event) {
            if($scope.selectedEvent !== event){
                $scope.selectedEvent = event;
                $scope.toggleEntireCourse();
            }
        };

        $scope.toggleSessionSelect = function(session){
            if(_.includes($scope.booking.sessions, session)){
                $scope.booking.sessions = _.without($scope.booking.sessions, session);
            } else {
                $scope.booking.sessions.push(session);
            }

            if(_.size($scope.booking.sessions) === _.size($scope.selectedEvent.sessions) ){
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
                $scope.booking.sessions = $scope.selectedEvent.sessions;
            }
        };

        $scope.calculateTotalPrice = function(){
            if($scope.booking.course){
                var pricing = $scope.booking.course.pricing;
                var price = pricing.coursePrice || 0;
                return price.toFixed(2);
            } else if ($scope.booking.sessions){
                return _.sum($scope.booking.sessions, 'pricing.sessionPrice').toFixed(2);
            } else {
                return "0.00"
            }
        };

        // TODO this is nasty. pare this down.
        $scope.calculateBookingDateRange = function(){
            if($scope.booking.course){
                var course = $scope.booking.course;
                var dateRange = getNewDateRange(course.timing, course.repetition);
                if($scope.booking.sessions){
                    return dateRange.start.format('dddd Do MMM') + " – " + dateRange.end.format('dddd Do MMM');                
                } else {
                    return dateRange.start.format('dddd Do MMM');
                }
            } else if ($scope.booking.sessions) {
                var dates = [];
                _.each($scope.booking.sessions, function(session){
                    dates.push(getNewDate(session.timing));
                });
                dates = _.sortBy(dates, function(date){
                    return date.valueOf();
                });
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

        function getNewDate(timing){
            return moment(timing.startDate + " " + timing.startTime, "YYYY-MM-DD HH:mm");
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

        $scope.filterAllSessions().then(function(events){
            var events = _.union($scope.events.courses, $scope.events.sessions);
            _.each(events, function(event){
                if(!locationAlreadyAdded(event.location.id)) {
                    $scope.locations.push(event.location);
                }
            });
        });
    }])
    .controller('bookingServicesCtrl', ['$scope', '$state', function($scope, $state){
        $scope.backToLocation = function ($event) {
            $scope.filters.service = null;
            $scope.filters.course = null;
            $scope.$parent.booking = {};
            $scope.$parent.services = [];

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

        if(!$scope.filters.location){
            $state.go('booking.location');
        } else if(!_.size($scope.services)) {
            var events = _.union($scope.events.courses, $scope.events.sessions);
            _.each(events, function(event){
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
    .controller('bookingConfirmationCtrl', ['$scope', '$q', '$state', 'onlineBookingAPIFactory', 'businessDomain',
      function($scope, $q, $state, onlineBookingAPIFactory, businessDomain){
        $scope.bookingConfirmed = false;

        if(!$scope.filters.location){
            $state.go('booking.location');
        }

        $scope.processBooking = function () {
            $scope.processingBooking = true;
            onlineBookingAPIFactory.anon(businessDomain)
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
            if($scope.booking.course){
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
            return onlineBookingAPIFactory.anon(businessDomain).save({ section: 'Bookings' }, bookingData).$promise;
        };
    }]);
