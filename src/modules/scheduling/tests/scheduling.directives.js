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
				        	console.log(booking)
				            scope.currentEvent.session.booking.bookings.push(bookingObject);
				            scope.isStudent = true;
				        }, scope.handleErrors).finally(function(){
				        	scope.hideCustomerList();
				            scope.bookingLoading = false;
				        });
				};

				scope.$watch('currentEvent', function(newVal){
				    if(newVal){
			        	scope.isStudent = false;
				    	var bookings = newVal.session.booking.bookings;
				    	_.forEach(bookings, function(booking){
				    		if(booking.customer.id === scope.item.id){
					        	scope.isStudent = true;
				    		}
				    	});
				    }
				});

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
				scope.checked = false;
				var booking;
				scope.toggleAttendance = function(){
					scope.checked = !scope.checked;
					// scope.bookingLoading = true;
					// if(scope.checked){

					// 	coachSeekAPIService.delete({section: 'Bookings', id: booking.id})
					// 	    .$promise.then(function(booking){
					// 	    	scope.checked = false;
					// 	    },function(error){
			  //                   _.forEach(error.data, function(error){
			  //                       scope.addAlert({
			  //                           type: 'danger',
			  //                           message: error.message ? error.message: error
			  //                       });
			  //                   });
			  //               }).finally(function(){
					// 			scope.bookingLoading = false;
     //                        });
					// } else {
					// 	if(!booking){
					// 		booking = buildBooking();						
					// 	}

					// 	coachSeekAPIService.update({section: 'Bookings'}, booking)
					// 	    .$promise.then(function(booking){
					// 	    	scope.checked = true;
					// 	    },function(error){
			  //                   _.forEach(error.data, function(error){
			  //                       scope.addAlert({
			  //                           type: 'danger',
			  //                           message: error.message ? error.message: error
			  //                       });
			  //                   });
			  //               }).finally(function(){
					// 			scope.bookingLoading = false;
     //                        });
					// }
				};
			}
		};
	}]);