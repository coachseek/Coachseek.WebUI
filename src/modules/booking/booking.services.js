angular.module('booking.services', [])  
    .factory('onlineBookingAPIFactory', ['$resource', function($resource){
        return {
            anon: function (subdomain) {
                return $resource('https://api.coachseek.com/OnlineBooking/:section', {}, {
                    get:   {method: 'GET', headers: {'Business-Domain': subdomain}},
                    query: {method: 'GET', isArray:true, headers: {'Business-Domain': subdomain}},
                    save:  {method: 'POST', headers: {'Business-Domain': subdomain}}
                })
            }
        };
    }])
    .service('currentBooking', ['onlineBookingAPIFactory', function(onlineBookingAPIFactory){
        this.customer = {};
        this.booking = {
            sessions: []
        };
        this.filters = {};

        this.resetBooking = function(){
            this.booking = {
                sessions: []
            };
        }

        this.getAllEvents = function(businessDomain){
            var params = {
                endDate: moment().add(12, 'week').format('YYYY-MM-DD'),
                startDate: moment().add(1, 'day').format('YYYY-MM-DD'),
                section: 'Sessions'
            };

            return onlineBookingAPIFactory.anon(businessDomain).get(params).$promise;
        };
    }]);