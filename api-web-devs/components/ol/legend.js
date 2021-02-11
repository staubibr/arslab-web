'use strict';

import Style from "../../tools/style.js";
import Evented from '../evented.js';

export default class Legend extends Evented { 
	
	get OL() {
		return this._ol;
	}
  
	constructor(style) {		
		super();
		
		this._element = null;
		this._ol = [];
		
		if (style.fill) {
			var rows = this.BuildFill(style.fill);
			
			this.AddLegend(`${style.fill.property}`, rows);
		}
		
		if (style.radius) {
			var rows = this.BuildRadius(style.radius);
		
			this.AddLegend(`${style.radius.property}`, rows);
		}
	}
	
	GetLegendRow(legendIndex, rowIndex) {
		var ul = this.OL[legendIndex].element.querySelector("ul");
		
		// First element is title, we don't care about it
		return ul.children[rowIndex + 1];
	}
	
	AddLegend(title, rows) {
		var sizes = rows.map(r => r.size);
		var size = Math.max(...sizes) * 2;
				
		var legend = new ol.control.Legend({ title:title, margin:5, size:[size, size], collapsed:false, target:this._element });
		
		if (!this._element) this._element = legend.element;
		
		rows.forEach(r => {
			legend.addRow({ title:r.title, typeGeom:"Point", style: r.style });
		});
		
		this.OL.push(legend);
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
}