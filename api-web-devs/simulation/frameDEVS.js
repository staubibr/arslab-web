'use strict';

import Frame from './frame.js';

export default class FrameDEVS extends Frame { 
		
	Reverse () {
		var reverse = new FrameDEVS(this.time);
		
		this.transitions.forEach((t) => reverse.AddTransition(t.Reverse()));
		
		return reverse;
	}
}