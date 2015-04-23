angular.module('customers.controllers', [])
    .controller('customersCtrl', ['$scope', 'CRUDService',
        function($scope, CRUDService){

        $scope.createItem = function(){
            if(!$scope.item){
                $scope.newItem = true;
                $scope.item = {};
            }
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

        $scope.$watchCollection('item', function(newVals){
            if(newVals){
                if(newVals.email === ""){
                    delete $scope.item.email;
                } else if (newVals.phone === ""){
                    delete $scope.item.phone;
                }
            }
        });

        CRUDService.get('Customers', $scope);
    }])
    .controller('customerSearchCtrl', ['$scope', '$filter', function($scope, $filter){
        var peopleList;
        //TODO - make this i18nable
        $scope.alphabetLetters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","ALL"];

        $scope.loadMore = function() {
            if(peopleList){
                _.forEach(peopleList.shift(), function(people){
                    $scope.customerList.push(people);
                });
            }
        };

        var filterText = function(){
            peopleList = $scope.itemList;
            if($scope.searchLetter){
                peopleList = $filter('byLastName')(peopleList, $scope.searchLetter);
            } 
            peopleList = $filter('searchBox')(peopleList, $scope.searchText);
            peopleList = $filter('orderBy')(peopleList, ['lastName', 'firstName']);
            peopleList = _.chunk(peopleList, 20);
            $scope.customerList = [];
            $scope.loadMore(); 
        };

        $scope.$on('updateSuccess', function(){
            filterText();
        });

        var unregister = $scope.$watch('itemList', function(newVal){
            if(newVal){
                filterText();
                unregister();
            }
        });

        $scope.$watch("searchText", function (newVal) {
            if(newVal === ''){
                $scope.searchText = null;
            }
            filterText();
        });

        $scope.$watchGroup(["searchLetter", "searchText"], function(newVals){
            if(!newVals[0]){
                $scope.filterHighlight = newVals[1];
            } else if (!newVals[1]) {
                $scope.filterHighlight = newVals[0];
            } else {
                $scope.filterHighlight = newVals[1] + " " + newVals[0];
            }
        });

        $scope.sortBy = function(letter){
            if(letter === "ALL"){
                $scope.searchLetter = null;
            } else {
                $scope.searchLetter = letter;
            }
            filterText();
        };
    }])
    .filter('highlight', ['$sce', function($sce) {
        return function(text, scope) {
            var phrase = scope.filterHighlight;
            if (text && phrase){
                var phrases = phrase.split(" ");
                var regex = scope.searchText ? new RegExp(phrases.join("|"),"gi") : new RegExp("^" + phrases.join("|"),"gi");
                text = text.replace(regex, function(matched){
                    return '<span class="highlighted">' + matched + '</span>';
                });
            }
            return $sce.trustAsHtml(text);
        };
     }])
    .filter('byLastName', function() {
        return function(items, letter){
            return _.filter(items, function (item) {
                return new RegExp(letter, "i").test(item.lastName.substring(0, 1));
            });
        };
     })
    .filter('searchBox', function(){
        return function(items, value){
            if(!value){
                return items;
            } else {
                value = value.toLowerCase();
                var values = value.split(" ");

                return _.filter(items, function(item){
                        var firstName = item.firstName.toLowerCase();
                        var lastName = item.lastName.toLowerCase();
                        var matches = [];
                        _.forEach(values, function(value){
                            if(_.includes(firstName, value) || _.includes(lastName, value) || _.includes(item.phone, value) ){
                                matches.push(true);
                            }
                        });
                        return matches.length === values.length;
                });
            }
        };
    });