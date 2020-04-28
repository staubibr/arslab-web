'use strict';

export default class State { 

	constructor(i, models) {
		this.i = i;
		this.models = models;
	}
	
	Clone(){
		var clone = JSON.parse(JSON.stringify(this.models));

		return new State(this.i, clone);
	}
	
	GetValue(id) {
		return this.models[id];
	}
	
	SetValue(id, value) {
		this.models[id] = value;
	}
	
	ApplyTransitions(frame) {
		frame.transitions.forEach((t) => {
			this.SetValue(t.id, t.value);
		});
		
		this.i++;
	}
	
	RollbackTransitions(frame) {
		frame.transitions.forEach((t) => {
			var value = this.GetValue(t.id) - t.diff;
			
			this.SetValue(t.id, value);
		});
		
		this.i--;
	}
	
	static Zero(models) {
		var index = {};
		
		models.forEach((id) => {
			index[id] = 0;
		});
			
		return new State(-1, index);
	}
}