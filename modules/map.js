class Map {
  constructor(id, zoom) {
    // set basics
    this.currentLocation = {
      "lat": defaults.getLat(),
      "lng": defaults.getLng()
    }
    this.currentGeoCode = ["bajs"];
    this.currentMarker = [];

    // set map basics
    var mapContainer = document.getElementById(id);
    var mapProperties = {
      center: {lat: defaults.getLat(), lng: defaults.getLng()},
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

    // init map
    this.map = new google.maps.Map(mapContainer, mapProperties);
    this.geocoder = new google.maps.Geocoder;

    // add eventlistener to map so we can
    // run update function when clicking on the map
    this.map.addListener('click', (e) => {
      this.update(e.latLng.lat(), e.latLng.lng(), false);
    });
  }

  // basic get functions
  getLocation(){ return this.currentLocation; }
  // getGeoCode(){ return this.currentGeoCode; }
  getGeoCode(){ return JSON.parse(localStorage.getItem("GeoCode")); }
  getMarker(){ return this.currentMarker; }

  // update functions
    // main function that updates everything
    async update(lat, lng, moveTo = false){
      this.updateProperties(lat, lng);
      if(moveTo){ this.mapCenter(lat, lng); }
    }
    // update all properties
    updateProperties(lat, lng){
      this.updateLocation(lat, lng);
      this.updateGeoCode(lat, lng);
      this.updateMarker(lat, lng);
    }
      // update this.Location
      updateLocation(lat, lng){
        this.currentLocation = {"lat": lat, "lng": lng}
      }

      // update this.GeoCode
      updateGeoCode(lat, lng){
        this.geocoder.geocode({ 'location': {lat: lat, lng: lng} }, function(results, status){
          if( status == google.maps.GeocoderStatus.OK ) {
            localStorage.setItem("GeoCode", JSON.stringify(results[0]));
          } else {
            localStorage,setItem("GeoCode", "Unable to find location.");
          }
          // when everything is updated, build app
          app.build(lat, lng);
        });
      }

      // update this.marker
      updateMarker(lat, lng){
        // clear marker if marker exist
        if(this.currentMarker != ""){ this.currentMarker[0].setMap(null); }
        // create new marker
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(parseFloat(lat), parseFloat(lng)),
          map: this.map
        });
        // add marker to map and to currentMarker
        marker.setMap(this.map);
        this.currentMarker[0] = marker;
      }

    // mapCenter - center view on map
    mapCenter(lat, lng){
      this.map.setCenter({lat: lat, lng: lng});
    }
}
