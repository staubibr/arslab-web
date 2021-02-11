'use strict';

import Evented from '../evented.js';
import Diagram from './diagram.js';
import Grid from './grid.js';
import GIS from './gis.js';
import Playback from './playback.js';

export default class Configuration extends Evented { 

	get diagram() { return this._diagram; }

	set diagram(value) { this._diagram = value; }

	get grid() { return this._grid; }

	set grid(value) { this._grid = value; }

	get gis() { return this._gis; }

	set gis(value) { this._gis = value; }

	get playback() { return this._playback; }

	set playback(value) { this._playback = value; }

	constructor() {
		super();
		
		this._diagram = null;
		this._grid = null;
		this._gis = null;
		this._playback = null;
	}
		
	static FromSimulation(simulation) {
		var configuration = new Configuration();
		
		configuration.playback = new Playback();
		
		if (simulation.Type == "Cell-DEVS") configuration.grid = Grid.FromSimulation(simulation);
		
		if (simulation.Type == "DEVS") configuration.diagram = new Diagram();
		
		if (simulation.Type == "Irregular Cell-DEVS") configuration.diagram = new GIS();
		
		return configuration;
	}
	
	static FromJson(json) {
		var configuration = new Configuration();
		
		configuration.playback = new Playback();
		
		if (json.playback) configuration.playback = Playback.FromJson(json.playback);
		if (json.diagram) configuration.diagram = Diagram.FromJson(json.diagram);
		if (json.grid) configuration.grid = Grid.FromJson(json.grid);
		if (json.gis) configuration.gis = GIS.FromJson(json.gis);
		
		return configuration;
	}
	
	ToJson() {
		var json = {};
		
		if (this.playback) json.playback = this.playback.ToJson();
		if (this.diagram) json.diagram = this.diagram.ToJson();
		if (this.grid) json.grid = this.grid.ToJson();
		if (this.gis) json.gis = this.gis.ToJson();
		
		return json;
	}
	
	ToString() {
		var json = this.ToJson();
		
		return JSON.stringify(json);
	}
	
	ToFile() {
		var content = this.ToString();
		
		return new File([content], "visualization.json", { type:"application/json", endings:'native' });
	}
}
