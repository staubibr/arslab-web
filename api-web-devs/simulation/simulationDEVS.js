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
		
		this.state = new StateDEVS(models);
	}
	
	static FromFiles(files) {
		var s = files.simulation;
		var t = files.transitions;
		var d = files.diagram;
		
		var simulation = new SimulationDEVS(s.name, s.simulator, s.type, s.models, null, d);
		
		// build frames from flat transitions list		
		for (var i = 0; i < t.length; i++) {
			var m = t[i];
			var f = simulation.Index(m.time) || simulation.AddFrame(new FrameDEVS(m.time));
			
			var add = new TransitionDEVS(m.type, m.model, m.port, m.value, m.destination);
			
			f.AddTransition(add);
		}
		
		return simulation;
	}
}