// initialize google's map
// try to get start/end points first before drawing on the map
var map,
    name,
    placesMarker,
    wyptMarker,
    infowindow,
    startLat,
    startLng,
    start = startLat + startLng,
    lat,
    lng,
    endLat,
    endLng,
    endDest = parseInt(endLat) + parseInt(endLng),
    wayptsArray = [],
    placesArray = [],
    mapLoaded = false,
    directionsDisplay,
    directionsService = new google.maps.DirectionsService(),
    poly,
    polyOptions,
    polylineOptions = new google.maps.Polyline(),
    path;

// the map init function will not work within a docready function
google.maps.event.addDomListener(document.getElementById("getStartedBtn"), "click", initialize);

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
      startLat = privLat; // storing private variables in public variables
      startLng = privLng;
      start = new google.maps.LatLng(startLat, startLng);

      addMarker(); // calling function to drop marker on map
    });
    $("#addyBox").val(""); // clear text after submit
  });
}

function initialize() {
  var rendererOptions = {
    draggable: true
  };
  var mapOptions = {
    zoom: 13,
    center: new google.maps.LatLng(37.7749300 , -122.4194200),
    panControl: true,
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: true,
    overviewMapControl: true
  };
  var polyOptions = {
    path: wayptsArray,
    strokeColor: '#000000',
    strokeOpacity: 1.0,
    strokeWeight: 3
  };
  poly = new google.maps.Polyline(polyOptions);
  poly.setMap(map);
  directionsDisplay = new google.maps.DirectionsRenderer(polylineOptions);
  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  mapLoaded = true;
  $(".addyForm").show();
  $(".getStarted").hide();
  $(".mainBox").css("padding-left", "0");
  $(".mainBox").css("background-color", "none");
  $(".mainBox").css("opacity", "1");
  google.maps.event.addListener(document.getElementsByClassName("addyForm"), "submit", submitAddyBox());
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById("directions-panel"));

}



function addMarker() {
  var myLatlng = new google.maps.LatLng(startLat, startLng);
  var mapOptions = {
    zoom: 15,
    center: myLatlng
  };
  // var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  var marker = new google.maps.Marker({
    draggable: true,
    animation: google.maps.Animation.DROP,
    position: myLatlng,
    icon: "map_marker_start.png"
  });


  // To add the marker to the map, call setMap();
  marker.setMap(map);

  // Event listener for click on the marker to invoke bouncing animation on marker
  google.maps.event.addListener(marker, 'click', toggleBounce);
  // Event listener to load Places results
  google.maps.event.addListener(marker, "dblclick", initPlaces);

  google.maps.event.addListener(map, 'click', function(event) {
    clickAddMarker(event.latLng);
  });

  function initPlaces() {
    var markerLocation = new google.maps.LatLng(lat, lng);
    var request = {
      location: markerLocation,
      radius: 150,
      types: ["bar", "restaurant"]
    };
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, markPlaces);
  }

  function markPlaces(results, status) {
    $(".placesList").css("visibility", "visible");
    $(".listItems").empty();
    console.log(results);
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var x = 0; x < placesArray.length; x++) {
        placesArray[x].setMap(null);
      }
      placesArray = [];
      for (var i = 0; i < results.length; i++) {
        var position = new google.maps.LatLng(results[i].geometry.location.k, results[i].geometry.location.D);
        var gpmarker = new google.maps.MarkerImage(results[i].icon, null, null, null, new google.maps.Size(25, 25));
        placesMarker = new google.maps.Marker({
          map: map,
          icon: gpmarker,
          title: results[i].name,
          position: position,
          draggable: false,
        });
        var placeTitle = results[i].name;
        var placeImage = results[i].icon;
        var placeRating = results[i].rating;
        var placeVicinity = results[i].vicinity;
        placesArray.push(placesMarker);
        infowindow = new google.maps.InfoWindow({
          content: results[i].name
        });
        google.maps.event.addListener(placesMarker, 'click', openInfoWindow);
        $(".listItems").append("<div class='item'><img class='placesMarker' src='" + placeImage + "'><h4>" + placeTitle + "</h4><p>Address: " + placeVicinity + "</p><p>Rating: " + placeRating + "</p></div>");
      }
    }
  }

  // opens info window of a places marker
  function openInfoWindow() {
    infowindow.setContent('<div style="color:black; width: 75px;">' + this.title + '</div>');
    // console.log("infowindow",infowindow);
    // console.log("placesMarker",this);
    infowindow.open(map, this);
    $(this).css("background-color", "#a9fcf5");
  }

    // this toggles the bouncing animation for the marker when marker is clicked
  function toggleBounce() {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }

  function clickAddMarker(location) {
    // console.log(location);
    lat = location.k;
    lng = location.D;
    endLat = lat;
    endLng = lng;
    var wyptLatlng = new google.maps.LatLng(lat, lng);
    var wyptMarker = new google.maps.Marker({
      draggable: true,
      position: wyptLatlng,
      map: map,
      animation: google.maps.Animation.DROP,
      icon: "map_marker_waypoint.png"
    });
    // wayptsArray.push(wyptLatlng);
    wayptsArray.push({
      location: location,
      stopover: true
    });
    var path = poly.getPath();
    path.push(event.latLng);

    google.maps.event.addListener(wyptMarker, "dblclick", initPlaces);
    calcRoute();
  }

  function calcRoute() {
  $(".directionsBox").css("visibility", "visible");
  var request = {
    origin: start,
    waypoints: wayptsArray,
    destination: new google.maps.LatLng(endLat, endLng),
    travelMode: google.maps.TravelMode.BICYCLING,
  };
  directionsService.route(request, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
            // options.suppressMarkers = true;
            // directionsDisplay.setOptions(options);// = new google.maps.DirectionsRenderer(options);
            directionsDisplay.setDirections(result);
          }
        });
      }
}


  


