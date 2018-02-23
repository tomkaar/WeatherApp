var days = {
  "0": "Sunday",
  "1": "Monday",
  "2": "Tuesday",
  "3": "Wednesday",
  "4": "Thursday",
  "5": "Friday",
  "6": "Saturday"
};
var month = {
  "0": "Januari",
  "1": "Februari",
  "2": "Mars",
  "3": "April",
  "4": "Maj",
  "5": "Juni",
  "6": "Juli",
  "7": "Augusti",
  "8": "September",
  "9": "Oktober",
  "10": "November",
  "11": "December"
};
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

var weather_klart = [1];
var weather_molnigt = [6];
var weather_latt_molnigt = [2, 3, 4, 5];
var weather_dimma = [7];
var weather_regn = [8, 9, 10, 18, 19, 20];
var weather_blixt = [11, 21];
var weather_hagel = [12, 13, 14, 22, 23, 24];
var weather_sno = [15, 16, 17, 25, 26, 27];

var build = document.getElementById("weatherBuild");
var today = document.getElementById("today");
var future = document.getElementById("future");

var currentLocation = document.getElementById("currentLocation");
var loadLocationMessage = document.getElementById("loadingScreen");

var defaultPositionlat = 59.334591;
var defaultPositionlng = 18.063240;



var map = new map("map", 10, true);
function map(id, zoom, controls){
  this.currentLocation = { "lat": defaultPositionlat, "lng": defaultPositionlng};
  this.currentMarker = [];
  this.currentGeoCode = [];

  var geo = this.currentGeoCode;

  var mapContainer = document.getElementById(id);
  var mapProperties = {
    center: {lat: defaultPositionlat, lng: defaultPositionlng},
    zoom: zoom,
    disableDefaultUI: false,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_CENTER
    },
    fullscreenControl: false,
    streetViewControl: false,
  }

  var map = new google.maps.Map(mapContainer, mapProperties);
  var geocoder = new google.maps.Geocoder;

  // When you click on map
  map.addListener('click', (e) => {
    this.setLocation(e.latLng.lat(), e.latLng.lng());
  });

  // Set location
  this.setLocation = ((lat, lng, moveTo = false) => {
    this.updateLocation(lat, lng);
    this.setMarker(lat, lng);
    if(moveTo){ this.moveToLocation(lat, lng); }
    getLocationData(lat, lng, function(locationData) {
      geo[0] = locationData;
      loadWeather(lat, lng);
    });
  });

  // get Location Data
  function getLocationData(lat, lng, callback) {
    geocoder.geocode({ 'location': {lat: lat, lng: lng} }, function (results, status) {
      if( status == google.maps.GeocoderStatus.OK ) {
        callback(results[0]);
      }
    });
  }

  // Update Location in array
  this.updateLocation = ((lat, lng) => { this.currentLocation = { "lat": lat, "lng": lng} });

  // set marker
  this.setMarker = ((lat, lng) => {
    if(this.currentMarker != ""){ this.currentMarker[0].setMap(null); }
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(parseFloat(lat), parseFloat(lng)),
      map: map
    });
    marker.setMap(map);
    this.currentMarker[0] = marker;
  });

  // Move to location - option
  this.moveToLocation = ((lat, lng) => {
    map.setCenter(new google.maps.LatLng(lat, lng));
  });

  this.getCurrentGeoCode = function(){ return this.currentGeoCode[0]};
  this.getCurrentLocation = function(){ return this.currentLocation};
  this.getCurrentMarker = function(){ return this.currentMarker};
}



getMyLocation();
function getMyLocation() {
  if (navigator.geolocation) {
    loadLocationMessage.classList.add("visible");
    navigator.geolocation.getCurrentPosition(function(position){
      map.setLocation(position.coords.latitude, position.coords.longitude, true);
      loadLocationMessage.classList.remove("visible");
    }, showError);
  } else {
    map.setLocation(defaultPositionlat, defaultPositionlng);
  }
}

