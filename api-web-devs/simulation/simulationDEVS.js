'use strict';

import Simulation from './simulation.js';
import Frame from './frame.js';
import TransitionDEVS from './transitionDEVS.js';
import StateDEVS from './stateDEVS.js';

export default class SimulationDEVS extends Simulation { 
	
	get Diagram() { 
		return this.diagram;
	}
	
	get Ratio() { 
		var vb = this.diagram.match(/viewBox="(.*?)"/);
		
		if (!vb) throw new Error("The viewBox attribute must be specified on the svg element.");

		var split = vb[1].split(" ");
		
		return split[2] / split[3];
	}
	
	get SVG() { return this.svg; }
	
	constructor(name, simulator, type, models, frames, diagram) {
		super(name, simulator, type, models, frames);
		
		this.diagram = diagram || null;
		
		this.state = new StateDEVS(models);
	}
	
	static FromJson(json) {		
		var simulation = new SimulationDEVS(json.name, json.simulator, json.type, json.models, null, json.svg);
		
		// build frames from flat transitions list		
		for (var i = 0; i < json.transitions.length; i++) {
			var t = json.transitions[i];
			var f = simulation.Index(t.time) || simulation.AddFrame(new Frame(t.time));
			
			var add = new TransitionDEVS(t.type, t.model, t.port, t.value, t.destination);
			
			f.AddTransition(add);
		}
		
		return simulation;
	}
}