describe('ngEnter directive', function(){
    
    var scope;
    beforeEach(function(){
        scope = $rootScope.$new();
        createDirective(scope, '<form ng-enter="someFunction()"></form>');
    });
    it('should call the function when the enter key is pressed', function(done){

        scope.someFunction = function(){
            done();
        };

        var e = jQuery.Event("keydown");
        e.which = 13; // # Some key code value
        $testRegion.find('form').trigger(e);
    });
});