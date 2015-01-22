/* Services */

angular.module('app.services', []).
  factory('coachSeekAPIService', ['$http', '$q', '$timeout', function($http, $q, $timeout) {

    var coachSeekAPI = {};
    // var authHeader = {'Authorization':'Basic cmFkZUBkLmNvbTpmYWNsa2xzZA=='};


    // return $resource('http://coachseek-api.azurewebsites.net/api/:section', {}, {
    //     get: { method: 'GET', isArray: true, headers: authHeader},
    //     update: {method: 'POST', headers: authHeader}
    // });

    coachSeekAPI.getBusiness = function(businessId) {
        this.deferred = $q.defer();
        var self = this;
        $timeout(function(){
        self.deferred.resolve({});
        }, _.random(500, 600));
        return this.deferred.promise;
        // return $http({
        //     url: 'http://coachseek-api.azurewebsites.net/api/BusinessRegistration',
        //     method: "GET"
        // });
    };

    coachSeekAPI.saveBusiness = function(business) {
        if(business.admin){
            console.log('SET AUTH')
            $http.defaults.headers.common['Authorization'] = 'Basic ' + btoa(business.admin.email + ':' + business.admin.password);
            console.log('Basic ' + btoa(business.admin.email + ':' + business.admin.password));
        } else {
            throw new Error('NO AUTH TO SET, DUDE')
        }

        return $http({
            url: 'http://coachseek-api.azurewebsites.net/api/BusinessRegistration',
            method: "POST",
            data: business
        });
    };
    
    coachSeekAPI.getLocations = function() {
        return $http({
            url: 'http://coachseek-api.azurewebsites.net/api/Locations',
            method: "GET"
        });
    };

    coachSeekAPI.saveLocation = function(locations){
        return $http({
            url: 'http://coachseek-api.azurewebsites.net/api/Locations',
            method: "POST",
            data: locations
        });
    };


    coachSeekAPI.getCoaches = function() {
        return $http({
            url: 'http://coachseek-api.azurewebsites.net/api/Coaches',
            method: "GET"
        });
    };

    coachSeekAPI.saveCoach = function(coach){
        return $http({
            url: 'http://coachseek-api.azurewebsites.net/api/Coaches',
            method: "POST",
            data: coach
        });
    };

    coachSeekAPI.getServices = function() {
        this.deferred = $q.defer();
        var self = this;
        $timeout(function(){
        self.deferred.resolve([]);
        }, _.random(500, 1600));
        return this.deferred.promise;
        // return $http({
        //     url: 'http://coachseek-api.azurewebsites.net/api/Services',
        //     method: "GET"
        // });
    };

    coachSeekAPI.saveService = function(service){
        return $http({
            url: 'http://coachseek-api.azurewebsites.net/api/Services',
            method: "POST",
            data: service
        });
    };

    return coachSeekAPI;
  }]);