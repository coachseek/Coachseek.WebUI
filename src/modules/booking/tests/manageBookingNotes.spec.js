describe('manageBookingNotes Directive', function(){

    let('savePromise', function(){
        var deferred = $q.defer();
        deferred.resolve();
        return {$promise: deferred.promise};
    });

    let('notes', function(){
        return [{
            type: 'customer',
            name: 'Note 1',
            isRequired: false
        },{
            type: 'customer',
            name: 'Note 2',
            isRequired: true
        }]
    });

    let('getNotesPromise', function(){
        var deferred = $q.defer();
        deferred.resolve(this.notes);
        return {$promise: deferred.promise};
    });

    var getNotesStub;
    beforeEach(function(){
        var self = this;
        self.savePromise = this.savePromise;
        var coachSeekAPIService = $injector.get('coachSeekAPIService');
        saveStub = this.sinon.stub(coachSeekAPIService, 'save', function(){
            return self.savePromise;
        });
        getNotesStub = this.sinon.stub(coachSeekAPIService, 'query', function(){
            return self.getNotesPromise;
        });
        createDirective($rootScope.$new(), '<manage-booking-notes></manage-booking-notes>');
    })
    it('should make a call to get custom field templates', function(){
        expect(getNotesStub).to.be.calledWith({section: 'CustomFields', type: 'customer'});
    });
    it('should hide the new note form', function(){
        expect($testRegion.find('.new-booking-note-container').hasClass('ng-hide')).to.be.true;
    });
    it('should load as many notes templates as are returned in the GET call', function(){
        expect(_.size($testRegion.find('booking-note-template'))).to.equal(_.size(this.notes))
    });
    describe('while loading the names', function(){
        let('getNotesPromise', function(){
            var deferred = $q.defer();
            return {$promise: deferred.promise};
        });
        it('should show the loading animation', function(){
            expect($testRegion.find('.booking-admin-booking-notes loading-animation').hasClass('ng-hide')).to.be.false;
        });
    });
    describe('when clicking on the add note button', function(){
        beforeEach(function(){
            $testRegion.find('.show-add-note button').trigger('click');
        });
        it('should show the new note form', function(){
            expect($testRegion.find('.new-booking-note-container').hasClass('ng-hide')).to.be.false;
        });
        describe('and then clicking the cancel button', function(){
            beforeEach(function(){
                $testRegion.find('.note-name i.fa-times').trigger('click');
            });
            it('should hide the new note form', function(){
                expect($testRegion.find('.new-booking-note-container').hasClass('ng-hide')).to.be.true;
            });
        });
        describe('when saving the new note form', function(){
            describe('and the form is invalid', function(){
                beforeEach(function(){
                    $testRegion.find('.new-note-save-container button.save-button').trigger('click');
                });
                it('should not save the note template', function(){
                    expect(saveStub).to.not.be.called;
                });
            });
            describe('and the form is valid', function(){
                var templateName;
                beforeEach(function(){
                    templateName = "test Name";
                    $testRegion.find('.note-name input').val(templateName).trigger('input');
                    $testRegion.find('.new-note-save-container button.save-button').trigger('click');
                });
                it('should save the note template', function(){
                    expect(saveStub).to.be.calledWith({section: "CustomFields"}, {type: 'customer', name: templateName, isRequired: false,});
                });
                it('should hide the new note form', function(){
                    expect($testRegion.find('.new-booking-note-container').hasClass('ng-hide')).to.be.true;
                });
            });
        });
    });

});