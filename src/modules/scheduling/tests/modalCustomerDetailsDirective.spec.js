describe('modalCustomerDetails directive', function(){

    let('currentEvent', function(){
        return {
            session: {
                id: 'session_one',
                booking: {
                    bookings: this.bookings
                },
                service: {
                    name: 'service name'
                }
            }
        };
    });

    let('bookingOne', function(){
        return {
            customer: {id: 'one'}
        };
    });

    let('bookings', function(){
        return [this.bookingOne];
    });

    let('item', function(){
        return {
            id: 'one',
            firstName: 'Dude',
            lastName: 'Guy'
        };
    });

    let('updatePromise', function(){
        return $q.defer().promise;
    });
    
    var scope,
        $modalCustomerDetails;
    beforeEach(function(){
        scope = $rootScope.$new();
        scope.currentEvent = this.currentEvent;
        scope.item = this.item;

        createDirective(scope, '<modal-customer-details></modal-customer-details>');
        $modalCustomerDetails = $testRegion.find('modal-customer-details');
    });

    describe('when bookings[] contains the customer', function(){
        it('should set the isStudent flag to true', function(){
            expect(scope.isStudent).to.be.truthy;
        });
    });
    describe('when bookings[] does not contain the customer', function(){
        let('bookings', function(){
            return [{ customer: {id: 'two'}}, {customer: {id: 'three'}}];
        });

        it('should not set the isStudent flag to true', function(){
            expect(scope.isStudent).to.be.falsy;
        });

        describe('when clicking addStudent', function(){
            var self, updateStub, $addStudent;
            beforeEach(function(){
                self = this;
                updateStub = this.sinon.stub($injector.get('coachSeekAPIService'), 'save', function(){
                    return {$promise: self.updatePromise};
                });
                $addStudent = $modalCustomerDetails.find('.add-student');
                $addStudent.trigger('click');
            });
            it('should call update method', function(){
                var bookingObject = {
                    session: {
                        id: this.currentEvent.session.id,
                        name: this.currentEvent.session.service.name
                    },
                    customer: {
                        id: this.item.id,
                        firstName: this.item.firstName,
                        lastName: this.item.lastName
                    }                
                }
                expect(updateStub).to.be.calledWith({section: 'Bookings'}, bookingObject);
            });
            describe('while loading', function(){
                it('should set bookingLoading to true', function(){
                    expect(scope.bookingLoading).to.be.truthy;
                });
                it('should hide the button', function(){
                    expect($addStudent.hasClass('ng-hide')).to.be.true;
                });
                it('should show the loading ellipsis', function(){
                    expect($modalCustomerDetails.find('ellipsis-animated').hasClass('ng-hide')).to.be.false;
                });
            });
            describe('when update is successful', function(){
                let('updatePromise', function(){
                    var deferred = $q.defer();
                    deferred.resolve(this.bookingOne);
                    return deferred.promise;
                });
                it('should set the isStudent flag to true', function(){
                    expect(scope.isStudent).to.be.truthy;
                });
                it('should show the add student button', function(){
                    expect($addStudent.hasClass('ng-hide')).to.be.false;
                });
                it('should disable the add student button', function(){
                    expect($addStudent.attr('disabled')).to.equal('disabled');
                });
                it('should hide the loading ellipsis', function(){
                    expect($modalCustomerDetails.find('ellipsis-animated').hasClass('ng-hide')).to.be.true;
                });
                it('should set bookingLoading to false', function(){
                    expect(scope.bookingLoading).to.be.falsy;
                });

            });
            describe('when update fails', function(){
                let('updatePromise', function(){
                    var deferred = $q.defer();
                    deferred.reject({data: {message:"error-message"}});
                    return deferred.promise;
                });
                it('should set the isStudent flag to false', function(){
                    expect(scope.isStudent).to.be.falsy;
                });
                it('should show the add student button', function(){
                    expect($addStudent.hasClass('ng-hide')).to.be.false;
                });
                it('should hide the loading ellipsis', function(){
                    expect($modalCustomerDetails.find('ellipsis-animated').hasClass('ng-hide')).to.be.true;
                });
                it('should set bookingLoading to false', function(){
                    expect(scope.bookingLoading).to.be.false;
                });
                it('should show an error message', function(){
                    expect($rootScope.alerts[0].type).to.equal('danger');
                    expect($rootScope.alerts[0].message).to.equal('error-message');
                });
            });
        });
    });
})