'use strict';

import Dom from '../tools/dom.js';
import Simulation from './simulation.js';
import FrameIRR from './frameIRR.js';
import TransitionIRR from './transitionIRR.js';
import StateIRR from './stateIRR.js';
import Model from './model.js';

export default class SimulationIRR extends Simulation { 
	
	constructor(name, simulator, type, models) {
		super(name, simulator, type, models);
								
		this.state = new StateIRR(this.Models);
	}
	
	AddTransition(time, transition) {		
		var f = this.Index(time) || this.AddFrame(new FrameIRR(time));	
		
		f.AddTransition(transition);
	}
	
	EachTransition(delegate) {
		this.Frames.forEach(f => {
			f.Transitions.forEach(t => {
				delegate(t, f);
			});
		});
	}
	
	static FromJson(json, messages, fields) {
		var info = json.info;
		var models = json.models.map(m => Model.FromJson(m));
		var simulation = new SimulationIRR(info.name, info.simulator, info.type, models);
		
		simulation.Models.forEach(m => m.template = JSON.parse(m.template));
		
		// Add frames from flat transitions list			
		for (var i = 0; i < messages.length; i++) {
			var m = messages[i];
			var split = m.value.split(",").map(v => {
				return isNaN(+v) ? v : +v; 
			});
			
			var model = simulation.Model(m.model);
			
			if (model.template.length != split.length) throw new Error("length mismatch between fields and message content. This is a required temporary measure until Cadmium outputs message information.");
			
			var v = {};
			
			model.template.forEach((f, i) => v[f] = split[i]);
			
			var transition = new TransitionIRR(m.model, v);
						
			simulation.AddTransition(m.time, transition);
		}
		
		return simulation;		
	}
}
