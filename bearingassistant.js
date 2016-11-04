var marker_from,
    marker_from_text = 'From',
    marker_to,
    marker_to_text = 'To',
    map,
    fromInitial = new google.maps.LatLng(58.38156, 13.43628),
    toInitial = new google.maps.LatLng(58.42836, 14.1037),
    mapOptions = {
      zoom: 8,
      center: fromInitial,
      disableDefaultUI: true
    },
    precision = 5,
    from_lat,
    from_lng,
    to_lat,
    to_lng,
    earthRadius = 6371, // km
    from_lat_radians,
    to_lat_radians,
    delta_lat,
    delta_lng;


function initialize() {
  setupMap();
  setupOverlay();
}

function setupMap() {  
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  marker_from = new google.maps.Marker({
      position: fromInitial,
      map: map,
      draggable: true,
      title: marker_from_text,
      icon: "http://maps.google.com/mapfiles/ms/icons/red.png"      
  });

  marker_to = new google.maps.Marker({
      position: toInitial,
      map: map,
      draggable: true,
      title: marker_to_text,
      icon: "http://maps.google.com/mapfiles/ms/icons/green.png"
  });

  google.maps.event.addListener(marker_from, 'dragend', function() {
    updatePositionFields(marker_from);
  });

  google.maps.event.addListener(marker_to, 'dragend', function() {
    updatePositionFields(marker_to);
  });

}

function setupOverlay() {
  updatePositionFields(marker_from);
  updatePositionFields(marker_to);  
  console.log("Hello Overlay!");
}

function updatePositionFields(marker) {
  var lat = parseFloat(marker.getPosition().lat().toFixed(precision));
  var lng = parseFloat(marker.getPosition().lng().toFixed(precision));
  var title = marker.title;
  if(title === marker_from_text) {
    from_lat = lat;
    from_lng = lng;
    $("#from-lat").html("<b>" + from_lat + "</b>");
    $("#from-lng").html("<b>" + from_lng + "</b>");
  } else if(title === marker_to_text) {
    to_lat = lat;
    to_lng = lng;
    $("#to-lat").html("<b>" + to_lat + "</b>");
    $("#to-lng").html("<b>" + to_lng + "</b>");
  }
  calculateDistance();
}

function calculateDistance() {
  from_lat_radians = toRadians(from_lat);
  to_lat_radians = toRadians(to_lat);
  delta_lat = toRadians(from_lat-to_lat);
  delta_lng = toRadians(from_lng-to_lng);

  var a = Math.sin(delta_lat/2) * Math.sin(delta_lat/2) +
          Math.cos(from_lat_radians) * Math.cos(to_lat_radians) *
          Math.sin(delta_lng/2) * Math.sin(delta_lng/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  var d = earthRadius * c;


  $("#distance").html("<b>" + parseFloat(d.toFixed(3)) + " km</br>");
  calculateBearing();
}

function calculateBearing() {
  var startLat = toRadians(from_lat);
  var startLong = toRadians(from_lng);

  var endLat = toRadians(to_lat);
  var endLong = toRadians(to_lng);

  var dLong = endLong - startLong;
  
  var dPhi = Math.log(Math.tan(endLat/2.0+Math.PI/4.0)/Math.tan(startLat/2.0+Math.PI/4.0));
  if (Math.abs(dLong) > Math.PI){
    if (dLong > 0.0)
       dLong = -(2.0 * Math.PI - dLong);
    else
       dLong = (2.0 * Math.PI + dLong);
  }

  var bearing = (toDegrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
  $("#bearing").html("<b>" + parseFloat(bearing.toFixed(1)) + " degrees</br>");
}


function toRadians(value) {
  return (value*Math.PI)/180;
}

function toDegrees(value) {
  return value*(180/Math.PI);
}


google.maps.event.addDomListener(window, 'load', initialize);