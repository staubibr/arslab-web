'use strict';

import Dom from '../tools/dom.js';
import Simulation from './simulation.js';
import FrameDEVS from './frameDEVS.js';
import TransitionDEVS from './transitionDEVS.js';
import StateDEVS from './stateDEVS.js';
import Model from './model.js';

export default class SimulationDEVS extends Simulation { 
	
	get Diagram() { 
		return this.diagram;
	}
	
	get Ratio() { 	
		var vb = this.Diagram.getAttribute("viewBox")
		
		if (!vb) throw new Error("The viewBox attribute must be specified on the svg element.");

		var split = vb[1].split(" ");
		
		return split[2] / split[3];
	}
	
	get SVG() { return this.svg; }
	
	constructor(name, simulator, type, models, diagram) {
		super(name, simulator, type, models);
				
		this.BuildModels();
				
		if (diagram) this.LoadSVG(diagram);
		
		this.state = new StateDEVS(this.Models);
	}
	
	AddTransition(time, transition) {		
		var f = this.Index(time) || this.AddFrame(new FrameDEVS(time));	
		
		f.AddTransition(transition);
	}
	
	BuildModels() {
		this.models.forEach(m => {
			m.submodels = m.submodels.map(name => this.Model(name));
			
			m.links.forEach(l => {
				l.modelB = this.Model(l.modelB);
				l.portB = this.Port(l.modelB.name, l.portB);
				l.portA = this.Port(m.name, l.portA);				
			});
		});
	}
	
	LoadSVG(svg) {		
		var root = Dom.Create("div", { innerHTML:svg });
		
		this.Models.forEach(model => {	
			model.svg = model.svg.map(s => root.querySelector(s)).filter(s => s != null);		
			
			model.ports.forEach(port => {
				port.svg = port.svg.map(s => root.querySelector(s)).filter(s => s != null);
			});
			
			model.links.forEach(link => {
				link.svg = link.svg.map(s => root.querySelector(s)).filter(s => s != null);
			});
		});
		
		this.diagram = root.children[0];
	}
	
	ToFiles() {
		
	}
	
	static FromFiles(files) {
		var s = files.simulation;		
		var models = s.models.map(m => Model.FromJson(m));
		var simulation = new SimulationDEVS(s.name, s.simulator, s.type, models, files.diagram);
		
		// Add frames from flat transitions list		
		for (var i = 0; i < files.transitions.length; i++) {
			var time = files.transitions[i].time;
			
			simulation.AddTransition(time, TransitionDEVS.FromCsv(files.transitions[i]));
		}
		
		return simulation;
	}
}