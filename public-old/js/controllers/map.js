myApp.controller('MapController', ['$scope'
  , function ($scope) {
        window.scrollTo(0, 0);
        var myCenter = new google.maps.LatLng(40.0631026, -83.0623581);
        var mapProp = {
            center: myCenter
            , zoom: 12
            , scrollwheel: false
            , draggable: false
            , mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
        var marker = new google.maps.Marker({
            position: myCenter
        , });
        marker.setMap(map);   
      
}]); // Controller