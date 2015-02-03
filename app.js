// initialize google's map
var map,
    name,
    newMarker,
    infowindow,
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

}
// the map init function will not work within a docready function
google.maps.event.addDomListener(document.getElementById("getStartedBtn"), "click", initialize);



function addMarker() {
  var myLatlng = new google.maps.LatLng(lat, lng);
  var mapOptions = {
    zoom: 17,
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
  // Event listener to load Places results
  google.maps.event.addListener(marker, "dblclick", initPlaces);

  google.maps.event.addListener(map, 'click', function(event) {
    clickAddMarker(event.latLng);
    // console.log(event.latLng);
  });

  function initPlaces() {
    var markerLocation = new google.maps.LatLng(lat, lng);
    var request = {
      location: markerLocation,
      radius: 100,
      types: ["restaurant"]
    };
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, markPlaces);
  }

  function markPlaces(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var position = new google.maps.LatLng(results[i].geometry.location.k, results[i].geometry.location.D);
        newMarker = new google.maps.Marker({
          map: map,
          image: results[i].icon,
          title: results[i].name,
          position: position
        });
        infowindow = new google.maps.InfoWindow({
          content: results[i].name
        });
        google.maps.event.addListener(newMarker, 'click', openInfoWindow);
      }
    }
  }

  function openInfoWindow() {
    infowindow.setContent('<div style="color:black; width: 75px;">' + this.title + '</div>');
    console.log("infowindow",infowindow);
    console.log("newMarker",this);
    infowindow.open(map, this);
  }
    // map.setCenter(results[i].geometry.location);   this line isn't needed unless centering the map after grabbing all places

    // this toggles the bouncing animation for the marker when marker is clicked
  function toggleBounce() {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }

  function clickAddMarker(location) {
  var marker = new google.maps.Marker({
      draggable: true,
      position: location,
      map: map,
      animation: google.maps.Animation.DROP,
  });
  waypts.push(marker);
  console.log(waypts);
  google.maps.event.addListener(marker, "dblclick", initPlaces);
  }
}

var lat,
    lng,
    waypts = [];

// this function will retrieve the lattitude/longitude of any address that is entered into the text box upon "submit" and place a marker on the location
function submitAddyBox() {
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
      addMarker(); // calling function to drop marker on map
    });
    $("#addyBox").val(""); // clear text after submit
  });
}



var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

function initDirections() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var startLoc = new google.maps.LatLng(lat, lng);
  var mapOptions = {
    zoom: 6,
    center: startLoc
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  directionsDisplay.setMap(map);
}

function calcRoute() {
  var start = document.getElementById('start').value;
  var end = document.getElementById('end').value;
  var checkboxArray = document.getElementById('waypoints');
  for (var i = 0; i < checkboxArray.length; i++) {
    if (checkboxArray.options[i].selected === true) {
      waypts.push({
          location:checkboxArray[i].value,
          stopover:true});
    }
  }

  var request = {
      origin: start,
      destination: end,
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.BICYCLING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      var route = response.routes[0];
      var summaryPanel = document.getElementsByClassName("directionsBox");
      summaryPanel.innerHTML = '';
      // For each route, display summary information.
      for (var i = 0; i < route.legs.length; i++) {
        var routeSegment = i + 1;
        summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment + '</b><br>';
        summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
        summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
        summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
      }
    }
  });
}

google.maps.event.addDomListener(document.getElementsByClassName("addyForm"), "submit", initDirections);