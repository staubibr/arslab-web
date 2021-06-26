'use strict';

export default class Frame { 

	get messages() { return this._messages; }

	get output_messages() { return this.messages.output; }

	get state_messages() { return this.messages.state; }
	
	get time() { return this._time; }
	
	constructor(time) {
		this._time = time;
		
		this._messages = {
			output : [],
			state : []
		}
	}
	
	AddMessage(m, type) {
		this.messages[type].push(m);
	}
	
	AddOutputMessage(m) {
		return this.AddMessage(m, "output");
	}
	
	AddStateMessage(m) {
		return this.AddMessage(m, "state");
	}
	
	Reverse () {
		var reverse = new Frame(this.time);
		
		for (var i = 0; i < this.state_messages.length; i++) {
			var m = this.state_messages[i];
			
			reverse.AddStateMessage(m.Reverse());
		}
		
		return reverse;
	}
	
	Difference(state) {
		for (var i = 0; i < this.state_messages.length; i++) {
			var m = this.state_messages[i];			
			var v = state.GetValue(m.model);
			
			m.Difference(v);
		}
	}
}