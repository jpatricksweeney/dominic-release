myApp.controller('RegistrationController',
  ['$scope', 'Authentication',
  function($scope, Authentication) {
  
  $scope.login = function() {
    Authentication.login($scope.user);
  }; //login

  $scope.logout = function() {
    Authentication.logout();
  }; //logout

  $scope.register = function() {
    Authentication.register($scope.user);
  }; // register
      
  $scope.pwReset = function() {
    Authentication.pwReset($scope.user);
  }; //reset
      
  $scope.requireAuth = function() {
    Authentication.requireAuth($scope.user);
  }; //reset      

  // Handler closes hamburger menu once item (anchor) is selected
  $(document).ready(function(){
    $("a").click(function() {
        // Check for "login" menu item.  Do not close "login" menu, rather let it expand.  Close menu for any other selection
        if( !$(this).hasClass('dropdown-toggle') ) {
            $("#myNavbar").removeClass('navbar-collapse collapse in').addClass('navbar-collapse collapse');
        }
    });
  }); 

}]); // Controller

