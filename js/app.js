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
    .when('/login', {
        templateUrl: '/views/login.html',
        controller: 'CredentialsController'
    })
    .when('/register', {
        templateUrl: '/views/register.html',
        controller: 'CredentialsController'
    })
    .when('/profile', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileFormController',
        resolve: { 
            currentAuth: function(Authentication) {
                return Authentication.requireAuth();
            } 
        }
    })
    .when('/admin', {
        templateUrl: 'views/admin.html',
        controller: 'AdminController',
        resolve: { 
            currentAuth: function(Authentication) {
                return Authentication.requireAuth();
            } 
        }
    })
    .when('/main', {
        templateUrl: 'views/main.html'
    })
    .when('/contact', {
        templateUrl: 'views/contact.html'
    })
    .when('/book-now', {
        templateUrl: 'views/book-now.html'
    })
    .when('/specialists', {
        templateUrl: 'views/specialists.html',
        controller: 'SpecialistsController',
    })
    .when('/specialists/:servQuery', {
        templateUrl: 'views/specialists.html',
        controller: 'SpecialistsController',
    })
    .when('/specialist-detail/:uID', {
        templateUrl: 'views/specialist-detail.html',
        controller: 'SpecialistDetailController',
    })
    .when('/services', {
        templateUrl: 'views/services.html',
        controller: 'ServicesController',
    })
    .when('/services/:goto', {
        templateUrl: 'views/services.html',
        controller: 'ServicesController',
    })
    .otherwise({
        redirectTo: '/main'
    });
}]);