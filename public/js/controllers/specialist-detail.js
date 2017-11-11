myApp.controller('SpecialistDetailController', ['$scope', '$rootScope', 'Authentication', '$firebaseObject', '$firebaseArray', '$routeParams',

  function ($scope, $rootScope, Authentication, $firebaseObject, $firebaseArray, $routeParams) {
      
      window.scrollTo(0, 0);
      
        /* ------------------- Load profile data --------------------- */
        console.log('in specialist detail controller!');     
      
        // retrieve the requested staff member's info
        ref = firebase.database().ref('/associates/' + $routeParams.uID);
        var specialist = $firebaseObject(ref);
        console.log(specialist);
      
        specialist.$loaded().then(function() {
            $scope.specialist = specialist;
            
            if($scope.specialist.facebookURL.length > 0) {
                if($scope.specialist.facebookURL.substr(0, 4) != "http") {
                    $scope.specialist.facebookURL = 'https://' + $scope.specialist.facebookURL;
                }
            }
            if($scope.specialist.twitterURL.length > 0) {
                if(!$scope.specialist.twitterURL.substr(0, 4) != "http") {
                    $scope.specialist.twitterURL = 'https://' + $scope.specialist.twitterURL;
                }
            }
            if($scope.specialist.instagramURL.length > 0) {
                if(!$scope.specialist.instagramURL.substr(0, 4) != "http") {
                    $scope.specialist.instagramURL = 'https://' + $scope.specialist.instagramURL;
                }
            }
            if($scope.specialist.googleURL.length > 0) {
                if(!$scope.specialist.googleURL.substr(0, 4) != "http") {
                    $scope.specialist.googleURL = 'https://' + $scope.specialist.googleURL;
                }
            }
            
            $scope.lookupPriceInfo = function(service) {
                var s = service.toLowerCase();
                s = s.replace(/ \+ /g, "_");
                s = s.replace(/ \& /g, "_");
                s = s.replace(/\, /g, "_");
                s = s.replace(/ - /g, "_");
                s = s.replace(/-/g, "_");
                s = s.replace(/'/g, "");
                s = s.replace(/\//g, "_");
                s = s.replace(/ /g, "_");
                
                if( service == "SHAMPOO, BLOW DRY + STYLE") {
                    console.log('IN SHAMPOO, BLOW DRY + STYLE');
                    console.log(s);
                }
                return $scope.specialist.services[s];
            }
            
            
        });
      
        // Get the picture gallery 
        gref = firebase.database().ref('/gallery/' + $routeParams.uID);
        var galleryList = $firebaseArray(gref);
      
        galleryList.$loaded().then(function() {
            $scope.gallery = galleryList;
        });
      
        
        
      
      
}]); // Controller