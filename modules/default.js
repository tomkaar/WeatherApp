var defaults = ( function(){
  var positionlat = 59.334591;
  var positionlng = 18.063240;
  var days = 5;

  function publicDefaultPositionlat() { return positionlat; }
  function publicDefaultPositionlng() { return positionlng; }
  function publicDefaultDays() { return days; }

  return{
    getLat: publicDefaultPositionlat,
    getLng: publicDefaultPositionlng,
    days: publicDefaultDays
  }
  
})();
