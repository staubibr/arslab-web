'use strict';

import Simulation from './simulation.js';
import MessageCA from './messageCA.js';
import StateCA from './stateCA.js';
import Model from './model.js';

export default class SimulationCA extends Simulation { 
	
	get Size() { return this.size; }
	
	get Dimensions() {  return { x:this.size[0], y:this.size[1], z:this.size[2] }}
	
	get Ratio() { return this.Dimensions.x / this.Dimensions.y; }
	
	get MaxX() { return this.size[0] }
	
	get MaxY() { return this.size[1] }
	
	get MaxZ() { return this.size[2] }
	
	constructor(structure, messages, size) {
		super(structure, messages);
		
		this.size = size || null;
		
		this.state = new StateCA(this.Models, size);
	}
	
	LoadStateMessages(messages) {
		// Add frames from flat messages list			
		for (var i = 0; i < messages.length; i++) {
			var m = messages[i];
			var message = new MessageCA(m.cell, m.value);
			
			this.AddStateMessage(m.time, message);
		}
	}
	
	get Ports() {
		// TODO : Is this always 0?? Is there always only one model in Cell-DEVS?
		return this.Models[0].Ports.map(p => p.Name);
	}
	
	get Layers() {
		var layers = [];
		
		for (var i = 0; i < this.MaxZ; i++) layers.push(i);
		
		return layers;
	}
}