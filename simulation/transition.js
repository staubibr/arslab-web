'use strict';

export default class Transition { 
			
	constructor(type, model, id, port, value, destination) {
		this.type = type;
		this.model = model;
		this.id = id;
		this.port = port;
		this.value = value;
		this.destination = destination;
		
		this.diff = null;
	}

	get Type() { return this.type; }

	get Model() { return this.model; }

	get Id() { return this.id; }
	
	get Port() { return this.port; }

	get Value() { return this.value; }

	get Destination() { return this.destination; }
	
	get Diff() { return this.diff; }
	
	set Diff(value) { this.diff = value; }
	
	Reverse() {
		return new Transition(this.id, this.value - this.diff, this.diff);
	}
}