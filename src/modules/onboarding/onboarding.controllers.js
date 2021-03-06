angular.module('onboarding.controllers', ['businessSetup'])
    .controller('onboardingDefaultsModalCtrl', ['$scope', '$q', '$activityIndicator', 'getOnboardingDefaults',
      function($scope, $q, $activityIndicator, getOnboardingDefaults){
        $scope.coachFirstName = $scope.currentUser.firstName;
        $scope.coachLastName = $scope.currentUser.lastName;
        $scope.createDefaults = function () {
            $scope.removeAlerts();
            if($scope.onboardingDefaultsForm.$valid){
                $activityIndicator.startAnimating();
                $q.all(getOnboardingDefaults($scope.locationName, $scope.serviceName, $scope.coachFirstName, $scope.coachLastName)).then(function(){
                    $scope.$close();
                    if(window.Intercom) {
                        Intercom('update', {Locations: 1});
                        Intercom('update', {Services: 1});
                        Intercom('update', {Coaches: 1});
                    }
                }, $scope.handleErrors).finally(function(){
                    $activityIndicator.stopAnimating();
                });
            } else {
                $scope.onboardingDefaultsForm.coachFirstName.$setTouched();
                $scope.onboardingDefaultsForm.coachLastName.$setTouched();
                $scope.onboardingDefaultsForm.locationName.$setTouched();
                $scope.onboardingDefaultsForm.serviceName.$setTouched();
            }
        };
    }])
    .controller('mobileOnboardingSignUpCtrl', ['$scope', '$state' , 'loginModal', 'sessionService',
        function($scope, $state ,loginModal, sessionService){
            $scope.signIn = function(){
                loginModal.open().then(function () {
                    $scope.removeAlerts();
                    $state.go('scheduling');
                }, function(){
                    sessionService.sessionType = null;
                });
            };
            $scope.joinUs = function(){
                $state.go('mobileOnboardingDefault');
            };
    }])
    .controller('mobileOnboardingDefaultCtrl', ['$window', '$q', '$state','$rootScope','$scope','$timeout', 'coachSeekAPIService', 'onboardingModal', 'uiCalendarConfig', 'getOnboardingDefaults', 'sessionService',
        function ($window, $q, $state, $rootScope, $scope, $timeout, coachSeekAPIService, onboardingModal, uiCalendarConfig, getOnboardingDefaults, sessionService) {
        $scope.business = {};
        $scope.admin = {};
        $scope.events=[];
        var initialService,
            initialCoach,
            initialLocation;
        /*onboarding calendar config*/
        $scope.uiConfig = {
            onboardingCalendar:{
                firstDay: 1,
                allDaySlot: false,
                titleFormat: {month:'MMM YYYY', week:'MMM YYYY', day:'D MMM YYYY'},
                snapDuration: '00:15:00',
                defaultView: 'agendaDay',
                eventDurationEditable: false,
                scrollTime:  "08:00:00",
                defaultDate: moment().add(1, 'd'),
                header:{
                    left: '',
                    center: 'prev title next',
                    right: '' 
                },
                eventRender: function(event, element, view) {
                    if(view.type !== 'month'){
                        $('<div></div>', {
                            class: 'fc-location',
                            text: event.session.location.name
                        }).appendTo(element.find('.fc-content'));
                    }
                },
                viewRender: function(view){
                    $timeout(function(){
                        var heightToSet = $(window).height() - 125;
                        uiCalendarConfig.calendars.mobileOnboardingCalendar.fullCalendar('option', 'height', heightToSet);
                    });
                },
                dayClick: function(date, jsEvent, ev, view) {
                    if(view.type === 'month'){
                        uiCalendarConfig.calendars.mobileOnboardingCalendar.fullCalendar('changeView', 'agendaDay');
                        uiCalendarConfig.calendars.mobileOnboardingCalendar.fullCalendar('gotoDate', date);
                    } else if (Modernizr.touchevents && ev.type !== "tap") {
                        //add already created event to calendar
                        $scope.hideSkipButton = true;
                        $rootScope.appLoading = true;
                        createInitialSession(initialService, initialLocation, initialCoach, date).then(function(session){
                            uiCalendarConfig.calendars.mobileOnboardingCalendar.fullCalendar('renderEvent', buildCalendarEvent(date, session), true);
                            $window.localStorage.setItem('completedCoachseekMobileOnboarding', true);
                            //show continue button
                        }, $scope.handleErrors).finally(function(){
                            $rootScope.appLoading = false;
                        });
                    }
                }
            }
        };
        /*calendar config end*/

        $scope.skipModal = function(){
            onboardingModal.open('mobileOnboardingSkipModal', null, 'mobile-onboarding-backdrop')
                .then({}, function(){
                    sessionService.sessionType = null;
                    $window.localStorage.setItem('completedCoachseekMobileOnboarding', true);
                    $scope.resetSession();
                    $state.go('newUserSetup');
                });
        };

        $scope.createDefaults = function(){
            $scope.removeAlerts();
            if($scope.mobileOnboardingDefaultForm.$valid){
                $rootScope.appLoading = true;
                createNewUser().then(function(newUser){
                    $scope.setUserAuth(newUser.admin.email, $scope.admin.password);
                    createDefaultSettings().then(function(response){
                        $scope.setupCurrentUser({
                            email: newUser.admin.email,
                            password: $scope.admin.password,
                            firstName: newUser.admin.firstName,
                            lastName: newUser.admin.lastName
                        }, newUser.business);
                        //set responses to use later
                        initialService = response.service;
                        initialLocation = response.location;
                        initialCoach = response.coach;
                        $scope.hideScoochBullets = true;
                        $('.m-scooch').scooch('next');
                        if(window.ga) ga('send', 'event', 'conversions', 'newUserSignUp');
                    }, $scope.handleErrors).finally(function(){
                        $rootScope.appLoading = false;
                    });
                }, function(errors){
                    $rootScope.appLoading = false;
                    $scope.handleErrors(errors)
                });
            }
        };

        function createNewUser(){
            return coachSeekAPIService.save({section: 'businessRegistration'}, {admin: $scope.admin, business: $scope.business }).$promise
        };

        function createDefaultSettings(){
            return $q.all(getOnboardingDefaults(
                    $scope.locationName, 
                    $scope.serviceName,
                    $scope.admin.firstName,
                    $scope.admin.lastName,
                    $scope.admin.email,
                    $scope.sessionPrice
                )
            );
        };

        function createInitialSession(service, location, coach, date){
            return coachSeekAPIService.save({section: 'Sessions'}, getSessionObject(service, location, coach, date)).$promise;
        }

        function getSessionObject(service, location, coach, date){
            return {
                service: service,
                location: {
                    id: location.id
                },
                coach: {
                    id: coach.id
                },
                timing: {
                    startDate: date.format('YYYY-MM-DD'),
                    startTime: date.format('HH:mm'),
                    duration: 60
                },
                booking: {
                    isOnlineBookable: true,
                    studentCapacity: 10,
                    bookings: []
                },
                pricing: {sessionPrice: $scope.sessionPrice},
                presentation: service.presentation,
                repetition: service.repetition
            };
        };

        function buildCalendarEvent(date, session){
            var dateClone = date.clone();

            return {
                _id: _.uniqueId('session_'),
                title: session.service.name,
                start: moment(dateClone),
                end: moment(dateClone.clone().add(60, 'minutes')),
                _start: 60,
                _end: moment(dateClone.clone().add(60, 'minutes')),
                allDay: false,
                className: session.presentation.colour,
                session: session
            };
        };

    }]);
