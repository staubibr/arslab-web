export default class ColorLegend {
  constructor(title, translate, scale) {

    document.getElementById("legend-svg").style.cssText =
      "width: 120px; height: 110px; background-color: rgba(255, 255, 255, 0.466)";

    const svg = d3.select("svg");

    svg.selectAll("*").remove();

    svg.append("g").attr("class", title).attr("transform", translate);

    var colorLegend = d3
      .legendColor()
      .labelFormat(d3.format(".2f"))
      // To actually color the legend based on our chosen colors
      .scale(scale.d3Scale);

    svg.select("." + title).call(colorLegend);
  }
}
