angular.module('coachServices',[])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/registration/coach-services', {
            templateUrl: 'coachServices/partials/coachServices.html'
            // controller: 'coachServicesCtrl'
        });
    }]);