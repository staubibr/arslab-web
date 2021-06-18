'use strict';

import Dom from '../tools/dom.js';
import Simulation from './simulation.js';
import State from './state.js';

export default class SimulationDEVS extends Simulation { 
	
	get diagram() { return this._diagram; }
	
	get ratio() {
		var vb = this.diagram.getAttribute("viewBox")
		
		if (!vb) throw new Error("The viewBox attribute must be specified on the svg element.");

		var split = vb[1].split(" ");
		
		return split[2] / split[3];
	}
	
	constructor(structure, frames, diagram) {
		super(structure, frames);
		
		if (diagram) this._diagram = this.LoadSVG(diagram);
		
		this.state = new State(this.models);
	}
	
	LoadSVG(svg) {		
		var root = Dom.Create("div", { innerHTML:svg });
		
		this.models.forEach(model => {		
			model.svg = model.svg ?? [];
			model.svg = model.svg.map(s => root.querySelector(s)).filter(s => s != null);		
			
			model.ports.forEach(port => {
				port.svg = port.svg ?? [];
				port.svg = port.svg.map(s => root.querySelector(s)).filter(s => s != null);
			});
			
			model.links.forEach(link => {
				link.svg = link.svg ?? [];
				link.svg = link.svg.map(s => root.querySelector(s)).filter(s => s != null);
			});
		});
		
		return root.children[0];
	}
}