'use strict';

import Evented from '../evented.js';

export default class GIS extends Evented { 

	get json() { return this._json; }
	
	set json(value) { 
		this._json = value; 
		
		if (this.variables) this.variables.forEach((s, i) => s.index = i); 
	}
	
	get basemap() { return this._json.basemap; }
	
	get layers() { return this._json.layers; }
	
	get variables() { return this._json.variables; }
	
	get view() { return this._json.view; }
	
	get styles() { return this._json.styles; }
	
	constructor() {		
		super();
		
		this.json = GIS.Default();
	}
	
	Set(property, value) {
		this[property] = value;
		
		this.Emit("Change", { property:property, value:value });
	}
	
	ToJson() {
		return this.json;
	}
		
	static FromJson(json) {
		var gis = new GIS();
		
		gis.json = json;
		
		return gis;
	}
	
	static Default() {
		return {

		}
	}
}
