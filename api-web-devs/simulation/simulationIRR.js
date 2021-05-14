'use strict';

import Simulation from './simulation.js';
import Message from './message.js';
import State from './state.js';
import Model from './model.js';

export default class SimulationIRR extends Simulation { 
	
	constructor(structure, messages) {
		super(structure, messages);
		
		this.state = new State(this.Models);
	}
	
}
