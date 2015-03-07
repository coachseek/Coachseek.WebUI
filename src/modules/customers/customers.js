angular.module('customers',
    [
        'customers.controllers',

        'infinite-scroll'
    ])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('customers', {
                url: "/customers",
                templateUrl: "customers/partials/customersView.html",
                controller: 'customersCtrl',
                data: {
                    requireLogin: true
                }
            });
    }]);