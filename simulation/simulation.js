'use strict';

import Evented from '../../basic-tools/components/evented.js';

export default class Simulation extends Evented { 
	
	constructor() {
		super();
		
		this.svg = null;
		this.transition = null;
		
		this.size = null;

		this.simulatorName = null;
		
		this.simulator = null;
		
		this.palette = null;
	}
	
	Initialize(info) {
		this.simulator = info.simulator;
		this.simulatorName = info.simulatorName;
	}
}