describe('customerBooking directive', function(){

    let('currentEvent', function(){
        return {
            session: {
                booking: {
                    bookings: [this.booking]
                }
            }
        };
    });

	let('booking', function(){
		return {
			id: '69'
		}
	});

	let('deletePromise', function(){
	    return $q.defer().promise;
	});

    var scope,
        $customerBooking;

    beforeEach(function(){
        scope = $rootScope.$new();
        self.deletePromise = this.deletePromise;
        scope.currentEvent = this.currentEvent;
        scope.booking = this.booking;

        createDirective(scope, '<customer-booking></customer-booking>');
        $customerBooking = $testRegion.find('customer-booking');
    });
    describe('when clicking deleteStudent', function(){
        var self, deleteStub, removeStub, $deleteStudent;
        beforeEach(function(){
            self = this;
            deleteStub = this.sinon.stub($injector.get('coachSeekAPIService'), 'delete', function(){
                return {$promise: self.deletePromise};
            });
            $deleteStudent = $customerBooking.find('.delete-booking');
            $deleteStudent.trigger('click');
        });
        it('should call delete method', function(){
        	expect(deleteStub).to.be.calledWith({section: 'Bookings', id: this.booking.id});
        });
        describe('while loading', function(){
            it('should set bookingLoading to true', function(){
                expect(scope.$$childHead.bookingLoading).to.be.true;
            });
            it('should show the loading ellipsis', function(){
                expect($customerBooking.find('ellipsis-animated').hasClass('ng-hide')).to.be.false;
            });
        });
        describe('when delete is successful', function(){
            let('deletePromise', function(){
                var deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            });
            it('should hide the loading ellipsis', function(){
                expect($customerBooking.find('ellipsis-animated').hasClass('ng-hide')).to.be.true;
            });
            it('should set bookingLoading to false', function(){
                expect(scope.$$childHead.bookingLoading).to.be.false;
            });
            it('should to remove customer from UI', function(){
            	expect(_.size(scope.currentEvent.session.booking.bookings)).to.be.equal(0);
            });
        });
        describe('when delete fails', function(){
            let('deletePromise', function(){
                var deferred = $q.defer();
                deferred.reject({data: {message:"error-message"}});
                return deferred.promise;
            });
            it('should hide the loading ellipsis', function(){
                expect($customerBooking.find('ellipsis-animated').hasClass('ng-hide')).to.be.true;
            });
            it('should set bookingLoading to false', function(){
                expect(scope.$$childHead.bookingLoading).to.be.false;
            });
            it('should show an error message', function(){
                expect($rootScope.alerts[0].type).to.equal('danger');
                expect($rootScope.alerts[0].message).to.equal('error-message');
            });
        });
    });
})