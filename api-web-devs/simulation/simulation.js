'use strict';

import Evented from '../components/evented.js';
import Cache from './cache.js';
import Frame from './frame.js';
import Model from './model.js';

export default class Simulation extends Evented { 
	
	get Name() { return this.name; }
	
	get Type() { return this.type; }
	
	get State() { return this.state; }

	get Selected() { return this.selected; }
	
	get Frames() { return this.frames; }
	
	// TODO : Should vary in a SimulationCA class
	get Ratio() { 
		throw new Error("get Ratio must be defined in child simulation class.");
	}

	get Models() {
		return this.models;
	}

	get ModelNames() {
		return this.Models.map(m => m.name);
	}

	get AtomicModels() {
		return this.Models.filter(m => m.Type == "atomic");
	}

	get CoupledModels() {
		return this.Models.filter(m => m.Type == "coupled");
	}

	constructor(name, simulator, type, models, transitions) {
		super();
		
		this.frames = [];

		this.name = name || null;
		this.simulator = simulator || null;
		this.type = type || null;
		this.models = models || [];
		this.transitions = transitions || [];
		this.index = {};
		this.selected = [];
		this.cache = new Cache();
	}
	
	Initialize(nCache) {
		this.state.Reset();
		
		this.cache.Build(nCache, this.frames, this.state);
		
		this.state.Reset();
		
		this.frames.forEach((f) => f.Difference(this.state));
		
		this.state = this.cache.First();
	}
	
	GetState(i) {
		if (i == this.frames.length - 1) return this.cache.Last();
		
		if (i == 0) return this.cache.First();
		
		var cached = this.cache.GetClosest(i);
		
		for (var j = cached.i + 1; j <= i; j++) {
			cached.ApplyTransitions(this.Frame(j));
		}
		
		return cached;
	}
	
	CurrentFrame() {
		return this.frames[this.state.i];
	}

	Model(name) {
		return this.Models.find(m => name == m.name) || null;
	}
	
	Port(mName, pName) {
		var model = this.Model(mName);
		
		return model && model.Port(pName) || null;
	}
	
	AddFrame(frame) {		
		this.frames.push(frame);
		
		this.index[frame.time] = frame;
		
		return frame;
	}
	
	Frame(i) {
		return this.frames[i];
	}
	
	Index(id) {
		return this.index[id];
	}
	
	FirstFrame(i) {
		return this.frames[0];
	}
	
	LastFrame(i) {
		return this.frames[this.frames.length - 1];
	}
	
	GoToFrame(i) {
		this.state = this.GetState(i);
		
		this.Emit("Jump", { state:this.state, i: i });
	}
	
	GoToNextFrame() {
		var frame = this.Frame(this.state.i + 1);
		
		this.state.ApplyTransitions(frame);
		
		this.Emit("Move", { frame : frame, direction:"next" });
	}
	
	GoToPreviousFrame() {
		var frame = this.Frame(this.state.i);
		var reverse = frame.Reverse();
		
		this.state.RollbackTransitions(frame);
		
		this.Emit("Move", { frame : reverse, direction:"previous"});
	}
	
	Save() {
		return {
			i : this.state.i,
			selection : this.selected
		}
	}
	
	Load(config) {
		this.GoToFrame(config.i);
		
		this.selected = config.selection;
		
		this.Emit("Session", { simulation:this });
	}
	
	onSimulation_Error(message) {
		this.Emit("Error", { error:new Error(message) });
	}
	
	IsSelected(model) {
		return this.selected.indexOf(model) > -1;
	}
	
	Select(model) {
		var idx = this.selected.indexOf(model);
		
		// Already selected
		if (idx != -1) return;
		
		this.selected.push(model);
		
		this.Emit("Selected", { model:model, selected:true });
	}
	
	Deselect(model) {
		var idx = this.selected.indexOf(model);
		
		// Not in current selection
		if (idx == -1) return;
		
		this.selected.splice(idx, 1);
		
		this.Emit("Selected", { model:model, selected:false });
	}
	
	static FromJson(json) {
		throw new Error("function FromJson must be defined in child simulation class.");
	}
}