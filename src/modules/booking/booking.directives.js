angular.module('booking.directives', [])
    .directive('bookingRectangle', function(){
        return {
            restrict: "E",
            templateUrl:'booking/partials/bookingRectangle.html',
            link: function(scope){
                scope.selected = false;
                var startDate = moment(scope.event.timing.startDate + " " + scope.event.timing.startTime, "YYYY-MM-DD HH:mm")

                scope.getEventDateRange = function(){
                    if(scope.event.sessions){
                        var repetition = scope.event.repetition;
                        return startDate.format('dddd Do MMM') +  " – " + startDate.clone().add(repetition.sessionCount - 1, repetition.repeatFrequency).format('dddd Do MMM');
                    } else {
                        return startDate.format('dddd Do MMM');
                    }
                };

                scope.getEventTimeRange = function(){
                    return startDate.format('h:mm A') + " – " + startDate.clone().add(scope.event.timing.duration, 'minutes').format('h:mm A');
                };

                scope.getSpacesAvailable = function(){
                    var booking = scope.event.booking;
                    if(scope.event.sessions){
                        var maxBookingsSession = _.max(scope.event.sessions, "booking.bookingCount");
                        return booking.studentCapacity - maxBookingsSession.booking.bookingCount;
                    } else {
                        return booking.studentCapacity - booking.bookingCount;
                    }
                };

                scope.toggleEventSelect = function(){
                    scope.selected = !scope.selected;
                    scope.selectEvent(scope.event)
                };
            }
        };
    })
    .directive('bookingCourseSessions', function(){
        return {
            restrict: "E",
            templateUrl:'booking/partials/bookingCourseSessions.html',
            link: function(scope){
                scope.getSessionDate = function(session){
                    return getNewDate(session.timing).format('dddd Do MMM');
                };

                scope.getEventTimeRange = function(session){
                    var startDate = getNewDate(session.timing)
                    return startDate.format('h:mm A') + " – " + startDate.clone().add(session.timing.duration, 'minutes').format('h:mm A');
                };

                function getNewDate(timing){
                    return moment(timing.startDate + " " + timing.startTime, "YYYY-MM-DD HH:mm")
                }

                scope.isSelected = function(session){
                    return _.includes(scope.booking.sessions, session);
                };

                scope.getSessionSpacesAvailable = function(session){
                    return session.booking.studentCapacity - session.booking.bookingCount;
                };
            }
        };
    });