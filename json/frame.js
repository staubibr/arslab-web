'use strict';

import Transition from './transition.js';

export default class Frame { 

	constructor(time, transitions) {
		this.time = time;
		this.transitions = transitions || [];
	}
}