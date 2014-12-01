angular.module('workingHours.controllers', [])
    .controller('coachListCtrl', ['$scope', 'coachSeekAPIService', '$location', '$activityIndicator',
    	function ($scope, coachSeekAPIService, $location, $activityIndicator) {

        $scope.editCoach = function(coach){
            $scope.coach = coach;
            $scope.weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        }

        $scope.createCoach = function(){
            $activityIndicator.startAnimating();

            coachSeekAPIService.createCoach().then(function(data){
                $activityIndicator.stopAnimating();

                $scope.coachList.push(data);
                $scope.editCoach(data);
                
            }, function(error){
                throw new Error(error);
            });
        }

        $scope.save = function(coach){
            $activityIndicator.startAnimating();
            $scope.coach = null;

            coachSeekAPIService.saveCoach(coach.coachId).then(function(){
                $activityIndicator.stopAnimating();
            }, function(error){
                throw new Error(error);
            });
        }

    	$activityIndicator.startAnimating();

        coachSeekAPIService.getCoaches().then(function(data){
	    	$activityIndicator.stopAnimating();
	    	//set coach list data or creat first coach
	    	if(data.length){  		
	        	$scope.coachList = data;
	    	} else {
		    	$scope.coachList = [];
	    		$scope.createCoach();
	    	}
        }, function(error){
			throw new Error(error);
        });
    }]);