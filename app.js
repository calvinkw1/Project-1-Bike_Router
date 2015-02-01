// initialize google's map
  var map;
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
  }

  google.maps.event.addDomListener(window, "load", initialize);
// the map init function will not work within a docready function

var startAddy = new google.maps.LatLng(lat, lng);

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
  google.maps.event.addListener(marker, 'click', toggleBounce);
}

function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

// google.maps.event.addDomListener(document.getElementById("map-canvas"), "click", addMarker);

var lat,
    lng;

// this function will retrieve the lattitude/longitude of any address that is entered into the text box upon "submit" and place a marker on the location
$("form").on("submit", function(e) {
  var address = $("#addyBox").val();
  var url = encodeURI("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyDE6F79FbnrSc9hZlurECTyBJoEyHCj-Nc"); // this encodes the URL to account for spaces
  e.preventDefault();
  // getJSON function below to retrieve the lat/lng from google's geocode api
  $.getJSON(url, function(data) {
    var privLat = data.results[0].geometry.location.lat; // json result stored in variable
    var privLng = data.results[0].geometry.location.lng; // json result stored in variable
    lat = privLat; // storing private variables in public variables
    lng = privLng;
    console.log(lat + ", " + lng);
  });
  addMarker();
});


