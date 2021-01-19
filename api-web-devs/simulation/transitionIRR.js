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
		return new TransitionIRR(this.model, this.GetDiff());
	}

	static FromCsv(csv) {
		return new TransitionIRR(csv.model, csv.value);
	}
}