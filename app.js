
var days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
var month = [
  "Januari",
  "Februari",
  "Mars",
  "April",
  "Maj",
  "Juni",
  "Juli",
  "Augusti",
  "September",
  "Oktober",
  "November",
  "December"
];
var weatherCodes = {
  "1": "klart",
  "2": "nästan klart",
  "3": "lätt molnighet",
  "4": "måttlig molnighet",
  "5": "molnigt",
  "6": "mulet",
  "7": "dimma",
  "8": "lätt regnskur",
  "9": "måttlig regnskur",
  "10": "tung regnskur",
  "11": "åskväder",
  "12": "lätt hagelskur",
  "13": "måttlig hagelskur",
  "14": "tung hagelskur",
  "15": "lätt snöskur",
  "16": "måttlig snöskur",
  "17": "tung snöskur",
  "18": "lätt regn",
  "19": "måttlig regn",
  "20": "tung regn",
  "21": "åska",
  "22": "lätt hagel",
  "23": "måttlig hagel",
  "24": "tung hagel",
  "25": "lätt snöfall",
  "26": "måttlig snöfall",
  "27": "tung snöfall"
};



// Positions in HTML
var errorMessage = document.getElementById("errorMessage");
var Textlocation = document.getElementById("location");
var loadLocationMessage = document.getElementById("loadLocation");

// Div to build weather in
var build = document.getElementById("weatherBuild");
var today = document.getElementById("today");
var today_top = document.getElementById("today_top");
var today_bottom = document.getElementById("today_bottom");

// Default positions if geolocation fails /default = Stockholm)
var defaultPositionlat = 59.334591;
var defaultPositionlng = 18.063240;

// Store Markers so we can target them later
var currentMarker = [];

// create map
var map = new map("map", 10, true);

function map(id, zoom, controls){
  // Find container
  var mapContainer = document.getElementById(id);

  // Set default location to Stockholm
  var mapProperties = {
    center: new google.maps.LatLng(defaultPositionlat, defaultPositionlng),
    zoom: zoom,
    disableDefaultUI: controls
  }

  // Create map + create Geo Location for Google maps
  var map = new google.maps.Map(mapContainer, mapProperties);
  var geocoder = new google.maps.Geocoder;

  // Change Location function
  this.setLocation = ((lat, lng) => {
    // in this case is this = 'map'
    this.addMarker(lat, lng);
    this.setCenter(lat, lng);
    this.getGeoCode(lat, lng);
    loadWeather(parseFloat(lat), parseFloat(lng));
  });

  // Replace marker on map
  this.addMarker = function(lat, lng) {

    // Removes previous marker from map if marker exists
    if(currentMarker != ""){
      currentMarker[0].setMap(null);
    }
    // create new marker
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(parseFloat(lat), parseFloat(lng)),
      map: map
    });
    // add new marker to map and array
    marker.setMap(map);
    currentMarker[0]= marker;
  }

  // Set center on map (new camera position)
  this.setCenter = function(lat, lng){
    map.setCenter(new google.maps.LatLng(lat, lng));
  };

  // Click to change location on click -> set marker and set center
  map.addListener('click', (e) => {
    this.addMarker(e.latLng.lat(), e.latLng.lng());
    loadWeather(e.latLng.lat(), e.latLng.lng());
    this.getGeoCode(e.latLng.lat(), e.latLng.lng());
  });

  this.getGeoCode = function(lat, lng){
    // print location adress
    geocoder.geocode({'location': {lat: lat, lng: lng}}, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
          let postal_town = (results[0].address_components.filter(loc => loc.types == "postal_town"))[0].long_name;
          let lan = results[0].address_components.filter(loc => loc.types[0] == "administrative_area_level_1")[0].long_name;
          Textlocation.innerHTML = postal_town + ", " + lan;
        } else {
          console.log('No results found');
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
    });
  }


}



