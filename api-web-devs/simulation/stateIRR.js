'use strict';

import State from "./state.js";

export default class StateIRR extends State { 

	constructor(models) {
		super(models.length, models);
	}
	
	Clone() {
		var clone = new StateIRR([]);
		
		clone.i = this.i;
		clone.models = JSON.parse(JSON.stringify(this.models));
		clone.data = JSON.parse(JSON.stringify(this.data));

		return clone;
	}
	
	GetValue(id) {
		if (!this.data.hasOwnProperty(id)) return null;
		
		return this.data[id] || null;
	}
	
	SetValue(id, value) {
		if (!this.data.hasOwnProperty(id)) return;
		
		this.data[id] = value;
	}
	
	ApplyTransitions(frame) {
		frame.transitions.forEach((t) => {
			this.SetValue(t.Id, t.Value);
		});
		
		this.i++;
	}
		
	Reset() {
		this.data = {};
		
		this.models.forEach((m) => {
			this.data[m.name] = {};
		});
	}
}