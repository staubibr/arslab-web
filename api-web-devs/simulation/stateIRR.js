'use strict';

import State from "./state.js";

export default class StateIRR extends State { 

	constructor(models) {
		super(models.length, models);
	}
	
	Clone() {
		var clone = new StateIRR([]);
		
		clone.i = this.i;
		clone.models = this.models.map(m => m.Clone());
		clone.data = JSON.parse(JSON.stringify(this.data));

		return clone;
	}
	
	GetValue(id) {
		if (!this.data.hasOwnProperty(id)) return null;
		
		return this.data[id] || null;
	}

	ApplyTransition(t) {
		if (!this.data.hasOwnProperty(t.Id)) return;
		
		for (var f in t.Value) this.data[t.Id][f] = t.Value[f];
	}
			
	Reset() {
		this.data = {};
		
		this.models.forEach((m) => {
			var d = {};
						
			m.template.forEach(f => d[f] = 0);
			
			this.data[m.name] = d;
		});
	}
}