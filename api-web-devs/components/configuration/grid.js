'use strict';

import Evented from '../evented.js';

export default class Grid extends Evented { 

	get json() { return this._json; }
	
	set json(value) { this._json = value; }
	
	get columns() { return this._json.columns; }
	
	get width() { return this._json.width; }
	
	get height() { return this._json.height; }
	
	get spacing() { return this._json.spacing; }
	
	get showGrid() { return this._json.showGrid; }
	
	get aspect() { return this._json.aspect; }
	
	get layers() { return this._json.layers; }
	
	get styles() { return this._json.styles; }
	
	set columns(value) { this._json.columns = value; }
	
	set width(value) { this._json.width = value; }
	
	set height(value) { this._json.height = value; }
	
	set spacing(value) { this._json.spacing = value; }
	
	set showGrid(value) { this._json.showGrid = value; }
	
	set aspect(value) { this._json.aspect = value; }
	
	set layers(value) { this._json.layers = value; }
		
	set styles(value) { this._json.styles = value; }
	
	constructor() {
		super();
		
		this.json = Grid.Default();
	}	
	
	Set(property, value) {
		this[property] = value;
				
		this.Emit("Change", { property:property, value:value });
	}
	
	CanvasSize(simulation, nGrids) {
		nGrids = nGrids || simulation.Dimensions.z;
		
		var aspect = this.aspect;
		var space = this.spacing;
		var cols = this.columns;
		var rows = Math.ceil(nGrids / cols);
		var width = this.width;
		var height = this.height;
		
		if (aspect) height = width / simulation.Ratio;
		
		width = (cols * width + space * cols - space);
		height = (rows * height + rows * space - space);
		
		return { width : width, height : height }
	}
	
	ToJson() {
		return this.json;
	}
	
	static FromSimulation(simulation) {
		var json = Grid.Default();
		
		json.layers = Grid.DefaultLayers(simulation.MaxZ, simulation.Ports);
		json.columns = Grid.DefaultColumns(json.layers);

		return Grid.FromJson(json);
	}
	
	static FromJson(json) {
		var grid = new Grid();
		
		if (json.columns != undefined) grid.json.columns = json.columns;
		if (json.width != undefined) grid.json.width = json.width;
		if (json.height != undefined) grid.json.height = json.height;
		if (json.spacing != undefined) grid.json.spacing = json.spacing;
		if (json.aspect != undefined) grid.json.aspect = json.aspect;
		if (json.showGrid != undefined) grid.json.showGrid = json.showGrid;
		if (json.layers != undefined) grid.json.layers = json.layers;
		if (json.styles != undefined) grid.json.styles = json.styles;
		
		return grid;
	}
	
	static Default() {
		return {
			columns : 1,
			width : 350,
			height : 350,
			spacing : 10,
			showGrid : false,
			aspect : true,
			layers : [],
			styles : []
		}
	}
	
	static DefaultLayers(maxZ, ports) {
		var layers = [];
		
		for (var i = 0; i < maxZ; i++) {
			ports.forEach(p => {				
				layers.push({ z:i, ports:[p], style:0, position:layers.length });
			});
		}
		
		return layers;
	}
	
	static DefaultColumns(layers) {		
		return (layers.length > 3) ? 3 : layers.length;	
	}
}
