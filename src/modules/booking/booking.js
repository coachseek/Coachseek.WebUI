angular
.module('booking', [ 'booking.controllers' ])
.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('booking', {
    url: "/booking",
    templateUrl: "booking/partials/layout.html",
    controller: 'bookingCtrl',
    data: {
      requireLogin: true
    }
  })
  .state('booking.course', {
    url: "/course",
    templateUrl: "booking/partials/booking.course.view.html",
    data: {
      requireLogin: true
    }
  })
  .state('booking.session', {
    url: "/session",
    templateUrl: "booking/partials/booking.session.view.html",
    data: {
      requireLogin: true
    }
  })
  .state('booking.register', {
    url: "/register",
    templateUrl: "booking/partials/booking.register.view.html",
    data: {
      requireLogin: true
    }
  })
  .state('booking.confirm', {
    url: "/confirm",
    templateUrl: "booking/partials/booking.confirm.view.html",
    data: {
      requireLogin: true
    }
  });

  $urlRouterProvider.otherwise('/booking/session');
});
