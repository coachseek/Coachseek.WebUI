angular.module('booking.controllers', [])
    .controller('bookingCtrl', ['$scope', function($scope){
        $scope.confirmed = false;
        $scope.booking = {
            // customer: savedCustomer ? JSON.parse(savedCustomer) : null,
            customer: null,
            sessions: []
        };

        $scope.filters = {
            location: null,
            service: null,
            course: null
        };
    }])
    .controller('bookingLocationCtrl', ['$scope', 'coachSeekAPIService', function($scope, coachSeekAPIService){

        $scope.selectLocation = function () {
            $scope.filters.service = null;
            $scope.filters.course = null;
            $scope.courses = null;
            $scope.booking.sessions = [];
        };

        coachSeekAPIService.query({section: 'Locations'})
            .$promise.then(function(locations){
                $scope.locations = locations;
            });
    }])
    .controller('bookingServicesCtrl', ['$scope', 'coachSeekAPIService', function($scope, coachSeekAPIService){

        $scope.selectService = function () {
            $scope.filters.course = null;
            $scope.booking.sessions = [];
            $scope.filterSessions();
        };

        $scope.filterSessions = function () {
            $scope.booking.enquiry = false;
            $scope.filters.course = null;
            $scope.courses = [];
            filterSessions($scope.filters).then(function (sessions) {
                console.log(sessions)
                var courses = _.groupBy(sessions, function (session) {
                    return session.parentId || session.id;
                });

                $scope.courses = Object.keys(courses).map(function (parentId) {
                    var course = courses[parentId][0];
                    return {
                        id: parentId,
                        selected: false,
                        type: courses[parentId].length === 1 ? 'single-session' : 'multi-session',
                        name: course.service.name,
                        duration: course.timing.duration,
                        location: course.location.name,
                        color: course.presentation.colour,
                        sessions: courses[parentId].map(function (session) {
                            var current = session;
                            current.selected = false;
                            current.timing.date = moment(current.timing.startDate, 'YYYY-MM-DD').format('dddd Do MMMM'),
                            current.timing.hour = {
                                start: moment(current.timing.startTime, "HH:mm").format('HH:mm a'),
                                end: moment(current.timing.startTime, "HH:mm").add(current.timing.duration, 'minutes').format('HH:mm a')
                            };

                            return current;
                        })
                    };
                });
            });
        };

        var filterSessions = function (filters) {
            var params = {
                startDate: moment().format('YYYY-MM-DD'),
                endDate: moment().add(12, 'week').format('YYYY-MM-DD'),
                locationId: filters.location ? filters.location.id : undefined,
                serviceId: filters.service ? filters.service.id : undefined,
                section: 'Sessions'
            };

            return coachSeekAPIService.query(params).$promise;
        };

        $scope.selectCourse = function (course) {
            if ($scope.filters.course && $scope.filters.course.id === course.id) {
                return;
            }

            course.selected = false;

            // Uncheck sessions currently selected
            if ($scope.filters.course) {
                $scope.filters.course.sessions = $scope.filters.course.sessions.map(function (session) {
                    session.selected = false;
                    return session;
                });
            }

            $scope.filters.course = course;
            $scope.booking.sessions = [];

            if (course.type === 'single-session') {
                $scope.filters.course.sessions[0].selected = !$scope.filters.course.sessions[0].selected;
                $scope.booking.sessions = $scope.filters.course.sessions;
            }
        };

        $scope.selectSession = function () {
            $scope.booking.sessions = $scope.filters.course.sessions.filter(function (session) {
                return session.selected === true;
            });
        };

        $scope.selectFullCourse = function (course) {
            $scope.filters.course.sessions = $scope.filters.course.sessions.map(function (session) {
                session.selected = course.selected;
                return session;
            });

            $scope.selectSession();
        };

        $scope.backToLocation = function ($event) {
            $event.preventDefault();

            $scope.filters.service = null;
            $scope.filters.course = null;

            $state.go('booking.location');
        };

        $scope.bookSessions = function () {
            $state.go('booking.details');
        };

        coachSeekAPIService.query({section: 'Services'})
            .$promise.then(function(services){
                $scope.services = services;
            });
    }])
    .controller('bookingDetailsCtrl', ['$scope', function($scope){}])
    .controller('bookingPaymentCtrl', ['$scope', function($scope){
        // GARRETT PLAYS HERE
    }])
    .controller('bookingConfirmationCtrl', ['$scope', '$q', 'coachSeekAPIService',
      function($scope, $q, coachSeekAPIService){
        $scope.confirmBooking = function (booking) {
            coachSeekAPIService
                .save({ section: 'Customers' }, booking.customer).$promise
                .then(function (customer) {
                    // if (booking.customer.remember === true) {
                    //     customer.remember = true;
                    //     localStorage.setItem('customer', JSON.stringify(customer));
                    // }

                    var bookingList = booking.sessions
                        .map(function (session) { return { id: session.id }; })
                        .forEach(function (session) {
                            var data = {
                                customer: customer,
                                session: session
                            };

                            return coachSeekAPIService.save({ section: 'Bookings' }, data).$promise;
                        });

                    $q.all(bookingList).then(function (booking) {
                        $scope.confirmed = true;
                    });
                });
        };

        $scope.restart = function () {
            $scope.confirmed = false;
            $scope.booking = {
                customer: savedCustomer ? JSON.parse(savedCustomer) : null,
                sessions: []
            };

            $scope.filters = {
                location: null,
                service: null,
                course: null
            };

            $state.go('booking.location');
        };
    }]);
