var text = ( function(){

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

  function publicGetDay(number){ return days[number]; }
  function publicGetMonth(number) { return month[number]; }
  function publicGetWeatherName(number) { return weatherCodes[number]; }

  function publicGetWeatherType(text) { return weather[text]; }
  function publicGetWeatherImg(number) {
    if(weather.klart.includes(number)){ return 'Sun'; }
    else if(weather.molnigt.includes(number)){ return 'Cloud'; }
    else if(weather.latt_molnigt.includes(number)){ return 'CloudLight'; }
    else if(weather.dimma.includes(number)){ return 'Fog'; }
    else if(weather.regn.includes(number)){ return 'Rain'; }
    else if(weather.blixt.includes(number)){ return 'Lightning'; }
    else if(weather.hagel.includes(number)){ return 'Hail'; }
    else if(weather.sno.includes(number)){ return 'Snow'; }
    else { return 'Sun'; }
  }

  return {
    getDay: publicGetDay,
    getMonth: publicGetMonth,
    getWeatherName: publicGetWeatherName,
    getWeatherType: publicGetWeatherType,
    getWeatherImg: publicGetWeatherImg
  }

})();
