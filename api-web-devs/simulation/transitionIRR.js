'use strict';

import Transition from './transition.js';

export default class TransitionIRR extends Transition { 
			
	constructor(model, value) {
		super(model, null, value);
	}
	
	get Id() {
		return this.model;
	}

	Reverse() {
		return new TransitionIRR(this.model, this.value - this.diff);
		
		// Not sure about this
		t.diff = this.diff;
		
		return t;
	}
	
	static FromCsv(csv) {
		return new TransitionIRR(csv.model, csv.value);
	}
}