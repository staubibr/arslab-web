'use strict';

import Evented from '../components/evented.js';

export default class Port { 
	get Name() { return this.name; }
	
	get Type() { return this.type; }
	
	get SVG() { return this.svg; }

	constructor(name, type, svg) {
		this.name = name;
		this.type = type;
		this.svg = svg || [];
	}
	
	static FromJson(json) {
		return new Port(json.name, json.type, json.svg);
	}
}