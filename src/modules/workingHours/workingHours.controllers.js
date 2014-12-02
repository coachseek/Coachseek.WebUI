angular.module('workingHours.controllers', [])
    .controller('coachListCtrl', ['$rootScope','$scope', 'coachSeekAPIService', '$location', '$activityIndicator',
    	function ($rootScope, $scope, coachSeekAPIService, $location, $activityIndicator) {

        $scope.editCoach = function(coach){
            $scope.coach = coach;
            $scope.weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        }

        $scope.createCoach = function(){
            $activityIndicator.startAnimating();

            coachSeekAPIService.createCoach().then(function(data){
                $activityIndicator.stopAnimating();

                $scope.editCoach(data);
            }, function(error){
                throw new Error(error);
            });
        }

        $scope.save = function(coach){
            $activityIndicator.startAnimating();
            coachSeekAPIService.saveCoach(coach.coachId).then(function(){

                if(!_.contains($scope.coachList, coach)){
                    $scope.coachList.push(coach);
                }

                $scope.coach = null;
                $rootScope.alert = null;

                $activityIndicator.stopAnimating();
            }, function(error){
                throw new Error(error);
            });
        }

        $scope.navigateToServices = function(){
            if(!$scope.coachList || $scope.coachList.length <= 0){
                //show bootstrap message
                $rootScope.alert = {
                    type: 'warning',
                    message: 'workingHours:add-coach-warning'
                };
            } else {
                $location.path('/registration/coach-services');
            }
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