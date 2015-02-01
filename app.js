// initialize google's map
  var map,
      mapLoaded = false;
  function initialize() {
    var mapOptions = {
      zoom: 12,
      center: new google.maps.LatLng(37.7749300 , -122.4194200),
      panControl: true,
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: true,
      overviewMapControl: true
    };
    map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);
    mapLoaded = true;
    $(".addyForm").show();
    $(".getStarted").hide();
    google.maps.event.addListener(document.getElementsByClassName("addyForm"), "submit", submitAddyBox());
    google.maps.event.addListener(map, 'click', function(event) {
      clickAddMarker(event.latLng);
      console.log(event.latLng);
  });

}
// the map init function will not work within a docready function
  google.maps.event.addDomListener(document.getElementById("getStartedBtn"), "click", initialize);


function addMarker() {
  var myLatlng = new google.maps.LatLng(lat, lng);
  var mapOptions = {
    zoom: 15,
    center: myLatlng
  };
  var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  var marker = new google.maps.Marker({
    draggable: true,
    animation: google.maps.Animation.DROP,
    position: myLatlng
  });

  // To add the marker to the map, call setMap();
  marker.setMap(map);

  // Event listener for click on the marker to invoke bouncing animation on marker
  google.maps.event.addListener(marker, 'click', toggleBounce);

  // this toggles the bouncing animation for the marker when marker is clicked
  function toggleBounce() {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }
}

function clickAddMarker(location) {
  var marker = new google.maps.Marker({
      position: location,
      map: map
  });
}

var lat,
    lng;

// this function will retrieve the lattitude/longitude of any address that is entered into the text box upon "submit" and place a marker on the location
function submitAddyBox() {
  $("form").on("submit", function(e) {
    var address = $("#addyBox").val();
    var url = encodeURI("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyDE6F79FbnrSc9hZlurECTyBJoEyHCj-Nc"); // this encodes the URL to account for spaces
    e.preventDefault();
    // getJSON function below to retrieve the lat/lng from google's geocode api
    $.getJSON(url, function(data) {
      console.log(data);
      var privLat = data.results[0].geometry.location.lat; // json result stored in variable
      var privLng = data.results[0].geometry.location.lng; // json result stored in variable
      lat = privLat; // storing private variables in public variables
      lng = privLng;
      console.log(lat + ", " + lng);
    });
    addMarker(); // calling function to drop marker on map
    // $("#addyBox").val("");
  });
}

