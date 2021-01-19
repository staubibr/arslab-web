'use strict';

import Frame from './frame.js';

export default class FrameDEVS extends Frame { 
	
	MakeFrame(time) {
		return new FrameDEVS(time);
	}
	
	GetValue(state, t) {
		return state.GetValue(t.Id, t.Port);
	}
}