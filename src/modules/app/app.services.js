angular.module('app.services', []).
	factory('coachSeekAPIService', ['$resource', function($resource) {
	    return $resource('http://coachseek-api.azurewebsites.net/api/:section', {}, {
	        get: { method: 'GET', isArray: true},
	        update: {method: 'POST'}
	    });
	}])
	// .factory('$remember', function() {
	//     return function(name, values) {
	//         var cookie = name + '=';

	//         cookie += values + ';';

	//         var date = new Date();
	//         date.setDate(date.getDate() + 1);

	//         cookie += 'expires=' + date.toString() + ';';

	//         document.cookie = cookie;
	//     }
	// })
	// .factory('$forget', function() {
	//     return function(name) {
	//         var cookie = name + '=;';
	//         cookie += 'expires=' + (new Date()).toString() + ';';

	//         document.cookie = cookie;
	//     }
	// })
	.service('loginModal', ['$modal', '$rootScope',
		function ($modal, $rootScope) {
			function assignCurrentUser (user) {
				$rootScope.currentUser = user;
				return user;
			}

			return function() {
				var instance = $modal.open({
					templateUrl: 'app/partials/loginModal.html',
					controller: 'loginModalCtrl',
					backdropClass: 'modal-backdrop'
				})

				return instance.result.then(assignCurrentUser);
			};
		}
	]);