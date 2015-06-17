describe('Toggle Switch Directive', function(){
	let('property', function(){
		return {
			testProperty: true,
			positive: "BOOBS",
			negative: "NO BOOBS"
		}
	});

	var $toggleSwitch;
	beforeEach(function(){
	    scope = $rootScope.$new();
	    scope.property = this.property;
	    createDirective(scope, '<toggle-switch property="property.testProperty" positive="property.positive" negative="property.negative"></toggle-switch>');
	    $toggleSwitch = $testRegion.find('toggle-switch');
	});

	it('should set the checkbox to the testProperty', function(){
		expect($toggleSwitch.find('input').attr('checked') === 'checked').to.equal(this.property.testProperty);
	});
	// it('should display the correct positive message', function(){
	// 	console.log($toggleSwitch.find('label').val())
	// 	expect($toggleSwitch.find('label').val()).to.equal(this.property.positive)
	// });
	describe('when clicking on the toggle switch', function(){
		beforeEach(function(){
			$toggleSwitch.find('.toggle-bg').trigger('click');
		});
		it('should switch the testProperty', function(){
			expect(scope.property.testProperty).to.be.false;
		});
		// it('should display the correct negative message', function(){
		// 	console.log($toggleSwitch.find('label').val())
		// 	expect($toggleSwitch.find('label').val()).to.equal(this.property.negative)
		// });
	});
});