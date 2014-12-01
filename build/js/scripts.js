angular.module("coachSeekApp.controllers",[]),angular.module("coachSeekApp.directives",[]).directive("activityIndicator",function(){return{replace:!0,templateUrl:"coachSeekApp/partials/activityIndicator.html"}}),angular.module("coachSeekApp",["ui.bootstrap","ngRoute","jm.i18next","coachSeekApp.controllers","coachSeekApp.services","coachSeekApp.directives","workingHours","locations","ngActivityIndicator"]).config(["$routeProvider",function(a){a.otherwise({redirectTo:"/"})}]).config(["$i18nextProvider",function(a){a.options={lng:"en",fallbackLng:"en",ns:{namespaces:["coachSeekApp","workingHours"],defaultNs:"coachSeekApp"},resGetPath:"modules/__ns__/i18n/__lng__/__ns__.json"}}]),angular.module("coachSeekApp.services",[]).factory("coachSeekAPIService",["$http","$q","$timeout",function(a,b,c){var d={},e=new Date;e.setHours(9),e.setMinutes(0);var f=new Date;return f.setHours(17),f.setMinutes(0),d.getCoaches=function(){this.deferred=b.defer();var a=this;return c(function(){a.deferred.resolve({})},_.random(500,5500)),this.deferred.promise},d.saveCoach=function(){var a=b.defer();return a.resolve("DATA"),a.promise},d.createCoach=function(){var a=b.defer();return a.resolve({businessId:"8786bcd0-3b14-4f7b-92db-198527a5b949",id:null,firstName:"NEWEST",lastName:"USER",email:"aaron.smith@example.com",phone:"021 99 88 77",workingHours:{monday:{isAvailable:!0,startTime:e,finishTime:f},tuesday:{isAvailable:!0,startTime:e,finishTime:f},wednesday:{isAvailable:!0,startTime:e,finishTime:f},thursday:{isAvailable:!0,startTime:e,finishTime:f},friday:{isAvailable:!0,startTime:e,finishTime:f},saturday:{isAvailable:!1,startTime:e,finishTime:f},sunday:{isAvailable:!1,startTime:e,finishTime:f}}}),a.promise},d}]),angular.module("locations.controllers",[]).controller("locationsCtrl",["$scope",function(){console.log("LOCATIONS CTRL")}]),angular.module("locations",["locations.controllers"]).config(["$routeProvider",function(a){a.when("/registration/locations",{templateUrl:"locations/partials/locations.html",controller:"locationsCtrl"})}]),describe("WorkingHours Module",function(){var a,b,c="workingHours/partials/coachListView.html";beforeEach(function(){b=$injector.get("coachSeekAPIService"),a=$rootScope.$new()}),describe("workingHours routes",function(){it("should map routes to controllers",function(){expect($route.routes["/registration/coach-list"].controller).to.equal("coachListCtrl")}),it("should map routes to templates",function(){expect($route.routes["/registration/coach-list"].templateUrl).to.equal("workingHours/partials/coachListView.html")}),it("should default to root",function(){expect($route.routes[null].redirectTo).to.equal("/")})}),describe("when the page loads",function(){var d,e,f,g;beforeEach(function(){g=this,g.let("coaches",function(){return[]}),f=sinon.stub(b,"getCoaches",function(){return $.Deferred().resolve(g.coaches)})}),afterEach(function(){f.restore()}),it("should attempt to call getCoaches",function(){createViewWithController(a,c,"coachListCtrl"),expect(f).to.be.calledOnce}),describe("and there are no coaches",function(){var d;beforeEach(function(){d=sinon.stub(b,"createCoach",function(){return $.Deferred().resolve([{}])}),createViewWithController(a,c,"coachListCtrl")}),afterEach(function(){d.restore()}),it("should not show the coach list view",function(){expect($testRegion.find(".coach-list-view").hasClass("ng-hide")).to.be.true}),it("should show the coach edit view",function(){expect($testRegion.find(".coach-edit-view").hasClass("ng-hide")).to.be.false}),it("should attempt to create a coach",function(){expect(d).to.be.calledOnce})}),describe("and there are one or more coaches",function(){beforeEach(function(){g.let("coaches",function(){return[{},{}]}),createViewWithController(a,c,"coachListCtrl"),d=$testRegion.find(".coach-list-view"),e=$testRegion.find(".coach-edit-view")}),it("should show the coach list view",function(){expect(d.hasClass("ng-hide")).to.be.false}),it("should have as many list entries as coaches",function(){expect(d.find(".coach-details").length).to.equal(g.coaches.length)}),it("should not show the coach edit view",function(){expect(e.hasClass("ng-hide")).to.be.true}),describe("when clicking the edit button",function(){beforeEach(function(){d.find(".edit-coach").first().trigger("click")}),it("should not show the coach list view",function(){expect(d.hasClass("ng-hide")).to.be.true}),it("should show the coach edit view",function(){expect(e.hasClass("ng-hide")).to.be.false}),describe("when clicking the save button",function(){var a;beforeEach(function(){a=sinon.stub(b,"saveCoach",function(){return $.Deferred().resolve([{}])}),e.find(".save-coach").first().trigger("click")}),afterEach(function(){a.restore()}),it("should attempt to save coach",function(){expect(a).to.be.calledOnce}),it("should show the coach list view",function(){expect(d.hasClass("ng-hide")).to.be.false}),it("should not show the coach edit view",function(){expect(e.hasClass("ng-hide")).to.be.true})})})})}),describe("time slot derective",function(){beforeEach(function(){a.weekdays=["monday","tuesday","wednesday"],a.coach={firstName:"NEWEST",lastName:"USER",email:"aaron.smith@example.com",phone:"021 99 88 77",workingHours:{monday:{isAvailable:!0},tuesday:{isAvailable:!1},wednesday:{isAvailable:!0}}},createDirective(a,"<div><time-slot></time-slot></div>")}),it("should have as many entries as days",function(){var b=$testRegion.find(".workingHours-weekday");expect(b.length).to.equal(_.size(a.coach.workingHours))}),describe("when a day is available",function(){it("should enable the time spinner",function(){var a=$testRegion.find(".workingHours-weekday").first();expect(a.find(".workingHours-timepicker").attr("disabled")).to.equal(void 0)})}),describe("when a day is unavailable",function(){it("should disable the time spinner",function(){var a=$testRegion.find(".workingHours-weekday:nth-child(2)");expect(a.find(".workingHours-timepicker").attr("disabled")).to.equal("disabled")})}),describe("when clicking on the toggle available switch",function(){var b;beforeEach(function(){var a=$testRegion.find(".workingHours-weekday").first();b=a.find(".toggle-switch"),b.trigger("click")}),it("should set isAvailable to false",function(){expect(a.coach.workingHours.monday.isAvailable).to.be.false}),describe("when clicking on the toggle available switch again",function(){it("should set isAvailable to true",function(){b.trigger("click"),expect(a.coach.workingHours.monday.isAvailable).to.be.true})})})})}),angular.module("workingHours.controllers",[]).controller("coachListCtrl",["$scope","coachSeekAPIService","$location","$activityIndicator",function(a,b,c,d){a.editCoach=function(b){a.coach=b,a.weekdays=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"]},a.createCoach=function(){d.startAnimating(),b.createCoach().then(function(b){d.stopAnimating(),a.coachList.push(b),a.editCoach(b)},function(a){throw new Error(a)})},a.save=function(c){d.startAnimating(),a.coach=null,b.saveCoach(c.coachId).then(function(){d.stopAnimating()},function(a){throw new Error(a)})},d.startAnimating(),b.getCoaches().then(function(b){d.stopAnimating(),b.length?a.coachList=b:(a.coachList=[],a.createCoach())},function(a){throw new Error(a)})}]),angular.module("workingHours.directives",[]).directive("timeSlot",function(){return{replace:!0,templateUrl:"workingHours/partials/timeSlot.html"}}),angular.module("workingHours",["toggle-switch","workingHours.controllers","workingHours.directives"]).config(["$routeProvider",function(a){a.when("/registration/coach-list",{templateUrl:"workingHours/partials/coachListView.html",controller:"coachListCtrl"})}]).constant("timepickerConfig",{hourStep:1,minuteStep:15,showMeridian:!1});