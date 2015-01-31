// initialize google's map
  var map;
  function initialize() {
    var mapOptions = {
      zoom: 8,
      center: new google.maps.LatLng(-34.397, 150.644)
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
  }

  google.maps.event.addDomListener(window, 'load', initialize);
// the map init function will not work within a docready function


$(document).ready(function() {
  
});