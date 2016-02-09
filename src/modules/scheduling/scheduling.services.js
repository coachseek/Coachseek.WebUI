angular.module('scheduling.services', [])
    .service('sessionOrCourseModal', ['$modal',
        function ($modal) {
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
    .service('removeFromCourseModal', ['$modal',
        function ($modal) {
            return function() {
                var instance = $modal.open({
                    templateUrl: 'scheduling/partials/removeFromCourseModal.html',
                    backdropClass: 'session-or-course-modal-backdrop',
                    windowClass: 'session-or-course-modal-window'
                });

                return instance.result;
            };
        }
    ])
    .service('currentEventService', function(){
        return {};
    })
    .service('bookingManager', ['$q', 'coachSeekAPIService', 'uiCalendarConfig', 'currentEventService',
        function($q, coachSeekAPIService, uiCalendarConfig, currentEventService){

        this.addToCourse = function(customer){
            var courseId = currentEventService.event.course.id;
            return coachSeekAPIService.save({section: 'Bookings'}, buildBooking(customer))
                .$promise.then(function(booking){
                    return updateCourse(courseId).then(function(){
                        return booking;
                    });
                });
        };

        this.addToSession = function(customer, sessionId){
            var eventUpdate = getEventUpdateInfo();
            return coachSeekAPIService.save({section: 'Bookings'}, buildBooking(customer, sessionId))
                .$promise.then(function(booking){
                    return eventUpdate.updateEventFunction(eventUpdate.eventId).then(function(){
                        return booking;
                    });
                });
        }

        this.updateBooking = function(bookingId, updateCommand){
            var eventUpdate = getEventUpdateInfo();
            return coachSeekAPIService.save({section: 'Bookings', id: bookingId}, updateCommand)
                .$promise.then(function(booking){
                    return eventUpdate.updateEventFunction(eventUpdate.eventId).then(function(){
                        return booking;
                    });
                });
        };

        this.removeFromSession = function(bookingId){
            var eventUpdate = getEventUpdateInfo();
            return deleteBooking(bookingId).then(function(){
                return eventUpdate.updateEventFunction(eventUpdate.eventId);
            });
        }

        function getEventUpdateInfo(){
            if(currentEventService.event.course){
                return {
                    eventId: currentEventService.event.course.id,
                    updateEventFunction: updateCourse
                }
            } else {
                return {
                    eventId: currentEventService.event.session.id,
                    updateEventFunction: updateStandaloneSession
                }
            }
        }

        //accepts all courseBookings. deletes using $q.all
        this.removeFromCourse = function(courseBookings){
            var courseId = currentEventService.event.course.id;
            var bookingsToDelete = [];
            _.each(courseBookings, function(booking){
                bookingsToDelete.push(deleteBooking(booking.parentId));
            });
            return $q.all(bookingsToDelete).then(function(bookings){
                return updateCourse(courseId);
            });
        }

        function updateCourse(courseId){
            //courseId must be grabbed before this oint from currentEventService in case currentEvent changes during async
            return getUpdatedEvents(courseId).then(function(course){
                var courseEvents = getCalendarEventsByCourseId(course.id);
                _.each(courseEvents, function(courseEvent){
                    //fullcalendar needs original event so we get it from the calendar here
                    var event = courseEvent;
                    _.assign(event, {
                        session: _.find(course.sessions, function(session){return session.id === event.session.id}),
                        course:  course
                    });
                });
            })
        }

        function getCalendarEventsByCourseId(courseId){
            return _.filter(uiCalendarConfig.calendars.sessionCalendar.fullCalendar('clientEvents'), function(event){
                return _.get(event, 'course.id', 1) === courseId;
            });
        }

        function updateStandaloneSession(sessionId){
            //sessionId must be grabbed before this oint from currentEventService in case currentEvent changes during async
            return getUpdatedEvents(sessionId).then(function(session){
                //fullcalendar needs original event so we get it from the calendar here
                var event = getCalendarEventBySessionId(session.id);
                event.session = session;
            });
        }

        function getCalendarEventBySessionId(sessionId){
            return _.find(uiCalendarConfig.calendars.sessionCalendar.fullCalendar('clientEvents'), function(event){
                return _.get(event, 'session.id', 1) === sessionId;
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

        function deleteBooking(bookingId){
            return coachSeekAPIService.delete({section: 'Bookings', id: bookingId}).$promise;
        }
    }]);