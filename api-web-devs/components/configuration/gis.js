'use strict';

import Section from './section.js';

export default class GIS extends Section { 
	
	set json(value) { 
		this._json = value; 
		
		if (this.variables) this.variables.forEach((s, i) => s.index = i); 
	}
	
	get basemap() { return this._json.basemap; }
	
	get layers() { return this._json.layers; }
	
	get variables() { return this._json.variables; }
	
	get view() { return this._json.view; }
	
	get styles() { return this._json.styles; }
	
	constructor(json) {		
		super(json);
		
		this.json = json || GIS.Default();
	}
		
	static FromJson(json) {
		return new GIS(json);
	}
}
