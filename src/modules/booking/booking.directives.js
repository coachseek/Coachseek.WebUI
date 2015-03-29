angular.module('booking.directives', [])
  .directive('mySessionTypeSelection', function () {
    return {
  		restrict: "E",
      replace: true,
  		templateUrl:'booking/partials/mySessionTypeSelectionView.html',
  		link: function (scope, element, attributes) {
        scope.onPrivateSessionSelected = function () {
          scope.navigate.to('enquiry');
        };

        scope.onPublicSessionSelected = function () {
          scope.navigate.to('booking');
        };
  		}
  	};
  })
  .directive('mySessionSelection', function () {
  	return {
  		restrict: "E",
      replace: true,
  		templateUrl:'booking/partials/mySessionSelectionView.html',
  		link: function (scope, element, attributes) {
        scope.onSessionSelected = function (session) {
          scope.booking.session = session;
          scope.booking.enquiry = null;

          scope.navigate.forward();
        };

        scope.onCancel = function () {
          scope.booking.session = null;
          scope.navigate.back();
        };
  		}
  	};
  })
  .directive('myEnquiry', function () {
  	return {
  		restrict: "E",
      replace: true,
  		templateUrl:'booking/partials/myEnquiryView.html',
  		link: function (scope, element, attributes) {
        scope.onMakeEnquiry = function () {
          scope.booking.session = null;

          scope.navigate.forward();
        };

        scope.onCancel = function () {
          scope.booking.enquiry = null;
          scope.navigate.back();
        };
  		}
  	};
  })
  .directive('myCustomerRegistration', ['coachSeekAPIService', function (coachSeekAPIService) {
  	return {
  		restrict: "E",
      replace: true,
  		templateUrl:'booking/partials/myCustomerRegistrationView.html',
  		link: function (scope, element, attributes) {
        scope.onCancel = function () {
          scope.booking.session = null;
          scope.navigate.back();
        };
        scope.onRegister = function () {
          scope.navigate.forward();
        };
  		}
  	};
  }])
  .directive('myBookingConfirmation', ['coachSeekAPIService', function (coachSeekAPIService) {
  	return {
  		restrict: "E",
      replace: true,
  		templateUrl:'booking/partials/myBookingConfirmationView.html',
  		link: function (scope, element, attributes) {
        scope.onEditSession = function () {
          scope.booking.session = null;
          scope.navigate.to('booking');
        };

        scope.onEditRegistration = function () {
          scope.navigate.to('register');
        };

        scope.onEditEnquiry = function () {
          scope.navigate.to('enquiry');
        }

        scope.onCancel = function () {
          scope.booking.session = null;
          scope.booking.enquiry = null;
          scope.booking.customer = JSON.parse(localStorage.getItem('customer')) || null;
          scope.navigate.back();
        };

        scope.onBooking = function (booking) {
          coachSeekAPIService
            .update({ section: 'Customers' }, booking.customer).$promise
            .then(function (customer) {
              if (booking.customer.remember === true) {
                localStorage.setItem('customer', JSON.stringify(customer));
              }

              booking.customer = customer;

              coachSeekAPIService
              .update({ section: 'Bookings' }, booking).$promise
              .then(function (booking) {
                console.log('your booking has been taken into consideration...');
                console.log(booking);
              });
            });
        };
  		}
  	};
  }]);
