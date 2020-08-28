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
		// TODO : Is this always 0?? Is there always only one model in Cell-DEVS?
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
	
	static FromJson(json, messages) {
		var info = json.info;
		var models = json.models.map(m => Model.FromJson(m));
		
		// TODO : This is awkward, do Cell-DEVS models always have a single cell space?
		var size = json.models[0].size;
		var simulation = new SimulationCA(info.name, info.simulator, info.type, models, size);
		
		// Add frames from flat transitions list			
		for (var i = 0; i < messages.length; i++) {
			var m = messages[i];			
			var transition = new TransitionCA(m.model, m.coord, m.port, m.value);
						
			simulation.AddTransition(m.time, transition);
		}
		
		return simulation;
	}
}