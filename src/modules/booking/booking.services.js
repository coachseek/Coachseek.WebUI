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
    }]);