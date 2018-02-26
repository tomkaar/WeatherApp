var days = {
  "0": "Söndag",
  "1": "Måndag",
  "2": "Tisdag",
  "3": "Onsdag",
  "4": "Torsdag",
  "5": "Fredag",
  "6": "Lördag"
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
      } else {
        today.innerHTML = "No results found.<br>Cannot find geolocation";
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



// getMyLocation();
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

// Load weather from SMHI Web API
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
  // console.log(map.getCurrentGeoCode());

  // clear innerhtml to write new content
  today.innerHTML = "";
  future.innerHTML = "";

  // All them varibales
  let today_date = new Date();
  let today_temp = getParam("t")[0].values[0];
  let today_temp_type = getParam("t")[0].unit;
  let today_type = weatherCodes[ getParam("Wsymb2")[0].values[0] ];

    if(today_temp_type == "Cel"){ today_temp_type = "°"; }

  let createTemp = new newElement("p", "today_temp", today_temp + today_temp_type);
  let createType = new newElement("p", "today_type", today_type);
  let createDate = new newElement("p", "today_date", days[today_date.getDay()] + ", " + today_date.getDate() +  " " + month[today_date.getMonth()] + " " + addZero(today_date.getHours()) + ":" + addZero(today_date.getMinutes()) );

  // create location if location is found in google maps
  if(getParamGeo("administrative_area_level_1").length > 0 && getParamGeo("postal_town").length > 0){
    let postal_town = getParamGeo("postal_town")[0].long_name;
    let lan = getParamGeo("administrative_area_level_1")[0].long_name;
    var createLocation = new newElement("p", "today_location", postal_town + ", " + lan);
  } else {
    var createLocation = new newElement("p", "today_location", "Position Undefined.");
  }

  // create elements
  createTemp.create(today);
  createType.create(today);
  createLocation.create(today);
  createDate.create(today);




  // Sort timeSeries into array after date + create date array to use as reference
  var timeLength = response.timeSeries.length;
  var allDatesNames = [];
  var sortedDates = [];

  for(var i = 0; i < timeLength; i++) {
    let date = response.timeSeries[i].validTime;
    let dateCut = date.substring(0, 10);

    if(dateCut in sortedDates){
      sortedDates[dateCut].push(response.timeSeries[i]);
    } else{
      allDatesNames.push(dateCut);
      sortedDates[dateCut] = new Array();
      sortedDates[dateCut].push(response.timeSeries[i]);
    }
  }

  // console.log(allDatesNames);
  // console.log(sortedDates);

  // find each day
  for (var i = 0; i < 5; i++) { // change how many days should be displayed (allDatesNames.length for all)
    // each day
    let day = sortedDates[allDatesNames[i]]

    // First of date (top row)
    let firstOfDay = day[0];
    let thisDate = new Date(firstOfDay.validTime);
    // console.log(firstOfDay);
    console.log(thisDate);

    var createRow = document.createElement("div");
      createRow.setAttribute("class", "eachDate");

    var createTopContainer = document.createElement("div");
      createTopContainer.setAttribute("class", "eachTop");

    var createRowTopDate = document.createElement("p");
      createRowTopDate.setAttribute("class", "dateTopDate");
      createRowTopDate.innerHTML = days[thisDate.getDay()] + ", " + addZero(thisDate.getDate()) + " " + month[thisDate.getMonth()];

    var createRowTopButton = document.createElement("button");
      createRowTopButton.setAttribute("class", "dateTopButton");
      createRowTopButton.addEventListener("click", function(e){
        let next = e.target.parentNode.nextSibling;
        next.classList.toggle("open");
      });

    // Each Item container
    var createContainer = document.createElement("div");
      createContainer.setAttribute("class", "eachContainer open");

      // Each Item under each day
      for (var k = 0; k < day.length; k++) {
        console.log(day[k]);

        // create icon
        var eachDateItemIcon = document.createElement("div");
          eachDateItemIcon.setAttribute("class", "dateIcon");
        // create min temp
        // create max temp
        // create vindstyrka

        var eachDateItemTime = document.createElement("h4");
          eachDateItemTime.setAttribute("class", "dateTime");
          eachDateItemTime.innerHTML = "Kl. " + day[k].validTime.substring(11, 16);

        var eachDateItem = document.createElement("div");
          eachDateItem.setAttribute("class", "dateItem");

        // Append
        eachDateItem.appendChild(eachDateItemIcon);
        eachDateItem.appendChild(eachDateItemTime);
        createContainer.appendChild(eachDateItem);
      }

    // Append all items
    createTopContainer.appendChild(createRowTopButton);
    createTopContainer.appendChild(createRowTopDate);
    createRow.appendChild(createTopContainer);
    createRow.appendChild(createContainer);
    future.appendChild(createRow);



  }







  // get SMHI weather info from parameters
  function getParam(input){
    return response.timeSeries[0].parameters.filter( filter => filter.name == input);
  }
  function getParamGeo(input) {
    return map.getCurrentGeoCode().address_components.filter(loc => loc.types.includes(input));
  }
  // add zeros to date while printing
  function addZero(i) { if (i < 10) { i = "0" + i; } return i; }
  // get position for images from sprite
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
  // create a new element function
  function newElement(type, className, content){
    this.type = type;
    this.className = className;
    this.content = content;

    var element = document.createElement(type);
    element.setAttribute("class", this.className);
    element.innerHTML = this.content;

    this.create = function(location){
      location.appendChild(element);
    }
  }
}
