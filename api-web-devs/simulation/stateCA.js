'use strict';

import State from "./state.js";

export default class StateCA extends State { 

	constructor(model, size) {
		super([model]);
		
		this.size = size;
	}
	
	Clone() {
		var clone = new StateCA(this.models, this.size);
		
		clone.i = this.i;
		clone.data = JSON.parse(JSON.stringify(this.data));
		
		return clone;
	}
	
	GetValue(coord) {
		return this.data[coord[0]][coord[1]][coord[2]];
	}

	ApplyMessage(m) {		
		for (var f in m.value) this.data[m.x][m.y][m.z][f] = m.value[f];
	}
		
	Reset() {
		this.data = [];
		
		// TODO : Is this always 0?? Is there always only one model in Cell-DEVS?
		var m = this.models[0];
		
		for (var x = 0; x < this.size.x; x++) {
			this.data[x] = [];
			
			for (var y = 0; y < this.size.y; y++) {
				this.data[x][y] = [];
				
				for (var z = 0; z < this.size.z; z++) {
					this.data[x][y][z] = m.node_type.Template0();
				}
			}
		}
	}
}