var helper = ( function(){

  function publicAddZero(i) { if (i < 10) { i = "0" + i; } return i; }

  function publicAverageTemp(loc) {
    let all = [];
    loc.forEach( function(e){ all.push(e.parameters[1].values[0]); });
    let thisDay = all.reduce((total, value) => total += value);
    return (thisDay/all.length).toFixed(1);
  }

  function publicMostFrequent(loc){
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
  }

  return{
    addZero: publicAddZero,
    averageTemp: publicAverageTemp,
    mostFrequent: publicMostFrequent
  }

})();
