angular.module('scheduling.controllers', [])
    .controller('schedulingCtrl', ['$scope', 'CRUDService',
        function($scope, CRUDService){
            $scope.events = [];
            $scope.eventSources = [$scope.events];

            $scope.onRevert = function(valid){
                if(valid) {
                    $(this).css('opacity', '0');
                }
                return true;
            };

            $scope.uiConfig = {
                calendar:{
                    height: 500,
                    editable: true,
                    droppable: true,
                    allDaySlot: false,
                    firstDay: 1,
                    defaultView: 'agendaWeek',
                    eventDurationEditable: false,
                    drop: function(date, event) {
                        // console.log('Specified TIME', date.hasTime())
                        var serviceData = $(this).data('service');
                        buildEvents(date, serviceData);
                        $(this).animate({ opacity: 1 }, 750);
                    },
                    // businessHours: {
                    //     start: '10:00', // a start time (10am in this example)
                    //     end: '18:00', // an end time (6pm in this example)

                    //     dow: [ 1, 2, 3, 4 ]
                    //     // days of week. an array of zero-based day of week integers (0=Sunday)
                    //     // (Monday-Thursday in this example)
                    // },
                    eventRender: function(event, element, view) {
                        if(view.type === 'agendaDay'){
                            $('<div></div>', {
                                class: 'fc-description',
                                text: event.description
                            }).appendTo(element.find('.fc-content'));
                        }
                    },
                    viewRender: function(view, element){
                        //doing this to allow user to drop outside of box
                        element.droppable();
                    },
                    header:{
                        left: '',
                        center: 'prev title next',
                        right: 'month agendaWeek agendaDay today '
                    },
                    scrollTime:  "08:00:00"
                }
            };

            $scope.minutesToStr = function(duration){
                return Math.floor(duration / 60) + ":" + duration % 60;
            };

            var buildEvents = function(date, serviceData){
                var repeatFrequency = serviceData.repetition.repeatFrequency;
                var duration = serviceData.timing.duration;
                var id = _.uniqueId('service_');
                if( repeatFrequency === -1 ){
                    // console.log('FOREVER')
                    createEvent(id, date, serviceData, 0);
                } else if ( repeatFrequency === undefined ) {
                    // console.log('ONCE')
                    createEvent(id, date, serviceData, 0);
                } else if ( repeatFrequency ) {
                    // console.log('FINITE')
                    var sessionCount = serviceData.repetition.sessionCount;
                    _.times(sessionCount, function(index){
                        createEvent(id, date, serviceData, index);
                    });
                }
            };

            var createEvent = function(id, date, serviceData, index){
                var newDate = date.clone();
                var repeatFrequency = serviceData.repetition.repeatFrequency;
                var duration = serviceData.timing.duration;

                var newEvent = {
                    _id: id,
                    title: serviceData.name,
                    description: serviceData.description,
                    start: moment(newDate.add(index, repeatFrequency)),
                    end: moment(newDate.add(duration, 'minutes')),
                    allDay: false,
                    className: serviceData.presentation.colour
                };
                $scope.events.push(newEvent); 
            };

            CRUDService.get('Services', $scope);
            // GET existing calendar
    }]);