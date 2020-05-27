'use strict';

export default class Frame { 

	constructor(time) {
		this.time = time;
		this.transitions = [];
		this.index = {};
	}
	
	AddTransition(t) {
		this.transitions.push(t);
		
		if (!this.index.hasOwnProperty(t.Z)) this.index[t.Z] = {};
		
		if (!this.index[t.Z].hasOwnProperty(t.Port)) this.index[t.Z][t.Port] = [];
		
		this.index[t.Z][t.Port].push(t);
		
		return t;
	}
	
	Transitions() {
		return this.transitions;
	}
	
	TransitionsByIndex(z, port) {
		return this.index[z] && this.index[z][port] || [];
	}
		
	Reverse () {
		var reverse = new Frame(this.time)
		
		this.transitions.forEach((t) => reverse.AddTransition(t.Reverse()));
		
		return reverse;
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