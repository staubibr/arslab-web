'use strict';

import Evented from '../components/evented.js';
import Styler from './styler.js';

export default class Settings extends Evented { 

	set json(value) {
		this._json = value;

		this.styler = Styler.FromJson(value.grid.styles);
	}
	
	get json() { return this._json; }

	set layers (values) { this.json.grid.layers = value; }
	
	get layers () { return this.json.grid.layers; }

	constructor() {
		super();
		
		this._json = Settings.Default(0);
	}
		
	CanvasSize(simulation, nGrids) {
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
	
	ToString() {
		return JSON.stringify(this.json);
	}
	
	ToFile() {
		var content = this.ToString();
		
		return new File([content], "options.json", { type:"application/json", endings:'native' });
	}
	
	static FromJson(json) {
		var settings = new Settings();
		
		settings.json = json;
		
		return settings;
	}
	
	static Default(layers, ports) {
		layers = layers || 0;
		
		var options =  {
			diagram : {
				width : 600,
				height : 400,
				aspect : true
			},
			grid : {
				columns : 1,
				width : 350,
				height : 350,
				spacing : 10,
				showGrid : false,
				aspect : true,
				layers : [],
				styles : []
			},
			playback : {
				speed : 10,
				loop : false,
				cache : 10
			}
		}		
		
		if (!layers) return options;
		
		options.grid.layers = Settings.DefaultLayers(layers, ports);
		
		options.grid.columns = Settings.DefaultColumns(options.grid.layers);
				
		return options;
	}
	
	static DefaultLayers(maxZ, ports) {
		var layers = [];
		
		for (var i = 0; i < maxZ; i++) {
			ports.forEach((p, j) => {
				var k = (i * ports.length) + j;
				
				layers.push({
					z : i,
					ports : [p.name],
					style : (p.style != undefined) ? p.style : k
				})
			});
		}
		
		return layers;
	}
	
	static DefaultColumns(layers) {		
		return (layers.length > 3) ? 3 : layers.length;	
	}
}
