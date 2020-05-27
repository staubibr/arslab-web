'use strict';

import Simulation from './simulation.js';
import Frame from './frame.js';
import TransitionCA from './transitionCA.js';
import StateCA from './stateCA.js';
import Palette from './palettes/basic.js';

export default class SimulationCA extends Simulation { 
	
	get Size() { return this.size; }
	
	get Palette() { return this.palette; }
	
	get Dimensions() { 
		return { x:this.size[0], y:this.size[1], z:this.size[2] } 
	}
	
	get Ratio() { 
		return this.Dimensions.x / this.Dimensions.y;
	}
	
	constructor(name, simulator, type, models, frames, size, palette) {
		super(name, simulator, type, models, frames);

		this.size = size || null;
		this.palette = palette || new Palette();
		
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
	
	static FromJson(json) {
		var simulation = new SimulationCA(json.name, json.simulator, json.type, json.models, null, json.size, null);
		
		// build frames from flat transitions list		
		for (var i = 0; i < json.transitions.length; i++) {
			var t = json.transitions[i];
			var f = simulation.Index(t.time) || simulation.AddFrame(new Frame(t.time));
			
			var add = new TransitionCA(t.type, t.model, t.coord, t.port, t.value, t.destination);
			
			f.AddTransition(add);
		} 
		
		// Palette needs to be constructed.		
		if (json.palette) json.palette.forEach(p => simulation.palette.AddClass(p.begin, p.end, p.color));
		
		return simulation;
	};
}