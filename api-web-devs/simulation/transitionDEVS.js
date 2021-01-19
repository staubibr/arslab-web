'use strict';

import Transition from './transition.js';

export default class TransitionDEVS extends Transition { 
			
	constructor(model, port, value) {
		super(model, port, value);
	}
	
	get Id() {
		return this.model;
	}
	
	Reverse() {			
		return new TransitionDEVS(this.model, this.port, this.GetDiff());
	}

	static FromCsv(csv) {
		return new TransitionDEVS(csv.model, csv.port, csv.value);
	}
}