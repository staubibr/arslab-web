'use strict';

import Core from '../tools/core.js';
import Dom from '../tools/dom.js';
import Evented from '../components/evented.js';
import Nls from './nls.js';

export default class Automator extends Evented { 
	
	get simulation() { return this._simulation; }
	
	get widget() { return this._widget; }

	constructor(widget, simulation) {
		super();
		
		this.nls = this.constructor.Nls ? new Nls(this.constructor.Nls()) : null;
		
		this._simulation = simulation;
		this._widget = widget;
		this._handles = [];
	}

	Handle(handles) {
		this._handles = this._handles.concat(handles);
	}
	
	Destroy() {
		this._handles.forEach((h) => {
			h.target.Off(h.type, h.callback);
		});
		
		this._simulation = null;
		this._widget = null;
		this._handles = null;
	}
	
	Redraw() {
		
	}
};