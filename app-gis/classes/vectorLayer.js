export default class VectorLayer {
  get OL() {
    return this._layer;
  }

  /* Create the vector layer: 
		 - Read GeoJSON coordinates 
		 - Add a title 
		 - Match simulation data to census subdivisions
		 - Color in each census subdivision based on its infeced proportion value
	*/
  constructor(url, title, data, SIR, scale) {    
    // Fix later 
    this._layer = new ol.layer.Vector({
      source: new ol.source.Vector({
        // In this case, our url is a file retrieved from the user or locally
        url: url,
        format: new ol.format.GeoJSON(),
      }),
      visible: true,
      title: title,
      // Each feature in the vector layer will be colored according to it's scale
      // Ex. x = dauid[feature.N.dauid] where x might equal 0.2, 
      // and scale(x) might then return rgb(255,255,1) which is white 
      style: function (feature, resolution) {
        let x;
        // feature.N.dauid will point us to the current feature (a census subdivision)
        // data[feature.N.dauid] will allow us to access the 
        // proportion of infected people in the current feature
        if (data[feature.N.dauid] != undefined) {
          if(SIR == "Susceptible" || SIR == undefined){
            x = data[feature.N.dauid].Susceptible;
          } else if (SIR == "Infected") {
            x = data[feature.N.dauid].Infected;
          } else {
            x = data[feature.N.dauid].Recovered;
          }
        } else {
          x = 0;
        }
        return new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: "black",
            width: 1.2,
          }),
          // The feature will now have its polygon filled with a color 
          fill: new ol.style.Fill({
            color: scale.GetColor(feature, x),
          }),
        });
      },
    });
  }

  Redraw(scale, data, SIR){
    this._layer.getSource().forEachFeature(function(feature){
      const d = feature.getProperties();
        let x;
        if (data[d.dauid] != undefined) {
          if(SIR == "Susceptible" || SIR == undefined){
            x = data[feature.N.dauid].Susceptible;
          } else if (SIR == "Infected") {
            x = data[d.dauid].Infected;
          } else {
            x = data[d.dauid].Recovered;
          }
        } else {
          x = 0;
        }
        if(data[d.dauid] != undefined){
          feature.setStyle(new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: "black",
              width: 1.2,
            }),
            fill: new ol.style.Fill({
              color: scale.GetColor(feature, x),
            }),
          }))
        }
    });
  }
}
