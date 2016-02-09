describe('Booking Note Template directive', function(){

    let('note', function(){
        return {
            type: 'customer',
            name: 'Hot Ting',
            key: 'hotting',
            isRequired: false,
            isActive: true
        };
    });

    var scope, $noteTemplate, saveStub;
    beforeEach(function(){
        scope = $rootScope.$new();
        scope.note = this.note;

        saveStub = this.sinon.stub($injector.get('coachSeekAPIService'), 'save', function(){
            var deferred = $q.defer();
            deferred.resolve();
            return {$promise: deferred.promise};
        });

        createDirective(scope, '<booking-note-template></booking-note-template>');
        $noteTemplate = $testRegion.find('booking-note-template');
    });
    it('should set the correct state on the template', function(){
        expect($noteTemplate.find('.is-required input').prop('checked')).to.equal(this.note.isRequired);
        expect($noteTemplate.find('.note-name .display-name').text()).to.equal(this.note.name);
        expect($noteTemplate.find('toggle-switch input').prop('checked')).to.equal(this.note.isActive);
    });
    it('should initial hide the edit form and show the display name', function(){
        expect($noteTemplate.find('.edit-name-container').hasClass('ng-hide')).to.be.true;
        expect($noteTemplate.find('.display-name-container').hasClass('ng-hide')).to.be.false;
    });
    describe('when clicking on the display name container', function(){
        beforeEach(function(){
            $noteTemplate.find('.display-name-container').trigger('click');
        });
        it('should show the edit form and hide the display name', function(){
            expect($noteTemplate.find('.edit-name-container').hasClass('ng-hide')).to.be.false;
            expect($noteTemplate.find('.display-name-container').hasClass('ng-hide')).to.be.true;
        });
        describe('when clicking the save button', function(){
            beforeEach(function(){
                $noteTemplate.find('.edit-name-container i.fa-save').trigger('click');
            });
            describe('and the input is valid', function(){
                it('should attempt to save the note', function(){
                    expect(saveStub).to.be.calledWith({ section: "CustomFields" }, this.note);
                });
            });
            describe('and the input is invalid', function(){
                let('note', function(){
                    return {
                        type: 'customer',
                        name: '', //name invalid
                        key: 'hotting',
                        isRequired: false,
                        isActive: true
                    };
                });
                it('should NOT attempt to save the note', function(){
                    expect(saveStub).to.not.be.called;
                });
            });
        });
        describe('when hitting enter button', function(){
            beforeEach(function(){
                var e = jQuery.Event("keydown");
                e.which = 13; // # Some key code value
                $noteTemplate.find('.edit-name-container form').trigger(e);
            });
            describe('and the input is valid', function(){
                it('should attempt to save the note', function(){
                    expect(saveStub).to.be.calledWith({ section: "CustomFields" }, this.note);
                });
            });
            describe('and the input is invalid', function(){
                let('note', function(){
                    return {
                        type: 'customer',
                        name: '', //name invalid
                        key: 'hotting',
                        isRequired: false,
                        isActive: true
                    };
                });
                it('should NOT attempt to save the note', function(){
                    expect(saveStub).to.not.be.called;
                });
            });
        });
        describe('when blurring the input', function(){
            beforeEach(function(){
                $noteTemplate.find('.edit-name-container form input').trigger('blur');
            });
            describe('and the input is valid', function(){
                it('should attempt to save the note', function(){
                    expect(saveStub).to.be.calledWith({ section: "CustomFields" }, this.note);
                });
            });
            describe('and the input is invalid', function(){
                let('note', function(){
                    return {
                        type: 'customer',
                        name: '', //name invalid
                        key: 'hotting',
                        isRequired: false,
                        isActive: true
                    };
                });
                it('should NOT attempt to save the note', function(){
                    expect(saveStub).to.not.be.called;
                });
            });
        });
        describe('when hitting esc', function(){
            beforeEach(function(){
                $noteTemplate.find('.edit-name-container form input').val('BOOBS').trigger('input');
                var e = jQuery.Event("keydown");
                e.which = 27; // # Some key code value
                $noteTemplate.find('.edit-name-container form').trigger(e);
            });
            it('should cancel the edit', function(){
                expect($noteTemplate.find('.edit-name-container form input').val()).to.equal(this.note.name);
            });
            it('should NOT attempt to save the note', function(){
                //in reality it saves because focus is blurred but at least it saves the old state
                expect(saveStub).to.not.be.called;
            });
        });
    });
    describe('when changing the isRequired checkbox', function(){
        beforeEach(function(){
            $noteTemplate.find('.is-required input').trigger('click');
        });
        it('should attempt to save the note', function(){
            expect(saveStub).to.be.calledWith({ section: "CustomFields" }, {type: 'customer',name: 'Hot Ting',key: 'hotting',isRequired: true,isActive: true});
        });
    });
    describe('when changing the isActive toggle', function(){
        beforeEach(function(){
            $noteTemplate.find('toggle-switch input').trigger('click');
        });
        it('should attempt to save the note', function(){
            expect(saveStub).to.be.calledWith({ section: "CustomFields" }, {type: 'customer',name: 'Hot Ting',key: 'hotting',isRequired: false,isActive: false});
        });
        it('should disable isRequired and display name', function(){
            expect($noteTemplate.find('.is-required').attr('disabled')).to.equal('disabled');
            expect($noteTemplate.find('.note-name').attr('disabled')).to.equal('disabled');
        });
        it('should leave isActive switch enabled', function(){
            expect($noteTemplate.find('toggle-switch').attr('disabled')).to.equal(undefined);
        });
    });
});