angular.module('booking.services', [])  
    .factory('onlineBookingAPIFactory', ['$resource', 'ENV', function($resource, ENV){
        return {
            anon: function (subdomain) {
                return $resource(ENV.apiURL + '/OnlineBooking/:section', {}, {
                    get:   {method: 'GET', headers: {'Business-Domain': subdomain}},
                    // query: {method: 'GET', isArray:true, headers: {'Business-Domain': subdomain}},
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
                endDate: moment().add(1, 'y').format('YYYY-MM-DD'),
                startDate: moment().format('YYYY-MM-DD'),
                section: 'Sessions'
            };

            return onlineBookingAPIFactory.anon(businessDomain).get(params).$promise;
        };
    }]);