'use strict';

import State from "./state.js";

export default class StateCA extends State { 

	constructor(size, models) {
		super();
		
		this.size = size;
		this.models = models;
		
		if (!this.models) return;
		
		this.Reset();
	}
	
	Clone() {
		var clone = new StateCA([0, 0, 0], null);
		
		clone.i = this.i;
		clone.size = JSON.parse(JSON.stringify(this.size));
		clone.models = JSON.parse(JSON.stringify(this.models));
		clone.data = JSON.parse(JSON.stringify(this.data));
		
		return clone;
	}
	
	GetValue(coord, port) {
		return this.data[coord[0]][coord[1]][coord[2]][port];
	}
	
	SetValue(coord, port, value) {
		this.data[coord[0]][coord[1]][coord[2]][port] = value;
	}
	
	Reset() {
		this.data = [];
		
		// TODO : Is this always 0?? Is there always only one model in Cell-DEVS?
		var m = this.models[0];
		
		for (var x = 0; x < this.size[0]; x++) {
			this.data[x] = [];
			
			for (var y = 0; y < this.size[1]; y++) {
				this.data[x][y] = [];
				
				for (var z = 0; z < this.size[2]; z++) {
					var ports = {};
					
					m.ports.forEach(p => {
						if (p.type == "output") ports[p.name] = 0;
					}) 
					
					this.data[x][y][z] = ports;
					
				}
			}
		}
	}
}