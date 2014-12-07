/* Services */

angular.module('app.services', []).
  factory('coachSeekAPIService', ['$http', '$q', '$timeout', function($http, $q, $timeout) {

    var coachSeekAPI = {};
    
    coachSeekAPI.getCoaches = function(businessId) {
      // return $http({
      //   method: 'GET', 
      //   url: 'https://api.coachseek.com/api/Coaches',
      //   params: {businessId: '@businessId'}
      // });
		this.deferred = $q.defer();
		var self = this;
		$timeout(function(){
		   self.deferred.resolve({});
		}, _.random(500, 1500));
		return this.deferred.promise;
    };

  //   coachSeekAPI.getCoach = function(businessId, coachId){
  //   	// return $http({
  //   	//   method: 'GET', 
  //   	//   url: 'https://api.coachseek.com/api/Coaches',
  //   	//   params: {businessId: '@businessId', coachId: '@coachId'}
  //   	// });



		// this.deferred = $q.defer();
		// var self = this;
		// $timeout(function(){
		//    self.deferred.resolve({
		// 		businessId: "8786bcd0-3b14-4f7b-92db-198527a5b949",
		// 		id: null,
		// 		firstName: "Koot",
		// 		lastName: "Stains",
		// 		email: "n.h@example.com",
		// 		phone: "021 99 88 77",
		// 		workingHours: {
		// 			monday: { 
		// 				isAvailable: true,
		// 				startTime: startTime,
		// 				finishTime: finishTime
		// 			},
		// 			tuesday: {
		// 				isAvailable: true,
		// 				startTime: startTime,
		// 				finishTime: finishTime
		// 			}, 
		// 			wednesday: {
		// 				isAvailable: true,
		// 				startTime: startTime,
		// 				finishTime: finishTime
		// 			},
		// 			thursday: {
		// 				isAvailable: true,
		// 				startTime: startTime,
		// 				finishTime: finishTime
		// 			},
		// 			friday: {
		// 				isAvailable: true,
		// 				startTime: startTime,
		// 				finishTime: finishTime
		// 			},
		// 			saturday: {
		// 				isAvailable: false,
		// 				startTime: startTime, 
		// 				finishTime: finishTime
		// 			}, 
		// 			sunday: {
		// 				isAvailable: false,
		// 				startTime: startTime, 
		// 				finishTime: finishTime
		// 			}
		// 		}
		// 	});
		// }, _.random(500, 1500));
  // 		return this.deferred.promise;
  //   }

    coachSeekAPI.saveCoach = function(businessId, coachId){
    	// return $http({
    	//   method: 'POST', 
    	//   url: 'https://api.coachseek.com/api/Coaches',
    	//   params: {businessId: '@businessId', coachId: '@coachId'}
    	// });
		var deferred = $q.defer();
		deferred.resolve("DATA");
		return deferred.promise;
    };

    coachSeekAPI.createCoach = function(){
    	// return $http({
    	//   method: 'PUT', 
    	//   url: 'https://api.coachseek.com/api/Coaches',
    	//   params: {businessId: '@businessId'}
    	// });

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