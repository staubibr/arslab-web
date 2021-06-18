'use strict';

import Style from "../../tools/style.js";
import Templated from '../templated.js';
import Dom from '../../tools/dom.js';

export default class Legend extends Templated { 
	
	get control() { return this._control; }
  
	constructor(style) {		
		super();
		
		this._control = new ol.control.Control({ element: this.Elem("legend-container") });
	}
	
	AddLegend(variable) {
		if (variable.style.fill) {
			var rows = this.BuildFill(variable.style.fill);
			
			this.AddLegendRows(variable.layer, `${variable.style.fill.property}`, rows);
		}
		
		if (variable.style.radius) {
			var rows = this.BuildRadius(variable.style.radius);
		
			this.AddLegendRows(variable.layer, `${variable.style.radius.property}`, rows);
		}
		/*
		if (variable.style.src) {
			var rows = this.BuildScale(variable.style.scale, variable.style.src);
		
			this.AddLegendRows(variable.layer, `${variable.style.scale.property}`, rows);
		}
		*/
	}
	
	AddLegendRows(layer, property, rows) {
		var sizes = rows.map(r => r.size);
		var size = Math.max(...sizes) * 2;
		
		var legend = new ol.control.Legend({ title:`${layer.label} - ${property}`, margin:5, size:[size, size], collapsed:false, target:this.control.element });
		
		rows.forEach(r => {
			legend.addRow({ title:r.title, typeGeom:"Point", style:r.style });
		});
		
		Dom.Place(legend.element, this.control.element);
	}
	
	AddZero(rows, buckets, color) {
		for (var i = 0; buckets.length; i++) {
			if (buckets[i] > 0) break;
		}
		
		rows.splice(i, 0, {
			title: "0", 
			size: 8, 
			style: Style.PointStyle({
				radius: 8, 
				stroke: { color: "#000", width: 1 },
				fill: { color: color }
			})
		});
	}
	
	// TODO: This should be in the style classes directly
	BuildFill(style) {
		var prev = null;
		
		var rows = style.buckets.map((b, i) => {
			var curr = b.toFixed(4).toString();
			var title = (prev) ? `${prev} - ${curr}` : `0 - ${curr}`;
			
			prev = curr;

			return {
				title: title, 
				size: 8, 
				style: Style.PointStyle({
					radius: 8, 
					stroke: { color: "#000", width: 1 },
					fill: { color: style.colors[i] }
				})
			}
		});
		
		if (style.zero) this.AddZero(rows, style.buckets, style.zero);
		
		return rows;
	}
	
	BuildRadius(style){
		var prev = null;
		
		var rows = style.buckets.map((b, i) => {			
			var curr = b.toFixed(4).toString();
			var title = (prev) ? `${prev} - ${curr}` : `0 - ${curr}`;

			prev = curr;
			
			return {
				title: title, 
				size: style.radius[i], 
				style: Style.PointStyle({
					radius: style.radius[i], 
					stroke: { color: "#000", width: 1 } ,
					fill: { color: "#fff" }
				})
			}
		});
		
		if (style.zero) this.AddZero(rows, style.buckets, style.zero);
		
		return rows;
	}
	
	BuildScale(style, src){
		var prev = null;
		
		var rows = style.buckets.map((b, i) => {
			var curr = b.toFixed(4).toString();
			var title = (prev) ? `${prev} - ${curr}` : `0 - ${curr}`;

			prev = curr;
			
			return {
				title: title, 
				size: style.scale[i], 
				style: Style.PointIconStyle({
					scale: style.scale[i], 
					src: src
				})
			}
		});
		
		if (style.zero) this.AddZero(rows, style.buckets, style.zero);
		
		return rows;
	}
	
	Template() {
		return "<div handle='legend-container' class='ol-control ol-legend-container'></div>";
	}
}