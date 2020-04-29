'use strict';

import Evented from '../../basic-tools/components/evented.js';
import Palette from './palettes/basic.js';
import State from './state.js';
import Cache from './cache.js';
import Frame from './frame.js';
import Transition from './transition.js';

export default class Simulation extends Evented { 
	
	get Size() { return this.size; }
	
	get Palette() { return this.palette; }
		
	get State() { return this.state; }

	get Selected() { return this.selected; }
	
	get SVG() { return this.svg; }

	constructor(name, simulator, type, frames, diagram, models, size, palette) {
		super();

		this.name = name || null;
		this.simulator = simulator || null;
		this.type = type || null;
		this.frames = frames || [];
		this.diagram = diagram || null;
		this.models = models || [];
		this.size = size || null;
		this.palette = palette || new Palette();
		
		this.index = {};
		this.selected = [];
		this.state = null;
		this.cache = new Cache();
	}
	
	Initialize(nCache) {
		this.BuildCache(nCache);
		this.BuildDifferences();
	}
	
	BuildCache(nCache) {
		var zero = State.Zero(this.models);
		
		this.cache.Build(nCache, this.frames, zero);
		
		this.state = this.cache.First();
	}
	
	BuildDifferences() {		
		var state = State.Zero(this.models);
		
		this.frames.forEach((f) => f.Difference(state));
	}
	
	GetGridState(i) {
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
		this.state = this.GetGridState(i);
		
		this.Emit("Jump", { state:this.state });
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
		
		this.Emit("Move", { frame : reverse, direction:"previous" });
	}
	
	StartRecord() {
		this.Emit("RecordStart");
	}
	
	StopRecord() {
		this.Emit("RecordStop");
	}
	
	Save() {
		return {
			i : this.state.i,
			selection : this.selected,
			palette : this.palette.Save()
		}
	}
	
	Load(config) {
		this.GoToFrame(config.i);
		
		this.selected = config.selection;
		this.palette.Load(config.palette);
		
		this.Emit("Session", { simulation:this });
	}
	
	LoopOnSize(delegate) {
		for (var i = 0; i < this.size; i++) {
			delegate(i);
		}
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
		var simulation = new Simulation(json.name, json.simulator, json.type, null, json.svg, json.models, json.size, null);
		
		// build frames from flat transitions list		
		for (var i = 0; i < json.transitions.length; i++) {
			var t = json.transitions[i];
			var f = simulation.Index(t.time) || simulation.AddFrame(new Frame(t.time));
			
			f.AddTransition(new Transition(t.type, t.model, t.id, t.port, t.value, t.destination));
		} 
		
		// Palette needs to be constructed.		
		if (json.palette) json.palette.forEach(p => simulation.palette.AddClass(p.begin, p.end, p.color));
		
		return simulation;
	}
}