'use strict';

import Transition from './transition.js';

export default class TransitionCA extends Transition { 
	
	constructor(type, model, coord, port, value, destination) {
		super(type, model, port, value, destination);
		
		this.coord = coord;
	}
	
	get Id() {
		return this.coord;
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
		return new TransitionCA(this.type, this.model, this.coord, this.port, this.value - this.diff, this.destination);
		
		// Not sure about this
		t.diff = this.diff;
		
		return t;
	}
}