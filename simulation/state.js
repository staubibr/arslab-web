'use strict';

export default class State { 

	constructor() {
		this.i = -1;
		this.data = null;
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
		frame.transitions.forEach((t) => {
			this.SetValue(t.Id, t.Port, t.Value);
		});
		
		this.i++;
	}
	
	RollbackTransitions(frame) {
		frame.transitions.forEach((t) => {
			var value = this.GetValue(t.Id, t.Port) - t.diff;
			
			this.SetValue(t.Id, t.Port, t.Value);
		});
		
		this.i--;
	}
}