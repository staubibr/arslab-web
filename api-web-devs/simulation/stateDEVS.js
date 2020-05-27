'use strict';

import State from "./state.js";

export default class StateDEVS extends State { 

	constructor(models) {
		super();
		
		this.models = models;
		
		this.Reset();
	}
	
	Clone() {
		var clone = new StateDEVS([]);
		
		clone.i = this.i;
		clone.models = JSON.parse(JSON.stringify(this.models));
		clone.data = JSON.parse(JSON.stringify(this.data));

		return clone;
	}
	
	GetValue(id, port) {
		if (!this.data.hasOwnProperty(id)) return null;
		
		return this.data[id][port] || null;
	}
	
	SetValue(id, port, value) {
		if (!this.data.hasOwnProperty(id)) return;
		
		this.data[id][port] = value;
	}
		
	Reset() {
		this.data = {};
		
		this.models.forEach((m) => {
			this.data[m.name] = {};
			
			m.ports.forEach(p => {
				if (p.type == "output") this.data[m.name][p.name] = 0;
			}) 
		});
	}
}