'use strict';

import Evented from '../evented.js';

export default class Grid extends Evented { 

	get json() { return this._json; }
	
	set json(value) { this._json = value; }
	
	constructor(json) {
		super();
		
		this.json = json;
	}	
	
	Trigger(property, value) {
		this.Emit(`change`, { property:property });
		this.Emit(`change:${property}`, { property:property });
	}
	
	Set(property, value) {
		this[property] = value;
		
		this.Trigger(property, value);
	}
	
	ToJson() {
		return this.json;
	}
	
	Default() {
		throw new Error("Default not implemented for this configuration section.");
	}
}
