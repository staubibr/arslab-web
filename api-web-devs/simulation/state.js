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
	
	GetValue(emitter) {
		if (!this.data.hasOwnProperty(emitter.id)) return null;
		
		return this.data[emitter.id] || null;
	}
	
	ApplyMessages(frame) {
		for (var i = 0; i < frame.state_messages.length; i++) {
			this.ApplyMessage(frame.state_messages[i]);
		}
	}

	ApplyMessage(m) {
		if (!this.data.hasOwnProperty(m.emitter.id)) return;
		
		for (var f in m.value) this.data[m.emitter.id][f] = m.value[f];
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
			var d = {};
			
			m.node_type.template.forEach(f => d[f] = 0);
			
			this.data[m.id] = d;
		});
	}
}