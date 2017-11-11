myApp.controller('ProfileFormController', ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'FIREBASE_URL', 
                                           
  function ($scope, $rootScope, $firebaseAuth, $firebaseArray, FIREBASE_URL) {
      
      profUID = $rootScope.currentUser.uid;
      
      /* Get gallery */
      gref = firebase.database().ref('/gallery/' + profUID);
      var galleryList = $firebaseArray(gref);
      $scope.gallery = galleryList;
      
      /* Delete gallery URL handler */
      $scope.deleteGalleryURL = function(item){
          console.log('delete gallery url handler!!');
          $scope.gallery.$remove(item);
      }     
      
      /* Add gallery image handler */
      $scope.addGalleryURL = function(item){
          console.log('add gallery url handler!!');
          $scope.gallery.$add(item);
      } 
                                           
        $scope.tinymceOptions = {
            plugins: 'advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table contextmenu paste code',
            toolbar: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image'
        };      
      
        /* ------------------- Load profile data --------------------- */
        console.log('in profile controller!');
                
        //profUID = $rootScope.currentUser.uid;
        var spinner = startSpinner();
        firebase.database().ref('/associates/' + profUID).once('value').then(function (snapshot) {
            console.log('in populate profile form');
            
            // If no snapshot, this is the very first time in for staff member so initialize critical items
            if( !snapshot.val() ) {
                console.log('in initial & POPULATE service times');
                serviceTimes = [];
                populateServiceTimes(serviceTimes);
                $scope.dayCount = 7; // Default to a week if not specified
                $scope.segmentTime = 60; // Default 60-minute segment time
                $scope.allowOver = false;
                $scope.tinymceModel = " ";
            }
            
            var myProfileActive = snapshot.val().profile;
            populateCheckbox('pf_cbActive', myProfileActive);
            
            $('#pf_txtFirstName').val(snapshot.val().firstname);
            $('#pf_txtLastName').val(snapshot.val().lastname);            
            $('#pf_txtEmail').val(snapshot.val().email);
            $('#pf_txtWebsite').val(snapshot.val().website);
            $('#pf_txtFacebookURL').val(snapshot.val().facebookURL);
            $('#pf_txtTwitterURL').val(snapshot.val().twitterURL);
            $('#pf_txtInstagramURL').val(snapshot.val().instagramURL);
            $('#pf_txtGoogleURL').val(snapshot.val().googleURL);
            
            $('#pf_txtMobile').val(snapshot.val().mobile);
            var myTitle = snapshot.val().title;
               
            
            populateCheckbox('pf_cbMyTitle', myTitle);
            var hairColor = snapshot.val().hairColor;
            populateCheckbox('pf_cbHairColor', hairColor);
            var hairTexturizers = snapshot.val().hairText;
            populateCheckbox('pf_cbHairTexturizers', hairTexturizers);
            var hairCuts = snapshot.val().hairCut;
            populateCheckbox('pf_cbHairCuts', hairCuts);
            var hairAddition = snapshot.val().hairAddition;
            populateCheckbox('pf_cbHairAddition', hairAddition);
            var waxing = snapshot.val().wax;
            populateCheckbox('pf_cbWax', waxing);
            var manicures = snapshot.val().mani;
            populateCheckbox('pf_cbManicures', manicures);          
            var pedicures = snapshot.val().pedi;
            populateCheckbox('pf_cbPedicures', pedicures);
            var makeup = snapshot.val().makeup;
            populateCheckbox('pf_cbMakeup', makeup);
            var brow = snapshot.val().brow;
            populateCheckbox('pf_cbBrow', brow);
            var products = snapshot.val().products;
            populateCheckbox('pf_cbProducts', products);
            var massage = snapshot.val().massage;
            populateCheckbox('pf_cbMassage', massage);
            var facial = snapshot.val().facial;
            populateCheckbox('pf_cbFacial', facial);       
                
            /* About textarea is now a tinymce editor allowing for rich text */
            $scope.tinymceModel = snapshot.val().about;
            
            /* Hours available */
            doesExist = snapshot.val().hours;
            if( doesExist ) {
                snapshot.val().hours.Monday.work == 'on' ? $scope.checkedMonday = true : $scope.checkedMonday = false;
                snapshot.val().hours.Tuesday.work == 'on' ? $scope.checkedTuesday = true : $scope.checkedTuesday = false;
                snapshot.val().hours.Wednesday.work == 'on' ? $scope.checkedWednesday = true : $scope.checkedWednesday = false;
                snapshot.val().hours.Thursday.work == 'on' ? $scope.checkedThursday = true : $scope.checkedThursday = false;
                snapshot.val().hours.Friday.work == 'on' ? $scope.checkedFriday = true : $scope.checkedFriday = false;
                snapshot.val().hours.Saturday.work == 'on' ? $scope.checkedSaturday = true : $scope.checkedSaturday = false;
                snapshot.val().hours.Sunday.work == 'on' ? $scope.checkedSunday = true : $scope.checkedSunday = false;                
                $('#pf_txtMondayStart').val(snapshot.val().hours.Monday.start);
                $('#pf_txtMondayEnd').val(snapshot.val().hours.Monday.end);
                $('#pf_txtTuesdayStart').val(snapshot.val().hours.Tuesday.start);
                $('#pf_txtTuesdayEnd').val(snapshot.val().hours.Tuesday.end);
                $('#pf_txtWednesdayStart').val(snapshot.val().hours.Wednesday.start);
                $('#pf_txtWednesdayEnd').val(snapshot.val().hours.Wednesday.end);            
                $('#pf_txtThursdayStart').val(snapshot.val().hours.Thursday.start);
                $('#pf_txtThursdayEnd').val(snapshot.val().hours.Thursday.end);
                $('#pf_txtFridayStart').val(snapshot.val().hours.Friday.start);
                $('#pf_txtFridayEnd').val(snapshot.val().hours.Friday.end);            
                $('#pf_txtSaturdayStart').val(snapshot.val().hours.Saturday.start);
                $('#pf_txtSaturdayEnd').val(snapshot.val().hours.Saturday.end);             
                $('#pf_txtSundayStart').val(snapshot.val().hours.Sunday.start);
                $('#pf_txtSundayEnd').val(snapshot.val().hours.Sunday.end); 
            }
            
            var referralOn = snapshot.val().referral;
            if (referralOn == "on") {
                $("input[id='pf_cbReferral']").each(function (index, element) {
                    element.setAttribute("checked", true);
                });
            }
            var newClientOn = snapshot.val().newClient;
            if (newClientOn == "on") {
                $("input[id='pf_cbNcDiscount']").each(function (index, element) {
                    element.setAttribute("checked", true);
                });
            }
            var LoyalDiscountOn = snapshot.val().loyalty;           
            if (LoyalDiscountOn == "on") {
                $("input[id='pf_cbLoyalDiscount']").each(function (index, element) {
                    element.setAttribute("checked", true);
                });
            }
            var squareOn = snapshot.val().square;           
            if (squareOn == "on") {
                $("input[id='pf_cbSquare']").each(function (index, element) {
                    element.setAttribute("checked", true);
                });
            }
            var styleseatOn = snapshot.val().styleseat;           
            if (styleseatOn == "on") {
                $("input[id='pf_cbStyleSeat']").each(function (index, element) {
                    element.setAttribute("checked", true);
                });
            }
            $('#pf_txtRefDiscount').val(snapshot.val().refdiscountPct);
            $('#pf_txtNcDiscount').val(snapshot.val().ncdiscountPct);
            $('#pf_txtLoyalDiscount').val(snapshot.val().loyaldiscountPct);   
            $('#pf_txtSquareID').val(snapshot.val().squareID);
            $('#pf_txtStyleSeatID').val(snapshot.val().styleseatID);
            $('#pf_loyaltydp').val(snapshot.val().loyaltyDiscountExpiration);
            $('#pf_cbOnlineBooking').val(snapshot.val().onlineBooking);
            
            // Booking Configuration
            $scope.dayCount = 7;  // Default to a week if not specified
            if( snapshot.val().bookingConfiguration ) {
                $scope.dayCount = snapshot.val().bookingConfiguration.dayCount;
            }
            $scope.segmentTime = 60;  // Default 60-minute segment time
            if( snapshot.val().bookingConfiguration ) {
                $scope.segmentTime = snapshot.val().bookingConfiguration.segmentTime;
            }
            snapshot.val().bookingConfiguration.allowOverflow == 'on' ? $scope.allowOver = true : $scope.allowOver = false; 
            
            // Service times specify the time it takes a specialist to complete a service (ombre, men's haircut, etc)
            serviceTimes = snapshot.val().serviceTimes;
            if( serviceTimes === undefined ) {
                serviceTimes = [];
            }                  
            
            // Now load all the service times (or initialize if non-existent)
            populateServiceTimes(serviceTimes);
            
            // Retrieve profile pic URL from Google Storage
            var storageRef = firebase.storage().ref().child('/images/' + profUID);
            
            storageRef.getDownloadURL().then(function (url) {
                document.getElementById("pf_imgProfilePic").src = url;
                // profile pic handler for deleting
                $('.img-wrap .close').on('click', function () {
                    //console.log(storageRef);
                    // Confirm delete
                    $('#modalDeleteConfirm').modal('show');
                    $('#pf_modalYes').on('click', function () {
                        // Delete the file
                        storageRef.delete().then(function () {
                            console.log('delete profile pic successful');
                            document.getElementById("pf_imgProfilePic").src = '/images/default_avatar.png';
                            show('#deleteProfilePicSuccess');
                        }).catch(function (error) {
                            console.log('delete profile pic NOT successful');
                        });
                    });
                });
                spinner.stop();
            }).catch(function (error) {
                console.log("error getting user's profile pic!");
                console.log(error);
                spinner.stop();
            });
        }).catch(function (error) {
            // error wil be an Object
            console.log("no associate for this user's UID!");
            firebase.database().ref('/users/' + profUID).once('value').then(function (snapshot) {
                console.log('in firebase database read user')
                firstname = snapshot.val().firstname;
                lastname = snapshot.val().lastname;
                email = snapshot.val().email
                $('#welcome-name').text(firstname + ' ' + lastname);
                $('#pf_txtFirstName').val(firstname);
                $('#pf_txtLastName').val(lastname);
                $('#pf_txtEmail').val(email);
                spinner.stop();
            }).catch(function (e) {
                console.log('in read associate error handler')
                console.log(e.message);
                spinner.stop();
            });
        });
      
      
        /* ------------------- Save profile data --------------------- */
        btnSaveProfile.addEventListener('click', function (e) {
            const pf_profileActive = getCheckedCheckboxesFor('pf_cbActive');
            const pf_firstName = pf_txtFirstName.value;
            const pf_lastName = pf_txtLastName.value;
            const pf_email = pf_txtEmail.value;
            const pf_website = pf_txtWebsite.value;
            const pf_facebook = pf_txtFacebookURL.value;
            const pf_twitter = pf_txtTwitterURL.value;
            const pf_instagram = pf_txtInstagramURL.value;
            const pf_google = pf_txtGoogleURL.value;
            
            const pf_mobile = pf_txtMobile.value;
            const pf_myTitle = getCheckedCheckboxesFor('pf_cbMyTitle');
            const pf_profilePic = pf_txtProfilePic;
            
            var myHours = {
                Monday : {
                    'work': $scope.checkedMonday ? 'on':'off',
                    'start': pf_txtMondayStart.value,
                    'end': pf_txtMondayEnd.value
                },
                Tuesday : {
                    'work': $scope.checkedTuesday ? 'on':'off',
                    'start': pf_txtTuesdayStart.value,
                    'end': pf_txtTuesdayEnd.value
                },
                Wednesday : {
                    'work': $scope.checkedWednesday ? 'on':'off',
                    'start': pf_txtWednesdayStart.value,
                    'end': pf_txtWednesdayEnd.value
                },
                Thursday : {
                    'work': $scope.checkedThursday ? 'on':'off',
                    'start': pf_txtThursdayStart.value,
                    'end': pf_txtThursdayEnd.value
                },
                Friday : {
                    'work': $scope.checkedFriday ? 'on':'off',
                    'start': pf_txtFridayStart.value,
                    'end': pf_txtFridayEnd.value
                },
                Saturday : {
                    'work': $scope.checkedSaturday ? 'on':'off',
                    'start': pf_txtSaturdayStart.value,
                    'end': pf_txtSaturdayEnd.value
                },
                Sunday : {
                    'work': $scope.checkedSunday ? 'on':'off',
                    'start': pf_txtSundayStart.value,
                    'end': pf_txtSundayEnd.value
                }
            }

            
            /* About text is created from a "tinymce" embedded editor */
            const pf_about = $scope.tinymceModel;    
            
            const pf_hairColor = getCheckedCheckboxesFor('pf_cbHairColor');
            const pf_hairTexturizer = getCheckedCheckboxesFor('pf_cbHairTexturizers');
            const pf_hairCuts = getCheckedCheckboxesFor('pf_cbHairCuts');
            const pf_hairAddition = getCheckedCheckboxesFor('pf_cbHairAddition');
            const pf_wax = getCheckedCheckboxesFor('pf_cbWax');
            const pf_massage = getCheckedCheckboxesFor('pf_cbMassage');
            const pf_facial = getCheckedCheckboxesFor('pf_cbFacial'); 
            const pf_manicures = getCheckedCheckboxesFor('pf_cbManicures');
            const pf_pedicures = getCheckedCheckboxesFor('pf_cbPedicures');
            const pf_makeup = getCheckedCheckboxesFor('pf_cbMakeup');
            const pf_brow = getCheckedCheckboxesFor('pf_cbBrow');
            const pf_products = getCheckedCheckboxesFor('pf_cbProducts');
            const pf_referral = getCheckedCheckboxesFor('pf_cbReferral');
            const pf_newClient = getCheckedCheckboxesFor('pf_cbNcDiscount');
            const pf_loyalty = getCheckedCheckboxesFor('pf_cbLoyalDiscount');
            const pf_square = getCheckedCheckboxesFor('pf_cbSquare');
            const pf_styleseat = getCheckedCheckboxesFor('pf_cbStyleSeat');
            const pf_OnlineBooking = getCheckedCheckboxesFor('pf_cbOnlineBooking');
            const pf_refDiscount = pf_txtRefDiscount.value;
            const pf_ncDiscount = pf_txtNcDiscount.value;
            const pf_loyalDiscount = pf_txtLoyalDiscount.value;
            const pf_squareID = pf_txtSquareID.value;
            const pf_styleseatID = pf_txtStyleSeatID.value;
            const pf_loyaltyDiscountExpiration = pf_loyaltydp.value;
            
            // Booking Configuration
            pf_dayCount = $scope.dayCount;
            pf_segmentTime = $scope.segmentTime;
            var bookingConfig = {
                'dayCount': pf_dayCount,
                'segmentTime': pf_segmentTime,
                'allowOverflow': $scope.allowOver ? 'on':'off',
            }
            
            // handle Service times (Advanced tab)
            srvcTimes = {};
            
            // Hair Color
            srvcTimes["Color_Retouch"] = createServiceObj($scope.rzColorRetouch);
            srvcTimes["Weaving"] = createServiceObj($scope.rzWeaving);
            srvcTimes["Virgin_Hair_Color"] = createServiceObj($scope.rzVirginHairColor);
            srvcTimes["Partial_Weaving"] = createServiceObj($scope.rzPartialWeaving);
            srvcTimes["Balayage"] = createServiceObj($scope.rzBalayage);
            srvcTimes["Full_Highlights"] = createServiceObj($scope.rzFullHighlights);
            srvcTimes["Face_Framing_Highlights"] = createServiceObj($scope.rzFaceFramingHighlights);
            srvcTimes["All_Over_Color"] = createServiceObj($scope.rzAllOverColor);
            srvcTimes["T_Line_Part_Only_Touch_Up"] = createServiceObj($scope.rzTLinePartOnlyTouchUp);
            srvcTimes["Ten_Foil"] = createServiceObj($scope.rzTenFoil);
            srvcTimes["Custom_Color"] = createServiceObj($scope.rzCustomColor);
            srvcTimes["Dimensional_Highlights"] = createServiceObj($scope.rzDimensionalHighlights);
            srvcTimes["Ombre"] = createServiceObj($scope.rzOmbre);
            srvcTimes["Eyebrow_Tinting"] = createServiceObj($scope.rzEyebrowTinting);
            srvcTimes["Express_Color"] = createServiceObj($scope.rzExpressColor);
            srvcTimes["Corrective_Color"] = createServiceObj($scope.rzCorrectiveColor);
            srvcTimes["Weave_Slicing"] = createServiceObj($scope.rzWeaveSlicing);
            srvcTimes["Clear_Shine_Color_Treatment"] = createServiceObj($scope.rzClearShineColorTreatment);
            srvcTimes["Color_Enhancing_Shine_Treatment"] = createServiceObj($scope.rzColorEnhancingShineTreatment);
            srvcTimes["Men_s_Color"] = createServiceObj($scope.rzMensColor);
            
            // Hair Texturizers
            srvcTimes["Body_Wave"] = createServiceObj($scope.rzBodyWave);
            srvcTimes["Permanent"] = createServiceObj($scope.rzPermanent);
            srvcTimes["Permanent_Wave"] = createServiceObj($scope.rzPermanentWave);
            srvcTimes["Keratin_Treatment"] = createServiceObj($scope.rzKeratinTreatment);
            srvcTimes["KeraFusion"] = createServiceObj($scope.rzKeraFusion);
            srvcTimes["Relaxer"] = createServiceObj($scope.rzRelaxer);
            srvcTimes["Reverse_Perm"] = createServiceObj($scope.rzReversePerm);
            srvcTimes["Natural_Hair_Straightening_Iron_Work"] = createServiceObj($scope.rzNaturalHairStraighteningIronWork);
            
            // Hair Cuts
            srvcTimes["Women_s_Haircut___Style"] = createServiceObj($scope.rzWomensHaircutStyle);
            srvcTimes["Women_s_Haircut"] = createServiceObj($scope.rzWomensHaircut);
            srvcTimes["Bang_Trim"] = createServiceObj($scope.rzBangTrim);
            srvcTimes["Shampoo_Style"] = createServiceObj($scope.rzShampooStyle);
            srvcTimes["Thermal_Style"] = createServiceObj($scope.rzThermalStyle);
            srvcTimes["Updo"] = createServiceObj($scope.rzUpdo);
            srvcTimes["Men_s_Haircut"] = createServiceObj($scope.rzMensHaircut);
            srvcTimes["Men_s_Haircut___Style"] = createServiceObj($scope.rzMensHaircutStyle);
            srvcTimes["Children_s_Haircut"] = createServiceObj($scope.rzChildrensHaircut);
            srvcTimes["Children_s_Haircut___Style"] = createServiceObj($scope.rzChildrensHaircutStyle);
            srvcTimes["Clipper_Cut"] = createServiceObj($scope.rzClipperCut);
            srvcTimes["Women_s_Precision_Haircut"] = createServiceObj($scope.rzWomensPrecisionHaircut);
            srvcTimes["Light_Dry_Trim"] = createServiceObj($scope.rzLightDryTrim);
            srvcTimes["Partial_Highlights___Cut___Style"] = createServiceObj($scope.rzPartialHighlightsCutStyle);
            srvcTimes["Partial_Highlights___Style"] = createServiceObj($scope.rzPartialHighlightsStyle);
            srvcTimes["Full_Highlights___Cut___Style"] = createServiceObj($scope.rzFullHighlightsCutStyle);
            srvcTimes["Full_Highlights___Style"] = createServiceObj($scope.rzFullHighlightsStyle);
            srvcTimes["Color_Retouch___Cut___Style"] = createServiceObj($scope.rzColorRetouchCutStyle);
            srvcTimes["Color_Retouch___Style"] = createServiceObj($scope.rzColorRetouchStyle);
            srvcTimes["All_Over_Color___Cut___Style"] = createServiceObj($scope.rzAllOverColorCutStyle);
            srvcTimes["All_Over_Color___Style"] = createServiceObj($scope.rzAllOverColorStyle);
            srvcTimes["Glossing___Cut___Style"] = createServiceObj($scope.rzGlossingCutStyle);
            srvcTimes["Glossing___Style"] = createServiceObj($scope.rzGlossingStyle);
            srvcTimes["Balayage___Cut___Style"] = createServiceObj($scope.rzBalayageCutStyle);
            srvcTimes["Balayage___Style"] = createServiceObj($scope.rzBalayageStyle);
            srvcTimes["Face_Framing_Highlights___Cut___Style"] = createServiceObj($scope.rzFaceFramingHighlightsCutStyle);
            srvcTimes["Face_Framing_Highlights___Style"] = createServiceObj($scope.rzFaceFramingHighlightsStyle);
            srvcTimes["Perm___Cut___Style"] = createServiceObj($scope.rzPermCutStyle);
            srvcTimes["Perm___Style"] = createServiceObj($scope.rzPermStyle);
            srvcTimes["Relaxer_Retouch"] = createServiceObj($scope.rzRelaxerRetouch);
            srvcTimes["Relaxer_Retouch___Haircut"] = createServiceObj($scope.rzRelaxerRetouchHaircut);
            srvcTimes["Relaxer___Color"] = createServiceObj($scope.rzRelaxerColor);
            srvcTimes["Relaxer_Retouch___Color___Cut"] = createServiceObj($scope.rzRelaxerRetouchColorCut);
            srvcTimes["Lift_And_Tone"] = createServiceObj($scope.rzLiftAndTone);
            //srvcTimes["Bang_Trim___Complimentary_Current_Clients_only"] = createServiceObj($scope.rzBangTrimComplimentary);            
            srvcTimes["Full_Keratin___Cut___Style"] = createServiceObj($scope.rzFullKeratinCutStyle);
            srvcTimes["Fringe_Bang_Trim"] = createServiceObj($scope.rzFringeBangTrim);
            srvcTimes["Express_Color___Cut___Style"] = createServiceObj($scope.rzExpressColorCutStyle);
            srvcTimes["Retouch_Ombre"] = createServiceObj($scope.rzRetouchOmbre);
            srvcTimes["Partial_Balayage___Haircut"] = createServiceObj($scope.rzPartialBalayageHaircut);
            srvcTimes["OLAPLEX_Add_in"] = createServiceObj($scope.rzOLAPLEXAddin);
            srvcTimes["L_anza_Ultimate_Treatment"] = createServiceObj($scope.rzLanzaUltimateTreatment);
            srvcTimes["L_anza_Healing_Service"] = createServiceObj($scope.rzLanzaHealingService);
            srvcTimes["Special_Occasion_Downstyle"] = createServiceObj($scope.rzSpecialOccasionDownstyle);
            srvcTimes["Special_Occasion_Upstyle"] = createServiceObj($scope.rzSpecialOccasionUpstyle);
            srvcTimes["Shampoo__Blow_dry___Style"] = createServiceObj($scope.rzShampooBlowdryStyle);
            srvcTimes["Shampoo__Wrap___Style"] = createServiceObj($scope.rzShampooWrapStyle);
            srvcTimes["Dry_Styling"] = createServiceObj($scope.rzDryStyling);
            
            // Hair Additions
            srvcTimes["Hair_Extension_Consultation"] = createServiceObj($scope.rzHairExtensionConsultation);
            srvcTimes["Extensions"] = createServiceObj($scope.rzExtensions);
            srvcTimes["Couture_Sew_In"] = createServiceObj($scope.rzCoutureSewIn);
            srvcTimes["Braidless_Sew_In"] = createServiceObj($scope.rzBraidlessSewIn);
            srvcTimes["Couture_Lace_Wig_Prep_and_Install"] = createServiceObj($scope.rzCoutureLaceWigPrepandInstall);
            srvcTimes["Tightening___Style"] = createServiceObj($scope.rzTighteningStyle);
            srvcTimes["Removal___Style"] = createServiceObj($scope.rzRemovalStyle);
            srvcTimes["Hothead_Hair_Extensions"] = createServiceObj($scope.rzHotheadHairExtensions);
            srvcTimes["Integration"] = createServiceObj($scope.rzIntegration);
            srvcTimes["Tightening"] = createServiceObj($scope.rzTightening);
            srvcTimes["Removal"] = createServiceObj($scope.rzRemoval);
            srvcTimes["Klix_Extensions"] = createServiceObj($scope.rzKlixExtensions);
            srvcTimes["Klix_Extension_Tightening"] = createServiceObj($scope.rzKlixExtensionTightening);
            srvcTimes["Colored_Extension_Accents"] = createServiceObj($scope.rzColoredExtensionAccents);
            srvcTimes["Cinderella_Hair_Extensions"] = createServiceObj($scope.rzCinderellaHairExtensions);
            
            // Manicures
            srvcTimes["Shellac"] = createServiceObj($scope.rzShellac);
            srvcTimes["Spa"] = createServiceObj($scope.rzSpa);
            srvcTimes["Polish"] = createServiceObj($scope.rzPolish);
            srvcTimes["Polish_Change"] = createServiceObj($scope.rzPolishChange);
            srvcTimes["Bevel___Polish_Change"] = createServiceObj($scope.rzBevelPolishChange);
            srvcTimes["Paraffin_Treatment"] = createServiceObj($scope.rzParaffinTreatment);
            srvcTimes["New_Set_Acrylic_Pink___White"] = createServiceObj($scope.rzNewSetAcrylicPinkWhite);
            srvcTimes["Pink___White_Balance"] = createServiceObj($scope.rzPinkWhiteBalance);
            srvcTimes["Balance"] = createServiceObj($scope.rzBalance);
            srvcTimes["Nail_Repair"] = createServiceObj($scope.rzNailRepair);  
            
            // Pedi
            srvcTimes["Pedicure_Spa"] = createServiceObj($scope.rzPediSpa);
            srvcTimes["Pedicure_Special"] = createServiceObj($scope.rzSpecial); 
            
            // Wax
            srvcTimes["Brow_Shaping_Wax"] = createServiceObj($scope.rzBrowShapingWax);
            srvcTimes["Bikini_Wax"] = createServiceObj($scope.rzBikiniWax);
            srvcTimes["Bikini_Wax__Brazilian_"] = createServiceObj($scope.rzBikiniWaxBrazilian);
            srvcTimes["Full_Leg_Wax"] = createServiceObj($scope.rzFullLegWax);
            srvcTimes["Full_Leg_Wax__Half_Leg_"] = createServiceObj($scope.rzFullLegWaxHalfLeg);
            srvcTimes["Back_Wax"] = createServiceObj($scope.rzBackWax);
            srvcTimes["Underarms"] = createServiceObj($scope.rzUnderarms);
            srvcTimes["Arms"] = createServiceObj($scope.rzArms);
            srvcTimes["Lip__Cheeks_or_Chin"] = createServiceObj($scope.rzLipCheeksorChin);
            srvcTimes["Brow_Wax"] = createServiceObj($scope.rzBrowWax);
            srvcTimes["Brows"] = createServiceObj($scope.rzBrows);
            srvcTimes["Lip_Wax"] = createServiceObj($scope.rzLipWax);
            srvcTimes["Cheek_Wax"] = createServiceObj($scope.rzCheekWax);
            srvcTimes["Chin_Wax"] = createServiceObj($scope.rzChinWax);
            srvcTimes["Brow_Shaping_and_Lip_Wax_Combo"] = createServiceObj($scope.rzBrowShapingandLipWaxCombo);
            srvcTimes["Eyebrow_Shaping"] = createServiceObj($scope.rzEyebrowShaping);
            srvcTimes["Ear_Wax"] = createServiceObj($scope.rzEarWax);
            
            // Massage
            srvcTimes["Massage___30_Minutes"] = createServiceObj($scope.rz30MinuteMassage);
            srvcTimes["Massage___60_Minutes"] = createServiceObj($scope.rz60MinuteMassage);
            srvcTimes["Massage___90_Minutes"] = createServiceObj($scope.rz90MinuteMassage);
            srvcTimes["Massage___120_Minutes"] = createServiceObj($scope.rz120MinuteMassage);
            srvcTimes["Hot_Stone___30_Minutes"] = createServiceObj($scope.rz30MinuteHotStone);
            srvcTimes["Hot_Stone___60_Minutes"] = createServiceObj($scope.rz60MinuteHotStone);
            srvcTimes["Hot_Stone___90_Minutes"] = createServiceObj($scope.rz90MinuteHotStone);
            srvcTimes["Hot_Stone___120_Minutes"] = createServiceObj($scope.rz120MinuteHotStone);
            srvcTimes["Reflexology___30_Minutes"] = createServiceObj($scope.rz30MinuteReflexology);
            srvcTimes["Reflexology___60_Minutes"] = createServiceObj($scope.rz60MinuteReflexology);
            
            // Makeup
            srvcTimes["Makeup_Consultation"] = createServiceObj($scope.rzMakeupConsultation);
            srvcTimes["Makeup_Special_Event"] = createServiceObj($scope.rzMakeupSpecialEvent);
            srvcTimes["Makeup_Bridal"] = createServiceObj($scope.rzMakeupBridal);
            srvcTimes["Makeup_Bridal__bride___3_attendants_"] = createServiceObj($scope.rzMakeupBridalAttendants);
            srvcTimes["Makeup_Bridal__bride_only_"] = createServiceObj($scope.rzMakeupBrideOnly);
            srvcTimes["Makeup_Seasonal_Color_Analysis"] = createServiceObj($scope.rzSeasonalColorAnalysis);
            srvcTimes["Makeup_Application"] = createServiceObj($scope.rzMakeupApplication);
            srvcTimes["Makeup_Application_Lesson"] = createServiceObj($scope.rzMakeupApplicationLesson);
            srvcTimes["Makeup_Application_Lesson__Airbrush_"] = createServiceObj($scope.rzMakeupApplicationLessonAirbrush);
            //srvcTimes["Complimentary_Skin_Analysis_Mineral_Makeup_Color_Matching "] = createServiceObj($scope.rzComplimentarySkinAnalysisMineralMakeupColorMatching);          
            srvcTimes["Makeup_Lesson_Bridal_Trial_Session"] = createServiceObj($scope.rzMakeupLessonBridalTrialSession);
            srvcTimes["On_Location_Makeup"] = createServiceObj($scope.rzOnLocationMakeup);
            srvcTimes["Makeup_Lashes"] = createServiceObj($scope.rzLashes);

            // Brow
            srvcTimes["Eyelash_Extensions"] = createServiceObj($scope.rzEyelashExtensions);
            srvcTimes["Lavish_Lashes"] = createServiceObj($scope.rzLavishLashes);
            srvcTimes["Lash___Brow_Tinting___Duo"] = createServiceObj($scope.rzLashBrowTintingDuo);            
            srvcTimes["Brow_Shaping"] = createServiceObj($scope.rzBrowShaping);
            srvcTimes["Brow_Tint_and_Shaping"] = createServiceObj($scope.rzBrowTintandShaping);
            srvcTimes["Brow_Tint"] = createServiceObj($scope.rzBrowTint);
            srvcTimes["Eye_Lash_Tint"] = createServiceObj($scope.rzEyeLashTint);

            
            // upload profile pic to Google Storage
            // ------------------------------------------- //
            // REFACTOR THE FOLLOWING CODE!!!!!!!!!!!!!!!! //
            // ------------------------------------------- //
            var fileToUpload = document.getElementById("pf_txtProfilePic").files[0];
            if (fileToUpload != null) {
                var metadata = {
                    contentType: 'image/*'
                };
                var storageRef = firebase.storage().ref().child('/images/' + profUID);
                var uploadTask = storageRef.put(fileToUpload, metadata).then(function (snapshot) {
                    console.log('Uploaded profile picture URL ***');
                    storageRef.getDownloadURL().then(function(url) {
                        //console.log('*** URL ***');
                        //console.log(url);
                        
                        var d = new Date();
                        var now = d.toDateString();
                        firebase.database().ref('/associates/' + profUID).set({
                            profile: pf_profileActive
                            , firstname: pf_firstName
                            , lastname: pf_lastName
                            , email: pf_email
                            , website: pf_website
                            , facebookURL: pf_facebook
                            , twitterURL: pf_twitter
                            , instagramURL: pf_instagram
                            , googleURL: pf_google
                            , mobile: pf_mobile
                            , title: pf_myTitle
                            , hours: myHours
                            , createdate: now
                            , about: pf_about
                            , hairColor: pf_hairColor
                            , hairText: pf_hairTexturizer
                            , hairCut: pf_hairCuts
                            , hairAddition: pf_hairAddition
                            , wax: pf_wax
                            , massage: pf_massage
                            , facial: pf_facial
                            , mani: pf_manicures
                            , pedi: pf_pedicures
                            , makeup: pf_makeup
                            , brow: pf_brow
                            , products: pf_products
                            , referral: pf_referral
                            , newClient: pf_newClient
                            , loyalty: pf_loyalty
                            , square: pf_square
                            , squareID: pf_squareID
                            , styleseat: pf_styleseat
                            , styleseatID: pf_styleseatID
                            , onlineBooking: pf_OnlineBooking
                            , refdiscountPct: pf_refDiscount
                            , ncdiscountPct: pf_ncDiscount
                            , loyaldiscountPct: pf_loyalDiscount
                            , loyaltyDiscountExpiration: pf_loyaltyDiscountExpiration
                            , bookingConfiguration: bookingConfig
                            , serviceTimes: srvcTimes
                            , regUID: profUID
                            , picURL: url
                        });                        
                    });  
                }).catch(function (error) {
                    console.log('no file to upload');
                    console.log(error);
                    
                    var d = new Date();
                    var now = d.toDateString();
                    firebase.database().ref('/associates/' + profUID).set({
                        profile: pf_profileActive
                        , firstname: pf_firstName
                        , lastname: pf_lastName
                        , email: pf_email
                        , website: pf_website
                        , facebookURL: pf_facebook
                        , twitterURL: pf_twitter
                        , instagramURL: pf_instagram
                        , googleURL: pf_google
                        , mobile: pf_mobile
                        , title: pf_myTitle
                        , hours: myHours
                        , createdate: now
                        , about: pf_about
                        , hairColor: pf_hairColor
                        , hairText: pf_hairTexturizer
                        , hairCut: pf_hairCuts
                        , hairAddition: pf_hairAddition
                        , wax: pf_wax
                        , massage: pf_massage
                        , facial: pf_facial
                        , mani: pf_manicures
                        , pedi: pf_pedicures
                        , makeup: pf_makeup
                        , brow: pf_brow
                        , products: pf_products
                        , referral: pf_referral
                        , newClient: pf_newClient
                        , loyalty: pf_loyalty
                        , square: pf_square
                        , squareID: pf_squareID
                        , styleseat: pf_styleseat
                        , styleseatID: pf_styleseatID
                        , onlineBooking: pf_OnlineBooking
                        , refdiscountPct: pf_refDiscount
                        , ncdiscountPct: pf_ncDiscount
                        , loyaldiscountPct: pf_loyalDiscount
                        , loyaltyDiscountExpiration: pf_loyaltyDiscountExpiration
                        , bookingConfiguration: bookingConfig
                        , serviceTimes: srvcTimes
                        , regUID: profUID
                    });                    
                });
            } else {
                    var d = new Date();
                    var now = d.toDateString();
                    firebase.database().ref('/associates/' + profUID).set({
                        profile: pf_profileActive
                        , firstname: pf_firstName
                        , lastname: pf_lastName
                        , email: pf_email
                        , website: pf_website
                        , facebookURL: pf_facebook
                        , twitterURL: pf_twitter
                        , instagramURL: pf_instagram
                        , googleURL: pf_google
                        , mobile: pf_mobile
                        , title: pf_myTitle
                        , hours: myHours
                        , createdate: now
                        , about: pf_about
                        , hairColor: pf_hairColor
                        , hairText: pf_hairTexturizer
                        , hairCut: pf_hairCuts
                        , hairAddition: pf_hairAddition
                        , wax: pf_wax
                        , massage: pf_massage
                        , facial: pf_facial
                        , mani: pf_manicures
                        , pedi: pf_pedicures
                        , makeup: pf_makeup
                        , brow: pf_brow
                        , products: pf_products
                        , referral: pf_referral
                        , newClient: pf_newClient
                        , loyalty: pf_loyalty
                        , square: pf_square
                        , squareID: pf_squareID
                        , styleseat: pf_styleseat
                        , styleseatID: pf_styleseatID
                        , onlineBooking: pf_OnlineBooking
                        , refdiscountPct: pf_refDiscount
                        , ncdiscountPct: pf_ncDiscount
                        , loyaldiscountPct: pf_loyalDiscount
                        , loyaltyDiscountExpiration: pf_loyaltyDiscountExpiration
                        , bookingConfiguration: bookingConfig
                        , serviceTimes: srvcTimes
                        , regUID: profUID
                    }); 
            }

            $('#modalProfileSave-body').text('Your profile has been saved!');
            $('#modalProfileSave').modal('show');
            
            
            // return checkbox values
            function getCheckedCheckboxesFor(checkboxName) {
                var checkboxes = document.querySelectorAll('input[name="' + checkboxName + '"]:checked'), values = [];
                Array.prototype.forEach.call(checkboxes, function(el) {
                    values.push(el.value);
                });
                return values;
            }
            
        });  // Save profile data
  
      
      
        function populateServiceTimes() {  
            // Hair Color
            $scope.rzColorRetouch = loadServiceTimes(serviceTimes.Color_Retouch);
            $scope.rzWeaving = loadServiceTimes(serviceTimes.Weaving);
            $scope.rzVirginHairColor = loadServiceTimes(serviceTimes.Virgin_Hair_Color);
            $scope.rzPartialWeaving = loadServiceTimes(serviceTimes.Partial_Weaving);
            $scope.rzBalayage = loadServiceTimes(serviceTimes.Balayage);
            $scope.rzFullHighlights = loadServiceTimes(serviceTimes.Full_Highlights);
            $scope.rzFaceFramingHighlights = loadServiceTimes(serviceTimes.Face_Framing_Highlights);
            $scope.rzAllOverColor = loadServiceTimes(serviceTimes.All_Over_Color);
            $scope.rzTLinePartOnlyTouchUp = loadServiceTimes(serviceTimes.T_Line_Part_Only_Touch_Up);
            $scope.rzTenFoil = loadServiceTimes(serviceTimes.TenFoil);
            $scope.rzCustomColor = loadServiceTimes(serviceTimes.Custom_Color);
            $scope.rzDimensionalHighlights = loadServiceTimes(serviceTimes.Dimensional_Highlights);
            $scope.rzOmbre = loadServiceTimes(serviceTimes.Ombre);
            $scope.rzEyebrowTinting = loadServiceTimes(serviceTimes.Eyebrow_Tinting);
            $scope.rzExpressColor = loadServiceTimes(serviceTimes.Express_Color);
            $scope.rzCorrectiveColor = loadServiceTimes(serviceTimes.Corrective_Color);
            $scope.rzWeaveSlicing = loadServiceTimes(serviceTimes.Weave_Slicing);
            $scope.rzClearShineColorTreatment = loadServiceTimes(serviceTimes.Clear_Shine_Color_Treatment);
            $scope.rzColorEnhancingShineTreatment = loadServiceTimes(serviceTimes.Color_Enhancing_Shine_Treatment);
            $scope.rzMensColor = loadServiceTimes(serviceTimes.Men_s_Color);
            // Hair Texturizers
            $scope.rzBodyWave = loadServiceTimes(serviceTimes.Body_Wave);
            $scope.rzPermanent = loadServiceTimes(serviceTimes.Permanent);
            $scope.rzPermanentWave = loadServiceTimes(serviceTimes.Permanent_Wave);
            $scope.rzKeratinTreatment = loadServiceTimes(serviceTimes.Keratin_Treatment);
            $scope.rzKeraFusion = loadServiceTimes(serviceTimes.KeraFusion);
            $scope.rzRelaxer = loadServiceTimes(serviceTimes.Relaxer);
            $scope.rzReversePerm = loadServiceTimes(serviceTimes.Reverse_Perm);
            $scope.rzNaturalHairStraighteningIronWork = loadServiceTimes(serviceTimes.Natural_Hair_Straightening_Iron_Work);
            // Hair Cuts
            $scope.rzWomensHaircutStyle = loadServiceTimes(serviceTimes.Women_s_Haircut_Style);
            $scope.rzWomensHaircut = loadServiceTimes(serviceTimes.Women_s_Haircut);
            $scope.rzBangTrim = loadServiceTimes(serviceTimes.Bang_Trim);
            $scope.rzShampooStyle = loadServiceTimes(serviceTimes.Shampoo_Style);
            $scope.rzThermalStyle = loadServiceTimes(serviceTimes.Thermal_Style);
            $scope.rzUpdo = loadServiceTimes(serviceTimes.Updo);
            $scope.rzMensHaircut = loadServiceTimes(serviceTimes.Men_s_Haircut);
            $scope.rzMensHaircutStyle = loadServiceTimes(serviceTimes.Men_s_Haircut___Style);
            $scope.rzChildrensHaircut = loadServiceTimes(serviceTimes.Children_s_Haircut);
            $scope.rzChildrensHaircutStyle = loadServiceTimes(serviceTimes.Children_s_Haircut___Style);
            $scope.rzClipperCut = loadServiceTimes(serviceTimes.Clipper_Cut);
            $scope.rzWomensPrecisionHaircut = loadServiceTimes(serviceTimes.Women_s_Precision_Haircut);
            $scope.rzLightDryTrim = loadServiceTimes(serviceTimes.Light_Dry_Trim);
            $scope.rzPartialHighlightsCutStyle = loadServiceTimes(serviceTimes.Partial_Highlights___Cut___Style);
            $scope.rzPartialHighlightsStyle = loadServiceTimes(serviceTimes.Partial_Highlights___Style);
            $scope.rzFullHighlightsCutStyle = loadServiceTimes(serviceTimes.Full_Highlights___Cut___Style);
            $scope.rzFullHighlightsStyle = loadServiceTimes(serviceTimes.Full_Highlights___Style);
            $scope.rzColorRetouchCutStyle = loadServiceTimes(serviceTimes.Color_Retouch___Cut___Style);
            $scope.rzColorRetouchStyle = loadServiceTimes(serviceTimes.Color_Retouch___Style);
            $scope.rzAllOverColorCutStyle = loadServiceTimes(serviceTimes.All_Over_Color___Cut___Style);
            $scope.rzAllOverColorStyle = loadServiceTimes(serviceTimes.All_Over_Color___Style);
            $scope.rzGlossingCutStyle = loadServiceTimes(serviceTimes.Glossing___Cut___Style);
            $scope.rzGlossingStyle = loadServiceTimes(serviceTimes.Glossing___Style);
            $scope.rzBalayageCutStyle = loadServiceTimes(serviceTimes.Balayage___Cut___Style);
            $scope.rzBalayageStyle = loadServiceTimes(serviceTimes.Balayage___Style);
            $scope.rzFaceFramingHighlightsCutStyle = loadServiceTimes(serviceTimes.Face_Framing_Highlights___Cut___Style);
            $scope.rzFaceFramingHighlightsStyle = loadServiceTimes(serviceTimes.Face_Framing_Highlights___Style);
            $scope.rzPermCutStyle = loadServiceTimes(serviceTimes.Perm___Cut___Style);
            $scope.rzPermStyle = loadServiceTimes(serviceTimes.Perm___Style);
            $scope.rzRelaxerRetouch = loadServiceTimes(serviceTimes.Relaxer_Retouch);
            $scope.rzRelaxerRetouchHaircut = loadServiceTimes(serviceTimes.Relaxer_Retouch___Haircut);
            $scope.rzRelaxerColor = loadServiceTimes(serviceTimes.Relaxer___Color);
            $scope.rzRelaxerRetouchColorCut = loadServiceTimes(serviceTimes.Relaxer_Retouch___Color___Cut);
            $scope.rzLiftAndTone = loadServiceTimes(serviceTimes.Lift_And_Tone);
            //$scope.rzBangTrimComplimentary = loadServiceTimes(serviceTimes.Bang_Trim___Complimentary_Current_Clients_only);
            $scope.rzFullKeratinCutStyle = loadServiceTimes(serviceTimes.Full_Keratin___Cut___Style);
            $scope.rzExpressColorCutStyle = loadServiceTimes(serviceTimes.Express_Color___Cut___Style);
            $scope.rzFringeBangTrim = loadServiceTimes(serviceTimes.Fringe_Bang_Trim);
            $scope.rzRetouchOmbre = loadServiceTimes(serviceTimes.Retouch_Ombre);
            $scope.rzPartialBalayageHaircut = loadServiceTimes(serviceTimes.Partial_Balayage___Haircut);
            $scope.rzOLAPLEXAddin = loadServiceTimes(serviceTimes.OLAPLEX_Add_in);
            $scope.rzLanzaUltimateTreatment = loadServiceTimes(serviceTimes.L_anza_Ultimate_Treatment);
            $scope.rzLanzaHealingService = loadServiceTimes(serviceTimes.L_anza_Healing_Service);
            $scope.rzSpecialOccasionDownstyle = loadServiceTimes(serviceTimes.Special_Occasion_Downstyle);
            $scope.rzSpecialOccasionUpstyle = loadServiceTimes(serviceTimes.Special_Occasion_Upstyle);
            $scope.rzShampooBlowdryStyle = loadServiceTimes(serviceTimes.Shampoo__Blow_dry___Style);
            $scope.rzShampooWrapStyle = loadServiceTimes(serviceTimes.Shampoo__Wrap___Style);
            $scope.rzDryStyling = loadServiceTimes(serviceTimes.Dry_Styling);
            // Hair Additions
            $scope.rzHairExtensionConsultation = loadServiceTimes(serviceTimes.Hair_Extension_Consultation);
            $scope.rzExtensions = loadServiceTimes(serviceTimes.Extensions);
            $scope.rzCoutureSewIn = loadServiceTimes(serviceTimes.Couture_Sew_In);
            $scope.rzBraidlessSewIn = loadServiceTimes(serviceTimes.Braidless_Sew_In);
            $scope.rzCoutureLaceWigPrepandInstall = loadServiceTimes(serviceTimes.Couture_Lace_Wig_Prep_and_Install);
            $scope.rzTighteningStyle = loadServiceTimes(serviceTimes.Tightening___Style);
            $scope.rzRemovalStyle = loadServiceTimes(serviceTimes.Removal___Style);
            $scope.rzHotheadHairExtensions = loadServiceTimes(serviceTimes.Hothead_Hair_Extensions);
            $scope.rzIntegration = loadServiceTimes(serviceTimes.Integration);
            $scope.rzTightening = loadServiceTimes(serviceTimes.Tightening);
            $scope.rzRemoval = loadServiceTimes(serviceTimes.Removal);
            $scope.rzKlixExtensions = loadServiceTimes(serviceTimes.Klix_Extensions);
            $scope.rzKlixExtensionTightening = loadServiceTimes(serviceTimes.Klix_Extension_Tightening);
            $scope.rzColoredExtensionAccents = loadServiceTimes(serviceTimes.Colored_Extension_Accents);
            $scope.rzCinderellaHairExtensions = loadServiceTimes(serviceTimes.Cinderella_Hair_Extensions);
            // Mani
            $scope.rzShellac = loadServiceTimes(serviceTimes.Shellac);
            $scope.rzSpa = loadServiceTimes(serviceTimes.Spa);
            $scope.rzPolish = loadServiceTimes(serviceTimes.Polish);
            $scope.rzPolishChange = loadServiceTimes(serviceTimes.Polish_Change);
            $scope.rzBevelPolishChange = loadServiceTimes(serviceTimes.Bevel___Polish_Change);
            $scope.rzParaffinTreatment = loadServiceTimes(serviceTimes.Paraffin_Treatment);
            $scope.rzNewSetAcrylicPinkWhite = loadServiceTimes(serviceTimes.New_Set_Acrylic_Pink___White);
            $scope.rzPinkWhiteBalance = loadServiceTimes(serviceTimes.Pink___White_Balance);
            $scope.rzBalance = loadServiceTimes(serviceTimes.Balance);
            $scope.rzNailRepair = loadServiceTimes(serviceTimes.Nail_Repair);
            // Pedi
            $scope.rzPediSpa = loadServiceTimes(serviceTimes.Pedicure_Spa);
            $scope.rzSpecial = loadServiceTimes(serviceTimes.Pedicure_Special);
            // Wax
            $scope.rzBrowShapingWax = loadServiceTimes(serviceTimes.Brow_Shaping_Wax);
            $scope.rzBikiniWax = loadServiceTimes(serviceTimes.Bikini_Wax);
            $scope.rzBikiniWaxBrazilian = loadServiceTimes(serviceTimes.Bikini_Wax__Brazilian_);
            $scope.rzFullLegWax = loadServiceTimes(serviceTimes.Full_Leg_Wax);
            $scope.rzFullLegWaxHalfLeg = loadServiceTimes(serviceTimes.Full_Leg_Wax__Half_Leg_);
            $scope.rzBackWax = loadServiceTimes(serviceTimes.Back_Wax);
            $scope.rzUnderarms = loadServiceTimes(serviceTimes.Underarms);
            $scope.rzArms = loadServiceTimes(serviceTimes.Arms);
            $scope.rzLipCheeksorChin = loadServiceTimes(serviceTimes.Lip__Cheeks_or_Chin);
            $scope.rzBrowWax = loadServiceTimes(serviceTimes.Brow_Wax);
            $scope.rzBrows = loadServiceTimes(serviceTimes.Brows);
            $scope.rzLipWax = loadServiceTimes(serviceTimes.Lip_Wax);
            $scope.rzCheekWax = loadServiceTimes(serviceTimes.Cheek_Wax);
            $scope.rzChinWax = loadServiceTimes(serviceTimes.Chin_Wax);
            $scope.rzBrowShapingandLipWaxCombo = loadServiceTimes(serviceTimes.Brow_Shaping_and_Lip_Wax_Combo);
            $scope.rzEyebrowShaping = loadServiceTimes(serviceTimes.Eyebrow_Shaping);
            $scope.rzEarWax = loadServiceTimes(serviceTimes.rzEarWax);
            // Massage
            $scope.rz30MinuteMassage = loadServiceTimes(serviceTimes.Massage30);
            $scope.rz60MinuteMassage = loadServiceTimes(serviceTimes.Massage60);
            $scope.rz90MinuteMassage = loadServiceTimes(serviceTimes.Massage90);
            $scope.rz120MinuteMassage = loadServiceTimes(serviceTimes.Massage120);
            $scope.rz30MinuteHotStone = loadServiceTimes(serviceTimes.Hot_Stone30);
            $scope.rz60MinuteHotStone = loadServiceTimes(serviceTimes.Hot_Stone60);
            $scope.rz90MinuteHotStone = loadServiceTimes(serviceTimes.Hot_Stone90);
            $scope.rz120MinuteHotStone = loadServiceTimes(serviceTimes.Hot_Stone120);
            $scope.rz30MinuteReflexology = loadServiceTimes(serviceTimes.Reflexology30);
            $scope.rz60MinuteReflexology = loadServiceTimes(serviceTimes.Reflexology60);
            // Makeup
            $scope.rzMakeupConsultation = loadServiceTimes(serviceTimes.Makeup_Consultation);
            $scope.rzMakeupSpecialEvent = loadServiceTimes(serviceTimes.Makeup_Special_Event);
            $scope.rzMakeupBridal = loadServiceTimes(serviceTimes.Makeup_Bridal);
            $scope.rzMakeupBridalAttendants = loadServiceTimes(serviceTimes.Makeup_Bridal__bride___3_attendants_);
            $scope.rzMakeupBrideOnly = loadServiceTimes(serviceTimes.Makeup_Bridal__bride_only_);
            $scope.rzSeasonalColorAnalysis = loadServiceTimes(serviceTimes.Makeup_Seasonal_Color_Analysis);
            $scope.rzMakeupApplication = loadServiceTimes(serviceTimes.Makeup_Application);
            $scope.rzMakeupApplicationLesson = loadServiceTimes(serviceTimes.Makeup_Application_Lesson);
            $scope.rzMakeupApplicationLessonAirbrush = loadServiceTimes(serviceTimes.Makeup_Application_Lesson__Airbrush_);
            //$scope.rzComplimentarySkinAnalysisMineralMakeupColorMatching = loadServiceTimes(serviceTimes.Complimentary_Skin_Analysis_Mineral_Makeup_Color_Matching);    
            $scope.rzMakeupLessonBridalTrialSession = loadServiceTimes(serviceTimes.Makeup_Lesson_Bridal_Trial_Session);
            $scope.rzOnLocationMakeup = loadServiceTimes(serviceTimes.On_Location_Makeup);
            $scope.rzLashes = loadServiceTimes(serviceTimes.Makeup_Lashes);
            // Brow
            $scope.rzEyelashExtensions = loadServiceTimes(serviceTimes.Eyelash_Extensions);
            $scope.rzLavishLashes = loadServiceTimes(serviceTimes.Lavish_Lashes);
            $scope.rzLashBrowTintingDuo = loadServiceTimes(serviceTimes.Lash___Brow_Tinting___Duo);
            $scope.rzBrowShaping = loadServiceTimes(serviceTimes.Brow_Shaping);
            $scope.rzBrowTintandShaping = loadServiceTimes(serviceTimes.Brow_Tint_and_Shaping);
            $scope.rzBrowTint = loadServiceTimes(serviceTimes.Brow_Tint);
            $scope.rzEyeLashTint = loadServiceTimes(serviceTimes.Eye_Lash_Tint);
        }      
      

      
}]); // Controller


