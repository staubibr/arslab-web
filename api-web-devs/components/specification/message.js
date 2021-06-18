'use strict';

export class Message { 
	
	get emitter() { return this._raw.emitter; }

	get value() { return this._raw.value; }
	
	get diff() { return this._diff; }
	set diff(value) { this._diff = value; }
	
	constructor(emitter, value) {
		this._raw = {
			emitter: emitter,
			value: value
		}

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
		// TODO: Only place where we use GetDiff I think.		
		return new Message(this.emitter, this.GetDiff());
	}
}

export class MessageCA extends Message {
	
	get id() { return this.emitter.join("-"); }
	
	get x() { return this.emitter[0]; }

	get y() { return this.emitter[1]; }
	
	get z() { return this.emitter[2]; }
	
	constructor(emitter, value) {
		super(emitter, value);
	}
	
	Reverse() {		
		// TODO: Only place where we use GetDiff I think.		
		return new MessageCA(this.emitter, this.GetDiff());
	}
}