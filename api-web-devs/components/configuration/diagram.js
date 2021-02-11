'use strict';

import Evented from '../evented.js';

export default class Diagram extends Evented { 

	get json() { return this._json; }
	
	set json(value) { this._json = value; }
	
	get width() { return this._json.width; }
	
	get height() { return this._json.height; }
	
	get aspect() { return this._json.aspect; }
	
	get click() { return this._json.click; }
	
	set width(value) { this._json.width = value; }
	
	set height(value) { this._json.height = value; }
	
	set aspect(value) { this._json.aspect = value; }
	
	set click(value) { this._json.click = value; }
	
	constructor() {
		super();
		
		this.json = Diagram.Default();
	}
	
	Set(property, value) {
		this[property] = value;
				
		this.Emit("Change", { property:property, value:value });
	}
	
	DiagramSize(simulation) {		
		return { 
			width : this.width, 
			height : this.aspect ? this.width / simulation.Ratio : this.height 
		}
	}
	
	ToJson() {
		return this.json;
	}
	
	static FromJson(json) {
		var diagram = new Diagram();
				
		if (json.width != undefined) diagram.json.width = json.width;
		if (json.height != undefined) diagram.json.height = json.height;
		if (json.aspect != undefined) diagram.json.aspect = json.aspect;
		if (json.click != undefined) diagram.json.click = json.click;
		
		return diagram;
	}
	
	static Default() {
		return {
			width : 600,
			height : 400,
			aspect : true,
			click : false
		}
	}
}
