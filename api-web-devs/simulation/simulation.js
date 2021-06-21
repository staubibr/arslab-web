'use strict';

import Evented from '../components/evented.js';
import Cache from './cache.js';

export default class Simulation extends Evented { 
	
	get structure() { return this._structure; }
	
	get name() { return this.structure.info.name; }
	
	get type() { return this.structure.info.type; }
	
	get models() { return this.structure.models; }
	
	get timestep() { return this.state.i; }
	
	get state() { return this._state; }
	set state(value) { this._state = value; }
	
	get cache() { return this._cache; }

	get selected() { return this._selected; }
	
	get frames() { return this._frames; }

	get current_frame() { return this.frames[this.timestep]; }
	
	get first_frame() { return this.frames[0]; }
	
	get last_frame() { return this.frames[this.frames.length - 1]; }
	
	get ratio() { 
		throw new Error("get ratio must be defined in child simulation class.");
	}

	constructor(structure, frames) {
		super();
		
		this._structure = structure
		
		// class variables with accessors
		this._state = null;
		this._cache = new Cache();
		this._selected = [];
		this._frames = [];
		this._frame_index = {};
		
		for (var i = 0; i < frames.length; i++) this.AddFrame(frames[i]);
	}
	
	// TODO REVIEW
	Initialize(nCache) {
		this.state.Reset();
		
		this.cache.Build(nCache, this.frames, this.state);
		
		this.state.Reset();
		
		for (var i = 0; i < this.frames.length; i++) {
			this.frames[i].Difference(this.state);
			this.state.ApplyMessages(this.frames[i]);
		}
		
		this.state = this.cache.First();
	}

	Model(id) {
		return this.structure.Model(id);
	}
	
	Port(mId, pName) {
		return this.structure.Port(mId, pName);
	}
	
	State(i) {
		if (i == this.frames.length - 1) return this.cache.Last();
		
		if (i == 0) return this.cache.First();
		
		var cached = this.cache.GetClosest(i);
		
		for (var j = cached.i + 1; j <= i; j++) {
			cached.Forward(this.frames[j]);
		}
		
		return cached;
	}
	
	Frame(time) {
		return this._frame_index[time] || null;
	}
	
	AddFrame(frame) {		
		this.frames.push(frame);
		
		this._frame_index[frame.time] = frame;
		
		return frame;
	}
	
	GoToFrame(i) {
		this.state = this.State(i);
		
		this.Emit("Jump", { state:this.state, i: i });
	}
	
	GoToNextFrame() {
		var frame = this.frames[this.timestep + 1];
		
		this.state.Forward(frame);
		
		this.Emit("Move", { frame : frame, direction:"next" });
	}
	
	GoToPreviousFrame() {
		var frame = this.frames[this.state.i].Reverse();
		
		this.state.Backward(frame);
		
		this.Emit("Move", { frame : frame, direction:"previous"});
	}
	
	GetSelected(model) {
		return this.selected.find(s => s == model);
	}
	
	GetSelectedIndex(model) {
		return this.selected.indexOf(this.GetSelected(model));
	}
	
	IsSelected(model) {
		return !!this.GetSelected(model);
	}
	
	Select(model) {
		var item = this.GetSelected(model);
		
		// Already selected
		if (item) return;
		
		this.selected.push(model);
		
		this.Emit("Selected", { model:model, selected:true });
	}
	
	Deselect(model) {
		var idx = this.GetSelectedIndex(model);
		
		// Already not selected
		if (idx == -1) return;
		
		this.selected.splice(idx, 1);
		
		this.Emit("Selected", { model:model, selected:false });
	}
	
	// TODO: This doesn't belong here, only used for style.js
	EachMessage(delegate) {
		for (var i = 0; i < this.frames.length; i++) {
			var f = this.frames[i];
			
			for (var j = 0; j < f.state_messages.length; j++) {
				var t = f.state_messages[j];
				
				delegate(t, f);
			}
		}
	}
}