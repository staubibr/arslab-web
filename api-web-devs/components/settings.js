'use strict';

import Evented from '../../api-basic/components/evented.js';

export default class Settings extends Evented { 

	constructor() {
		super();
				
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
				aspect : true,
				layers : null
			},
			playback : {
				speed : 10,
				loop : false,
				cache : 10
			}
		}
	}
	
	GridSize(simulation, nGrids) {
		nGrids = nGrids || simulation.Dimensions.z;
		
		var aspect = this.Get("grid", "aspect");
		var space = this.Get("grid", "spacing");
		var cols = this.Get("grid", "columns");
		var rows = Math.ceil(nGrids / cols);
		var width = this.Get("grid", "width");
		var height = this.Get("grid", "height");
		
		if (aspect) height = width / simulation.Ratio;
		
		width = (cols * width + space * cols - space);
		height = (rows * height + rows * space - space);
		
		return { width : width, height : height }
	}
		
	DiagramSize(simulation) {		
		var aspect = this.Get("diagram", "aspect");
		var width = this.Get("diagram", "width");
		var height = this.Get("diagram", "height");
		
		if (aspect) height = width / simulation.Ratio;
		
		return { width : width, height : height }
	}
		
	Get(group, property) {
		return this.json[group][property];
	}
	
	Set(group, property, value) {
		var change = this.Silent(group, property, value);
		
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