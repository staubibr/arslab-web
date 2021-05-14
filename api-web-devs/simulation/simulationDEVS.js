'use strict';

import Dom from '../tools/dom.js';
import Simulation from './simulation.js';
import Frame from './frame.js';
import Message from './message.js';
import State from './state.js';
import Model from './model.js';

export default class SimulationDEVS extends Simulation { 
	
	get Diagram() { return this.diagram; }
	
	get Ratio() { 	
		var vb = this.Diagram.getAttribute("viewBox")
		
		if (!vb) throw new Error("The viewBox attribute must be specified on the svg element.");

		var split = vb[1].split(" ");
		
		return split[2] / split[3];
	}
	
	get SVG() { return this.svg; }
	
	constructor(structure, messages, diagram) {
		super(structure, messages);
		
		if (diagram) this.LoadSVG(diagram);
		
		this.state = new State(this.Models);
	}
	
	LoadSVG(svg) {		
		var root = Dom.Create("div", { innerHTML:svg });
		
		this.Models.forEach(model => {			
			model.SVG = model.SVG.map(s => root.querySelector(s)).filter(s => s != null);		
			
			model.Ports.forEach(port => {
				port.SVG = port.SVG.map(s => root.querySelector(s)).filter(s => s != null);
			});
			
			model.Links.forEach(link => {
				link.SVG = link.SVG.map(s => root.querySelector(s)).filter(s => s != null);
			});
		});
		
		this.diagram = root.children[0];
	}
}