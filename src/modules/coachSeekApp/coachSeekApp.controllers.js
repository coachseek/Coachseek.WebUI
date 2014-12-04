/* Controllers */
angular.module('coachSeekApp.controllers', [])
    .controller('appCtrl', ['$rootScope','$scope', '$location',
        function ($rootScope, $scope, $location) {
            $rootScope.addAlert = function(alert){
                var addAlert = true;;

                _.forEach($rootScope.alerts, function(existingAlert){
                    if(existingAlert.message === alert.message){
                        return addAlert = false;
                    }
                });

                if( addAlert ){
                    $rootScope.alerts.push(alert);
                }
            }

            $rootScope.removeAlerts = function(alerts){
                $rootScope.alerts = [];
            }
        }]);