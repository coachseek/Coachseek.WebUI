/* Services */

angular.module('app.services', []).
  factory('coachSeekAPIService', ['$http', '$q', '$timeout', function($http, $q, $timeout) {

    var coachSeekAPI = {};
    // return $resource('https://api.coachseek.com/api/Coaches/:id', {}, {
    //     getCoaches: { method: 'GET' },
    //     saveCoach: { method: 'PUT', params: {id: '@id'} },
    //     createCoach: { method: 'POST', params: {id: '@id'} },
    //     deleteCoach: { method: 'DELETE', params: {id: '@id'} },

    //     createService: { method: 'POST'},
    //     saveServices: { method: 'PUT'},
    //     getServices: { method: 'GET'},
    //     deleteService: { method: 'DELETE'}

    //     createLocation: { method: 'POST'},
    //     saveLocation: { method: 'PUT'},
    //     getLocations: { method: 'GET'},
    //     deleteLocation: { method: 'DELETE'}
    // });
    
    coachSeekAPI.getLocations = function(businessId) {
        this.deferred = $q.defer();
        var self = this;
        $timeout(function(){
        self.deferred.resolve([]);
        }, _.random(500, 600));
        return this.deferred.promise;
    };

    coachSeekAPI.createLocation = function(businessId) {
        this.deferred = $q.defer();
        var self = this;
        $timeout(function(){
        self.deferred.resolve({
                businessId: "8786bcd0-3b14-4f7b-92db-198527a5b949",
                id: null,
                name: "Club Trouw",
                address: "aaron.smith@example.com"
            });
        }, _.random(500, 800));
        return this.deferred.promise;
    };

    coachSeekAPI.saveLocation = function(businessId, coachId){
        var deferred = $q.defer();
        deferred.resolve("DATA");
        return deferred.promise;
    };

    coachSeekAPI.getServices = function(businessId) {
        this.deferred = $q.defer();
        var self = this;
        $timeout(function(){
        self.deferred.resolve([]);
        }, _.random(500, 600));
        return this.deferred.promise;
    };

    coachSeekAPI.createService = function(businessId) {
        this.deferred = $q.defer();
        var self = this;
        $timeout(function(){
        self.deferred.resolve({
                businessId: "8786bcd0-3b14-4f7b-92db-198527a5b949",
                id: null,
                firstName: "NEWEST",
                name: "USER",
                description: "aaron.smith@example.com",
                timing: {
                    duration: "0:15"
                },
                booking: {
                    studentCapacity: 8
                },
                presentation: {
                    color: 'blue'
                },
                repititon: {
                    sessionCount: 12,
                    repeatFrequency: 'w'
                },
                pricing: {
                    sessionPrice: 15.00,
                    coursePrice: 150.0
                }
            });
        }, _.random(500, 800));
        return this.deferred.promise;
    };

    coachSeekAPI.saveService = function(businessId, coachId){
        var deferred = $q.defer();
        deferred.resolve("DATA");
        return deferred.promise;
    };

    coachSeekAPI.getCoaches = function(businessId) {
		this.deferred = $q.defer();
		var self = this;
		$timeout(function(){
		   self.deferred.resolve({});
		}, _.random(500, 1500));
		return this.deferred.promise;
    };

    coachSeekAPI.saveCoach = function(businessId, coachId){
		var deferred = $q.defer();
		deferred.resolve("DATA");
		return deferred.promise;
    };

    coachSeekAPI.createCoach = function(){

		var deferred = $q.defer();
  		deferred.resolve({
					businessId: "8786bcd0-3b14-4f7b-92db-198527a5b949",
					id: null,
					firstName: "NEWEST",
					lastName: "USER",
					email: "aaron.smith@example.com",
					phone: "021 99 88 77",
					workingHours: {
						monday: { 
							isAvailable: true,
							startTime: "9:00",
							finishTime: "17:00"
						},
						tuesday: {
							isAvailable: true,
                            startTime: "9:00",
                            finishTime: "17:00"

						}, 
						wednesday: {
							isAvailable: true,
                            startTime: "9:00",
                            finishTime: "17:00"

						},
						thursday: {
							isAvailable: true,
                            startTime: "9:00",
                            finishTime: "17:00"

						},
						friday: {
							isAvailable: true,
                            startTime: "9:00",
                            finishTime: "17:00"

						},
						saturday: {
							isAvailable: false,
                            startTime: "9:00",
                            finishTime: "17:00"

						}, 
						sunday: {
							isAvailable: false,
                            startTime: "9:00",
                            finishTime: "17:00"

						}
					}
				});
  		return deferred.promise;
    };

    return coachSeekAPI;
  }]);