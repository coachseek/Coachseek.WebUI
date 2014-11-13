"use strict";!function(){var a=angular.module("coachSeekApp",["ngRoute","xeditable","coachSeekControllers","coachSeekDirectives"]);a.config(["$routeProvider",function(a){a.when("/",{templateUrl:"partials/business-registration.html",controller:"BusinessRegCtrl"}).when("/business/registration",{templateUrl:"partials/business-registration.html",controller:"BusinessRegCtrl"}).when("/:domain/business/locations",{templateUrl:"partials/business-locations.html",controller:"LocationCtrl"}).when("/:domain/business/coaches",{templateUrl:"partials/business-coaches.html",controller:"CoachCtrl"}).otherwise({redirectTo:"/business"})}]),a.run(function(a){a.theme="bs3"})}(),function(){var a=angular.module("coachSeekControllers",[]);a.controller("BusinessRegCtrl",["$scope","$http","$location","$rootScope",function(a,b,c,d){function e(a,b){return-1!==a.indexOf(b,a.length-b.length)}a.businessReg={},a.business={},a.registerBusiness=function(){a.business={},a.error={},b.post("/api/BusinessRegistration",a.businessReg).success(function(a){d.business=a,c.path("/"+a.domain+"/business/locations")}).error(function(b){a.error=b[0],e(b[0].field,"email")&&a.businessRegForm.email.$setValidity("email",!1)})}}]),a.controller("LocationCtrl",["$scope","$filter","$http","$rootScope","$routeParams",function(a,b,c,d,e){function f(){g()&&c.get("/api/Businesses/"+e.domain).success(function(a){n(a)}).error(function(b){a.error=b})}function g(){return void 0==d.business}function h(a){return void 0===a}function i(a){return a=a||"",""==a?"Location name is required.":k(a)?"Location '"+a+"' already exists.":!0}function j(a,b){return a=a||"",""==a?"Location name is required.":k(a,b)?"Location '"+a+"' already exists.":!0}function k(b,c){c=c||"";for(var d=0;d<a.locations.length;d++)if(a.locations[d].id!=c&&a.locations[d].name.toLowerCase()==b.toLowerCase())return!0;return!1}function l(a,b){var c={};return c.businessId=d.business.id,c.id=b,c.name=a.name,c}function m(b){a.inserted.id=b.id,a.locations.push(a.inserted)}function n(b){d.business=b,a.locations=b.locations}a.locations=[],f(),a.checkLocation=function(a,b){return h(b)?i(a):j(a,b)},a.saveLocation=function(b,d){var e=l(b,d);return c.post("/api/Locations",e).success(function(a){h(d)&&m(a)}).error(function(b){a.error=b})},a.addLocation=function(){a.inserted={name:""},a.locations.push(a.inserted)}}]),a.controller("CoachCtrl",["$scope","$filter","$http","$rootScope","$routeParams",function(a,b,c,d,e){function f(){g()&&c.get("/api/Businesses/"+e.domain).success(function(a){h(a)}).error(function(b){a.error=b})}function g(){return void 0==d.business}function h(b){d.business=b,a.coaches=b.coaches}a.coaches=[],f(),a.saveCoach=function(b,e){var f={};return f.businessId=d.business.id,f.id=e,f.firstName=b.firstName,f.lastName=b.lastName,f.email=b.email,f.phone=b.phone,c.post("/api/Coaches",f).success(function(a){h(a)}).error(function(b){a.error=b})},a.addCoach=function(){a.inserted={firstName:"",lastName:""},a.coaches.push(a.inserted)}}])}(),function(){var a=angular.module("coachSeekDirectives",[]);a.directive("restrict",function(a){return{restrict:"A",require:"ngModel",link:function(b,c,d){b.$watch(d.ngModel,function(c){c&&a(d.ngModel).assign(b,c.toLowerCase().replace(new RegExp(d.restrict,"g"),"").replace(/\s+/g,""))})}}}),a.directive("focus",function(a){return{scope:{trigger:"@focus"},link:function(b,c){b.$watch("trigger",function(b){"true"===b&&a(function(){c[0].focus()})})}}}),a.directive("goClick",function(a){return function(b,c,d){var e;d.$observe("goClick",function(a){e=a}),c.bind("click",function(){b.$apply(function(){a.path(e)})})}})}();