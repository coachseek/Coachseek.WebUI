angular.module('workingHours.controllers', [])
    .controller('coachListCtrl', ['$scope', 'coachSeekAPIService', '$location', '$activityIndicator',
    	function ($scope, coachSeekAPIService, $location, $activityIndicator) {
        var coachCopy;
        $scope.editCoach = function(coach){
            _.pull($scope.coachList, coach);
            coachCopy = angular.copy(coach);

            $scope.coach = coach;
            $scope.weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        }

        $scope.createCoach = function(){
            $activityIndicator.startAnimating();

            coachSeekAPIService.createCoach().then(function(data){

                $scope.newCoach = true;
                $scope.editCoach(data);
            }, function(error){
                throw new Error(error);
            }).finally(function(){
                $activityIndicator.stopAnimating();
            });
        }

        $scope.cancelEdit = function(){
            if(!$scope.newCoach){
                $scope.coachList.push(coachCopy);
            }
            resetToCoachList();
        }

        var resetToCoachList = function(){
            $scope.coach = null;
            $scope.removeAlerts();
            $scope.newCoach = null;
            coachCopy = null;
        }

        $scope.saveCoach = function(coach){
            var formValid = validateForm();
            if( formValid ) {
                $activityIndicator.startAnimating();
                coachSeekAPIService.saveCoach(coach.coachId).then(function(){
                    $scope.coachList.push(coach);

                    resetToCoachList();
                }, function(error){
                    throw new Error(error);
                }).finally(function(){
                    $activityIndicator.stopAnimating();
                });
            }
        }

        var validateForm = function(){
            var valid = $scope.newCoachForm.$valid;
            if(!valid){
                var errors = $scope.newCoachForm.$error
                _.each(errors, function(error){
                    $scope.addAlert({
                        type: 'warning',
                        message: 'workingHours:' + error[0].$name + '-invalid'
                    });
                })
            } else {
                valid = checkDuplicateNames(valid);
            }
            return valid;
        }

        var checkDuplicateNames = function(valid){
            _.forEach($scope.coachList, function(coach){
                if($scope.coach.firstName === coach.firstName
                     && $scope.coach.lastName === coach.lastName){

                    $scope.addAlert({
                        type: 'warning',
                        message: 'workingHours:name-already-exists'
                    });
                    // using return here to exit forEach early
                    return valid = false;
                }
            });
            return valid
        }

        $scope.navigateToServices = function(){
            if(!$scope.coachList || $scope.coachList.length <= 0){
                //show bootstrap message
                $scope.addAlert({
                    type: 'warning',
                    message: 'workingHours:add-coach-warning'
                });
            } else {
                $location.path('/registration/coach-services');
            }
        }

    	$activityIndicator.startAnimating();

        coachSeekAPIService.getCoaches().then(function(data){
	    	//set coach list data or creat first coach
	    	if(data.length){  		
	        	$scope.coachList = data;
	    	} else {
		    	$scope.coachList = [];
	    		$scope.createCoach();
	    	}
        }, function(error){
			throw new Error(error);
        }).finally(function(){
            $activityIndicator.stopAnimating();
        });
    }]);