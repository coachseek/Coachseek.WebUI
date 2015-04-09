angular.module('scheduling.directives', [])
    .directive('schedulingServicesList', function(){
		return {
			restrict: "E",
			replace: false,
			templateUrl:'scheduling/partials/schedulingServicesList.html'
		};
	})
    .directive('modalSessionForm', function(){
		return {
			restrict: "E",
			replace: false,
			templateUrl:'scheduling/partials/modalSessionForm.html',
			link: function(scope){
				scope.changeServiceName = function(){
				    var newService = _.find(scope.serviceList, {id: scope.currentSessionForm.services.$viewValue});
				    scope.currentEvent.session.presentation.colour = newService.presentation.colour;
				    _.assign(scope.currentEvent, {
				        className: newService.presentation.colour,
				        title: newService.name
				    });
				    updateCurrentEvent();
				};

				scope.changeLocationName = function(){
				    var newLocation = _.find(scope.locationList, {id: scope.currentSessionForm.locations.$viewValue});
				    scope.currentEvent.session.location = newLocation;
				    updateCurrentEvent();
				};

				var updateCurrentEvent = function(){
				    //TODO - why does this freak out when currentEvent is a new event?
				    if(!scope.currentEvent.tempEventId){
				        $('#session-calendar').fullCalendar('updateEvent', scope.currentEvent);                    
				    }
				};
			}
		};
	})
	.directive('startTimePicker', function(){
		return {
			scope: {
			    startTime: '='
			},
			restrict: "E",
			templateUrl:'scheduling/partials/startTimePicker.html',
			link: function(scope, elem){
				scope.editingTime = false;

				var startTimeCopy,
					$timePickerContainer = angular.element(elem.find('.time-picker-container'));

                scope.editTime = function(currentTime){
                    if(!scope.editingTime) {
                        startTimeCopy = angular.copy(scope.startTime);
	                    scope.editingTime = true;
                    }
                };

                scope.$on('closeTimePicker', function(event, resetTime){
                    if(resetTime && startTimeCopy){
                        scope.startTime = startTimeCopy;
                    }
                    scope.editingTime = false;
                    $timePickerContainer.one('$animate:after', function(){
                        startTimeCopy = null;
                    });
                });
			}
		}
	})
    .directive('modalSessionAttendanceList', ['coachSeekAPIService', function(coachSeekAPIService){
		return {
			restrict: "E",
			replace: false,
			templateUrl:'scheduling/partials/modalSessionAttendanceList.html',
			link: function(scope){
				scope.showCustomers = false;

				scope.showCustomerList = function(){
				    scope.showCustomers = true;
				};

				scope.hideCustomerList = function(){
				    scope.showCustomers = false;
				};

				coachSeekAPIService.get({section: 'Customers'})
				    .$promise.then(function(customerList){
				        scope.itemList  =  customerList;
				    }, scope.handleErrors);
			}
		};
	}])
    .directive('modalCustomerDetails', ['coachSeekAPIService', function(coachSeekAPIService){
		return {
			restrict: "E",
			replace: false,
			templateUrl:'scheduling/partials/modalCustomerDetails.html',
			link: function(scope){

				scope.addStudent = function(){
				    var bookingObject = buildBooking();

				    scope.bookingLoading = true;
				    coachSeekAPIService.update({section: 'Bookings'}, bookingObject)
				        .$promise.then(function(booking){
				        	_.assign(booking.customer, 
				        		{
				        			firstName: bookingObject.customer.firstName,
				        			lastName: bookingObject.customer.lastName
				        		}
				        	);
				            scope.currentEvent.session.booking.bookings.push(booking);
				        }, scope.handleErrors).finally(function(){
				            scope.bookingLoading = false;
				        });
				};

				scope.$watch('currentEvent.session.booking.bookings', function(newBookings){
				    if(newBookings){
			        	scope.isStudent = _.size(_.filter(newBookings, function(booking){
				    		return booking.customer.id === scope.item.id;
				    	}));
				    }
				}, true);

				var buildBooking = function(addToCourse){
                    return {
                        session: {
                            id: scope.currentEvent.session.id,
                            name: scope.currentEvent.session.service.name
                        },
                        customer: {
                            id: scope.item.id,
                            firstName: scope.item.firstName,
                            lastName: scope.item.lastName
                        },
                        paymentStatus: "Awaiting Payment",
                        hasAttended: false
                    };
                };
			}
		};
	}])
    .directive('customerBooking', ['coachSeekAPIService', function(coachSeekAPIService){
		return {
			restrict: "E",
			replace: false,
			templateUrl:'scheduling/partials/customerBooking.html',
			link: function(scope){
				//TODO - load attendance info for checked attribute
				scope.checked = false;

				scope.toggleAttendance = function(){
					scope.checked = !scope.checked;
				};

				scope.removeBooking = function(){
					scope.bookingLoading = true;
					var bookingId = scope.booking.id;
					coachSeekAPIService.delete({section: 'Bookings', id: bookingId})
					    .$promise.then(function(){
			                _.pull(scope.currentEvent.session.booking.bookings, scope.booking);
					    },scope.handleErrors).finally(function(){
							scope.bookingLoading = false;
                        });
				};

				scope.updateAttendance = function(){
					scope.bookingLoading = true;
					var attendance = scope.booking;
					console.log(attendance);
					coachSeekAPIService.update({section:'Bookings'}, attendance)
						.$promise.then(function(){
							attendance = scope.checked;
						},scope.handleErrors).finally(function(error){
							scope.bookingLoading = false;
                        });
				};

			}
		};

	}]);