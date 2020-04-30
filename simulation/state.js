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
	
	static ModelsFromSize(size) {
		var models = [];
			
		for (var x = 0; x < size[0]; x++) {
			for (var y = 0; y < size[1]; y++) {
				for (var z = 0; z < size[2]; z++) {					
					models.push(`${x}-${y}-${z}`);
				}
			}
		}
			
		return models;
	}
}