var loc = ( function(){

  async function publicGetMyLocation() {
    return new Promise(resolve => {
      if(navigator.geolocation){
        return navigator.geolocation.getCurrentPosition( async function(position){
          let x = {
            "status": true,
            "lat": position.coords.latitude,
            "lng": position.coords.longitude
          };
          resolve(x);
        }, function(error){
          let x = showError(error);
          resolve(x);
        });

      } else {
        let x = {"status": false}
        resolve(x);
      }
    });
  }

  function showError(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        return {
          "status": false,
          "message": "User denied the request for Geolocation. Position set to Stockholm."
        };
        break;
      case error.POSITION_UNAVAILABLE:
        return {
          "status": false,
          "message": "Location information is unavailable. Position set to Stockholm."
        };
        break;
      case error.TIMEOUT:
        return {
          "status": false,
          "message": "The request to get user location timed out. Position set to Stockholm."
        };
        break;
      case error.UNKNOWN_ERROR:
        return {
          "status": false,
          "message": "An unknown error occurred. Position set to Stockholm."
        };
        break;
    }
  } // end of showError function

  return {
    getMyLocation: publicGetMyLocation
  }

})();
