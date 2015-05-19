angular.module('booking.directives', [])
    .directive('bookingRectangle', function(){
        return {
            restrict: "E",
            templateUrl:'booking/partials/bookingRectangle.html',
            link: function(scope){
                scope.selected = false;
                var startDate = moment(scope.event.timing.startDate + " " + scope.event.timing.startTime, "YYYY-MM-DD HH:mm");
                scope.spacesAvailable = getSpacesAvailable();
                scope.fullCoursePrice = getFullCoursePricePrice();

                function getFullCoursePricePrice(){
                    var event = scope.event;
                    if(scope.isBefore(event)){
                        // SUM SESSION PRICES
                        if(event.pricing.sessionPrice >= 0){
                            return sumSessionCosts(event.sessions);
                        // PRO RATE
                        } else {
                            var numSessionsInFuture = _.size(_.filter(event.sessions, function(session){return !scope.isBefore(session)}));
                            return (event.pricing.coursePrice / event.repetition.sessionCount * numSessionsInFuture).toFixed(0);
                        }
                    } else {
                        return event.pricing.coursePrice;
                    }
                };

                function sumSessionCosts(sessions){
                    return _.sum(sessions, function(session){
                        if(scope.isBefore(session) || scope.getSessionSpacesAvailable(session) <= 0){
                            return 0;
                        }else{
                            return session.pricing.sessionPrice;
                        }
                    });
                };

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

                function getSpacesAvailable(){
                    var booking = scope.event.booking;
                    var spacesAvailable;
                    if(scope.event.sessions){
                        spacesAvailable = booking.studentCapacity - getMaxBookingSessionCount();
                    } else {
                        spacesAvailable = booking.studentCapacity - booking.bookingCount;
                    }
                    return spacesAvailable > 0 ? spacesAvailable : 0;
                };

                function getMaxBookingSessionCount(){
                    var sessions = _.filter(scope.event.sessions, function(session){
                        return getNewDate(session.timing).isAfter();
                    });
                    return _.max(sessions, "booking.bookingCount").booking.bookingCount;
                };

                function getNewDate(timing){
                    return moment(timing.startDate + " " + timing.startTime, "YYYY-MM-DD HH:mm")
                }

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
            }
        };
    });