'use strict';

import Evented from '../../basic-tools/components/evented.js';

export default class Settings extends Evented { 

	constructor() {
		super();
		
		this.ratio = {
			diagram : 1,
			grid : 1
		};
		
		this.json = {
			diagram : {
				width : 600,
				height : 400,
				aspect : true
			},
			grid : {
				columns : 1,
				width : 400,
				height : 400,
				spacing : 10,
				showGrid : false,
				aspect : true
			},
			playback : {
				speed : 10,
				loop : false,
				cache : 10
			}
		}
	}
	
	SetRatio(widget, ratio) {
		this.ratio[widget] = ratio;
		
		if (this.Get(widget, "aspect")) {
			var height = this.Get(widget, "width") / ratio;
			
			this.Silent(widget, "height", height);
		}
	}
		
	DiagramSize() {
		var width = this.Get("diagram", "width");
		var height = this.Get("diagram", "height");
		
		return { width : width, height : height }
	}
	
	GridSize(nGrids) {
		var space = this.Get("grid", "spacing");
		var cols = this.Get("grid", "columns");
		var rows = Math.ceil(nGrids / cols);
		var width = this.Get("grid", "width");
		var height = this.Get("grid", "height");
		
		width = (cols * width + space * cols - space);
		height = (rows * height + rows * space - space);
		
		return { width : width, height : height }
	}
	
	Get(group, property) {
		return this.json[group][property];
	}
	
	Set(group, property, value) {
		var change = this.Silent(group, property, value);
		
		if (property == 'height' && this.Get(group, "aspect")) {
			this.Silent(group, 'width', value * this.ratio[group]);
		}
		
		if (property == 'width' && this.Get(group, "aspect")) {
			this.Silent(group, 'height', value / this.ratio[group]);
		}
		
		this.Emit("Change", change);
	}
	
	Silent(group, property, value) {
		this.json[group][property] = value;
		
		return { group:group, property:property, value:value }
	}
	
	static FromJson(json) {
		var settings = new Settings();
		
		settings.json = json;
		
		return settings;
	}
}