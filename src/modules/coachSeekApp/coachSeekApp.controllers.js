/* Controllers */
angular.module('coachSeekApp.controllers', [])
    .controller('appCtrl', ['$rootScope',
        function ($rootScope) {
            //TODO add ability to remove alerts by view
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
            
            $rootScope.closeAlert = function(index) {
                $rootScope.alerts.splice(index, 1);
            }

            $rootScope.removeAlerts = function(alerts){
                $rootScope.alerts = [];
            }
        }]);