'use strict';

export default class TransitionCSV { 

	constructor(frame, model, stateValue, input, output, phase,diff, coord) {
		this.frame = frame;
		
		if(coord != "" ) this.model = this.CoordToId(coord);

		else this.model = model;	
		
		this.stateValue = stateValue;
		this.input = input;
		this.output = output;
		this.phase = phase;
		this.diff = diff;
		
		if (coord != "" ) this.coord = coord.join("-");
	}

	get Frame() {
		return this.frame;
	}

	get Model() {
		return this.model;
	}
	
	get StateValue() {
		return this.stateValue;
	}

	get Input() {
		return this.input;
	}
	
	get Output() {
		return this.output;
	}

	get Phase() {
		return this.phase;
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
	get Diff() {
		return this.diff;
	}
	
	set Diff(stateValue) {

		this.diff = stateValue;
	}

	CoordToId(coord) {
		return coord.join("-");
	}

	Reverse() {

	}
}