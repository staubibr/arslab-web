'use strict';

import Simulation from './simulation.js';
import FrameDEVS from './frameDEVS.js';
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
		
		this.state = new StateDEVS(this.Models);
	}
	
	static FromFiles(files) {
		var s = files.simulation;
		var d = files.diagram;
		
		var simulation = new SimulationDEVS(s.name, s.simulator, s.type, s.models, null, d);
		
		// build frames from flat transitions list		
		for (var i = 0; i < files.transitions.length; i++) {
			var t = files.transitions[i];
			
			simulation.Model(t.model);

			var f = simulation.Index(t.time) || simulation.AddFrame(new FrameDEVS(t.time));
			
			var add = new TransitionDEVS(t.type, t.model, t.port, t.value, t.destination);
			
			f.AddTransition(add);
		}
		
		return simulation;
	}
}