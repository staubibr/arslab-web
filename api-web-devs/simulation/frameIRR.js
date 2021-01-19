'use strict';

import Frame from './frame.js';

export default class FrameIRR extends Frame { 
		
	MakeFrame(time) {
		return new FrameIRR(time);
	}
	
	GetValue(state, t) {
		return state.GetValue(t.Id);
	}
}