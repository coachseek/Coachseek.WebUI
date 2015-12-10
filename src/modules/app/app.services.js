angular.module('app.services', [])
    // TODO change name to coachseekAPIFactory
    .factory('coachSeekAPIService', ['$resource', 'ENV', function($resource, ENV) {
        return $resource(ENV.apiURL + '/:section/:id');
            //   DEFAULT RESOURCE FUNTIONS
            //   'get':    {method:'GET'},
            //   'save':   {method:'POST'},
            //   'query':  {method:'GET', isArray:true},
            //   'remove': {method:'DELETE'},
            //   'delete': {method:'DELETE'}
    }])
    .factory('anonCoachseekAPIFactory', ['$resource', 'ENV', function($resource, ENV){
        return {
            anon: function (subdomain) {
                return $resource(ENV.apiURL + '/:section/:id', {}, {
                    get:   {method: 'GET', headers: {'Business-Domain': subdomain}},
                    // query: {method: 'GET', isArray:true, headers: {'Business-Domain': subdomain}},
                    // save:  {method: 'POST', headers: {'Business-Domain': subdomain}}
                })
            }
        };
    }])
    .service('getLocationBasedCurrency', function(){
        var self = this;
        this.locationCurrency = 'USD';

        $.getJSON('https://freegeoip.net/json/').done(function(location){
            self.locationCurrency = getCurrencyByLocation(location.country_code);
        });

        function getCurrencyByLocation(countryCode){
            switch (countryCode) {
                case 'NZ': //New Zealand
                    return 'NZD';
                    break;
                case 'AU': //Australia
                    return 'AUD';
                    break;
                case 'AT': //Austria
                case 'BE': //Belgium
                case 'CY': //Cyprus
                case 'EE': //Estonia
                case 'FI': //Finland
                case 'FR': //France
                case 'DE': //Germany
                case 'GR': //Greece
                case 'IE': //Ireland
                case 'IT': //Italy
                case 'LV': //Latvia
                case 'LT': //Lithuania
                case 'LU': //Luxembourg
                case 'MT': //Malta
                case 'NL': //Netherlands
                case 'PT': //Portugal
                case 'SK': //Slovakia
                case 'SI': //Slovenia
                case 'ES': //Spain
                    return 'EUR';
                    break;
                case 'GB': //United Kingdom
                    return 'GBP';
                    break;
                case 'SE': //Sweden
                    return 'SEK';
                    break;
                case 'ZA': //South Africa
                    return 'ZAR';
                    break;
                case 'US': //United States
                    return 'USD';
                    break;
                case 'CN': //China
                    return 'CNY';
                    break;
                case 'SG': //Singapore
                    return 'SGD';
                    break;
                default:
                    return 'USD';
                    break;
            }
        }
    })
    .service('CRUDService', ['coachSeekAPIService', '$activityIndicator',
        function(coachSeekAPIService, $activityIndicator){

        this.get = function(functionName, $scope){
            $activityIndicator.startAnimating();
            return coachSeekAPIService.query({section: functionName})
                .$promise.then(function(itemList){
                    //set list data or create first item
                    if(_.size(itemList)){
                        $scope.itemList = itemList;
                    } else {
                        $scope.itemList = [];
                        $scope.createItem();
                    }
                }, $scope.handleErrors).finally(function(){
                    $activityIndicator.stopAnimating();
                });
        };

        this.update = function(functionName, $scope, item){
            $activityIndicator.startAnimating();
            return coachSeekAPIService.save({section: functionName}, item)
                .$promise.then(function(item){
                    if($scope.itemList) $scope.itemList.push(item);
                    if($scope.newItem){
                        var updateObject = {};
                        updateObject[functionName] = $scope.itemList.length;
                        if(window.Intercom) Intercom('update', updateObject);
                    }
                    resetToList($scope);
                    $scope.addAlert({
                        type: 'success',
                        message: "businessSetup:save-success",
                        name: item.name ? item.name: findName(item)
                    });
                    $scope.$broadcast('updateSuccess');
                    return item;
                }, $scope.handleErrors).finally(function(){
                    $activityIndicator.stopAnimating();
                });
        };

        this.cancelEdit = function($scope){
            if(!$scope.newItem){
                $scope.itemList.push($scope.itemCopy);
            }
            resetToList($scope);
        };
        this.validateForm = function($scope){
            var valid = $scope.itemForm.$valid;

            if(!valid){
                var errorTypes = $scope.itemForm.$error;
                _.forEach(errorTypes, function(errorType, key){
                    _.forEach(errorType, function(error){
                        var errorMessage = error && error.$name ? error.$name : key;
                        $scope.addAlert({
                            type: 'warning',
                            message: 'businessSetup:' + errorMessage + '-invalid'
                        });
                    });
                });
            }
            return valid;
        };

        var resetToList = function($scope){
            $scope.item = null;
            $scope.itemForm.$setPristine();
            $scope.itemForm.$setUntouched();
            $scope.removeAlerts();
            $scope.newItem = null;
            $scope.itemCopy = null;
        };

        var findName = function(item){
            if(item.firstName && item.lastName){
                return item.firstName + " " + item.lastName;
            } else if (item.business) {
                return item.business.name;
            }
        };
    }])
    .service('loginModal', ['$modal', '$rootScope',
        function ($modal, $rootScope) {
            return {
                open: function() {
                    var instance = $modal.open({
                        templateUrl: 'app/partials/loginModal.html',
                        controller: 'loginModalCtrl',
                        windowClass: 'login-modal-backdrop',
                        backdrop: 'static',
                        keyboard: false,
                        animation: false
                    });

                    return instance.result.then(function(userDetails) {
                        $rootScope.setupCurrentUser(userDetails.user, userDetails.business);
                        return userDetails;
                    });
                }
            }
        }
    ])
    .service('expiredLicenseModal', ['$modal', function($modal){
        return {
            open: function() {
                $modal.open({
                    templateUrl: 'app/partials/expiredLicenseModal.html',
                    windowClass: 'trial-expired-modal-backdrop',
                    backdrop: 'static',
                    keyboard: false,
                    animation: false
                });
            }
        }
    }])
    .service('sessionService', function(){
        var isBigScreen = $(window).width() > 768;
        return {
            isBigScreen: isBigScreen,
            calendarView: {
                coachId: "",
                locationId: "",
                serviceDrawerOpen: isBigScreen
            },
            onboarding: {
                showOnboarding: false,
                // ['createDefaults', 'dragService', 'sessionModal', 'onboardingReview']
                stepsCompleted: []
            },
            mobileOnboarding:{
                showMobileOnboarding: false,
                // ['createDefaults', 'dragService', 'sessionModal', 'onboardingReview']
                stepsCompleted: []
            }
        };
    });