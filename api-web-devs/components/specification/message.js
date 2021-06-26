'use strict';

export class Message { 
	
	get value() { return this._value; }
	
	get diff() { return this._diff; }
	set diff(value) { this._diff = value; }
	
	constructor(value) {
		this._value = value;
		this._diff = null;
	}
	
	GetDiff() {
		var d = {};
		
		for (var f in this.value) d[f] = this.value[f] - this.diff[f];
		
		return d;
	}
	
	Difference(v) {
		if (v === undefined || v === null) return;
		
		this.diff = {};
		
		for (var f in this.value) this.diff[f] = this.value[f] - v[f];
	}
	
	Reverse() {		
		throw new Error("Reverse must be implemented by child class.");
	}
}

export class StateMessage extends Message { 
	
	get model() { return this._model; }
	
	constructor(model, value) {
		super(value);
		
		this._model = model;
	}
	
	Reverse() {		
		// TODO: Only place where we use GetDiff I think.		
		return new StateMessage(this.model, this.GetDiff());
	}
}

export class StateMessageCA extends Message {
	
	get model() { return this.coord; }
	
	get coord() { return this._coord; }
	
	get id() { return this.coord.join("-"); }
	
	get x() { return this.coord[0]; }

	get y() { return this.coord[1]; }
	
	get z() { return this.coord[2]; }
	
	constructor(coord, value) {
		super(value);
		
		this._coord = coord;
	}
	
	Reverse() {		
		// TODO: Only place where we use GetDiff I think.		
		return new StateMessageCA(this.coord, this.GetDiff());
	}
}

export class OutputMessage extends StateMessage { 
	
	get port() { return this._port; }
	
	constructor(model, port, value) {
		super(model, value);
		
		this._port = port;
	}
	
	Reverse() {		
		// TODO: Only place where we use GetDiff I think.		
		return new OutputMessage(this.model, this.port, this.GetDiff());
	}
}