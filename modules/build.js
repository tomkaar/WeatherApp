var build = ( function(){

  function publicRightNow(map, data) {
    let temp = document.getElementById("today_temp");
    let type = document.getElementById("today_type");
    let location = document.getElementById("today_location");
    let date = document.getElementById("today_date");

    let today_number = weather.getPara(data, "Wsymb2");
    let loc = map.getGeoCode();
    let d = new Date();

    function getGeoParameter(input) {
      return loc.address_components.filter(loc => loc.types.includes(input));
    }

    temp.innerHTML = weather.getPara(data, "t") + "°";
    type.innerHTML = text.getWeatherName(today_number);
    date.innerHTML =
      text.getDay(d.getDay()) + " " +
      d.getDate() + " " +
      text.getMonth(d.getMonth()) + " " +
      helper.addZero(d.getHours()) + ":" +
      helper.addZero(d.getMinutes());

    if(getGeoParameter("administrative_area_level_1").length > 0 &&
       getGeoParameter("postal_town").length > 0){
      let postal_town = getGeoParameter("postal_town")[0].long_name;
      let lan = getGeoParameter("administrative_area_level_1")[0].long_name;
      location.innerHTML = postal_town + ", " + lan;
    } else {
      location.innerHTML = "Position Undefined";
    }

  }

  function publicDayMenu(data) {

    let averageTemp = helper.averageTemp(data);
    let mostFrequent = helper.mostFrequent(data);

    return{
      "averageTemp": averageTemp,
      "mostFrequent": mostFrequent,
      "weatherImg": text.getWeatherImg(mostFrequent)
    }

  }

  function publicDayDetails(data){

    let temp = data.parameters.filter( filter => filter.name == "t")[0].values[0];
    let type = data.parameters.filter( filter => filter.name == "Wsymb2")[0].values[0];
    let time = new Date(data.validTime);

    return {
      "temp": temp,
      "name": text.getWeatherName(type),
      "img": text.getWeatherImg(type),
      "time": helper.addZero(time.getHours()) + ":00"
    }

  }

  function publicCreateElement(element, thisClass, content){
    let el = document.createElement(element);
    el.classList.add(thisClass);
    el.innerHTML = content;
    return el;
  }

  function publicClear() {
    let menu = document.getElementById("menu");
    let details = document.getElementById("details");

    menu.innerHTML = "";
    details.innerHTML = "";
  }

  return {
    rightNow: publicRightNow,
    dayMenu: publicDayMenu,
    dayDetails: publicDayDetails,
    createElement: publicCreateElement,
    clear: publicClear
  }
})();
