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
    loginModalStub;

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

    var loginModal = $injector.get('$modal');
    loginModalStub = this.sinon.stub(loginModal, 'open', function(){
        var deferred = $q.defer();
        deferred.resolve("User");
        return {result: deferred.promise};
    });

    $testRegion = $('<div></div>');
    $rootScope.$digest();    
}));


afterEach(function(){
    this.sinon.restore();

    $testRegion.remove();
});