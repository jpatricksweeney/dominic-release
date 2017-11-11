myApp.controller('SpecialistsController', ['$scope', '$rootScope', 'Authentication', '$firebaseArray', '$routeParams',

  function ($scope, $rootScope, Authentication, $firebaseArray, $routeParams) {
      
        /* ------------------- Load profile data --------------------- */
        console.log('in staff controller!');
      
        window.scrollTo(0, 0);
      
        $scope.query = $routeParams.servQuery;
      
        // Retrieve all specialists (ie. staff members or associates)
        ref = firebase.database().ref('/associates');
        var staffList = $firebaseArray(ref);
        $scope.staffers = staffList;
        $scope.staffOrder = "firstname";

        staffList.$loaded()
        .then(function(data){
            angular.forEach(data, function(value, key) {
                var storageRef = firebase.storage().ref().child('/images/' + value.regUID);
                storageRef.getDownloadURL().then(function (url) {
                    document.getElementById(value.regUID).src = url;
    
                }).catch(function (error) {
                    console.log('error retrieving picture for ' + value.firstname + ' ' + value.lastname);
                });
            })
        });

    $(document).ready(function () {
        $("#all-specialists").addClass('specialist-underline');
    });
      
    $(function() {
    $("#specialist-nav-section a").click(function(){
        $(".specialist-underline").removeClass("specialist-underline");
        });
    });
      
}]); // Controller