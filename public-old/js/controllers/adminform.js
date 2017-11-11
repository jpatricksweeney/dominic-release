myApp.controller('AdminController', ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'FIREBASE_URL',            
  function ($scope, $rootScope, $firebaseAuth, $firebaseArray, FIREBASE_URL) {
      
      console.log('in admin controller!');
      
      /* Get services */
      sref = firebase.database().ref('/services');
      var serviceList = $firebaseArray(sref);
      $scope.services = serviceList;
      
      /* Get staff */
      ref = firebase.database().ref('/associates');
      var staffList = $firebaseArray(ref);
      $scope.staffers = staffList;
      
      /* Get registered users (staff and customers) */
      uref = firebase.database().ref('/users');
      var userList = $firebaseArray(uref);
      $scope.users = userList;
      
      /* Delete staff member handler */
      $scope.deleteStaffmember = function(item){
          console.log('delete staff member!!');
          
          // Confirm staffer delete
          $('#fullName').text(item.firstname + " " + item.lastname);
          $('#modalDeleteConfirm').modal('show');
          $('#pf_modalYes').on('click', function () {
              $scope.staffers.$remove(item);
          });
      }   
  
      /* Delete user handler */
      $scope.deleteUser = function(item){
          console.log('delete user!!');
          
          // Confirm user delete
          $('#fullName').text(item.firstname + " " + item.lastname);
          $('#modalDeleteConfirm').modal('show');
          $('#pf_modalYes').on('click', function () {
              $scope.users.$remove(item);
          });
      } 

      /* Delete service handler */
      $scope.deleteService = function(item){
          console.log('delete service handler!!');
          $scope.services.$remove(item);
      }     
      
      /* Add service handler */
      $scope.addService = function(item){
          $scope.services.$add(item);
      } 
      
      /* Toggle user associate handler */
      $scope.toggleAssociate = function(item){
          console.log('toggle user associate flag!!');
          console.log(item);
          if( item.associate == 'on' ) {
              item.associate = 'off';
          } else {
              item.associate = 'on';
          }
          $scope.users.$save(item);
      }           
      
      var appointments = [];
        firebase.database().ref('/bookings').once('value').then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                childSnapshot.forEach(function(bookingDetails) {
                    var bd = bookingDetails.val();
                    appointments.push({
                        'client': bd.client
                        , 'date': bd.date
                        , 'dateBooked': bd.dateBooked
                        , email: bd.email
                        , minutesToComplete: bd.minutesToComplete
                        , service: bd.service
                        , sortDate: bd.sortDate
                        , specialist: bd.specialist
                    });
                });
            });
            $scope.$apply();
        });
      $scope.appointments = appointments; 
      
}]); // Controller