// errors for Geo Location
function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      errorMessage.innerHTML = "User denied the request for Geolocation. Position set to Stockholm.";
      map.setLocation(defaultPositionlat, defaultPositionlng, true);
      loadLocationMessage.classList.remove("visible");
      break;
    case error.POSITION_UNAVAILABLE:
      errorMessage.innerHTML = "Location information is unavailable. Position set to Stockholm.";
      map.setLocation(defaultPositionlat, defaultPositionlng, true);
      loadLocationMessage.classList.remove("visible");
      break;
    case error.TIMEOUT:
      errorMessage.innerHTML = "The request to get user location timed out. Position set to Stockholm.";
      map.setLocation(defaultPositionlat, defaultPositionlng, true);
      loadLocationMessage.classList.remove("visible");
      break;
    case error.UNKNOWN_ERROR:
      errorMessage.innerHTML = "An unknown error occurred. Position set to Stockholm.";
      map.setLocation(defaultPositionlat, defaultPositionlng, true);
      loadLocationMessage.classList.remove("visible");
      break;
  }
}


async function loadWeather(lat, lng){
  let lat2 = lat.toFixed(0);
  let lng2 = lng.toFixed(0);
  let url = 'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/'+lng2+'/lat/'+lat2+'/data.json';
  let promise = await fetch(url).then( async function(data){
    let response = await data.json();
    buildWeather(response);
  });
}




// Build Weather
function buildWeather(response){
  console.log(response);
  console.log(map.getCurrentGeoCode());

  today.innerHTML = "";

  var today_date = new Date();

  var today_temp = getParam("t")[0].values[0];
  var today_temp_type = getParam("t")[0].unit;
  var today_type = weatherCodes[ getParam("Wsymb2")[0].values[0] ];

  if(today_temp_type == "Cel"){ today_temp_type = "°"; }

  let createTemp = document.createElement("p");
    createTemp.innerHTML = today_temp + today_temp_type;
    createTemp.setAttribute("class", "today_temp");

  let createType = document.createElement("p");
    createType.innerHTML = today_type;
    createType.setAttribute("class", "today_type");

  let location = document.createElement("p");
    let postal_town = getParamGeo("postal_town")[0].long_name;
    let lan = getParamGeo("administrative_area_level_1")[0].long_name;
    location.innerHTML = postal_town + ", " + lan;
    location.setAttribute("class", "today_location");

  let createDate = document.createElement("p");
    createDate.innerHTML = days[today_date.getDay()] + ", " + today_date.getDay() +  " " + month[today_date.getMonth()] + " " + addZero(today_date.getHours()) + ":" + addZero(today_date.getMinutes());
    createDate.setAttribute("class", "today_date");

  let createTypeImg = document.createElement("div");
    createTypeImg.setAttribute("class", "today_img");
    let setImage = getImagePosition(getParam("Wsymb2")[0].values[0]);
    createTypeImg.style.backgroundPosition = setImage.lat + "px " + setImage.lng + "px";


  today.append(createTypeImg);
  today.append(createTemp);
  today.append(createType);
  today.append(location);
  today.append(createDate);


  // get SMHI info from parameters
  function getParam(input){
    return response.timeSeries[0].parameters.filter( filter => filter.name == input);
  }
  function getParamGeo(input) {
    return map.getCurrentGeoCode().address_components.filter(loc => loc.types.includes(input));
  }
  function addZero(i) { if (i < 10) { i = "0" + i; } return i; }
  function getImagePosition(input){
    if(weather_klart.includes(input)){ return {lat: 2700, lng: 1580} }
    else if(weather_molnigt.includes(input)){ return {lat: 2815, lng: 2040}; }
    else if(weather_latt_molnigt.includes(input)){ return {lat: 2700, lng: 2035}; }
    else if(weather_dimma.includes(input)){ return {lat: 2700, lng: 1700}; }
    else if(weather_regn.includes(input)){ return {lat: 2816, lng: 1920}; }
    else if(weather_blixt.includes(input)){ return {lat: 1900, lng: 1685}; }
    else if(weather_hagel.includes(input)){ return {lat: 2125, lng: 1920}; }
    else if(weather_sno.includes(input)){ return {lat: 2245, lng: 1810}; }
  }
}
