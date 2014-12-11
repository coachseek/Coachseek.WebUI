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
    // });

    coachSeekAPI.getServices = function(businessId) {
        this.deferred = $q.defer();
        var self = this;
        $timeout(function(){
        self.deferred.resolve([{
                businessId: "8786bcd0-3b14-4f7b-92db-198527a5b949",
                id: null,
                firstName: "NEWEST",
                name: "USER",
                description: "aaron.smith@example.com",
                phone: "021 99 88 77",
            },{
                businessId: "8786bcd0-3b14-4f7b-92db-198527a5b949",
                id: null,
                firstName: "NEWEST",
                name: "USER",
                description: "aaron.smith@example.com",
                phone: "021 99 88 77",
            }]);
        }, _.random(500, 1500));
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
                phone: "021 99 88 77",
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