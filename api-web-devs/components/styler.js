'use strict';

import Core from '../tools/core.js';
import Evented from '../components/evented.js';
import Scale from './scales/basic.js';

export default class Styler extends Evented { 
	
	constructor(scales) {
		super();
		
		this.scales = scales || [];
	}
		
	ToJson() {
		return this.scales.map(s => s.ToJson());
	}
	
	AddScale(scale) {
		this.scales.push(scale);
	}
	
	GetScale(idx) {
		var scale = this.scales[idx];
		
		if (!scale) throw new Error(`Style #${idx} does not exist.`);
		
		return scale;
	}
	
	GetColor(idx, value) {				
		return this.GetScale(idx).GetColor(value);
	}
	
	static FromJson(json) {
		var styler = new Styler();		
		
		json.forEach(classes => {
			var scale = new Scale(classes);
			
			styler.AddScale(scale);
		});
		
		return styler;
	}
}