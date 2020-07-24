export default class VectorLayer {
  get OL() {
    return this._layer;
  }

  constructor(url, title, data, scale) {
    this._layer = new ol.layer.Vector({
      source: new ol.source.Vector({
        url: url,
        format: new ol.format.GeoJSON(),
      }),
      visible: true,
      title: title,
      style: function (feature, resolution) {
        let x;
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
          fill: new ol.style.Fill({
            color: scale(x),
          }),
        });
      },
    });
  }
}
