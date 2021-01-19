'use strict';

import Frame from './frame.js';

export default class FrameCA extends Frame { 
	
	MakeFrame(time) {
		return new FrameCA(time);
	}
	
	GetValue(state, t) {
		return state.GetValue(t.Id);
	}
}