'use strict';

export default class State { 

	constructor(size, models) {
		this.i = -1;
		this.data = null;
		this.models = [];
		this.size = size;
		
		if (!models) return;
		
		this.models = models.map(m => {
			return {
				name : m.name,
				ports : m.ports.map(p => p.name)
			}
		});
		
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