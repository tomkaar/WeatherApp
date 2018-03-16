var app = ( function(){

  var map = new Map("map", 10, true);

  async function publicStart(){
    loadingScreen.show();
    var myLocation = await loc.getMyLocation();
    if(myLocation.status == true){
      map.update(myLocation.lat, myLocation.lng, true);
    }
    else if (myLocation.status == false) {
      error.show( myLocation.message );
      map.update(defaults.getLat(), defaults.getLng(), true);
    }
  }

  // from inside map function
  async function publicBuild(lat, lng){
    let data = await weather.fetch(lat, lng, false);
    let sorted = weather.sortDays(data);

    let menu = document.getElementById("menu");
    let details = document.getElementById("details");

    build.clear();

    // today + get all info
    let today = sorted.dates[sorted.names[0]][0];
    build.rightNow(map, today);


    // each day
    for (var i = 0; i < defaults.days(); i++) {
      let thisDay = sorted.dates[sorted.names[i]];

      // get date names
      var todayName;
      if(i == 0){
        todayName = "Idag";
      } else {
        var currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + i);
        let thisDate = currentDate.getDay();
        todayName = text.getDay(thisDate).substring(0,3);
      }

      // create menu
      let day_info = build.dayMenu(thisDay);

      // create detail view container
      let detailContainer = document.createElement("div");
      detailContainer.classList.add("detailContainer");

      let newEle = build.createElement("div", "menu-item", "");
      newEle.addEventListener('click', function(m){
        let allMenuItems = document.querySelectorAll(".menu-item");
        allMenuItems.forEach( function(e){ e.classList.remove("active"); });
        m.target.classList.add("active");

        let allContainers = document.querySelectorAll(".detailContainer");
        allContainers.forEach( function(e){ e.classList.remove("visible"); });
        detailContainer.classList.add("visible");
      });

      let newEleTemp = build.createElement("p", "menu-temp", day_info.averageTemp + "°");
      let newEleImg = build.createElement("div", "menu-img", "");
      newEleImg.classList.add(day_info.weatherImg);
      newEleImg.classList.add("menu-img");
      let newEleDay = build.createElement("p", "menu-day", todayName);

      newEle.append(newEleDay);
      newEle.append(newEleImg);
      newEle.append(newEleTemp);
      menu.append(newEle);

      // create Detail view
      for (var j = 0; j < thisDay.length; j++) {

        let dayData = build.dayDetails(thisDay[j]);

        let detailWrapper = document.createElement("div");
        detailWrapper.classList.add("details-item");

        let newDetTextContainer = document.createElement("div");
        newDetTextContainer.classList.add("details-textContainer");

          let newDetTime = document.createElement("div");
          newDetTime.classList.add("details-time");
          newDetTime.innerHTML = dayData.time;

          let newDetName = document.createElement("p");
          newDetName.classList.add("details-name");
          newDetName.innerHTML = dayData.name;

        let newDetImg = document.createElement("div");
        newDetImg.classList.add("details-img");
        newDetImg.classList.add(dayData.img);

        let newDetTemp = document.createElement("p");
        newDetTemp.classList.add("details-temp");
        newDetTemp.innerHTML = dayData.temp;

        newDetTextContainer.append(newDetTime);
        newDetTextContainer.append(newDetName);
        detailWrapper.append(newDetTextContainer);
        detailWrapper.append(newDetImg);
        detailWrapper.append(newDetTemp);
        detailContainer.append(detailWrapper);
        details.append(detailContainer);
      } // end of detail view
    } // end of each day

    // after everything is loaded, hide the loading screen
    loadingScreen.hide();
  } // end of build function

  return{
    start: publicStart,
    build: publicBuild
  }
})();

app.start();
