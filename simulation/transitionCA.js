'use strict';

import Transition from './transition.js';

export default class TransitionCA extends Transition { 

	static CoordToId(coord) {
		return coord.join("-");
	}

	constructor(type, model, id, port, value, destination) {
		super(type, model, id, port, value, destination);
		
		this.coord = id.split("-");
		
		this.coord[0] = +this.coord[0];
		this.coord[1] = +this.coord[1];
		
		if (this.coord.length == 2) {
			this.id += "-0";
			
			this.coord[2] = 0;
		}
		
		else this.coord[2] = +this.coord[2];
		
	}
	
	get X() {
		return this.coord[0];
	}

	get Y() {
		return this.coord[1];
	}
	
	get Z() {
		return this.coord[2];
	}
	
	Reverse() {
		return new TransitionCA(this.type, this.model, this.id, this.port, this.value - this.diff, this.destination);
		
		// Not sure about this
		t.diff = this.diff;
		
		return t;
	}
}