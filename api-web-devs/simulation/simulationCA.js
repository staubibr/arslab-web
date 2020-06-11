'use strict';

import Simulation from './simulation.js';
import FrameCA from './frameCA.js';
import TransitionCA from './transitionCA.js';
import StateCA from './stateCA.js';

export default class SimulationCA extends Simulation { 
	
	get Size() { return this.size; }
	
	get Dimensions() { 
		return { x:this.size[0], y:this.size[1], z:this.size[2] } 
	}
	
	get Ratio() { 
		return this.Dimensions.x / this.Dimensions.y;
	}
	
	constructor(name, simulator, type, models, frames, size) {
		super(name, simulator, type, models, frames);

		this.size = size || null;
		
		this.state = new StateCA(size, models);
	}
	
	LayersAndPorts() {
		var layers = [];
			
		for (var z = 0; z < this.Dimensions.z; z++) {
			this.models[0].ports.forEach(port => {
				layers.push({ z:z, ports:[port.name] });
			}); 
		}
		
		return layers;
	}
	
	static FromFiles(files) {
		var s = files.simulation;
		var t = files.transitions;
		
		var simulation = new SimulationCA(s.name, s.simulator, s.type, s.models, null, s.size, null);
		
		// build frames from flat transitions list		
		for (var i = 0; i < t.length; i++) {
			var m = t[i];
			var f = simulation.Index(m.time) || simulation.AddFrame(new FrameCA(m.time));
			
			var add = new TransitionCA(m.type, m.model, m.coord, m.port, m.value, m.destination);
			
			f.AddTransition(add);
		}
		
		return simulation;
	};
}