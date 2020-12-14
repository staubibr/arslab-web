export default class VectorLayer {
  get OL() {
    return this._layer;
  }

  // Read GeoJSON coordinates
  // Add a title
  constructor(url, title) {
    this._layer = new ol.layer.Vector({
      source: new ol.source.Vector({
        // In this case, our url is a file retrieved from the user
        url: url,
        format: new ol.format.GeoJSON(),
      }),
      visible: true,
      title: title,
      style: null,
    });
  }

  // Match simulation data to census subdivisions
  // Color in each census subdivision based on its infeced proportion value
  // Polygons with no data will not be drawn
  ColorLayer(scale, data, SIR) {
    this._layer.getSource().forEachFeature(function (feature) {
      const d = feature.getProperties();
      let x;
      if (data[d.dauid] != undefined) {
        if (SIR == "Susceptible" || SIR == undefined) {
          x = data[d.dauid].Susceptible;
        } else if (SIR == "Infected") {
          x = data[d.dauid].Infected;
        } else {
          x = data[d.dauid].Recovered;
        }
      } else {
        x = 0;
      }
      if (data[d.dauid] != undefined) {
        feature.setStyle(
          new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: "black",
              width: 1.2,
            }),
            fill: new ol.style.Fill({
              color: scale.GetColor(d, x),
            }),
          })
        );
      }
    });
  }
}
