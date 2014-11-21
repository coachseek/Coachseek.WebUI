angular.module('workingHours.controllers', [])
    .controller('coachListCtrl', ['$scope', 'coachSeekAPIService', '$location', '$activityIndicator',
    	function ($scope, coachSeekAPIService, $location, $activityIndicator) {
    	$activityIndicator.startAnimating();

        coachSeekAPIService.getCoaches().success(function(data){
        	$scope.coachList = data;
        }).error(function(error){
			//log error
	    	$activityIndicator.stopAnimating();
        });

        $scope.editCoach = function(coach){
        	$location.path('registration/coach-list/' + coach.bussinessId + '/' + coach.id);
        }

        $scope.createCoach = function(){
        	var data = 'new3123';
    		// var newCoach = coachSeekAPIService.createCoach().success(function(data){
	        	$location.path('registration/coach-list/' + data);
    		// }).error(function(error){
				//log error
    		// });
        }
    }]).controller('coachEditCtrl', ['$scope', 'coachSeekAPIService', '$location', '$routeParams',
    	function($scope, coachSeekAPIService, $location, $routeParams){
	    	$activityIndicator.startAnimating();

    	coachSeekAPIService.getCoach($routeParams.coachId).success(function(data){
    		$scope.coach = data;
    	}).error(function(error){
			//log error
        });
		    	$activityIndicator.stopAnimating();

    	// need in order to keep days in order
    	$scope.weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    	$scope.save = function(coach){
    		// coachSeekAPIService.saveCoach(coach.coachId).success().error();
    		$location.path('registration/coach-list/' + coach.businessId);
	    	$activityIndicator.startAnimating();
    	}
    }]);