myApp.controller('ServicesController', ['$scope', '$rootScope', 'Authentication', '$firebaseArray', '$routeParams', '$location', '$anchorScroll',

  function ($scope, $rootScope, Authentication, $firebaseArray, $routeParams, $location, $anchorScroll) {
      
      /* ------------------- Load profile data --------------------- */
      console.log('in services controller!');
      window.scrollTo(0, 0);

      $scope.isHairSpecialist = false;
      $scope.isBridalSpecialist = false;
      $scope.isFitnessExpert = false;
      $scope.isHairSpecialist = false;
      $scope.isMassageSpecialist = false;
      $scope.isMakeupSpecialist = false;
      $scope.isNailSpecialist = false;
      $scope.isSpaSpecialist = false;
      $scope.isTeethSpecialist = false;
      
      $scope.services = [];
      ref = firebase.database().ref('/services');
      ref.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            $scope.services.push(childData);
        });
        $scope.$apply();
      });
       
      $scope.specialists = [];
      sref = firebase.database().ref('/associates');
      sref.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            $scope.specialists.push(childData);
            
            // Set flags that indicate whether at least one specialist found in each particular category
            if( childSnapshot.val().profile == 'on' ) {                
                if( childSnapshot.val().title == 'Hair Stylist') { $scope.isHairSpecialist = true; }
                if( childSnapshot.val().title == 'Hair Stylist & Color Specialist') { $scope.isHairSpecialist = true; }
                if( childSnapshot.val().title == 'Nail Technician') { $scope.isNailSpecialist = true; }
                if( childSnapshot.val().title == 'Massage Therapist') { $scope.isMassageSpecialist = true; }
                if( childSnapshot.val().title == 'Makeup Artist') { $scope.isMakeupSpecialist = true; }
                if( childSnapshot.val().title == 'Makeup Artist & Aesthetician') { $scope.isMakeupSpecialist = true; }
                if( childSnapshot.val().title == 'Color Specialist') { $scope.isHairSpecialist = true; }
                if( childSnapshot.val().title == 'Facials, Brows & Makeup') { $scope.isSpaSpecialist = true; }
                if( childSnapshot.val().title == 'Bridal Stylist') { $scope.isBridalSpecialist = true; }
                if( childSnapshot.val().title == 'Personal Trainer') { $scope.isFitnessExpert = true; }
                if( childSnapshot.val().title == 'Fitness Trainer') { $scope.isFitnessExpert = true; }
                if( childSnapshot.val().title == 'Teeth Whitening Specialist') { $scope.isTeethSpecialist = true; }
            }       
        });
        $scope.$apply();
          
        // Scroll to target if there's a "goto" parameter
        angular.element(function () {
            if($routeParams.goto) {
                $anchorScroll.yOffset = 100;  // Account for nav bar
                if (window.innerWidth*window.devicePixelRatio <= 1530) {  // If mobile nav, no offset needed
                    $anchorScroll.yOffset = 0;
                }
                $anchorScroll($routeParams.goto);
            }
        });  
          
      });
      
      // Custom filter for Spa section (include massage, facial, makeup, aestheticians)
      $scope.getHairExperts = function() {
          return function(item) {

              if( item.profile == 'on' && 
                 (item.title[0] == 'Hair Stylist & Color Specialist' || item.title[0] == 'Hair Stylist')) {
                  return true;
              } else {
                  return false;
              }
         };          
      }
      
      // Custom filter for Spa section (include massage, facial, makeup, aestheticians)
      $scope.getSpaSpecialists = function() {
          return function(item) {
              if( item.profile == 'on' && 
                 (item.title == 'Makeup Artist & Aesthetician' || item.title == 'Massage Therapist' || 
                  item.title == 'Facials, Brows & Makeup')) {
                  return true;
              } else {
                  return false;
              }
         };          
      }
      
      // Custom filter for Fitness section (include Fitness Trainer and Personal Trainer)
      $scope.getFitnessExperts = function() {
          return function(item) {
              if( item.profile == 'on' && 
                  (item.title == 'Fitness Trainer' || item.title == 'Personal Trainer')) {
                  return true;
              } else {
                  return false;
              };
         };          
      }      
      
}]); // Controller