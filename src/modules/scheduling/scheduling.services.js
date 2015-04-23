angular.module('scheduling.services', [])
    .service('sessionOrCourseModal', ['$modal', '$rootScope',
        function ($modal, $rootScope) {
            return function(scope) {
                scope.removeAlerts();
                var instance = $modal.open({
                    scope: scope,
                    templateUrl: 'scheduling/partials/sessionOrCourseModal.html',
                    backdropClass: 'session-or-course-modal-backdrop',
                    windowClass: 'session-or-course-modal-window'
                });

                return instance.result.then(function(id){
                    return id;
                });
            };
        }
    ]);