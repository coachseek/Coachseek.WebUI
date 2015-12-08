describe('exportToCsv Directive', function(){
	let('filename', function(){
		return 'boobs.csv'
	});

	let('exportData', function(){
		return [{
				one: 1,
				two: 2,
				three: 3
			}, {
				one: 3,
				two: 2,
				three: 1
			}
		];
	});

	let('keys', function(){
		return ['one', 'two', 'three'];
	});

	var scope, clickStub, removeStub;
	beforeEach(function(){
	    scope = $rootScope.$new();
	    scope.filename = this.filename;
	    scope.exportData = this.exportData;
	    scope.keys = this.keys;

	    clickStub = this.sinon.stub(HTMLElement.prototype, 'click');
	    removeStub = this.sinon.stub($.fn, 'remove');

	    createDirective(scope, '<export-to-csv export-data="exportData" filename="filename" keys="keys"></export-to-csv>');
	});
	describe('when clicking on the export-to-csv button', function(){
		var $link;
		beforeEach(function(){
			$testRegion.find('export-to-csv button').trigger('click');
			$link = $('.export-csv');
		});
		afterEach(function(){
			removeStub.restore();
			$link.remove();
		});
		it('should set the download attribute on the link', function(){
			expect($link.attr('download')).to.equal(this.filename)
		});
		it('should set the href attribute on the link', function(){
			expect($link.attr('href')).to.equal('data:attachment/csv,one,two,three%0A1,2,3%0A3,2,1%0A')
		});
		it('should attempt to click on the link', function(){
			expect(clickStub).to.be.called;
		});
		it('should remove the link from the DOM', function(){
			expect(removeStub).to.be.calledOnce;
		});
		describe('when only certain keys are set', function(){
			let('keys', function(){
				return ['two'];
			});
			it('should set the href attribute on the link', function(){
				expect($link.attr('href')).to.equal('data:attachment/csv,two%0A2%0A2%0A')
			});
		});
		describe('when no filename is set', function(){
			let('filename', function(){
				return null;
			});
			it('should set the download attribute on the link', function(){
				expect($link.attr('download')).to.equal('export.csv')
			});
		});
		describe('when no exportData is set', function(){
			let('exportData', function(){
				return null;
			});
			it('should not create a download link', function(){
				expect($link.length).to.equal(0)
			});
		});
	});
});