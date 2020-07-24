export default class VectorLayer {
  get OL() {
    return this._layer;
  }

  /* Create the vector layer: 
		 - Read Ontario's coordinates 
		 - Add a title 
		 - Match simulation data to Ontarios census subdivisions
		 - Color in each census subdivision based on its infeced proportion value
	*/
  constructor(url, title, data, scale) {
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
          x = data[feature.N.dauid];
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
            color: scale(x),
          }),
        });
      },
    });
  }
}
