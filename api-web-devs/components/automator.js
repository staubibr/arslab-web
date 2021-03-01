'use strict';

import Core from '../tools/core.js';
import Dom from '../tools/dom.js';
import Evented from '../components/evented.js';
import Nls from './nls.js';

export default class Automator extends Evented { 
	
	get Simulation() { return this.simulation; }
	
	get Widget() { return this.widget; }

	constructor(widget, simulation) {
		super();
		
		this.nls = this.constructor.Nls ? new Nls(this.constructor.Nls()) : null;
		
		this.simulation = simulation;
		this.widget = widget;
		this.handles = [];
	}

	Handle(handles) {
		this.handles = this.handles.concat(handles);
	}
	
	Destroy() {
		this.handles.forEach((h) => {
			h.target.Off(h.type, h.callback);
		});
		
		this.simulation = null;
		this.widget = null;
		this.handles = null;
	}
	
	Redraw() {
		
	}
};