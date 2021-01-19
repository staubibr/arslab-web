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
	
	MakeFrame(time) {
		throw new Error("function MakeFrame must be defined in child class.");
	}
	
	GetValue(state, t) {
		throw new Error("function MakeFrame must be defined in child class.");
	}
	
	Reverse () {
		var reverse = this.MakeFrame(this.time);
		
		for (var i = 0; i < this.transitions.length; i++) {			
			reverse.AddTransition(this.transitions[i].Reverse());
		}
		
		return reverse;
	}
	
	Difference(state) {
		for (var i = 0; i < this.transitions.length; i++) {
			var t = this.transitions[i];
			
			var v = this.GetValue(state, t);
			
			if (v === undefined) continue;
			
			t.diff = {};
			
			for (var f in t.value) t.diff[f] = t.value[f] - v[f];
						
			state.ApplyTransition(t);
		}
	}
}