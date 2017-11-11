var myApp = angular.module('myApp',
  ['ngRoute', 'firebase', 'ui.tinymce', 'ngSanitize', 'rzModule'])
  .constant('FIREBASE_URL', 'https://dominic-and-company.firebaseio.com/');

myApp.run(['$rootScope', '$location',
  function($rootScope, $location) {
    $rootScope.$on('$routeChangeError',
      function(event, next, previous, error) {
        console.log('in routeChangeError!');
        if (error=='AUTH_REQUIRED') {
          alert('Sorry, you must log in to access that page');
          $location.path('/');
        } // AUTH REQUIRED
      }); //event info
}]); //run

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/profile', {
      templateUrl: 'views/profile.html',
      controller: 'ProfileFormController',
      resolve: { 
        currentAuth: function(Authentication) {
            return Authentication.requireAuth();
        } 
      } //resolve
    })
  .when('/admin', {
      templateUrl: 'views/admin.html',
      controller: 'AdminController',
      resolve: { 
        currentAuth: function(Authentication) {
            return Authentication.requireAuth();
        } 
      } //resolve
    })
    .when('/scheduler/:uID', {
      templateUrl: 'views/scheduler.html',
      controller: 'SchedulerController',
      resolve: { 
        currentAuth: function(Authentication) {
            return Authentication.requireAuth();
        }
      }  //resolve
    })
    .when('/bookings', {
      templateUrl: 'views/bookings.html',
      controller: 'BookingController',
      resolve: { 
        currentAuth: function(Authentication) {
            return Authentication.requireAuth();
        }
      }  //resolve
    })
    .when('/header', {
      templateUrl: 'views/header.html'
    })
    .when('/about', {
      templateUrl: 'views/about.html'
    })
    .when('/map', {
      templateUrl: 'views/map.html',
      controller: 'MapController'
    })
    .when('/envision', {
      templateUrl: 'views/envision.html',
      controller: 'EnvisionController'
    })
    .when('/services', {
      templateUrl: 'views/services.html',
    })
    .when('/staff', {
      templateUrl: 'views/staff.html',
      controller: 'StaffController',
    })
    .when('/staffdetail/:uID', {
      templateUrl: 'views/staffdetail.html',
      controller: 'StaffDetailController',
    })
    .otherwise({
      redirectTo: '/header'
    });
}]);