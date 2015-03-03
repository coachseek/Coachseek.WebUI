angular.module('customers.controllers', [])
    .controller('customersCtrl', ['$scope', 'CRUDService',
    	function($scope, CRUDService){

    	$scope.createItem = function(){
    	    $scope.newItem = true;
    	    $scope.item = {};
    	};

    	$scope.editItem = function(customer){
    	    _.pull($scope.itemList, customer);
    	    $scope.itemCopy = angular.copy(customer);

    	    $scope.item = customer;
    	};

    	$scope.saveItem = function(customer){
    	    var formValid = CRUDService.validateForm($scope);

    	    if(formValid){
    	        CRUDService.update('Customers', $scope, customer);
    	    }
    	};

    	$scope.cancelEdit = function(){
    	    CRUDService.cancelEdit($scope);
    	};

    	$scope.itemList = [];
    	$scope.createItem();
    	// CRUDService.get('Customers', $scope);
    }]);