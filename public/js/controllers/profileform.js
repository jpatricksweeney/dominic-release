myApp.controller('ProfileFormController', ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'Authentication',
                                           
  function ($scope, $rootScope, $firebaseAuth, $firebaseArray, Authentication) {
      
      profUID = $rootScope.currentUser.uid;
      
      $scope.logout = function() {
          console.log('in logout!');
          Authentication.logout();
          alert('Logout successful.');
      }
      
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
      
        firebase.database().ref('/users/' + profUID).once('value').then(function (snapshot) {
            console.log('in user get');
            $scope.admin = snapshot.val().admin;
        });
                
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
            
            $scope.namefirst = snapshot.val().firstname;
            $scope.namelast = snapshot.val().lastname;
            
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
            var massage = snapshot.val().massage;
            populateCheckbox('pf_cbMassage', massage);
            var facial = snapshot.val().facial;
            populateCheckbox('pf_cbFacial', facial); 
            
            var teethwhitening = snapshot.val().whitening;
            populateCheckbox('pf_cbTeethWhitening', teethwhitening);
                
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
            
            //console.log("picture URL=" + snapshot.val().picURL);
            if( snapshot.val().picURL != 'undefined' ) {
                document.getElementById("pf_imgProfilePic").src = snapshot.val().picURL;
            }
            
            // Services pricing info
            $('#color_retouch').val(snapshot.val().services.color_retouch);
            $('#weaving').val(snapshot.val().services.weaving);
            $('#partial_weaving').val(snapshot.val().services.partial_weaving);
            $('#virgin_hair_color').val(snapshot.val().services.virgin_hair_color);
            $('#balayage').val(snapshot.val().services.balayage);
            $('#full_highlights').val(snapshot.val().services.full_highlights);
            $('#face_framing_highlights').val(snapshot.val().services.face_framing_highlights);
            $('#all_over_color').val(snapshot.val().services.all_over_color);
            $('#mens_color').val(snapshot.val().services.mens_color);
            $('#t_line_part_only_touch_up').val(snapshot.val().services.t_line_part_only_touch_up);
            $('#ten_foil').val(snapshot.val().services.ten_foil);
            $('#custom_color').val(snapshot.val().services.custom_color);
            $('#dimensional_highlights').val(snapshot.val().services.dimensional_highlights);
            $('#ombre').val(snapshot.val().services.ombre);
            $('#eyebrow_tinting').val(snapshot.val().services.eyebrow_tinting);
            $('#express_color').val(snapshot.val().services.express_color);
            $('#corrective_color').val(snapshot.val().services.corrective_color);
            $('#weave_slicing').val(snapshot.val().services.weave_slicing);
            $('#clear_shine_color_treatment').val(snapshot.val().services.clear_shine_color_treatment);
            $('#color_enhancing_shine_treatment').val(snapshot.val().services.color_enhancing_shine_treatment);
            $('#body_wave').val(snapshot.val().services.body_wave);
            $('#permanent').val(snapshot.val().services.permanent);
            $('#permanent_wave').val(snapshot.val().services.permanent_wave);
            $('#keratin_treatment').val(snapshot.val().services.keratin_treatment);
            $('#kerafusion').val(snapshot.val().services.kerafusion);
            $('#relaxer').val(snapshot.val().services.relaxer);
            $('#reverse_perm').val(snapshot.val().services.reverse_perm);
            $('#natural_hair_straightening_iron_work').val(snapshot.val().services.natural_hair_straightening_iron_work);
            $('#womens_haircut_style').val(snapshot.val().services.womens_haircut_style);
            $('#womens_haircut').val(snapshot.val().services.womens_haircut);
            $('#bang_trim').val(snapshot.val().services.bang_trim);
            $('#shampoo_style').val(snapshot.val().services.shampoo_style);
            $('#thermal_style').val(snapshot.val().services.thermal_style);
            $('#updo').val(snapshot.val().services.updo);
            $('#mens_haircut').val(snapshot.val().services.mens_haircut);
            $('#mens_haircut_style').val(snapshot.val().services.mens_haircut_style);
            $('#childrens_haircut').val(snapshot.val().services.childrens_haircut);
            $('#childrens_haircut_style').val(snapshot.val().services.childrens_haircut_style);
            $('#clipper_cut').val(snapshot.val().services.clipper_cut);
            $('#womens_precision_haircut').val(snapshot.val().services.womens_precision_haircut);
            $('#light_dry_trim').val(snapshot.val().services.light_dry_trim);
            $('#partial_highlights_cut_style').val(snapshot.val().services.partial_highlights_cut_style);
            $('#partial_highlights_style').val(snapshot.val().services.partial_highlights_style);
            $('#full_highlights_cut_style').val(snapshot.val().services.full_highlights_cut_style);
            $('#full_highlights_style').val(snapshot.val().services.full_highlights_style);
            $('#color_retouch_cut_style').val(snapshot.val().services.color_retouch_cut_style);
            $('#color_retouch_style').val(snapshot.val().services.color_retouch_style);
            $('#all_over_color_cut_style').val(snapshot.val().services.all_over_color_cut_style);
            $('#all_over_color_style').val(snapshot.val().services.all_over_color_style);
            $('#glossing_cut_style').val(snapshot.val().services.glossing_cut_style);
            $('#glossing_style').val(snapshot.val().services.glossing_style);
            $('#balayage_cut_style').val(snapshot.val().services.balayage_cut_style);
            $('#balayage_style').val(snapshot.val().services.balayage_style);
            $('#face_framing_highlights_cut_style').val(snapshot.val().services.face_framing_highlights_cut_style);
            $('#face_framing_highlights_style').val(snapshot.val().services.face_framing_highlights_style);
            $('#perm_cut_style').val(snapshot.val().services.perm_cut_style);
            $('#perm_style').val(snapshot.val().services.perm_style);
            $('#relaxer_retouch').val(snapshot.val().services.relaxer_retouch);
            $('#relaxer_retouch_haircut').val(snapshot.val().services.relaxer_retouch_haircut);
            $('#relaxer_color').val(snapshot.val().services.relaxer_color);
            $('#relaxer_retouch_color_cut').val(snapshot.val().services.relaxer_retouch_color_cut);
            $('#lift_and_tone').val(snapshot.val().services.lift_and_tone);
            $('#full_keratin_cut_style').val(snapshot.val().services.full_keratin_cut_style);
            $('#express_color_cut_style').val(snapshot.val().services.express_color_cut_style);
            $('#fringe_bang_trim').val(snapshot.val().services.fringe_bang_trim);
            $('#retouch_ombre').val(snapshot.val().services.retouch_ombre);
            $('#partial_balayage_haircut').val(snapshot.val().services.partial_balayage_haircut);
            $('#olaplex_add_in').val(snapshot.val().services.olaplex_add_in);
            $('#lanza_ultimate_treatment').val(snapshot.val().services.lanza_ultimate_treatment);
            $('#lanza_healing_service').val(snapshot.val().services.lanza_healing_service);
            $('#special_occasion_downstyle').val(snapshot.val().services.special_occasion_downstyle);
            $('#special_occasion_upstyle').val(snapshot.val().services.special_occasion_upstyle);
            $('#shampoo_blow_dry_style').val(snapshot.val().services.shampoo_blow_dry_style);
            $('#shampoo_wrap_style').val(snapshot.val().services.shampoo_wrap_style);
            $('#dry_styling').val(snapshot.val().services.dry_styling);
            $('#hair_extension_consultation').val(snapshot.val().services.hair_extension_consultation);
            $('#extensions').val(snapshot.val().services.extensions);
            $('#couture_sew_in').val(snapshot.val().services.couture_sew_in);
            $('#braidless_sew_in').val(snapshot.val().services.braidless_sew_in);
            $('#couture_lace_wig_prep_and_install').val(snapshot.val().services.couture_lace_wig_prep_and_install);
            $('#tightening_style').val(snapshot.val().services.tightening_style);
            $('#removal_style').val(snapshot.val().services.removal_style);
            $('#hothead_hair_extensions').val(snapshot.val().services.hothead_hair_extensions);
            $('#integration').val(snapshot.val().services.integration);
            $('#tightening').val(snapshot.val().services.tightening);
            $('#removal').val(snapshot.val().services.removal);
            $('#klix_extensions').val(snapshot.val().services.klix_extensions);
            $('#klix_extension_tightening').val(snapshot.val().services.klix_extension_tightening);
            $('#colored_extension_accents').val(snapshot.val().services.colored_extension_accents);
            $('#cinderella_hair_extensions').val(snapshot.val().services.cinderella_hair_extensions);
            $('#shellac').val(snapshot.val().services.shellac);
            $('#spa').val(snapshot.val().services.spa);
            $('#polish').val(snapshot.val().services.polish);
            $('#polish_change').val(snapshot.val().services.polish_change);
            $('#bevel_polish_change').val(snapshot.val().services.bevel_polish_change);
            $('#paraffin_treatment').val(snapshot.val().services.paraffin_treatment);
            $('#new_set_acrylic_pink_white').val(snapshot.val().services.new_set_acrylic_pink_white);
            $('#pink_white_balance').val(snapshot.val().services.pink_white_balance);
            $('#balance').val(snapshot.val().services.balance);
            $('#nail_repair').val(snapshot.val().services.nail_repair);
            $('#pedicure_spa').val(snapshot.val().services.pedicure_spa);
            $('#pedicure_special').val(snapshot.val().services.pedicure_special);
            $('#brow_shaping_wax').val(snapshot.val().services.brow_shaping_wax);
            $('#bikini_wax').val(snapshot.val().services.bikini_wax);
            $('#brazilian_bikini_wax').val(snapshot.val().services.brazilian_bikini_wax);
            $('#full_leg_wax').val(snapshot.val().services.full_leg_wax);
            $('#half_leg_wax').val(snapshot.val().services.half_leg_wax);
            $('#back_wax').val(snapshot.val().services.back_wax);
            $('#underarms').val(snapshot.val().services.underarms);
            $('#arms').val(snapshot.val().services.arms);
            $('#lip_cheeks_or_chin').val(snapshot.val().services.lip_cheeks_or_chin);
            $('#brow_wax').val(snapshot.val().services.brow_wax);
            $('#brows').val(snapshot.val().services.brows);
            $('#lip_wax').val(snapshot.val().services.lip_wax);
            $('#cheek_wax').val(snapshot.val().services.cheek_wax);
            $('#chin_wax').val(snapshot.val().services.chin_wax);
            $('#brow_shaping_and_lip_wax_combo').val(snapshot.val().services.brow_shaping_and_lip_wax_combo);
            $('#eyebrow_shaping').val(snapshot.val().services.eyebrow_shaping);
            $('#ear_wax').val(snapshot.val().services.ear_wax);
            $('#massage_30_minutes').val(snapshot.val().services.massage_30_minutes);
            $('#massage_60_minutes').val(snapshot.val().services.massage_60_minutes);
            $('#massage_90_minutes').val(snapshot.val().services.massage_90_minutes);
            $('#massage_120_minutes').val(snapshot.val().services.massage_120_minutes);
            $('#hot_stone_30_minutes').val(snapshot.val().services.hot_stone_30_minutes);
            $('#hot_stone_60_minutes').val(snapshot.val().services.hot_stone_60_minutes);
            $('#hot_stone_90_minutes').val(snapshot.val().services.hot_stone_90_minutes);
            $('#hot_stone_120_minutes').val(snapshot.val().services.hot_stone_120_minutes);
            $('#reflexology_30_minutes').val(snapshot.val().services.reflexology_30_minutes);
            $('#reflexology_60_minutes').val(snapshot.val().services.reflexology_60_minutes);
            $('#pomegranate_wintermint_facial').val(snapshot.val().services.pomegranate_wintermint_facial);
            $('#lemon_zest_facial').val(snapshot.val().services.lemon_zest_facial);
            $('#coconut_papaya_facial').val(snapshot.val().services.coconut_papaya_facial);
            $('#vitamin_c_facial').val(snapshot.val().services.vitamin_c_facial);
            $('#oxygen_lift_facial').val(snapshot.val().services.oxygen_lift_facial);
            $('#almond_mineral_facial').val(snapshot.val().services.almond_mineral_facial);
            $('#minty_relief').val(snapshot.val().services.minty_relief);
            $('#eucalyptus_charcoal_back_treatment').val(snapshot.val().services.eucalyptus_charcoal_back_treatment);
            $('#custom_facial').val(snapshot.val().services.custom_facial);
            $('#the_royal_treatment').val(snapshot.val().services.the_royal_treatment);
            $('#just_microderm').val(snapshot.val().services.just_microderm);
            $('#just_dermaplaning').val(snapshot.val().services.just_dermaplaning);
            $('#signature_anti_aging_treatment').val(snapshot.val().services.signature_anti_aging_treatment);
            $('#dermaplaning').val(snapshot.val().services.dermaplaning);
            $('#ultrasonic_face_lift_vitamin_infusion').val(snapshot.val().services.ultrasonic_face_lift_vitamin_infusion);
            $('#elite_skin_boosters').val(snapshot.val().services.elite_skin_boosters);
            $('#echo_2_oxygen_treatment').val(snapshot.val().services.echo_2_oxygen_treatment);
            $('#micro_diamond_abrasion').val(snapshot.val().services.micro_diamond_abrasion);
            $('#activated_charcoal_clearing_facial_for_face_or_back').val(snapshot.val().services.activated_charcoal_clearing_facial_for_face_or_back);
            $('#teen_facial').val(snapshot.val().services.teen_facial);
            $('#balancing_facial').val(snapshot.val().services.balancing_facial);
            $('#makeup_consultation').val(snapshot.val().services.makeup_consultation);
            $('#makeup_special_event').val(snapshot.val().services.makeup_special_event);
            $('#makeup_bridal').val(snapshot.val().services.makeup_bridal);
            $('#makeup_seasonal_color_analysis').val(snapshot.val().services.makeup_seasonal_color_analysis);
            $('#makeup_application').val(snapshot.val().services.makeup_application);
            $('#makeup_application_lesson').val(snapshot.val().services.makeup_application_lesson);
            $('#makeup_application_lesson_airbrush').val(snapshot.val().services.makeup_application_lesson_airbrush);
            $('#makeup_lesson_bridal_trial_session').val(snapshot.val().services.makeup_lesson_bridal_trial_session);
            $('#on_location_makeup').val(snapshot.val().services.on_location_makeup);
            $('#makeup_lashes').val(snapshot.val().services.makeup_lashes);
            $('#eyelash_extensions').val(snapshot.val().services.eyelash_extensions);
            $('#lavish_lashes').val(snapshot.val().services.lavish_lashes);
            $('#brow_shaping').val(snapshot.val().services.brow_shaping);
            $('#brow_tint_and_shaping').val(snapshot.val().services.brow_tint_and_shaping);
            $('#brow_tint').val(snapshot.val().services.brow_tint);
            $('#eye_lash_tint').val(snapshot.val().services.eye_lash_tint);
            $('#lash_and_brow_tinting_duo').val(snapshot.val().services.lash_and_brow_tinting_duo   );
            
            $('#in_studio_whitening').val(snapshot.val().services.in_studio_whitening);
            
            
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
                            document.getElementById("pf_imgProfilePic").src = '/images/dominic_profile.png';
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
            
            var pf_profilePic = $('#pf_imgProfilePic').attr('src');
            
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
            var pf_about = $scope.tinymceModel;
            if( pf_about === undefined ) {
                pf_about = ' '; 
            }
            
            const pf_hairColor = getCheckedCheckboxesFor('pf_cbHairColor');
            var pf_services = {
                'color_retouch': $('#color_retouch').val()
                , 'weaving': $('#weaving').val()
                , 'partial_weaving': $('#partial_weaving').val()
                , 'virgin_hair_color': $('#virgin_hair_color').val()
                , 'balayage': $('#balayage').val()
                , 'full_highlights': $('#full_highlights').val()
                , 'face_framing_highlights': $('#face_framing_highlights').val()
                , 'all_over_color': $('#all_over_color').val()
                , 'mens_color': $('#mens_color').val()
                , 't_line_part_only_touch_up': $('#t_line_part_only_touch_up').val()
                , 'ten_foil': $('#ten_foil').val()
                , 'custom_color': $('#custom_color').val()
                , 'dimensional_highlights': $('#dimensional_highlights').val()
                , 'ombre': $('#ombre').val()
                , 'eyebrow_tinting': $('#eyebrow_tinting').val()
                , 'express_color': $('#express_color').val()
                , 'corrective_color': $('#corrective_color').val()
                , 'weave_slicing': $('#weave_slicing').val()
                , 'clear_shine_color_treatment': $('#clear_shine_color_treatment').val()
                , 'color_enhancing_shine_treatment': $('#color_enhancing_shine_treatment').val()
                , 'body_wave': $('#body_wave').val()
                , 'permanent': $('#permanent').val()
                , 'permanent_wave': $('#permanent_wave').val()
                , 'keratin_treatment': $('#keratin_treatment').val()
                , 'kerafusion': $('#kerafusion').val()
                , 'relaxer': $('#relaxer').val()
                , 'reverse_perm': $('#reverse_perm').val()
                , 'natural_hair_straightening_iron_work': $('#natural_hair_straightening_iron_work').val()
                , 'womens_haircut_style': $('#womens_haircut_style').val()
                , 'womens_haircut': $('#womens_haircut').val()
                , 'bang_trim': $('#bang_trim').val()
                , 'shampoo_style': $('#shampoo_style').val()
                , 'thermal_style': $('#thermal_style').val()
                , 'updo': $('#updo').val()
                , 'mens_haircut': $('#mens_haircut').val()
                , 'mens_haircut_style': $('#mens_haircut_style').val()
                , 'childrens_haircut': $('#childrens_haircut').val()
                , 'childrens_haircut_style': $('#childrens_haircut_style').val()
                , 'clipper_cut': $('#clipper_cut').val()
                , 'womens_precision_haircut': $('#womens_precision_haircut').val()
                , 'light_dry_trim': $('#light_dry_trim').val()
                , 'partial_highlights_cut_style': $('#partial_highlights_cut_style').val()
                , 'partial_highlights_style': $('#partial_highlights_style').val()
                , 'full_highlights_cut_style': $('#full_highlights_cut_style').val()
                , 'full_highlights_style': $('#full_highlights_style').val()
                , 'color_retouch_cut_style': $('#color_retouch_cut_style').val()
                , 'color_retouch_style': $('#color_retouch_style').val()
                , 'all_over_color_cut_style': $('#all_over_color_cut_style').val()
                , 'all_over_color_style': $('#all_over_color_style').val()
                , 'glossing_cut_style': $('#glossing_cut_style').val()
                , 'glossing_style': $('#glossing_style').val()
                , 'balayage_cut_style': $('#balayage_cut_style').val()
                , 'balayage_style': $('#balayage_style').val()
                , 'face_framing_highlights_cut_style': $('#face_framing_highlights_cut_style').val()
                , 'face_framing_highlights_style': $('#face_framing_highlights_style').val()
                , 'perm_cut_style': $('#perm_cut_style').val()
                , 'perm_style': $('#perm_style').val()
                , 'relaxer_retouch': $('#relaxer_retouch').val()
                , 'relaxer_retouch_haircut': $('#relaxer_retouch_haircut').val()
                , 'relaxer_color': $('#relaxer_color').val()
                , 'relaxer_retouch_color_cut': $('#relaxer_retouch_color_cut').val()
                , 'lift_and_tone': $('#lift_and_tone').val()
                , 'full_keratin_cut_style': $('#full_keratin_cut_style').val()
                , 'express_color_cut_style': $('#express_color_cut_style').val()
                , 'fringe_bang_trim': $('#fringe_bang_trim').val()
                , 'retouch_ombre': $('#retouch_ombre').val()
                , 'partial_balayage_haircut': $('#partial_balayage_haircut').val()
                , 'olaplex_add_in': $('#olaplex_add_in').val()
                , 'lanza_ultimate_treatment': $('#lanza_ultimate_treatment').val()
                , 'lanza_healing_service': $('#lanza_healing_service').val()
                , 'special_occasion_downstyle': $('#special_occasion_downstyle').val()
                , 'special_occasion_upstyle': $('#special_occasion_upstyle').val()
                , 'shampoo_blow_dry_style': $('#shampoo_blow_dry_style').val()
                , 'shampoo_wrap_style': $('#shampoo_wrap_style').val()
                , 'dry_styling': $('#dry_styling').val()
                , 'hair_extension_consultation': $('#hair_extension_consultation').val()
                , 'extensions': $('#extensions').val()
                , 'couture_sew_in': $('#couture_sew_in').val()
                , 'braidless_sew_in': $('#braidless_sew_in').val()
                , 'couture_lace_wig_prep_and_install': $('#couture_lace_wig_prep_and_install').val()
                , 'tightening_style': $('#tightening_style').val()
                , 'removal_style': $('#removal_style').val()
                , 'hothead_hair_extensions': $('#hothead_hair_extensions').val()
                , 'integration': $('#integration').val()
                , 'tightening': $('#tightening').val()
                , 'removal': $('#removal').val()
                , 'klix_extensions': $('#klix_extensions').val()
                , 'klix_extension_tightening': $('#klix_extension_tightening').val()
                , 'colored_extension_accents': $('#colored_extension_accents').val()
                , 'cinderella_hair_extensions': $('#cinderella_hair_extensions').val()
                , 'shellac': $('#shellac').val()
                , 'spa': $('#spa').val()
                , 'polish': $('#polish').val()
                , 'polish_change': $('#polish_change').val()
                , 'bevel_polish_change': $('#bevel_polish_change').val()
                , 'paraffin_treatment': $('#paraffin_treatment').val()
                , 'new_set_acrylic_pink_white': $('#new_set_acrylic_pink_white').val()
                , 'pink_white_balance': $('#pink_white_balance').val()
                , 'balance': $('#balance').val()
                , 'nail_repair': $('#nail_repair').val()
                , 'pedicure_spa': $('#pedicure_spa').val()
                , 'pedicure_special': $('#pedicure_special').val()
                , 'brow_shaping_wax': $('#brow_shaping_wax').val()
                , 'bikini_wax': $('#bikini_wax').val()
                , 'brazilian_bikini_wax': $('#brazilian_bikini_wax').val()
                , 'full_leg_wax': $('#full_leg_wax').val()
                , 'half_leg_wax': $('#half_leg_wax').val()
                , 'back_wax': $('#back_wax').val()
                , 'underarms': $('#underarms').val()
                , 'arms': $('#arms').val()
                , 'lip_cheeks_or_chin': $('#lip_cheeks_or_chin').val()
                , 'brow_wax': $('#brow_wax').val()
                , 'brows': $('#brows').val()
                , 'lip_wax': $('#lip_wax').val()
                , 'cheek_wax': $('#cheek_wax').val()
                , 'chin_wax': $('#chin_wax').val()
                , 'brow_shaping_and_lip_wax_combo': $('#brow_shaping_and_lip_wax_combo').val()
                , 'eyebrow_shaping': $('#eyebrow_shaping').val()
                , 'ear_wax': $('#ear_wax').val()
                , 'massage_30_minutes': $('#massage_30_minutes').val()
                , 'massage_60_minutes': $('#massage_60_minutes').val()
                , 'massage_90_minutes': $('#massage_90_minutes').val()
                , 'massage_120_minutes': $('#massage_120_minutes').val()
                , 'hot_stone_30_minutes': $('#hot_stone_30_minutes').val()
                , 'hot_stone_60_minutes': $('#hot_stone_60_minutes').val()
                , 'hot_stone_90_minutes': $('#hot_stone_90_minutes').val()
                , 'hot_stone_120_minutes': $('#hot_stone_120_minutes').val()
                , 'reflexology_30_minutes': $('#reflexology_30_minutes').val()
                , 'reflexology_60_minutes': $('#reflexology_60_minutes').val()
                , 'pomegranate_wintermint_facial': $('#pomegranate_wintermint_facial').val()
                , 'lemon_zest_facial': $('#lemon_zest_facial').val()
                , 'coconut_papaya_facial': $('#coconut_papaya_facial').val()
                , 'vitamin_c_facial': $('#vitamin_c_facial').val()
                , 'oxygen_lift_facial': $('#oxygen_lift_facial').val()
                , 'almond_mineral_facial': $('#almond_mineral_facial').val()
                , 'minty_relief': $('#minty_relief').val()
                , 'eucalyptus_charcoal_back_treatment': $('#eucalyptus_charcoal_back_treatment').val()
                , 'custom_facial': $('#custom_facial').val()
                , 'the_royal_treatment': $('#the_royal_treatment').val()
                , 'just_microderm': $('#just_microderm').val()
                , 'just_dermaplaning': $('#just_dermaplaning').val()
                , 'signature_anti_aging_treatment': $('#signature_anti_aging_treatment').val()
                , 'dermaplaning': $('#dermaplaning').val()
                , 'ultrasonic_face_lift_vitamin_infusion': $('#ultrasonic_face_lift_vitamin_infusion').val()
                , 'elite_skin_boosters': $('#elite_skin_boosters').val()
                , 'echo_2_oxygen_treatment': $('#echo_2_oxygen_treatment').val()
                , 'micro_diamond_abrasion': $('#micro_diamond_abrasion').val()
                , 'activated_charcoal_clearing_facial_for_face_or_back': $('#activated_charcoal_clearing_facial_for_face_or_back').val()
                , 'teen_facial': $('#teen_facial').val()
                , 'balancing_facial': $('#balancing_facial').val()
                , 'makeup_consultation': $('#makeup_consultation').val()
                , 'makeup_special_event': $('#makeup_special_event').val()
                , 'makeup_bridal': $('#makeup_bridal').val()
                , 'makeup_seasonal_color_analysis': $('#makeup_seasonal_color_analysis').val()
                , 'makeup_application': $('#makeup_application').val()
                , 'makeup_application_lesson': $('#makeup_application_lesson').val()
                , 'makeup_application_lesson_airbrush': $('#makeup_application_lesson_airbrush').val()
                , 'makeup_lesson_bridal_trial_session': $('#makeup_lesson_bridal_trial_session').val()
                , 'on_location_makeup': $('#on_location_makeup').val()
                , 'makeup_lashes': $('#makeup_lashes').val()
                , 'eyelash_extensions': $('#eyelash_extensions').val()
                , 'lavish_lashes': $('#lavish_lashes').val()
                , 'lash_and_brow_tinting_duo': $('#lash_and_brow_tinting_duo').val()
                , 'brow_shaping': $('#brow_shaping').val()
                , 'brow_tint_and_shaping': $('#brow_tint_and_shaping').val()
                , 'brow_tint': $('#brow_tint').val()
                , 'eye_lash_tint': $('#eye_lash_tint').val()
                , 'in_studio_whitening': $('#in_studio_whitening').val()
            }; 
            
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
            const pf_whitening = getCheckedCheckboxesFor('pf_cbTeethWhitening');
            
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
                            , regUID: profUID
                            , picURL: url
                            , services: pf_services
                            , whitening: pf_whitening
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
                        , regUID: profUID
                        , picURL: pf_profilePic
                        , services: pf_services
                        , whitening: pf_whitening
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
                        , regUID: profUID
                        , picURL: pf_profilePic
                        , services: pf_services
                        , whitening: pf_whitening
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
