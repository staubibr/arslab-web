'use strict';

export default class Transition { 
			
	constructor(type, model, port, value, destination) {
		this.type = type;
		this.model = model;
		this.port = port;
		this.value = value;
		this.destination = destination;
		
		this.diff = null;
	}

	get Type() { return this.type; }

	get Model() { return this.model; }
	
	get Port() { return this.port; }

	get Value() { return this.value; }

	get Destination() { return this.destination; }
	
	get Diff() { return this.diff; }
	
	set Diff(value) { this.diff = value; }
	
	Reverse() {
		throw new Error("function Reverse must be defined in child class.");
	}
}