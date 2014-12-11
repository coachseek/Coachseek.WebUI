angular.module('businessSetup.controllers', [])
    .controller('coachListCtrl', ['$scope', 'coachSeekAPIService', '$location', '$activityIndicator',
    	function ($scope, coachSeekAPIService, $location, $activityIndicator) {
        
        var coachCopy;
        
        $scope.editCoach = function(coach){
            _.pull($scope.coachList, coach);
            coachCopy = angular.copy(coach);

            $scope.coach = coach;
            $scope.weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        };

        $scope.createCoach = function(){
            $activityIndicator.startAnimating();

            coachSeekAPIService.createCoach().then(function(data){
                $scope.newCoach = true;
                $scope.editCoach(data);
            }, function(error){
                $scope.addAlert({
                    type: 'danger',
                    message: 'businessSetup:' + error.message + '-invalid'
                });
            }).finally(function(){
                $activityIndicator.stopAnimating();
            });
        };

        $scope.cancelEdit = function(){
            if(!$scope.newCoach){
                $scope.coachList.push(coachCopy);
            }
            resetToCoachList();
        };

        var resetToCoachList = function(){
            $scope.coach = null;
            $scope.removeAlerts();
            $scope.newCoach = null;
            coachCopy = null;
        };

        $scope.saveCoach = function(coach){
            var formValid = validateForm();
            if( formValid ) {
                $activityIndicator.startAnimating();
                coachSeekAPIService.saveCoach(coach.coachId).then(function(){
                    $scope.coachList.push(coach);

                    resetToCoachList();
                }, function(error){
                    $scope.addAlert({
                        type: 'danger',
                        message: 'businessSetup:' + error.message + '-invalid'
                    });
                }).finally(function(){
                    $activityIndicator.stopAnimating();
                });
    .controller('coachesCtrl', ['$scope', 'CRUDFactoryService', '$state',
        function ($scope, CRUDFactoryService, $state) {
        
        $scope.editItem = function(coach){
            _.pull($scope.itemList, coach);
            $scope.itemCopy = angular.copy(coach);
            $scope.item = coach;
            $scope.weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        };

        $scope.createItem = function(){
            CRUDFactoryService.create('createCoach', $scope);
        };

        $scope.cancelEdit = function(){
            CRUDFactoryService.cancelEdit($scope);
        };

        $scope.saveItem = function(coach){
            var formValid = validateForm();
            if(formValid){
                CRUDFactoryService.update('saveCoach', $scope, coach);  
            }
        };

        var validateForm = function(){
            var valid = $scope.itemForm.$valid;

            if(!valid){
                var errors = $scope.itemForm.$error;
                _.forEach(errors, function(error, key){
                    var errorMessage = error[0] && error[0].$name ? error[0].$name : key;
                    $scope.addAlert({
                        type: 'warning',
                        message: 'businessSetup:' + errorMessage + '-invalid'
                    });
                });
            } else {
                valid = checkDuplicateNames(valid);
            }
            return valid;
        };

        var checkDuplicateNames = function(valid){
            var firstName = $scope.item.firstName;
            var lastName = $scope.item.lastName;
            if( _.find($scope.itemList, {firstName: firstName,lastName: lastName}) ){
                $scope.addAlert({
                    type: 'warning',
                    message: 'businessSetup:name-already-exists'
                });
                valid = false;
            }
            return valid;
        };

        $scope.$on('$stateChangeStart', function(event, toState){
            if( toState.name === "businessSetup.services" ){
                if(!$scope.itemList || $scope.itemList.length <= 0){
                    event.preventDefault();
                    //show bootstrap message
                    $scope.addAlert({
                        type: 'warning',
                        message: 'businessSetup:add-coach-warning'
                    });
                }
            }
        });

        CRUDFactoryService.get('getCoaches', $scope);
    }]);