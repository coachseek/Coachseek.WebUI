/* Services */

angular.module('coachSeekApp.services', []).
  factory('coachSeekAPIService', ['$http', function($http) {

    var coachSeekAPI = {};

    coachSeekAPI.getCoaches = function() {
      // return $http({
      //   method: 'GET', 
      //   url: 'https://api.coachseek.com/api/Coaches',
      //   params: {businessId: '@businessId'}
      // });
    };

    coachSeekAPI.getCoach = function(userId){
    	// return $http({
    	//   method: 'GET', 
    	//   url: 'https://api.coachseek.com/api/Coaches',
    	//   params: {businessId: '@businessId', coachId: '@coachId'}
    	// });
    }

    coachSeekAPI.saveCoach = function(){
    	// return $http({
    	//   method: 'POST', 
    	//   url: 'https://api.coachseek.com/api/Coaches',
    	//   params: {businessId: '@businessId', coachId: '@coachId'}
    	// });
    };

    coachSeekAPI.createCoach = function(){
    	// return $http({
    	//   method: 'PUT', 
    	//   url: 'https://api.coachseek.com/api/Coaches',
    	//   params: {businessId: '@businessId', coachId: '@coachId'}
    	// });
    };

    return coachSeekAPI;
  }]);