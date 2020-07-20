'use strict';

import Transition from './transition.js';

export default class TransitionCA extends Transition { 
	
	constructor(model, coord, port, value) {
		super(model, port, value);
		
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
		return new TransitionCA(this.model, this.coord, this.port, this.value - this.diff);
		
		// Not sure about this
		t.diff = this.diff;
		
		return t;
	}
	
	static FromCsv(csv) {
		return new TransitionCA(csv.model, csv.coord, csv.port, csv.value);
	}
}