function uploadProfilePicToGS(input) {
    var fileToUpload = document.getElementById("pf_txtProfilePic").files[0];
    console.log(fileToUpload);
    if (fileToUpload != null) {
        var metadata = {
            contentType: 'image/*'
        };
        var storageRef = firebase.storage().ref().child('/images/temp-ok-to-delete');
        var uploadTask = storageRef.put(fileToUpload, metadata).then(function (snapshot) {
            console.log('Uploaded a blob or file!');
            storageRef.getDownloadURL().then(function (url) {
                console.log(url);
                document.getElementById("pf_imgProfilePic").src = url;
            });
        }).catch(function (error) {
            console.log('no file to upload');
            console.log(error);
        });
    }
}

function createServiceObj(n) {
    obj = {
        'start': n.start
        , 'process': n.process
        , 'finish': n.finish
    };
    return obj;
}

function populateCheckbox(checkboxID, myKwArray) {
    if (myKwArray == null) {
        return;
    }
    $("input[id='" + checkboxID + "']").each(function (index, element) {
        myKwArray.forEach(function (entry) {
            if (element.value === entry) {
                element.setAttribute("checked", true);
            }
        });
    });
}

function loadServiceTimes(serviceIn) {
    var start = 60;
    var process = 0;
    var finish = 0;
    if (serviceIn) {
        start = serviceIn.start;
        process = serviceIn.process;
        finish = serviceIn.finish;
    }
    serviceOut = {
        'start': start
        , 'process': process
        , 'finish': finish
    };
    return serviceOut;
}

