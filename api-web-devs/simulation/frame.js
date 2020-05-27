'use strict';

export default class FrameCA { 

	get Transitions() { return this.transitions; }
	
	get Time() { return this.time; }
	
	constructor(time) {
		this.time = time;
		this.transitions = [];
	}
	
	AddTransition(t) {
		this.transitions.push(t);
		
		return t;
	}
	
	Reverse() {
		throw new Error("function Reverse must be defined in child class.");
	}
	
	Difference(state) {
		for (var i = 0; i < this.transitions.length; i++) {
			var t = this.transitions[i];
			
			var v = state.GetValue(t.Id, t.Port);
			
			if (v === undefined) continue;
			
			t.diff = t.value - v;
			
			state.SetValue(t.Id, t.Port, t.Value);
		}
	}
}