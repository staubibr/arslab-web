'use strict';

import Core from '../../api-basic/tools/core.js';
import Evented from '../../api-basic/components/evented.js';

export default class Chart extends Evented { 

	set Margin(value) { this.margin = value; }
	get Margin() { return this.margin; }

	constructor(node) {	
		super();
	
		this.svg = d3.select(node);
	
		var rect = this.svg.node().getBoundingClientRect();
		
		this.dragging = false;
		this.yTicks = 0;
		this.margin = { top: 10, right: 10, bottom: 40, left: 55 }
		this.width = rect.width - this.margin.left - this.margin.right;
		this.height = rect.height - this.margin.top - this.margin.bottom;

		this.handlers = {};

		this.x = d3.scaleBand().range([0, this.width]);
		this.y = d3.scaleLinear().range([this.height, 0]).clamp(true);
		
		this.Build();
	}
	
	Empty() {
		this.g.main.selectAll('*').remove();
	}
	
	Build(onMouseMove, onMouseOut) {		
		this.g = {}
		
		this.g.main = this.svg.append("g")
						  .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

		// Add the Y Axis
		this.g.yAxis = this.g.main.append("g")
								  .classed("y-axis", true);
								  
		this.g.yAxisGrid = this.g.main.append("g")
								 .classed("y-axis-grid", true);
		
		// Add the trendline path, must be over xAxis
		this.g.data = this.g.main.append("g")
								 .classed("data", true);
								 
		// Add the X Axis
		this.g.xAxis = this.g.main.append("g")
								  .classed("x-axis", true)
								  .attr("transform", "translate(0," + this.height + ")");
								  
		this.g.labels = this.g.main.append("g")
								   .classed("labels", true);
		
		this.g.labels.append("text")
				   .classed("y-label", true)
				   .attr("transform", "translate(" + (16 - this.margin.left) + "," + (this.height / 2) + ")rotate(-90)");
				   
				   
		this.g.overlay = this.g.main.append("g")
								    .classed("overlay", true);
		
		// organize overlay (date bar, vertical line)
		this.position = this.g.overlay.append("rect").attr("height", this.height)
									  .classed("hi-lite", true)
									  .style("pointer-events", "none");
	
		this.vertical = this.g.overlay.append("line")
							.attr('y1', 0)
							.attr('y2', this.height)
							.classed('overlay-vertical-line', true)
							.style("fill", "none")
							.style("pointer-events", "none")
							.style("display", "none")
							
		this.g.overlay.append("rect")
			.attr("width", this.width)
			.attr("height", this.height)
			.attr("fill", "transparent")
			.on("mousemove", this.OnOverlay_MouseMove.bind(this))
			.on("mouseout", this.OnOverlay_MouseOut.bind(this));
	}
	
	GetIndexByMouse (rect) {	
		var x = d3.mouse(rect)[0];
		
		return Math.round((x / this.x.step()));
	}
	
	Clear(animate) {
		// exit contains the lines to be removed, fade them out on remove
		var lines = this.g.data.selectAll("path");
				
		if (animate) {
			lines = lines.style("opacity", 1)
					     .transition().duration(300)
					     .style("opacity", 0);
		}
		
		lines.remove();
	}

	Update(data, dates, field, date, yLabel, animate) {
		var max = d3.max(data, d => d3.max(d.values, d => d[field]));
		var pow = 10 ** Math.floor(Math.log(max)/Math.log(10));
		
		max = pow * Math.ceil(max / pow);
		
		// var yTicks = Math.ceil(Math.log(max)/Math.log(10))
		
		if (this.max != max) this.Clear(false);
	
		this.max = max;
		this.dates = dates;
		
		this.UpdateAxisX(dates, false);
		this.UpdateAxisY(max, yLabel, false);
		this.UpdateHighlight(date, animate);
		this.UpdateData(data, field, animate);
	}
	
	UpdateAxisX(dates, animate) { 
		var mod = Math.floor(dates.length / 5);
	
		var tickValues = dates.filter((d, i) => !(i % mod));

		this.x.domain(dates);
		
		var g = this.g.xAxis;
		
		if (animate) g = g.transition().duration(600);
		
		g.call(d3.axisBottom(this.x).tickValues(tickValues))
		 .selectAll("text")
		 .attr("y", 12)
		 .attr("x", -21);
	}

	UpdateAxisY(max, label, animate) { 
		this.y.domain([1, max]);
		
		var g = this.g.yAxis;
		
		if (animate) g = g.transition().duration(600);
		
		g.call(d3.axisLeft(this.y).ticks(5))
		 .selectAll("text")
		 .text((d, i, list) => {
				if (d > 999999) return (d / 1000000) + "M";
				
				if (d > 999) return (d / 1000) + "K";
				
				return d;
		});
		
		// TODO : This is weird, not sure why that second domain path is full width
		this.g.yAxisGrid.call(d3.axisLeft(this.y).ticks(5).tickSize(-this.width).tickFormat(""))
						.call(g => g.select(".domain").remove())
				
		this.g.main.select(".y-label").text(label);
	}
	
	UpdateHighlight(time, animate) {
		var g = this.position;
			
		if (animate) g = g.transition().duration(600);
		
		g.attr("transform", d => {
			var v = this.x(time);
			
			g.style("display", v < 0 ? "none" : "block");
			
			return (v < 0) ? "translate(-5,0)" :  "translate(" + (v - 5) + ",0)";
		});
	}	

	UpdateData(data, field, animate) {
		var trendline = d3.line()
						  .x(d => this.x(d.time))
						  .y(d => this.y(d[field]));
		
		var lines = this.g.data.selectAll("path").data(data, function(d) { return d.id; });
				
		// lines exit contains the lines to be removed, fade them out on remove
		var exit = lines.exit();
		
		if (animate) {
			exit = exit.style("opacity", 1)
					   .transition().duration(300)
					   .style("opacity", 0);
		}
		
		exit.remove();
		
		// lines enter contains the lines to be added
		var enter = lines.enter().append("path")
						 .attr("stroke", (d, i) => d.color);
		
		// TODO: Only on enter or merged?
		enter = enter.attr("d", d => trendline(d.values));
		
		if (animate) {
			enter.attr("stroke-dasharray", function(d){
					return (d.isNull == true) ? 0 : this.getTotalLength(); 
				})
				 .attr("stroke-dashoffset", function(d){
					 return (d.isNull == true) ? 0 : this.getTotalLength();
				})
				 .transition().duration(600)
				 .ease(d3.easeLinear)
				 .attr("stroke-dashoffset", 0);
		}
	}

	OnOverlay_MouseMove(d, i, rects) {
		var ev = this.MouseEvent(rects[0]);
		var x = this.x(ev.date.time);
		
		ev.x = d3.event.pageX;
		ev.y = d3.event.pageY;
		
		this.vertical.attr('x1', x).attr('x2', x).style('display', null);
				
		this.Emit("mousemove", ev);
	}

	OnOverlay_MouseOut(d, i, rects) {								
		this.vertical.style('display', 'none')
		
		// Emit Event		
		this.Emit("mouseout");
	}
	
	MouseEvent(rect) {
		var i = this.GetIndexByMouse(rect);
		var data = this.g.data.selectAll("path").data();
		
		var items = data.map(d => { 
			return {
				id : d.id,
				color : d.color,
				label : d.label,
				value : d.values[i]
			}
		});
		
		var date = { 
			index : i,
			time : this.dates[i]
		}
		
		return { date:date, items:items }
	}
}