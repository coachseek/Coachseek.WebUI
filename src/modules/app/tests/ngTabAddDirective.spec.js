describe('ngTabAdd directive', function(){
    
    var scope;
    beforeEach(function(){
        scope = $rootScope.$new();
        createDirective(scope, '<div ng-tab-add="someFunction()"></div>');

        $testRegion.appendTo('body');
    });
    it('should call the function when the enter key is pressed', function(done){

        scope.someFunction = function(){
            done();
        };

        var e = jQuery.Event("keydown");
        e.which = 9; // # Some key code value
        $testRegion.trigger(e);
    });
});