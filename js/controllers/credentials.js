myApp.controller('CredentialsController',
  ['$scope', 'Authentication', '$location', 
  function($scope, Authentication, $location) {
      
  window.scrollTo(0, 0);      
      
  $scope.login = function() {
    Authentication.login($scope.user);      
  }; 

  $scope.logout = function() {
    Authentication.logout();
  };

  $scope.register = function() {
    Authentication.register($scope.user);
    
  };
      
  $scope.pwReset = function() {
    Authentication.pwReset($scope.user);
  };
      
  $scope.requireAuth = function() {
    Authentication.requireAuth($scope.user);
  };  

}]);

