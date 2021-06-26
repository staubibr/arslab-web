'use strict';

export default class State { 

	constructor(models) {
		this.i = -1;
		this.data = null;
		this.models = models || [];
		this.size = this.models.length;
	}
	
	Clone() {
		var clone = new State(this.models);
		
		clone.i = this.i;
		clone.data = JSON.parse(JSON.stringify(this.data));

		return clone;
	}
	
	GetValue(model) {
		// if (!this.data.hasOwnProperty(model.id)) return null;
		
		return this.data[model.id] || null;
	}
	
	ApplyMessages(frame) {
		for (var i = 0; i < frame.state_messages.length; i++) {
			this.ApplyMessage(frame.state_messages[i]);
		}
	}

	ApplyMessage(m) {
		// if (!this.data.hasOwnProperty(m.model.id)) return;
		
		for (var f in m.value) this.data[m.model.id][f] = m.value[f];
	}
	
	Forward(frame) {
		this.ApplyMessages(frame);
		
		this.i++;
	}
	
	Backward(frame) {
		this.ApplyMessages(frame);
		
		this.i--;
	}
		
	Reset() {
		this.data = {};
		
		this.models.forEach((m) => {
			this.data[m.id] = m.node_type.Template0();
		});
	}
}