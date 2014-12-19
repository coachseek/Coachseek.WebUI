/* Controllers */
angular.module('app.controllers', [])
    .controller('appCtrl', ['$rootScope', '$timeout',
        function ($rootScope, $timeout) {
            // TODO - add ability to remove alerts by view
            $rootScope.addAlert = function(alert){
                var addAlert = true;

                _.forEach($rootScope.alerts, function(existingAlert){
                    if(existingAlert.message === alert.message){
                        addAlert = false;
                        return addAlert;
                    }
                });

                if( addAlert ){
                    $rootScope.alerts.push(alert);
                    if(alert.type === 'success'){
                        $timeout(function(){
                            _.pull($rootScope.alerts, alert);
                        }, 2500);
                    }
                }
            };
            
            $rootScope.closeAlert = function(index) {
                $rootScope.alerts.splice(index, 1);
            };

            $rootScope.removeAlerts = function(alerts){
                $rootScope.alerts = [];
            };
        }]);