var weather = ( function(){

  async function fetchData(url){
    let promise = await fetch(url);
		let data = await promise.json();
		return data;
  }

  async function publicFetch(lat, lng){
    let lat2 = lat.toFixed(6);
    let lng2 = lng.toFixed(6);
    let url = 'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/' + lng2 + '/lat/' + lat2 + '/data.json';

    let data = await fetchData(url);
    return data;
  }

  function publicSortDays(data){
    var timeLength = data.timeSeries.length;
    var names = [];
    var dates = [];

    for(var i = 0; i < timeLength; i++) {
      let date = data.timeSeries[i].validTime;
      let dateCut = date.substring(0, 10);

      if(dateCut in dates){
        dates[dateCut].push(data.timeSeries[i]);
      } else{
        names.push(dateCut);
        dates[dateCut] = new Array();
        dates[dateCut].push(data.timeSeries[i]);
      }
    }
    return {
      "names": names,
      "dates": dates
    };
  }

  function publicGetPara(data, input){
    return data.parameters.filter(filter => filter.name == input)[0].values[0];
  }

  return {
    fetch : publicFetch,
    sortDays: publicSortDays,
    getPara: publicGetPara
  }

})();
