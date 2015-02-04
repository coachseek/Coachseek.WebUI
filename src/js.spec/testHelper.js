var $testRegion,
    $controller,
    $templateCache,
    $compile,
    $rootScope,
    $injector,
    $location,
    $q,
    $state,
    $timeout,
    createViewWithController,
    createDirective;

beforeEach(module('app'));

beforeEach(inject(function(_$controller_, _$templateCache_, _$compile_, _$rootScope_, _$injector_, _$location_, _$q_, _$state_, _$timeout_) { 
    $controller = _$controller_;
    $templateCache = _$templateCache_;
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $injector = _$injector_;
    $location = _$location_;
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
            var html = $templateCache.get(templateUrl);
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

    this.sinon = sinon.sandbox.create();

    $testRegion = $('<div></div>');
}));


afterEach(function(){
    this.sinon.restore();

    $testRegion.remove();
});