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
            return coachSeekAPIService.save({section: 'Bookings'}, buildBooking(customer))
                .$promise.then(function(booking){
                    return getUpdatedEvent(booking);
                });
        };

        this.addToSession = function(customer, sessionId){
            return coachSeekAPIService.save({section: 'Bookings'}, buildBooking(customer, sessionId))
                .$promise.then(function(booking){
                    return getUpdatedEvent(booking);
                });
        }

        this.updateBooking = function(bookingId, updateCommand){
            return coachSeekAPIService.save({section: 'Bookings', id: bookingId}, updateCommand)
                .$promise.then(function(booking){
                    return getUpdatedEvent(booking)
                });
        };

        this.removeFromSession = function(bookingId){
            return deleteBooking(bookingId).then(function(){
                return getUpdatedEvent();
            });
        }

        //accepts all courseBookings. deletes using $q.all
        this.removeFromCourse = function(courseBookings){
            var bookingsToDelete = [];
            _.each(courseBookings, function(booking){
                bookingsToDelete.push(deleteBooking(booking.parentId));
            });
            return $q.all(bookingsToDelete).then(function(bookings){
                return getUpdatedEvent();
            });
        }

        function getUpdatedEvent(booking){
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
        };

        function updateCourse(){
            return getUpdatedEvents(currentEventService.event.course.id).then(function(course){
                _.each(currentEventService.currentCourseEvents , function(courseEvent){
                    //fullcalendar needs original event so we get it from the calendar here
                    var event = uiCalendarConfig.calendars.sessionCalendar.fullCalendar('clientEvents', courseEvent._id)[0];
                    _.assign(event, {
                        session: _.find(course.sessions, function(session){return session.id === event.session.id}),
                        course:  course
                    });
                });
            })
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

        function deleteBooking(bookingId){
            return coachSeekAPIService.delete({section: 'Bookings', id: bookingId}).$promise;
        }
    }]);