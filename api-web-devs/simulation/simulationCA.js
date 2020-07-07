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
	
	get MaxX() { return this.size[0] }
	
	get MaxY() { return this.size[1] }
	
	get MaxZ() { return this.size[2] }
	
	constructor(name, simulator, type, models, frames, size) {
		super(name, simulator, type, models, frames);

		this.size = size || null;
		
		this.state = new StateCA(size, models);
	}
	
	get Ports() {
		return this.models[0].ports.map(p => p.name);
	}
	
	get Layers() {
		var layers = [];
		
		for (var i = 0; i < this.Dimensions.z; i++) layers.push(i);
		
		return layers;
	}
	
	LayersAndPorts() {
		var layers = [];
			
		this.Layers.forEach(z => {
			this.Ports.forEach(port => {
				layers.push({ z:z, ports:[port] });
			}); 
		})
		
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