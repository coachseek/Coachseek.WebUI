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

    coachSeekAPI.getBusiness = function(businessId) {
        this.deferred = $q.defer();
        var self = this;
        $timeout(function(){
        self.deferred.resolve({});
        }, _.random(500, 600));
        return this.deferred.promise;
    };

    coachSeekAPI.saveBusiness = function(businessId) {
        this.deferred = $q.defer();
        var self = this;
        $timeout(function(){
        self.deferred.resolve([]);
        }, _.random(500, 600));
        return this.deferred.promise;
    };

    coachSeekAPI.createBusiness = function(businessId) {
        this.deferred = $q.defer();
        var self = this;
        $timeout(function(){
        self.deferred.resolve({
                business: {
                    name: "West Coast Toast"
                },
                admin: {
                    firstName: "Toast",
                    lastName: "Master",
                    email: "toastmaster@westcoasttoast.com",
                    password: "password"
                }
            });
        }, _.random(500, 600));
        return this.deferred.promise;
    };
    
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
                name: "THE LAB",
                address: "1800 taylor ave n",
                city: "Seattle",
                state: "WA",
                country: "USA"
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
        self.deferred.resolve([{
                businessId: "8786bcd0-3b14-4f7b-92db-198527a5b949",
                id: _.uniqueId('service_'),
                name: "Toast Making w",
                description: "I show you how to make goddamn toast, son.",
                timing: {
                    duration: "0:30"
                },
                booking: {
                    studentCapacity: 8
                },
                presentation: {
                    color: 'blue'
                },
                repititon: {
                    sessionCount: 4,
                    repeatFrequency: 'w'
                },
                pricing: {
                    sessionPrice: 15.00,
                    coursePrice: 150.0
                }
            },{
                businessId: "8786bcd0-3b14-4f7b-92db-198527a5b949",
                id: _.uniqueId('service_'),
                name: "Toast Roasting d",
                description: "I show you how to roast goddamn toast, son.",
                timing: {
                    duration: "1:45"
                },
                booking: {
                    studentCapacity: 8
                },
                presentation: {
                    color: 'green'
                },
                repititon: {
                    sessionCount: 4,
                    repeatFrequency: 'd'
                },
                pricing: {
                    sessionPrice: 15.00,
                    coursePrice: 150.0
                }
            },{
                businessId: "8786bcd0-3b14-4f7b-92db-198527a5b949",
                id: _.uniqueId('service_'),
                name: "Boasting",
                description: "I show you how to boast, son.",
                timing: {
                    duration: "4:15"
                },
                booking: {
                    studentCapacity: 8
                },
                presentation: {
                    color: 'purple'
                },
                repititon: {
                    sessionCount: -1,
                    repeatFrequency: -1
                },
                pricing: {
                    sessionPrice: 15.00,
                    coursePrice: 150.0
                }
            },{
                businessId: "8786bcd0-3b14-4f7b-92db-198527a5b949",
                id: _.uniqueId('service_'),
                name: "Duding",
                description: "I teach you how to be a dude.",
                timing: {
                    duration: "2:15"
                },
                booking: {
                    studentCapacity: 8
                },
                presentation: {
                    color: 'orange'
                },
                repititon: {
                    sessionCount: null,
                    repeatFrequency: null
                },
                pricing: {
                    sessionPrice: 15.00,
                    coursePrice: 150.0
                }
            }]);
        }, _.random(500, 1600));
        return this.deferred.promise;
    };

    coachSeekAPI.createService = function(businessId) {
        this.deferred = $q.defer();
        var self = this;
        $timeout(function(){
        self.deferred.resolve({
                businessId: "8786bcd0-3b14-4f7b-92db-198527a5b949",
                id: null,
                name: "Toast Making",
                description: "I show you how to make goddamn toast, son.",
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
					firstName: "Toast",
					lastName: "Apprentice #1",
					email: "apprentice@westcoasttoast.com",
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