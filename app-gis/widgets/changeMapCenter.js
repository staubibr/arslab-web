export const openCageChangeMapCenter = (city, map) => { 
    var apikey = 'b339619380954a4fbe94451d66690365';
    
    
    var api_url = 'https://api.opencagedata.com/geocode/v1/json'
    
    var request_url = api_url
      + '?'
      + 'key=' + apikey
      // (latitude + ',' + longitude)
      + '&q=' + encodeURIComponent(city)
      + '&pretty=1'
      + '&no_annotations=1';
    
    // see full list of required and optional parameters:
    // https://opencagedata.com/api#forward
    
    var request = new XMLHttpRequest();
    request.open('GET', request_url, true);
    request.onload = function() {
      // see full list of possible response codes:
      // https://opencagedata.com/api#codes
    
      if (request.status == 200){ 
      // Success!
      var data = JSON.parse(request.responseText);
      let lat = data.results[0].bounds.northeast.lat;
      let long = data.results[0].bounds.northeast.lng
      map.getView().setCenter(ol.proj.transform([long, lat], 'EPSG:4326', 'EPSG:3857'))
    
      } else if (request.status <= 500){ 
      // We reached our target server, but it returned an error				 
      console.log("unable to geocode! Response code: " + request.status);
      var data = JSON.parse(request.responseText);
      console.log(data.status.message);
      } else {
      console.log("server error");
      }
    };
    
    request.onerror = function() {
      // There was a connection error of some sort
      console.log("unable to connect to server");        
    };
    
    request.send();  // make the request
}