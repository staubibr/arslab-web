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
		for (var i = 0; i < this.Frames.length; i++) {
			var f = this.Frames[i];
			
			for (var j = 0; j < f.Transitions.length; j++) {
				var t = f.Transitions[j];
				
				delegate(t, f);
			}
		}
	}
	
	static FromJson(json, messages, fields) {
		var info = json.info;
		var models = json.models.map(m => Model.FromJson(m));
		var simulation = new SimulationIRR(info.name, info.simulator, info.type, models);
				
		// Add frames from flat transitions list			
		for (var i = 0; i < messages.length; i++) {
			var m = messages[i];
			
			for (var f in m.value) {
				var v = m.value[f];
				
				m.value[f] = isNaN(+v) ? v : +v;
			}

			var transition = new TransitionIRR(m.model, m.value);
						
			simulation.AddTransition(m.time, transition);
		}
		
		return simulation;		
	}
}
