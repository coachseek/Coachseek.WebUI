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