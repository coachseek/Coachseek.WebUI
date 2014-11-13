'use strict';

/* App Module */

(function(){

var app = angular.module('coachSeekApp', ['ngRoute', 'xeditable', 'coachSeekControllers', 'coachSeekDirectives']);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/business-registration.html',
        controller: 'BusinessRegCtrl'
      }).
      when('/business/registration', {
        templateUrl: 'partials/business-registration.html',
        controller: 'BusinessRegCtrl'
      }).
      when('/:domain/business/locations', {
          templateUrl: 'partials/business-locations.html',
        controller: 'LocationCtrl'
      }).
      when('/:domain/business/coaches', {
          templateUrl: 'partials/business-coaches.html',
          controller: 'CoachCtrl'
      }).
      otherwise({
        redirectTo: '/business'
      });
      
    // use the HTML5 History API
		//$locationProvider.html5Mode(true);
  }]);

app.run(function (editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

})();

'use strict';

/* Controllers */

(function(){

var coachSeekControllers = angular.module('coachSeekControllers', []);


coachSeekControllers.controller('BusinessRegCtrl', ['$scope', '$http', '$location', '$rootScope', function ($scope, $http, $location, $rootScope) {
  $scope.businessReg = {};
  $scope.business = {};

  $scope.registerBusiness = function () {
      $scope.business = {};
      $scope.error = {};

      $http.post('/api/BusinessRegistration', $scope.businessReg)
           .success(function (business) {
               $rootScope.business = business;
               $location.path("/" + business.domain + "/business/locations");
          })
           .error(function (errors) {
               $scope.error = errors[0];
               if (endsWith(errors[0].field, "email"))
                   $scope.businessRegForm.email.$setValidity("email", false);
           });
  };
  
  function endsWith(str, endString) {
      return str.indexOf(endString, str.length - endString.length) !== -1;
  }

}]);


coachSeekControllers.controller('LocationCtrl', ['$scope', '$filter', '$http', '$rootScope', '$routeParams', function ($scope, $filter, $http, $rootScope, $routeParams) {

    $scope.locations = [];

    reloadBusiness();

    function reloadBusiness() {
        if (pageWasReloaded()) {
            $http.get('/api/Businesses/' + $routeParams.domain)
               .success(function (business) {
                   refreshBusinessAndLocations(business);
               })
               .error(function (error) {
                   $scope.error = error;
               });
        }
    };

    function pageWasReloaded() {
        return $rootScope.business == undefined;
    }

    $scope.checkLocation = function (name, id) {
        if (isNewLocation(id))
            return checkNewLocation(name);
        

        return checkExistingLocation(name, id);
    };

    function isNewLocation(id) {
        return id === undefined;
    }

    function checkNewLocation(name) {
        name = name || "";
        if (name == "")
            return "Location name is required.";
        if (containsLocationName(name))
            return "Location '" + name + "' already exists.";
        
        return true;
    }

    function checkExistingLocation(name, id) {
        name = name || "";
        if (name == "")
            return "Location name is required.";
        if (containsLocationName(name, id)) {
            return "Location '" + name + "' already exists.";
        }
        return true;
    }

    function containsLocationName(name, excludeId) {
        excludeId = excludeId || "";
        for (var i = 0; i < $scope.locations.length; i++) {
            if ($scope.locations[i].id == excludeId)
                continue;
            if ($scope.locations[i].name.toLowerCase() == name.toLowerCase())
                return true;
        }
        return false;
    }

    $scope.saveLocation = function (data, id) {
        var location = buildLocationForSave(data, id);

        return $http.post('/api/Locations', location)
           .success(function (savedLocation) {
               if (isNewLocation(id)) {
                   updateLocationInArray(savedLocation);
               }
           })
           .error(function (error) {
               $scope.error = error;
           });
    };

    function buildLocationForSave(data, id) {
        var location = {};
        location.businessId = $rootScope.business.id;
        location.id = id;
        location.name = data.name;

        return location;
    }

    function updateLocationInArray(savedLocation) {
        $scope.inserted.id = savedLocation.id;
        $scope.locations.push($scope.inserted);
    }

    function refreshBusinessAndLocations(business) {
        $rootScope.business = business;
        $scope.locations = business.locations;
    }

    $scope.addLocation = function () {
        $scope.inserted = { name: '' };
        $scope.locations.push($scope.inserted);
    };
}]);


coachSeekControllers.controller('CoachCtrl', ['$scope', '$filter', '$http', '$rootScope', '$routeParams', function ($scope, $filter, $http, $rootScope, $routeParams) {

    $scope.coaches = [];

    reloadBusiness();

    function reloadBusiness() {
        if (pageWasReloaded()) {
            $http.get('/api/Businesses/' + $routeParams.domain)
               .success(function (business) {
                   refreshBusinessAndCoaches(business);
               })
               .error(function (error) {
                   $scope.error = error;
               });
        }
    };

    function pageWasReloaded() {
        return $rootScope.business == undefined;
    }

    $scope.saveCoach = function (data, id) {
        var coach = {};
        coach.businessId = $rootScope.business.id;
        coach.id = id;
        coach.firstName = data.firstName;
        coach.lastName = data.lastName;
        coach.email = data.email;
        coach.phone = data.phone;

        return $http.post('/api/Coaches', coach)
           .success(function (business) {
               refreshBusinessAndCoaches(business);
            })
           .error(function (error) {
               $scope.error = error;
           });
    };

    function refreshBusinessAndCoaches(business) {
        $rootScope.business = business;
        $scope.coaches = business.coaches;
    }

    $scope.addCoach = function () {
        $scope.inserted = { firstName: '', lastName: '' };
        $scope.coaches.push($scope.inserted);
    };
}]);

})();
'use strict';

/* Directives */

(function(){

var coachSeekDirectives = angular.module('coachSeekDirectives', []);

coachSeekDirectives.directive('restrict', function($parse) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, iElement, iAttrs, controller) {
      scope.$watch(iAttrs.ngModel, function(value) {
        if (!value) {
          return;
        }
        $parse(iAttrs.ngModel).assign(scope, value.toLowerCase().replace(new RegExp(iAttrs.restrict, 'g'), '').replace(/\s+/g, ''));
      });
    }
  }
});

coachSeekDirectives.directive('focus', function($timeout) {
  return {
    scope : {
      trigger : '@focus'
    },
    link : function(scope, element) {
      scope.$watch('trigger', function(value) {
        if (value === "true") {
          $timeout(function() {
            element[0].focus();
          });
        }
      });
    }
  };
}); 

coachSeekDirectives.directive('goClick', function ($location) {
    return function ( scope, element, attrs ) {
        var path;

        attrs.$observe( 'goClick', function (val) {
            path = val;
        });

        element.bind( 'click', function () {
            scope.$apply( function () {
                $location.path( path );
            });
        });
    };
});

})();