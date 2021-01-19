'use strict';

import State from "./state.js";

export default class StateDEVS extends State { 

	constructor(models) {
		super(models.length, models);
	}
	
	Clone() {
		var clone = new StateDEVS([]);
		
		clone.i = this.i;
		clone.models = this.models.map(m => m.Clone());
		clone.data = JSON.parse(JSON.stringify(this.data));

		return clone;
	}
	
	GetValue(id, port) {
		if (!this.data.hasOwnProperty(id)) return null;
		
		return this.data[id][port] || null;
	}

	ApplyTransition(t) {
		if (!this.data.hasOwnProperty(t.Id)) return;
		
		for (var f in t.Value) this.data[t.Id][t.Port][f] = t.Value[f];
	}
		
	Reset() {
		this.data = {};
		
		this.models.forEach((m) => {
			this.data[m.name] = {};
			
			m.ports.forEach(p => {
				var d = {};
				
				if (p.type != "output") return;
				
				p.template.forEach(f => d[f] = 0);
				
				this.data[m.name][p.name] = d;
			});
		});
	}
}