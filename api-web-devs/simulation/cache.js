'use strict';

export default class Cache { 

	get length() { return this.states.length; }

	constructor() {
		this.n = 0;
		this.states = [];
	}
	
	Build(n, frames, zero) {
		this.n = n;
		
		var state = zero;
		
		for (var i = 0; i < frames.length; i++) {
			state.Forward(frames[i]);
			
			if (i % n === 0) this.AddState(state);
		}
		
		if (i % n != 0) this.AddState(state);
	}
	
	GetClosest(i) {
		var diff = i % this.n;
		
		return this.GetState((i - diff) / this.n);
	}
	
	AddState(state) {
		this.states.push(state.Clone());
	}
	
	GetState(i) {
		return this.states[i].Clone();
	}
	
	First() {
		return this.GetState(0);
	}
	
	Last() {
		return this.GetState(this.length - 1);
	}
}