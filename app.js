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

var weather = {
  "klart": [1],
  "molnigt": [6],
  "latt_molnigt": [2, 3, 4, 5],
  "dimma": [7],
  "regn": [8, 9, 10, 18, 19, 20],
  "blixt": [11, 21],
  "hagel": [12, 13, 14, 22, 23, 24],
  "sno": [15, 16, 17, 25, 26, 27]
}

// locations
var build = document.getElementById("weatherBuild");
var today = document.getElementById("today");
var future = document.getElementById("future");
var currentLocation = document.getElementById("currentLocation");
var loadLocationMessage = document.getElementById("loadingScreen");

// default position
var defaultPositionlat = 59.334591;
var defaultPositionlng = 18.063240;


// create + init map
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
    styles: mapStyle,
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
        future.innerHTML = "";
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

  this.getCurrentGeoCode = function(){ return this.currentGeoCode[0] };
  this.getCurrentLocation = function(){ return this.currentLocation };
  this.getCurrentMarker = function(){ return this.currentMarker };
}


// find users current location
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
  let lat2 = lat.toFixed(6);
  let lng2 = lng.toFixed(6);
  let url = 'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/'+lng2+'/lat/'+lat2+'/data.json';
  let promise = await fetch(url).then( async function(data){
    let response = await data.json();
    buildWeather(response);
  });
}




