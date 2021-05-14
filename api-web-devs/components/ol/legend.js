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
	
	BuildFill(style) {
		var prev = null;
		
		return style.buckets.map((b, i) => {
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
	}
	
	BuildRadius(style){
		var prev = null;
		
		return style.buckets.map((b, i) => {
			var curr = b.toFixed(4).toString();
			var title = (prev) ? `${prev} - ${curr}` : `0 - ${curr}`;

			prev = curr;
			
			return {
				title: title, 
				size: style.radii[i], 
				style: Style.PointStyle({
					radius: style.radii[i], 
					stroke: { color: "#000", width: 1 } ,
					fill: { color: "#fff" }
				})
			}
		});
	}
	
	BuildScale(style, src){
		var prev = null;
		
		return style.buckets.map((b, i) => {
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
	}
	
	Template() {
		return "<div handle='legend-container' class='ol-control ol-legend-container'></div>";
	}
}