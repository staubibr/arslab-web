export default class ColorLegend { 
    constructor(title, translate, scale){
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