'use strict';

import Transition from './transition.js';

export default class TransitionDEVS extends Transition { 
			
	constructor(type, model, port, value, destination) {
		super(type, model, port, value, destination);
	}
	
	get Id() {
		return this.model;
	}

	Reverse() {
		return new TransitionDEVS(this.type, this.model, this.port, this.value - this.diff, this.destination);
		
		// Not sure about this
		t.diff = this.diff;
		
		return t;
	}
}