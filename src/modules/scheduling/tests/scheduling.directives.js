angular.module('scheduling.directives', [])
    .directive('modalCustomerDetails', ['coachSeekAPIService', function(coachSeekAPIService){
		return {
			restrict: "E",
			replace: false,
			templateUrl:'scheduling/partials/modalCustomerDetails.html',
			scope: true,
			link: function(scope){
				scope.addStudent = function(){
				    var booking = buildBooking();
				    console.log(booking);
				    // scope.bookingLoading = true;
	        		scope.currentEvent.session.booking.bookings.push(scope.item)
		        	scope.hideCustomerList();

				    // coachSeekAPIService.update({section: 'Bookings'}, booking)
				    //     .$promise.then(function(booking){
				    //         scope.currentEvent.session.booking.bookings.push(booking);
				    //         scope.isStudent = true;
				    //     }, scope.handleErrors).finally(function(){
				    //     	scope.hideCustomerList();
				    //         scope.bookingLoading = false;
				    //     });
				};

				scope.$watch('currentEvent', function(newVal){
				    if(newVal){
				    	var bookings = newVal.session.booking.bookings;
				        // if(_.find(bookings, {customer: scope.item})){
				        	scope.isStudent = _.random(1);
				        	if(scope.isStudent){
				        		scope.currentEvent.session.booking.bookings.push(scope.item)
				        	}
				        // }
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
				            name: scope.item.firstName + ' ' + scope.item.lastName
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