import  GetScale  from "./getScale.js";
export default class VectorLayer {
  get OL() {
    return this._layer;
  }

  constructor(url, title, data, dataCycle) {
    let scale = new GetScale();
    let s = scale.GS;
    this._layer = new ol.layer.Vector({
      source: new ol.source.Vector({
        url: url,
        format: new ol.format.GeoJSON(),
      }),
      visible: true,
      title: title,
      style: function (feature, resolution) {
        let x;
        if (data[parseFloat(feature.N.dauid)] != undefined) {
          x = data[parseFloat(feature.N.dauid)][dataCycle];
        } else {
          x = 0;
        }
        return new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: "black",
            width: 1.2,
          }),
          fill: new ol.style.Fill({
            color: s(x),
          }),
        });
      },
    });
  }

  GetLegend(title, translate) {
    let scale = new GetScale();
    const svg = d3.select("svg");
    svg.append("g").attr("class", title).attr("transform", translate);
    svg
      .append("text")
      .text("Proportion of the DAUID Population with Infection")
      .attr("transform", "translate(20,25)");

    var colorLegend = d3
      .legendColor()
      .labelFormat(d3.format(".2f"))
      .scale(scale.GS);

    svg.select("." + title).call(colorLegend);
  }
}
