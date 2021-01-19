'use strict';

import Evented from '../components/evented.js';

export default class Port { 
	get Name() { return this.name; }
	
	get Type() { return this.type; }
	
	get SVG() { return this.svg; }

	constructor(name, type, svg, template) {
		this.name = name;
		this.type = type;
		this.svg = svg || [];
        this.template = template || null;
	}
    
	Clone() {
		return new Port(this.name, this.type, this.svg, this.template);
	}
	
	static FromJson(json) {
		return new Port(json.name, json.type, json.svg, json.template);
	}
}