'use strict';

import Frame from './frame.js';

export default class FrameIRR extends Frame { 
		
	Reverse () {
		var reverse = new FrameIRR(this.time);
		
		this.transitions.forEach((t) => reverse.AddTransition(t.Reverse()));
		
		return reverse;
	}
	
	Difference(state) {
		for (var i = 0; i < this.transitions.length; i++) {
			var t = this.transitions[i];
			
			var v = state.GetValue(t.Id);
			
			if (v === undefined) continue;
			
			t.diff = {};
			
			for (var f in v) t.diff[f] = t.value[f] - v[f];
			
			state.SetValue(t.Id, t.Value);
		}
	}
}