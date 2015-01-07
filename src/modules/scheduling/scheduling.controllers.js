angular.module('scheduling.controllers', [])
    .controller('schedulingCtrl', ['$scope', 'CRUDService',
        function($scope, CRUDService){
            $scope.events = [];
            $scope.eventSources = [$scope.events];

            $scope.myCallback = function(){
                console.log("REVERT")
            };

            $scope.uiConfig = {
                calendar:{
                    height: 500,
                    editable: true,
                    droppable: true,
                    allDaySlot: false,
                    defaultView: 'agendaWeek',
                    eventDurationEditable: false,
                    drop: function(date, event) {
                        $(this).hide().css({top: 0, left: 0}).fadeIn(600);
                        // console.log('Specified TIME', date.hasTime())
                        var serviceData = $(this).data('service');
                        buildEvents(date, serviceData);
                    },
                    eventDrop: function(event){
                    },
                    // businessHours: {
                    //     start: '10:00', // a start time (10am in this example)
                    //     end: '18:00', // an end time (6pm in this example)

                    //     dow: [ 1, 2, 3, 4 ]
                    //     // days of week. an array of zero-based day of week integers (0=Sunday)
                    //     // (Monday-Thursday in this example)
                    // },
                    header:{
                        left: 'month agendaWeek agendaDay',
                        center: 'title',
                        right: 'today prev,next'
                    },
                    scrollTime:  "08:00:00"
                }
            };

            var strToMinutes = function(duration){
                var timeArray = duration.split(":");
                return parseFloat(timeArray[0] * 60)  + parseFloat(timeArray[1]);
            };

            var buildEvents = function(date, serviceData){
                var repeatFrequency = serviceData.repititon.repeatFrequency
                var duration = strToMinutes(serviceData.timing.duration);
                var id = _.uniqueId('service_')
                if( repeatFrequency === -1 ){
                    // console.log('FOREVER')
                    createEvent(id, date, serviceData, 0);
                } else if ( repeatFrequency === null ) {
                    // console.log('ONCE')
                    createEvent(id, date, serviceData, 0);
                } else if ( repeatFrequency ) {
                    // console.log('FINITE')
                    var sessionCount = serviceData.repititon.sessionCount;
                    _.times(sessionCount, function(index){
                        createEvent(id, date, serviceData, index)
                    });
                }
            };

            var createEvent = function(id, date, serviceData, index){
                var newDate = date.clone();
                var repeatFrequency = serviceData.repititon.repeatFrequency
                var duration = strToMinutes(serviceData.timing.duration);
                var newEvent = {
                    _id: id,
                    title: serviceData.name,
                    start: moment(newDate.add(index, repeatFrequency)),
                    end: moment(newDate.add(duration, 'minutes')),
                    allDay: false,
                    color: serviceData.presentation.color
                }
                $scope.events.push(newEvent); 
            };

            CRUDService.get('getServices', $scope);
            // GET existing calendar
    }]);