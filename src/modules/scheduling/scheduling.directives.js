angular.module('scheduling.directives', [])
    .directive('modalCustomerDetails', ['coachSeekAPIService', function(coachSeekAPIService){
		return {
			restrict: "E",
			replace: false,
			templateUrl:'scheduling/partials/modalCustomerDetails.html',
			scope: true,
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

				scope.$watch('currentEvent.session.booking.bookings', function(newVal){
				    if(newVal){
			        	scope.isStudent = _.size(_.filter(newVal, function(booking){
				    		return booking.customer.id === scope.item.id;
				    	}));
				    }
				}, true);

				var buildBooking = function(customer){
				    return {
				        session: {
				            id: scope.currentEvent.session.id,
				            name: scope.currentEvent.session.service.name
				        },
				        customer: {
				            id: scope.item.id,
				            firstName: scope.item.firstName,
				            lastName: scope.item.lastName
				        }
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
			scope: true,
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
			}
		};
	}]);