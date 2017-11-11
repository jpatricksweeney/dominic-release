myApp.factory('Authentication', ['$rootScope', '$firebaseAuth', '$firebaseObject'
  , '$location', 'FIREBASE_URL', '$q'
  , function ($rootScope, $firebaseAuth, $firebaseObject, $location, FIREBASE_URL, $q) {
        var config = {
            apiKey: "AIzaSyBClzC2i_sRSvQdFEGFshGIUyu5lkA3FNY"
            , authDomain: "dominic-and-company.firebaseapp.com"
            , databaseURL: "https://dominic-and-company.firebaseio.com"
            , storageBucket: "dominic-and-company.appspot.com"
            , messagingSenderId: "711349142119"
        };
        firebase.initializeApp(config);
        const auth = firebase.auth();     
      
        auth.onAuthStateChanged(function (authUser) {
            
            if( authUser ) {
                console.log('in AuthStateChanged');
                console.log(authUser);
                
                // Clear any errors displayed from previous login attempt
                $('#login-error').addClass('hide');
                
                // USING *APPLY* TO FORCE DIGEST CYCLE and thus update of "currentUser"
                $rootScope.$apply(function () {
                    $rootScope.currentUser = authUser;
                });
            }
            else {
                // No user is currently logged in
                $rootScope.$apply(function () {
                    $rootScope.currentUser = '';
                });
            }
        });
      
      
        var myObject = {
            
            /* --------------------- Login functionality --------------------- */
            login: function(user) {
                auth.signInWithEmailAndPassword(user.email, user.password).then(function (regUser) {
                    console.log('login success!');
                    console.log(regUser.uid);
                    
                    // Clear any errors displayed from previous login attempt
                    $("#login-error").text(' ');
                    $('#login-error').addClass('hide');
                    
                    // Retrieve user's first name for display in success modal
                    firebase.database().ref('/users/' + regUser.uid).once('value').then(function (snapshot) {
                        console.log('authentication.js - read user data successful');
                        firstname = snapshot.val().firstname;
                        var welcomeMessage = 'Welcome ' + firstname + '!';
                        displaySuccess('Login Successful', welcomeMessage, '');
                        
                        // Update nav brand to welcome message when user logged in
                        $("#myBrand").text("Welcome " + firstname);
                        
                        // Is this an employee logging in?
                        $rootScope.$apply(function () {
                            $rootScope.isAssociate = snapshot.val().associate;
                            $rootScope.isAdmin = snapshot.val().admin;
                        });
           
                    });
                    
                    // We've successfully logged in, so close the drop-down!
                    $(".dropdown-toggle").each(function () {
                        $(this).attr("aria-expanded", false);
                        $(this).parent("li").removeClass("open");
                    });
                    
                }).catch(function (error) {
                    console.log('login failed!');
                    console.log(error.message);
                    $("#login-error").text(error.message);
                    $('#login-error').removeClass('hide');
                });
            }, //login
            
            
            /* --------------------- Logout functionality --------------------- */
            logout: function() {
                console.log('logout success!');
                auth.signOut();
                                  
                $('#modalLogout').modal('show');             
                
                // Replace welcome message in navigate brand area with company name
                $("#myBrand").text("Salon and Spa");
                
            }, //logout
            
            /* --------------------- requireAuth functionality --------------------- */
            requireAuth: function() {
                // I've simulated $requireAuth since it does not appear to be supported any longer.
                if( $rootScope.currentUser == '' ) {
                    return $q.reject("AUTH_REQUIRED")
                }
            }, //require Authentication
            
            
            /* --------------------- Password reset functionality --------------------- */
            pwReset: function(user) {
                console.log('in password reset');
                const promise = auth.sendPasswordResetEmail(user.email);       
                promise.catch(function(e) { 
                    displayFail('Password Reset Failed!', e.message);
                });
                $('#myModalPasswordReset').modal('hide');
            }, // password reset request            
        
            
            /* --------------------- Register functionality --------------------- */
            register: function(user) {
                console.log('in register new user!');
                auth.createUserWithEmailAndPassword(user.email, user.password)
                .then(function(regUser) {
                    console.log(regUser.uid);
                    firebase.database().ref('/users/' + regUser.uid).set({
                        email: user.email,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        createdate: new Date().toDateString(),
                        regUser: regUser.uid
                    });
                    myObject.login(user);
                }).catch(function(error) {
                    displayFail('Registration Failed!', error.message);
                }); //createUser
                $('#myModalRegistration').modal('hide');
            } // register
            
        };
        return myObject;
      
        function displaySuccess(titleMsg, message, footerMsg) {
            $('#modalSuccessAlert-title').text(titleMsg);
            $('#modalSuccessAlert-body').text(message); 
            $('#modalSuccessAlert-footer').text(footerMsg);
            $('#modalSuccessAlert').modal('show');
        }
      
        function displayFail(titleMsg, error) {
            console.log(error);
            $("#modalFailAlert-title").text(titleMsg);
            $("#modalFailAlert-body").text(error);
            $('#modalFailAlert').modal('show');
        }
}]); //factory