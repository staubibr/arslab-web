'use strict';

import Transition from './transition.js';

export default class Frame { 

	constructor(time) {
		this.time = time;
		this.transitions = [];
		this.index = {};
	}
	
	get Length() {
		return this.transitions.length;
	}
	
	AddTransition(transition) {
		this.transitions.push(transition);
		
		this.index[transition.id] = transition;
		
		return transition;
	}
	
	TransitionById(id) {
		return this.index[id] || null;
	}
	
	Transition(i) {
		return this.transitions[i];
	}
	
	First() {
		return this.transitions[0];
	}
	
	Last()  {
		return this.transitions[this.transitions.length - 1];
	}
	
	Reverse () {
		var reverse = new Frame(this.time)
		
		this.transitions.forEach((t) => reverse.AddTransition(t.Reverse()));
		
		return reverse;
	}
	
	Difference(state) {
		for (var i = 0; i < this.Length; i++) {
			var t = this.Transition(i);
			
			if (state.models[t.id] === undefined) continue;
			
			t.diff = t.value - state.GetValue(t.id);
			
			state.SetValue(t.id, t.value);
		}
	}
}