describe('ngEsc directive', function(){
    
    var scope;
    beforeEach(function(){
        scope = $rootScope.$new();
        createDirective(scope, '<form ng-esc="someFunction()"></form>');
    });
    it('should call the function when the enter key is pressed', function(done){

        scope.someFunction = function(){
            done();
        };

        var e = jQuery.Event("keydown");
        e.which = 27; // # Some key code value
        $testRegion.find('form').trigger(e);
    });
});