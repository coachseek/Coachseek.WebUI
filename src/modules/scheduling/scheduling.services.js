angular.module('scheduling.services', [])
    .service('sessionOrCourseModal', ['$modal', '$rootScope',
        function ($modal, $rootScope) {
            return function(scope) {
                scope.removeAlerts();
                var instance = $modal.open({
                    scope: scope,
                    templateUrl: 'scheduling/partials/sessionOrCourseModal.html',
                    backdropClass: 'session-or-course-modal-backdrop',
                    windowClass: 'session-or-course-modal-window'
                });

                return instance.result.then(function(id){
                    return id;
                });
            };
        }
    ])
    .service('currentEventService', function(){
        return {};
    })
    .service('bookingManager', ['coachSeekAPIService', 'uiCalendarConfig', 'currentEventService',
        function(coachSeekAPIService, uiCalendarConfig, currentEventService){

        this.addToCourse = function(customer){
            return coachSeekAPIService.save({section: 'Bookings'}, buildBooking(customer))
                .$promise.then(function(booking){
                    return updateCourse().then(function(){
                        return booking;
                    });
                });
        };

        function updateCourse(){
            return getUpdatedEvents(currentEventService.event.course.id).then(function(course){
                    console.log('COURSE UPDATED')
                _.each(currentEventService.currentCourseEvents , function(courseEvent){
                    //fullcalendar needs original event so we get it from the calendar here
                    event = uiCalendarConfig.calendars.sessionCalendar.fullCalendar('clientEvents', courseEvent._id)[0];
                    _.assign(event, {
                        session: _.find(course.sessions, function(session){return session.id === event.session.id}),
                        course:  course
                    });
                });
            })
        }

        this.addToSession = function(customer, sessionId){
            return coachSeekAPIService.save({section: 'Bookings'}, buildBooking(customer, sessionId))
                .$promise.then(function(booking){
                    if(currentEventService.event.course){
                        //Update session and course
                        return updateCourse().then(function(){
                            return booking;
                        });
                    } else {
                        //Update standalone session
                        return updateStandaloneSession().then(function(){
                            return booking;
                        });
                    }
                });
        }

        function updateStandaloneSession(){
            return getUpdatedEvents(currentEventService.event.session.id).then(function(session){
                //fullcalendar needs original event so we get it from the calendar here
                var event = uiCalendarConfig.calendars.sessionCalendar.fullCalendar('clientEvents', currentEventService.event._id)[0];
                event.session = session;
            });
        }


        function getUpdatedEvents(id){
            return coachSeekAPIService.get({section: 'Sessions', id: id}).$promise;
        }

        function buildBooking(customer, sessionId){
            return {
                sessions: getBookingSessionsArray(sessionId),
                customer: customer
            };
        };

        function getBookingSessionsArray(sessionId){
            if(sessionId){
                return [{
                    id:  sessionId,
                    name: currentEventService.event.session.service.name
                }];
            } else {
                return currentEventService.event.course.sessions;
            }
        };

        this.updateBooking = function(bookingId, updateCommand){
            return coachSeekAPIService.save({section: 'Bookings', id: bookingId}, updateCommand)
                .$promise.then(function(booking){
                    return updateCourse().then(function(){
                        return booking;
                    });
                });
        };

        this.removeFromSession = function(bookingId){
            return deleteBooking(bookingId).then(function(){
                return updateStandaloneSession();
            });
        }

        this.removeFromCourse = function(bookingId){
            return deleteBooking(bookingId).then(function(){
                return updateCourse();
            });
        }

        function deleteBooking(bookingId){
            return coachSeekAPIService.delete({section: 'Bookings', id: bookingId}).$promise;
        }
    }]);