myApp.controller('SchedulerController', ['$scope', '$rootScope', '$firebaseObject', '$routeParams', '$firebaseArray', '$location',

  function ($scope, $rootScope, $firebaseObject, $routeParams, $firebaseArray, $location) {
        window.scrollTo(0, 0);
      
        $scope.confirmBooking = function(slot) {
            
            // Display booking details
            d1 = slot.timestamp.toString("dddd, MMMM d yyyy - h:mm tt");
            $("#confbookdate").text(d1);
            $("#confservice").text($scope.myService);
            $('#modalBookingConfirm').modal('show');
            
            // If user clicks Yes, save the booking
            $('#pf_modalYes').on('click', function () {
                // save booking
                nowTime = new Date();
                firebase.database().ref('/bookings/' + uid + '/' + slot.timestamp).set({
                    date: slot.timestamp.toString("dddd, MMMM d yyyy - h:mm tt"),
                    sortDate: slot.timestamp.getTime(),
                    client: $scope.client,
                    regUser: $rootScope.currentUser.uid,
                    service: $scope.myService,
                    minutesToComplete: $scope.serviceTime * 60,
                    dateBooked: nowTime.toString(),
                    email: $scope.useremail,
                    specialist: $scope.firstname + ' ' + $scope.lastname
                });
                
                $('#modalSuccessAlert2').removeClass('modal-sm').addClass('modal-md');
                $('#modalSuccessAlert-title').text("You're appoinment has been booked!");
                $('#modalSuccessAlert-body').text("Please check your inbox for a confirmation email.  Thank you!");
                $('#modalSuccessAlert').modal('show');
                
                $('#pf_modalClose').on('click', function () {
                    window.location.href = "/";
                });
            });
            
            // If user click's NO, make timeslot available again
            $('#pf_modalNo').on('click', function () {
                slot.booked = false;
                $scope.$apply();
            });
        };
      
      
        // Incoming user id
        var uid = $routeParams.uID;
      
        var days = [];  // Array holding the staffer's schedule 
        var segmentMinutes = 0;
        var allowOverflow = false;
      
        // Get client's firstname and lastname
        userReg = $rootScope.currentUser.uid;
        firebase.database().ref('/users/' + userReg).once('value').then(function (snapshot) {
            console.log(snapshot.val());
            first = snapshot.val().firstname;
            last = snapshot.val().lastname;
            $scope.client = first + " " + last;
            $scope.useremail = snapshot.val().email;
        });      
        
      
        // Get staffer's firstname and lastname
        firebase.database().ref('/associates/' + uid + '/firstname').once('value').then(function (snapshot) {
            $scope.firstname = snapshot.val();
        });
        firebase.database().ref('/associates/' + uid + '/lastname').once('value').then(function (snapshot) {
            $scope.lastname = snapshot.val();
        });
        // Retrieve profile pic URL from Google Storage
        var storageRef = firebase.storage().ref().child('/images/' + uid);
        storageRef.getDownloadURL().then(function (url) {
            document.getElementById("sched_imgProfilePic").src = url;
        }).catch(function (error) {
            console.log("error getting user's profile pic!");
            console.log(error);
        });
        // Retrieve all services offered by the staff member
        $scope.items = [];
        var regexp = new RegExp(/[&\/\\#,+()\ /\\.'":*?\-\\<>{}]/g);
        firebase.database().ref('/associates/' + uid + '/hairCut').once('value').then(function (snapshot) {
            haircuts = snapshot.val();
            if (haircuts) {
                haircuts.forEach(function (cut) {
                    $scope.items.push({
                        category: 'Haircut'
                        , value: cut.replace(regexp, '_')
                        , text: cut
                    });
                });
            }
        });
        firebase.database().ref('/associates/' + uid + '/hairColor').once('value').then(function (snapshot) {
            hairColor = snapshot.val();
            if (hairColor) {
                hairColor.forEach(function (color) {
                    $scope.items.push({
                        category: 'Hair Color'
                        , value: color.replace(regexp, '_')
                        , text: color
                    });
                });
            };
        });
        firebase.database().ref('/associates/' + uid + '/hairAddition').once('value').then(function (snapshot) {
            hairAdd = snapshot.val();
            if (hairAdd) {
                hairAdd.forEach(function (add) {
                    $scope.items.push({
                        category: 'Hair Addition'
                        , value: add.replace(regexp, '_')
                        , text: add
                    });
                });
            };
        });
        firebase.database().ref('/associates/' + uid + '/hairText').once('value').then(function (snapshot) {
            hairText = snapshot.val();
            if (hairText) {
                hairText.forEach(function (texture) {
                    $scope.items.push({
                        category: 'Hair Texturizing'
                        , value: texture.replace(regexp, '_')
                        , text: texture
                    });
                });
            };
        });
        firebase.database().ref('/associates/' + uid + '/wax').once('value').then(function (snapshot) {
            wax = snapshot.val();
            if (wax) {
                wax.forEach(function (wak) {
                    $scope.items.push({
                        category: 'Wax'
                        , value: wak.replace(regexp, '_')
                        , text: wak
                    });
                });
            };
        });
        firebase.database().ref('/associates/' + uid + '/brow').once('value').then(function (snapshot) {
            brow = snapshot.val();
            if (brow) {
                brow.forEach(function (bro) {
                    $scope.items.push({
                        category: 'Brows'
                        , value: bro.replace(regexp, '_')
                        , text: bro
                    });
                });
            };
        });
        firebase.database().ref('/associates/' + uid + '/facial').once('value').then(function (snapshot) {
            facial = snapshot.val();
            if (facial) {
                facial.forEach(function (face) {
                    $scope.items.push({
                        category: 'Facial'
                        , value: face.replace(regexp, '_')
                        , text: face
                    });
                });
            };
        });
        firebase.database().ref('/associates/' + uid + '/makeup').once('value').then(function (snapshot) {
            makeup = snapshot.val();
            if (makeup) {
                makeup.forEach(function (make) {
                    $scope.items.push({
                        category: 'Makeup'
                        , value: make.replace(regexp, '_')
                        , text: make
                    });
                });
            };
        });
        firebase.database().ref('/associates/' + uid + '/mani').once('value').then(function (snapshot) {
            mani = snapshot.val();
            if (mani) {
                mani.forEach(function (man) {
                    $scope.items.push({
                        category: 'Manicure'
                        , value: man.replace(regexp, '_')
                        , text: man
                    });
                });
            };
        });
        firebase.database().ref('/associates/' + uid + '/pedi').once('value').then(function (snapshot) {
            pedi = snapshot.val();
            if (pedi) {
                pedi.forEach(function (ped) {
                    $scope.items.push({
                        category: 'Pedicure'
                        , value: ped.replace(regexp, '_')
                        , text: ped
                    });
                });
            };
        });
        firebase.database().ref('/associates/' + uid + '/massage').once('value').then(function (snapshot) {
            massage = snapshot.val();
            if (massage) {
                massage.forEach(function (mas) {
                    $scope.items.push({
                        category: 'Massage'
                        , value: mas.replace(regexp, '_')
                        , text: mas
                    });
                });
            };
        });
        // Load up the dayCount from staffmember's profile  
        firebase.database().ref('/associates/' + uid + '/bookingConfiguration').once('value').then(function (snapshot) {
            if (snapshot.val().dayCount) {
                dayCount = snapshot.val().dayCount;
            }
            
            // default slot time - configurable in Profile/Advanced tab
            if (snapshot.val().segmentTime) {
                segmentMinutes = snapshot.val().segmentTime;
            }
            
            // Allow last slot to overflow beyond work hours?
            if (snapshot.val().allowOverflow) {
                if( snapshot.val().allowOverflow == 'on' ) {
                    allowOverflow = true;
                }
            }
        });
      
        // Build staffer's work schedule -- used in generate calendar routine
        var myWorkSchedule = new Object();
        firebase.database().ref('/associates/' + uid + '/hours').once('value').then(function (snapshot) {
            obj = snapshot.val();
            myWorkSchedule["Monday"] = {
                'work': obj.Monday.work
                , 'start': obj.Monday.start
                , 'end': obj.Monday.end
            };
            myWorkSchedule["Tuesday"] = {
                'work': obj.Tuesday.work
                , 'start': obj.Tuesday.start
                , 'end': obj.Tuesday.end
            };
            myWorkSchedule["Wednesday"] = {
                'work': obj.Wednesday.work
                , 'start': obj.Wednesday.start
                , 'end': obj.Wednesday.end
            };
            myWorkSchedule["Thursday"] = {
                'work': obj.Thursday.work
                , 'start': obj.Thursday.start
                , 'end': obj.Thursday.end
            };
            myWorkSchedule["Friday"] = {
                'work': obj.Friday.work
                , 'start': obj.Friday.start
                , 'end': obj.Friday.end
            };
            myWorkSchedule["Saturday"] = {
                'work': obj.Saturday.work
                , 'start': obj.Saturday.start
                , 'end': obj.Saturday.end
            };
            myWorkSchedule["Sunday"] = {
                'work': obj.Sunday.work
                , 'start': obj.Sunday.start
                , 'end': obj.Sunday.end
            };
        });
        // Once page loads, read this associate's booking data and update view
        $(document).ready(function () {
            console.log('in doc ready!');
            firebase.database().ref('/bookings/' + uid).once('value').then(function (snapshot) {
                console.log('in snapshot');
                snapshot.forEach(function (childSnapshot) {
                    var bookingDate = childSnapshot.key;
                    var bookingDetails = childSnapshot.val();
                    d1 = new Date(bookingDate);
                    // Loop thru bookings to block out time slots on view 
                    days.forEach(function (day) {
                        day.timeslots.forEach(function (slot) {
                            if (slot.timestamp == d1.toString()) {
                                slot.booked = true;
                            };
                        });
                    });
                });
                // Update the view
                $rootScope.$apply();
            });
        });

        function getMinutesBetweenDates(startDate, endDate) {
            var diff = endDate.getTime() - startDate.getTime();
            return (diff / 60000);
        };
        $scope.$watch('selectItem', function (newValue) {
            // If user has selected (or re-selected) a service, then get service time and build time slots
            if (newValue) {
                //console.log('newValue.value=' + newValue.text);
                $scope.myService = newValue.text;
                firebase.database().ref('/associates/' + uid + '/serviceTimes/' + newValue.value).once('value').then(function (snapshot) {
                    serviceTime = snapshot.val().start;
                    $scope.serviceTime = serviceTime/60;
                    var mySlotMinutes = segmentMinutes == 0 ? serviceTime : segmentMinutes;
                    generateBookingCalendar(dayCount, mySlotMinutes, myWorkSchedule, serviceTime);  
                });
            };
        });
      
      
        $("#service_select").on(function () {
            alert('hello');
            $('html, body').animate({
                scrollTop: $("#myDiv").offset().top
            }, 2000);
        });
      
        // GenerateBookingCalendar build the calendar view based on how many days staffer specified in profile (advanced),
        // and the segment time (service time) associate to the service the user selected.  The result is a calendar where
        // available time slots can be selected for booking!
        function generateBookingCalendar(dayCount, slotMinutes, myWorkSchedule, serviceTime) {
            
            var slotsRequired = Math.ceil(serviceTime / slotMinutes);
            var days = [];
            for (i = 0; i < dayCount; i++) {
                var d1 = Date.today();
                d1.addDays(i);
                var todaysDate = d1.toString("d-MMM-yyyy");
                var dayofWeek = d1.getDayName();
                var starttime = myWorkSchedule[dayofWeek].start;
                var endtime = myWorkSchedule[dayofWeek].end;
                var dow = d1.getDay();

                // Inject space into time to appease date parser
                starttime = starttime.replace('am', ' am');
                starttime = starttime.replace('pm', ' pm');
                endtime = endtime.replace('am', ' am');
                endtime = endtime.replace('pm', ' pm');
                
                d1 = new Date(todaysDate + ' ' + starttime);
                d2 = new Date(todaysDate + ' ' + endtime);
                
                // Calculate segments based on duration between starttime and endtime, divided by segment minutes
                workMinutes = getMinutesBetweenDates(d1, d2);
                segments = workMinutes / slotMinutes;
                slots = [];
                for (j = 0; j < segments; j++) {
                    slot = d1.clone();
                    
                    // if this is a staffer's workday, then set 'booked' to false so clients can book appointments
                    isWorkday = myWorkSchedule[dayofWeek].work == 'on' ? false : true;
                    slots.push({
                        'booked': isWorkday
                        , 'start': slot.toString("hh:mm tt")
                        , 'timestamp': slot
                    });
                    d1.addMinutes(slotMinutes);
                };
                day = {
                    'todaysDate': todaysDate
                    , 'dayofWeek': dayofWeek
                    , 'dow': dow
                    , 'timeslots': slots
                };
                days.push(day);
            };
            $scope.days = days;
            
            
            // Now we block out time slots based on current bookings
            firebase.database().ref('/bookings/' + uid).once('value').then(function (snapshot) {
                console.log('in snapshot');
                snapshot.forEach(function (childSnapshot) {                    
                    var bookingDate = childSnapshot.key;
                    var bookingDetails = childSnapshot.val();
                    var startOfBooking = new Date(bookingDate);
                    var pastBooking = startOfBooking.compareTo(Date.today()) == -1 ? true : false;
                    
                    if( !pastBooking ) {
                        var endOfBooking = startOfBooking.clone().addMinutes(bookingDetails.minutesToComplete - 1);
                    
                        // Loop thru bookings to block out time slots on view 
                        days.forEach(function (day) {
                            day.timeslots.forEach(function (slot, index) {
                                if( slot.timestamp.between(startOfBooking, endOfBooking)) {
                                    slot.booked = true;
                                };
                                
                                if( day.timeslots.length - 1 === index ) { // Last slot of the day?
                                    // if this service takes longer than the last timeslot of the day, block if no overflow 
                                    if( serviceTime > slotMinutes ) {
                                        if( !allowOverflow ) {
                                            slot.booked = true;
                                        }
                                    }
                                }
                            });
                        });
                    
                        // Make a second pass and block out slots where there's not enough contiguous time for service
                        days.forEach(function (day) {
                            day.timeslots.forEach(function (slot, index) {
                                if( !day.timeslots[index].booked ) {        // Open slot?
                                    for(i = 0; i < slotsRequired; i++) {
                                        tempix = index + i;
                                        if( tempix < day.timeslots.length ) {
                                            startofAppointment = new Date(day.timeslots[tempix].timestamp);
                                            endofAppointment = startofAppointment.clone().addMinutes(slotMinutes);
                                            
                                            // End of a booking falls between an appointment slot (we have not blocke out yet, so BLOCK!)
                                            if( endOfBooking.between(startofAppointment, endofAppointment)) {
                                                //console.log('block out!!');
                                                //console.log(day.timeslots[tempix]);
                                                day.timeslots[index].booked = true;
                                            };
                                        };
                                    };
                                };
                            });                    
                        });
                    };  // if not pastBooking

                });
                
                // Update the view
                $rootScope.$apply();
            });
        }; // generateBookingCalendar
      } // end main function                                    
]); // Controller
