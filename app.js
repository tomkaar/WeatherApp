var app = ( function(){

  var map = new Map("map", 10, true);

  async function publicStart(){
    var myLocation = await loc.getMyLocation();
    if(myLocation.status == true){
      map.update(myLocation.lat, myLocation.lng, true);
    }
    else if (myLocation.status == false) {
      console.log(myLocation.message);
      map.update(defaults.getLat(), defaults.getLng(), true);
    }
  }

  // from inside map function
  async function publicBuild(lat, lng){
    let data = await weather.fetch(lat, lng, false);
    let sorted = weather.sortDays(data);

    build.clear();

    let today = sorted.dates[sorted.names[0]][0];
    build.rightNow(map, today);

    // each day
    for (var i = 0; i < defaults.days(); i++) {
      let thisDay = sorted.dates[sorted.names[i]];
      let day_info = build.dayMenu(thisDay);
      console.log(day_info);
    }
  }

  return{
    start: publicStart,
    build: publicBuild
  }
})();

// app.start();
