'use strict';

export default class State { 

	constructor(size, models) {
		this.i = -1;
		this.data = null;
		this.models = [];
		this.size = size;
		
		if (!models) return;
		
		this.models = models;
			
		this.Reset();
	}
	
	Clone(){
		throw new Error("Clone function must be implemented by state");
	}
	
	GetValue(id) {
		throw new Error("GetValue function must be implemented by state");
	}
	
	SetValue(id, value) {
		throw new Error("SetValue function must be implemented by state");
	}
	
	ApplyTransitions(frame) {
		for (var i = 0; i < frame.transitions.length; i++) {
			this.ApplyTransition(frame.transitions[i]);
		}
	}
	
	Forward(frame) {
		this.ApplyTransitions(frame);
		
		this.i++;
	}
	
	Backward(frame) {
		this.ApplyTransitions(frame);
		
		this.i--;
	}
}