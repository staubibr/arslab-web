'use strict';

import Simulation from './simulation.js';
import StateCA from './stateCA.js';

export default class SimulationCA extends Simulation { 
	
	get dimensions() {  return this._dimensions; }
	
	get ratio() { return this.dimensions.x / this.dimensions.y; }
	
	get maxX() { return this.dimensions.x }
	
	get maxY() { return this.dimensions.y }
	
	get maxZ() { return this.dimensions.z }
	
	get ports() {
		// TODO : Is this always 1?? Is there always only one model in Cell-DEVS?
		return this.structure.models[1].ports.map(p => p.name);
	}
	
	get layers() {
		var layers = [];
		
		for (var i = 0; i < this.maxZ; i++) layers.push(i);
		
		return layers;
	}
	
	constructor(structure, frames) {
		super(structure, frames);
		
		this._dimensions = {
			x: this.structure.model_types[1].dim[0],
			y: this.structure.model_types[1].dim[1],
			z: this.structure.model_types[1].dim[2]
		}
		
		this.state = new StateCA(this.models[1], this.dimensions);
	}
}