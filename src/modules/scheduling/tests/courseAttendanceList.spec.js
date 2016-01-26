describe('courseAttendanceList directive', function(){
    let('currentEvent', function(){
        return {
            _id: 'eventOne_id',
            session: this.sessionOne
        };
    });

    let('eventTwo', function(){
        return {
            _id: 'eventTwo_id',
            session: this.sessionTwo,
            course: this.course
        }
    });

    let('sessionOne', function(){
        return {
            id: 'session_one',
            booking: {
                bookings: this.sessionOneBookings
            },
            service: {
                name: 'service name'
            }
        };
    });

    let('sessionOneBookings', function(){
        return [this.sessionBookingOne]
    });

    let('sessionBookingOne', function(){
        return {
            customer: {id: 'one'},
            parentId: "course_booking_id"
        };
    });

    let('sessionTwo', function(){
        return {
            id: 'session_two',
            booking: {
                bookings: [this.sessionBookingTwo]
            },
            service: {
                name: 'service name'
            }
        };
    });

    let('sessionBookingTwo', function(){
        return {
            customer: {id: 'one'},
            parentId: "course_booking_id"
        };
    });

    let('course', function(){
        return {
            id: 'course_one',
            booking: {
                bookings: this.courseBookings
            },
            service: {
                name: 'service name'
            },
            sessions: [this.sessionOne, this.sessionTwo]
        }
    });

    let('customerOne', function(){
        return {
            id: 'one',
            firstName: 'Dude',
            lastName: 'Guy'
        }
    })

    let('queryCustomersPromise', function(){
        var deferred = $q.defer();
        deferred.resolve([this.customerOne]);
        return deferred.promise;
    });

    let('getSessionPromise', function(){
        var deferred = $q.defer();
        deferred.resolve(this.sessionOne);
        return deferred.promise;
    });

    let('updatePromise', function(){
        return $q.defer().promise;
    });

    let('currentCourseEvents', function(){
        return [this.currentEvent, this.eventTwo]
    });
})