// Build Weather
function buildWeather(response){

  // clear innerhtml to write new content
  today.innerHTML = "";
  future.innerHTML = "";

  // All them varibales
  let today_date = new Date();
  let today_temp = getParameter("t")[0].values[0];
  let today_temp_type = getParameter("t")[0].unit;
  let today_type = weatherCodes[ getParameter("Wsymb2")[0].values[0] ];

    if(today_temp_type == "Cel"){ today_temp_type = "°"; }



  // Create Today
  let createTemp = new dateElement("p", "today_temp", today_temp + today_temp_type);
  let createType = new dateElement("p", "today_type", today_type);
  let createDate = new dateElement("p", "today_date", days[today_date.getDay()] + ", " + today_date.getDate() +  " " + month[today_date.getMonth()] + " " + addZero(today_date.getHours()) + ":" + addZero(today_date.getMinutes()) );

  // create location if location is found in google maps
  if(getGeoParameter("administrative_area_level_1").length > 0 && getGeoParameter("postal_town").length > 0){
    let postal_town = getGeoParameter("postal_town")[0].long_name;
    let lan = getGeoParameter("administrative_area_level_1")[0].long_name;
    var createLocation = new dateElement("p", "today_location", postal_town + ", " + lan);
  } else {
    var createLocation = new dateElement("p", "today_location", "Position Undefined.");
  }

  today.appendChild(createTemp);
  today.appendChild(createType);
  today.appendChild(createLocation);
  today.appendChild(createDate);



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



  // create menu
  var createRowTopContainer = new dateElement("div", "menu", "");
  var futureDays = 5; // how many days in the future should be displayed

  for (var i = 0; i < futureDays; i++) {
    let day = sortedDates[allDatesNames[i]];
    let firstOfDay = day[0];
    let firstOfDayDate = new Date(firstOfDay.validTime);

    let thisDay = {
      "coldest": getColdestTemp(day),
      "warmest": getWarmestTemp(day),
      "average": ((getColdestTemp(day) + getWarmestTemp(day)) / 2).toFixed(1),
      "mostFrequent": mostFrequent(day)
    };

    // create each date in menu
    var createRowTopDate = new dateElement("div", "dateTopDate", "");
      createRowTopDate.setAttribute("data-id", i);
      createRowTopDate.addEventListener("click", function(e){
        document.querySelectorAll(".dateDateContainer").forEach( function(t){ t.classList.add("hidden"); });
        document.querySelectorAll(".dateTopDate").forEach( function(t){ t.classList.remove("active"); });
        this.classList.add("active");
        let target = e.target.getAttribute("data-id");
        document.getElementById("dateContainerDay" + target).classList.remove("hidden");
      });

    var createRowTopDateDate = new dateElement("span", "dateTopDateNumber", days[firstOfDayDate.getDay()].substring(0, 3) );
    var createRowTopDateImg = new dateElement("div", "dateTopDateImg", "");
    createRowTopDateImg.style.backgroundPosition = getImagePosition(thisDay.mostFrequent).lat + "% " + getImagePosition(thisDay.mostFrequent).lng + "%";
    var createRowTopDateAvgTemp = new dateElement("span", "dateTopDateMonth", thisDay.average );

    // append all to container
    createRowTopDate.appendChild(createRowTopDateDate);
    createRowTopDate.appendChild(createRowTopDateImg);
    createRowTopDate.appendChild(createRowTopDateAvgTemp);
    createRowTopContainer.appendChild(createRowTopDate);
  }
  future.appendChild(createRowTopContainer);



  // create each detail pages
  for (var i = 0; i < futureDays; i++) {
    var day = sortedDates[allDatesNames[i]];
    let firstOfDay = day[0];
    let firstOfDayDate = new Date(firstOfDay.validTime);

    let createDateContainer = new dateElement("div", "dateDateContainer hidden", "");
      createDateContainer.setAttribute("id", "dateContainerDay" + i);

    // Each Item on each day
    for (var k = 0; k < day.length; k++) {
      let d = new Date(day[k].validTime);
      let todayWeathernumber = day[k].parameters.filter( filter => filter.name == "Wsymb2")[0].values[0];

      let createDateContainerImg = new dateElement("div", "dateContainerImg", "");
        createDateContainerImg.style.backgroundPosition =
        getImagePosition(todayWeathernumber).lat + "% " +
        getImagePosition(todayWeathernumber).lng + "%";
      let createDateContainerText = new dateElement("div", "dateContainerText", "");
      let createDateContainerTime = new dateElement("p", "dateContainerTextTime", addZero(d.getHours()) + ":" + addZero(d.getMinutes()));
      let createDateContainerType = new dateElement("p", "dateContainerTextType", weatherCodes[ todayWeathernumber ]);

      let createDateContainerDate = new dateElement("div", "dateDateContainerDate", "");

      createDateContainerDate.append(createDateContainerImg);
        createDateContainerText.append(createDateContainerTime);
        createDateContainerText.append(createDateContainerType);
      createDateContainerDate.append(createDateContainerText);
      createDateContainer.append(createDateContainerDate);
    }

    future.append(createDateContainer);
  }



  // Helpers

  function getColdestTemp(loc){
    let thisDay = loc.reduce( function(preValue, value){
      return preValue.parameters[1].values[0] < value.parameters[1].values[0] ? preValue : value;
    });
    return thisDay.parameters[1].values[0];
  };
  function getWarmestTemp(loc){
    let thisDay =  loc.reduce( function(preValue, value){
      return preValue.parameters[1].values[0] > value.parameters[1].values[0] ? preValue : value;
    });
    return thisDay.parameters[1].values[0];
  };
  function mostFrequent(loc){
    let array = [];
    loc.forEach( function(e) {
      array.push(e.parameters.filter( filter => filter.name == "Wsymb2")[0].values[0]);
    });

    var result = array[0];
    var tmp = 0;
    for(var i = 0; i < array.length; i++){
      var count = 0;
      for(var j = 0; j < array.length; j++){
        if(array[i]===array[j]){
          count++;
        }
      }
      if(count > tmp){
        tmp = count;
        result = array[i];
      }
    }
    return result;
  } // end mostFrequent Function

  // get parameters from
  function getParameter(input){
    return response.timeSeries[0].parameters.filter( filter => filter.name == input);
  }
  function getGeoParameter(input) {
    return map.getCurrentGeoCode().address_components.filter(loc => loc.types.includes(input));
  }

  // add a zero to the dates
  function addZero(i) { if (i < 10) { i = "0" + i; } return i; }

  // get image position to show icons
  function getImagePosition(input){
    if(weather.klart.includes(input)){ return {lat: 21.2, lng: 56} }
    else if(weather.molnigt.includes(input)){ return {lat: 12.9, lng: 7.5}; }
    else if(weather.latt_molnigt.includes(input)){ return {lat: 20.9, lng: 7.5}; }
    else if(weather.dimma.includes(input)){ return {lat: 21.2, lng: 43.8}; }
    else if(weather.regn.includes(input)){ return {lat: 12.9, lng: 20}; }
    else if(weather.blixt.includes(input)){ return {lat: 78.7, lng: 44.8}; }
    else if(weather.hagel.includes(input)){ return {lat: 62.3, lng: 20}; }
    else if(weather.sno.includes(input)){ return {lat: 54, lng: 32.8}; }
  }

  // create new elements
  function dateElement(type, className, content) {
    var el = document.createElement(type);
    el.setAttribute("class", className);
    el.innerHTML = content;
    return el;
  }

} // end weather build
