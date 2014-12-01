var $testRegion,
    $controller,
    $templateCache,
    $compile,
    $rootScope,
    $injector,
    $route, 
    createViewWithController,
    createDirective;

beforeEach(module('coachSeekApp'));

beforeEach(inject(function(_$controller_, _$templateCache_, _$compile_, _$rootScope_, _$injector_, _$route_) { 
    $controller = _$controller_;
    $templateCache = _$templateCache_;
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $injector = _$injector_;
    $route = _$route_;



    createViewWithController = function(scope, templateUrl, ctrlName) {
        if(!scope || !templateUrl || !ctrlName){
            throw new Error('Scope, directive, or templateUrl not defined!');
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

    this.let = function(propName, getter) {
        var _lazy;
        Object.defineProperty(this, propName, { 
            get: function() { 
                if (!_lazy) { 
                    _lazy = getter.call(this); 
                } 

                return _lazy; 
            }, 
            set: function() {}, 
            enumerable: true, 
            configurable: true 
        }); 
    };

    $testRegion = $('<div></div>');
}));


afterEach(function(){
    $testRegion.remove();
});