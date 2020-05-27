'use strict';

import Frame from './frame.js';

export default class FrameCA extends Frame { 
	
	constructor(time) {
		super(time);
		
		this.index = {};
	}
	
	AddTransition(t) {
		this.transitions.push(t);
		
		if (!this.index.hasOwnProperty(t.Z)) this.index[t.Z] = {};
		
		if (!this.index[t.Z].hasOwnProperty(t.Port)) this.index[t.Z][t.Port] = [];
		
		this.index[t.Z][t.Port].push(t);
		
		return t;
	}
	
	TransitionsByIndex(z, port) {
		return this.index[z] && this.index[z][port] || [];
	}
		
	Reverse () {
		var reverse = new FrameCA(this.time)
		
		this.transitions.forEach((t) => reverse.AddTransition(t.Reverse()));
		
		return reverse;
	}
}