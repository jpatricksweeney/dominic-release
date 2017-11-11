myApp.controller('BookingController', ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'FIREBASE_URL',            
  function ($scope, $rootScope, $firebaseAuth, $firebaseArray, FIREBASE_URL) {
      
      console.log('in bookings controller!');
      bookUID = $rootScope.currentUser.uid;
      
      /* Get staff */
      ref = firebase.database().ref('/bookings/' + bookUID);
      var apptList = $firebaseArray(ref);
      $scope.appointments = apptList;
      
      /* Delete staff member handler */
      $scope.deleteAppointment = function(appt){
          console.log('modalBookingDeleteConfirm appointment!!');
          
          // Confirm staffer delete
          $('#theclientname').text(appt.client);
          $('#thebookdate').text(appt.date);
          
          $('#modalBookingDeleteConfirm').modal('show');
          $('#pf_modalBDYes').on('click', function () {
              $scope.appointments.$remove(appt);
          });
      }; 
}]); // Controller



