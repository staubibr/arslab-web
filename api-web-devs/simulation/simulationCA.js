'use strict';

import Simulation from './simulation.js';
import FrameCA from './frameCA.js';
import TransitionCA from './transitionCA.js';
import StateCA from './stateCA.js';
import Model from './model.js';

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
	
	constructor(name, simulator, type, models, size) {
		super(name, simulator, type, models);
		
		this.size = size || null;
		
		this.state = new StateCA(size, this.Models);
	}
	
	AddTransition(time, transition) {		
		var f = this.Index(time) || this.AddFrame(new FrameCA(time));	
		
		f.AddTransition(transition);
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
		var models = s.models.map(m => Model.FromJson(m));
		var simulation = new SimulationCA(s.name, s.simulator, s.type, models, s.size);
		
		// Add frames from flat transitions list		
		for (var i = 0; i < files.transitions.length; i++) {
			var time = files.transitions[i].time;
			
			simulation.AddTransition(time, TransitionCA.FromCsv(files.transitions[i]));
		}
		
		return simulation;
	};
}