function startSpinner() {
    // Create the Spinner with options
    var spinner = new Spinner({
        lines: 13
        , length: 28
        , width: 14
        , radius: 42
        , scale: 1
        , corners: 1
        , color: '#d56e2f'
        , opacity: 0.25
        , rotate: 0
        , direction: 1
        , speed: 1
        , trail: 60
        , fps: 20
        , zIndex: 2e9
        , className: 'spinner'
        , top: '50%'
        , left: '50%'
        , shadow: true
        , hwaccel: false
        , position: 'absolute'
    }).spin(document.getElementById("spinMe"));
    return spinner;
}




//            var fileToUpload = document.getElementById("pf_txtProfilePic").files[0];
//            if (fileToUpload != null) {
//                var metadata = {
//                    contentType: 'image/*'
//                };
//                var storageRef = firebase.storage().ref().child('/images/' + profUID);
//                var uploadTask = storageRef.put(fileToUpload, metadata).then(function (snapshot) {
//                    console.log('Uploaded profile picture URL ***');
//                    storageRef.getDownloadURL().then(function(url) {
//                        console.log('*** URL ***');
//                        console.log(url);
//                        firebase.database().ref('/associates/' + profUID).set({
//                            picURL: url
//                        });
//                    });  
//                }).catch(function (error) {
//                    console.log('no file to upload');
//                    console.log(error);
//                });
//            }
//            
//            var d = new Date();
//            var now = d.toDateString();
//            firebase.database().ref('/associates/' + profUID).set({
//                profile: pf_profileActive
//                , firstname: pf_firstName
//                , lastname: pf_lastName
//                , email: pf_email
//                , mobile: pf_mobile
//                , title: pf_myTitle
//                , hours: myHours
//                , createdate: now
//                , about: pf_about
//                , hairColor: pf_hairColor
//                , hairText: pf_hairTexturizer
//                , hairCut: pf_hairCuts
//                , hairAddition: pf_hairAddition
//                , wax: pf_wax
//                , massage: pf_massage
//                , facial: pf_facial
//                , mani: pf_manicures
//                , pedi: pf_pedicures
//                , makeup: pf_makeup
//                , brow: pf_brow
//                , products: pf_products
//                , referral: pf_referral
//                , newClient: pf_newClient
//                , loyalty: pf_loyalty
//                , square: pf_square
//                , squareID: pf_squareID
//                , styleseat: pf_styleseat
//                , styleseatID: pf_styleseatID
//                , onlineBooking: pf_OnlineBooking
//                , refdiscountPct: pf_refDiscount
//                , ncdiscountPct: pf_ncDiscount
//                , loyaldiscountPct: pf_loyalDiscount
//                , loyaltyDiscountExpiration: pf_loyaltyDiscountExpiration
//                , bookingConfiguration: bookingConfig
//                , serviceTimes: srvcTimes
//                , regUID: profUID
//            });