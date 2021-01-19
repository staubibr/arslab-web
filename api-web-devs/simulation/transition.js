'use strict';

export default class Transition { 
			
	constructor(model, port, value) {
		this.model = model;
		this.port = port;
		this.value = value;
		
		this.diff = null;
	}

	get Model() { return this.model; }
	
	get Port() { return this.port; }

	get Value() { return this.value; }
	
	get Diff() { return this.diff; }
	
	set Diff(value) { this.diff = value; }

	GetDiff() {
		var d = {};
		
		for (var f in this.value) d[f] = this.value[f] - this.diff[f];
		
		return d;
	}

	Reverse() {
		throw new Error("function Reverse must be defined in child class.");
	}
}