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
            if (authUser) {
                console.log('in AuthStateChanged');
                console.log(authUser);
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
            
            login: function (user) {
                auth.signInWithEmailAndPassword(
                    user.email, 
                    user.password)
                .then(function (regUser) {
                    firebase.database().ref('/users/' + regUser.uid).once('value').then(function (snapshot) {
                        if( snapshot.val().admin && snapshot.val().admin == 'on' ) {
                            if( snapshot.val().associate && snapshot.val().associate == 'on' ) {
                                $location.path('/profile');
                            } else {
                                $location.path('/admin');
                            }
                        } else if ( snapshot.val().associate && snapshot.val().associate == 'on' ) {
                            $location.path('/profile');
                        } else {
                            myObject.logout();
                            alert('Not a staff member.');
                            $location.path('/');
                        }
                        $rootScope.$apply();
                    });
                }).catch(function (error) {
                    console.log('login failed!');
                    $rootScope.message = error.message;
                    $rootScope.$apply();
                });
            },
            
            logout: function () {
                console.log('logout success!');
                auth.signOut();
            },
            
            requireAuth: function () {
                // I've simulated $requireAuth since it does not appear to be supported any longer.
                if ($rootScope.currentUser == '') {
                    return $q.reject("AUTH_REQUIRED")
                }
            },
            
            pwReset: function (user) {
                console.log('in password reset');
                const promise = auth.sendPasswordResetEmail(user.email);
                promise.catch(function (e) {
                    console.log('Password Reset Failed!');
                    console.log(e.message);
                });
            },
            
            register: function (user) {
                    console.log('in register new user!');
                    auth.createUserWithEmailAndPassword(user.email, user.password).then(function (regUser) {
                        console.log(regUser.uid);
                        firebase.database().ref('/users/' + regUser.uid).set({
                            email: user.email
                            , firstname: user.firstname
                            , lastname: user.lastname
                            , createdate: new Date().toDateString()
                            , regUser: regUser.uid
                        });
                        myObject.logout();
                        alert('registration successful!');
                        $location.path('/');
                    }).catch(function (error) {
                        console.log('Registration Failed!');
                        console.log(error.message);
                        $rootScope.message = error.message;
                        $rootScope.$apply();
                    });
                    $('#myModalRegistration').modal('hide');
                }
        };
        return myObject;
}]);