// Geo location with HTML5 Geolocation
  // Run when page loads
  getMyLocation();
  function getMyLocation() {
    if (navigator.geolocation) {
      loadLocationMessage.classList.add("visible");
      navigator.geolocation.getCurrentPosition(function(position){
        map.setLocation(position.coords.latitude, position.coords.longitude);
        map.getGeoCode(position.coords.latitude, position.coords.longitude);
        loadLocationMessage.classList.remove("visible");
      }, showError);
    } else {
      map.setLocation(defaultPositionlat, defaultPositionlng);
    }
  }

  // Error handlers for HTML5 Geolocation
  // if error -> set default location to default coordinates
  function showError(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
          errorMessage.innerHTML = "User denied the request for Geolocation. Position set to Stockholm.";
          map.setLocation(defaultPositionlat, defaultPositionlng);
            loadLocationMessage.classList.remove("visible");
          break;
      case error.POSITION_UNAVAILABLE:
          errorMessage.innerHTML = "Location information is unavailable. Position set to Stockholm.";
          map.setLocation(defaultPositionlat, defaultPositionlng);
            loadLocationMessage.classList.remove("visible");
          break;
      case error.TIMEOUT:
          errorMessage.innerHTML = "The request to get user location timed out. Position set to Stockholm.";
          map.setLocation(defaultPositionlat, defaultPositionlng);
            loadLocationMessage.classList.remove("visible");
          break;
      case error.UNKNOWN_ERROR:
          errorMessage.innerHTML = "An unknown error occurred. Position set to Stockholm.";
          map.setLocation(defaultPositionlat, defaultPositionlng);
            loadLocationMessage.classList.remove("visible");
          break;
    }
  }



// AJAX request to SMHI web API with coordinates from Google Maps
function loadWeather(lat, lng){
  lat2 = lat.toFixed(6);
  lng2 = lng.toFixed(6);

  var ajaxRequest = new XMLHttpRequest();
  ajaxRequest.onreadystatechange = function(){
    if(ajaxRequest.readyState == 4 && ajaxRequest.status == 200){
      let response = JSON.parse(this.response);
      buildWeather(response);
    }
  }
  // Get weather data from location from SMHI
  ajaxRequest.open('GET', 'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/'+lng2+'/lat/'+lat2+'/data.json', true);
  ajaxRequest.send();
}



// Use the response from SMHI to build the weather on page
function buildWeather(response){
  console.log(response);

  // clear html
  today_top.innerHTML = "";
  today_bottom.innerHTML = "";

  // Build todays weather
    // Create date object with the time from SMHI page
    var today_date = new Date(response.timeSeries[0].validTime);
    var today_temp = response.timeSeries[0].parameters.filter( name => name.name == "t")[0].values[0];
      var today_temp_type = response.timeSeries[0].parameters.filter( name => name.name == "t")[0].unit;
        if(today_temp_type == "Cel"){ today_temp_type = "°"; }
    var today_type = weatherCodes[ response.timeSeries[0].parameters.filter( name => name.name == "Wsymb2" )[0].values[0] - 1 ];

    let createTemp = document.createElement("p");
      createTemp.innerHTML = today_temp + today_temp_type;
      createTemp.setAttribute("class", "today_temp");

    let createType = document.createElement("p");
      createType.innerHTML = today_type;
      createType.setAttribute("class", "today_type");

    let createTypeImg = document.createElement("div");
      createTypeImg.setAttribute("class", "today_img");

    let createDate = document.createElement("p");
      createDate.innerHTML = days[today_date.getDay()] + ", " + today_date.getDay() +  " " + month[today_date.getMonth()] + " " + addZero(today_date.getHours()) + ":" + addZero(today_date.getMinutes());
      createDate.setAttribute("class", "today_date");


    today_top.append(createTemp);
    today_top.append(createType);
    today_top.append(createTypeImg);
    today_bottom.append(createDate);

}





function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
