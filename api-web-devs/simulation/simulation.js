'use strict';

import Evented from '../components/evented.js';
import Cache from './cache.js';
import Frame from './frame.js';
import Model from './model.js';
import Message from './message.js';

export default class Simulation extends Evented { 
	
	get TimeStep() { return this.State.i; }
	
	get Name() { return this.info.name; }
	
	get Type() { return this.info.type; }
	
	get Simulator() { return this.info.simulator; }
	
	get State() { return this.state; }
	
	set State(value) { this.state = value; }
	
	get Cache() { return this.cache; }

	get Selected() { return this.selected; }
	
	get Frames() { return this.frames; }

	get CurrentFrame() { return this.Frames[this.TimeStep]; }
	
	get FirstFrame() { return this.Frames[0]; }
	
	get LastFrame() { return this.Frames[this.Frames.length - 1]; }
	
	get Models() { return this.models; }

	get AtomicModels() { return this.Models.filter(m => m.Type == "atomic"); }

	get CoupledModels() { return this.Models.filter(m => m.Type == "coupled"); }

	get ModelIds() { return this.Models.map(m => m.Id); }
	
	get Ratio() { 
		throw new Error("get Ratio must be defined in child simulation class.");
	}

	constructor(structure, messages) {
		super();
		
		this.info = structure.info;
		
		// class variables with accessors
		this.time = -1;
		this.state = null;
		this.cache = new Cache();
		this.selected = [];
		this.frames = [];
		this.models = structure.models;
		
		// class variables meant to be private
		this.index = {};
		
		this.BuildModels();
		
		this.LoadOutputMessages(messages.output);
		this.LoadStateMessages(messages.state);
	}
	
	BuildModels() {
		this.Models.forEach(m => {
			m.Ports.forEach(p => p.Model = m);
			
			m.Links.forEach(l => {
				l.ModelB = this.Model(l.ModelB);
				l.PortB = this.Port(l.ModelB.Id, l.PortB);
				l.PortA = this.Port(m.Id, l.PortA);				
			});
		});
	}
	
	LoadOutputMessages(messages) {
		// Add frames from flat messages list			
		for (var i = 0; i < messages.length; i++) {
			var m = messages[i];
			var emitter = this.Port(m.model, m.port);
			var message	= new Message(emitter, m.value);		
			
			this.AddOutputMessage(m.time, message);
		}		
	}
	
	LoadStateMessages(messages) {
		// Add frames from flat messages list			
		for (var i = 0; i < messages.length; i++) {
			var m = messages[i];
			var emitter = this.Model(m.model);
			var message	= new Message(emitter, m.value);		
			
			this.AddStateMessage(m.time, message);
		}
	}
	
	// TODO REVIEW
	Initialize(nCache) {
		this.State.Reset();
		
		this.Cache.Build(nCache, this.Frames, this.State);
		
		this.State.Reset();
		
		for (var i = 0; i < this.Frames.length; i++) {
			this.Frames[i].Difference(this.State);
			this.State.ApplyMessages(this.Frames[i]);
		}
		
		this.State = this.Cache.First();
	}

	Model(name) {
		return this.Models.find(m => name == m.Id) || null;
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
	
	GetFrame(time) {
		return this.index[time] || null;
	}
	
	AddMessage(time, message, type) {
		var f = this.GetFrame(time) || this.AddFrame(new Frame(time));
		
		f.AddMessage(message, type);
	}
	
	AddOutputMessage(time, message) {		
		this.AddMessage(time, message, "output");
	}
	
	AddStateMessage(time, message) {		
		this.AddMessage(time, message, "state");
	}
	
	GetState(i) {
		if (i == this.Frames.length - 1) return this.Cache.Last();
		
		if (i == 0) return this.Cache.First();
		
		var cached = this.Cache.GetClosest(i);
		
		for (var j = cached.i + 1; j <= i; j++) {
			cached.Forward(this.Frames[j]);
		}
		
		return cached;
	}
	
	GoToFrame(i) {
		this.State = this.GetState(i);
		
		this.Emit("Jump", { state:this.State, i: i });
	}
	
	GoToNextFrame() {
		var frame = this.Frames[this.TimeStep + 1];
		
		this.State.Forward(frame);
		
		this.Emit("Move", { frame : frame, direction:"next" });
	}
	
	GoToPreviousFrame() {
		var frame = this.Frames[this.State.i].Reverse();
		
		this.State.Backward(frame);
		
		this.Emit("Move", { frame : frame, direction:"previous"});
	}
	
	IsSelected(model) {
		return this.Selected.indexOf(model) > -1;
	}
	
	Select(model) {
		var idx = this.Selected.indexOf(model);
		
		// Already selected
		if (idx != -1) return;
		
		this.Selected.push(model);
		
		this.Emit("Selected", { model:model, selected:true });
	}
	
	Deselect(model) {
		var idx = this.Selected.indexOf(model);
		
		// Not in current selection
		if (idx == -1) return;
		
		this.Selected.splice(idx, 1);
		
		this.Emit("Selected", { model:model, selected:false });
	}
	
	// TODO: This doesn't belong here, only used for style.js
	EachMessage(delegate) {
		for (var i = 0; i < this.Frames.length; i++) {
			var f = this.Frames[i];
			
			for (var j = 0; j < f.StateMessages.length; j++) {
				var t = f.StateMessages[j];
				
				delegate(t, f);
			}
		}
	}
	
	onSimulation_Error(message) {
		this.Emit("Error", { error:new Error(message) });
	}
	
	static FromJson(json) {
		throw new Error("function FromJson must be defined in child simulation class.");
	}
}