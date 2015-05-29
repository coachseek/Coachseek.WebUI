var $testRegion,
    $controller,
    $compile,
    $rootScope,
    $injector,
    $q,
    $state,
    $timeout,
    createViewWithController,
    createDirective,
    Intercom,
    loginModalStub,
    locationStub,
    clock;

beforeEach(module('app'));

//stop $urlRouterProvider from running otherwise()/loading default views
beforeEach(module(function($urlRouterProvider) {
  $urlRouterProvider.deferIntercept();
}));

beforeEach(inject(function(_$controller_, _$compile_, _$rootScope_, _$injector_, _$q_, _$state_, _$timeout_) { 
    $controller = _$controller_;
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $injector = _$injector_;
    $q = _$q_;
    $state = _$state_;
    $timeout = _$timeout_;

    // these two lines are here so we can use sinon fakeTimers to move debounce/throttle forward
    clock = sinon.useFakeTimers();
    _ = _.runInContext();

    $controller('appCtrl', {
        $scope: $rootScope
    });

    createViewWithController = function(scope, templateUrl, ctrlName) {
        if(!scope || !templateUrl || !ctrlName){
            throw new Error('Scope, templateUrl, or ctrlName not defined!');
        } else {
            var html = $injector.get('$templateCache').get(templateUrl);
            $controller(ctrlName, {
                $scope: scope
            });

            var view = $compile(html)(scope);
            scope.$digest();
            $testRegion.append(view);
        }
    };

    createDirective = function(scope, directive){
        if(!scope ||  !directive){
            throw new Error('Scope or directive not defined!');
        } else {
            var element = angular.element(directive);
            var view = $compile(element)(scope);

            scope.$digest();
            $testRegion.append(view);
        }
    };

    Intercom = function(){};

    this.sinon = sinon.sandbox.create();

    loginModalStub = this.sinon.stub($injector.get('$modal'), 'open', function(){
        var deferred = $q.defer();
        deferred.resolve({email: 'user@test.com'});
        return {result: deferred.promise};
    });

    locationStub = this.sinon.stub($injector.get('$location'), 'host', function(){
        return 'app';
    });

    $testRegion = $('<div></div>');
    $rootScope.$digest();    
}));


afterEach(function(){
    this.sinon.restore();

    $testRegion.remove();
    $('.modal-backdrop').remove();
    $('.modal').remove();
});