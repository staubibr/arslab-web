export default class ColorLegend {

  hideOrShowLegend(title, translate, scale, display, SIR) {
    if (display == false) {
      this.hideLegend();
    } else {
      this.showLegend(title, translate, scale, SIR);
    }
  }

  showLegend(title, translate, scale, SIR) {
    // Legend title 
    document.getElementById("legend-svg").firstChild.textContent = SIR;

    // Update the css
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

  hideLegend() {
    // Legend title
    document.getElementById("legend-svg").firstChild.textContent = "Legend";

    const svg = d3.select("svg");

    svg.selectAll("*").remove();

    // Update the css
    document.getElementById("legend-svg").style.cssText =
      "padding:5px; background-color:rgba(0,60,136,.5); font-size:12px; color: white";
    document.getElementById("legend-svg").style.width = "40px";
    document.getElementById("legend-svg").style.height = "15px";
  }

}
