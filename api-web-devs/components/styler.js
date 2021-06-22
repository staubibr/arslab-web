'use strict';

import Core from '../tools/core.js';
import Evented from '../components/evented.js';

export default class Styler extends Evented { 
	
	get empty() { return this.scales.length == 0 };
	
	constructor(scales) {
		super();
		
		this.scales = scales || [];
	}
	
	GetScale(idx) {
		var scale = this.scales[idx];
		
		if (!scale) throw new Error(`Style #${idx} does not exist.`);
		
		return scale;
	}
		
	GetColor(scale, value) {		
		for (var i = 0; i < scale.buckets.length; i++) {
			var c = scale.buckets[i];
			
			if (value >= c.start && value <= c.end) return `rgb(${c.color.join(",")})`;
		}
	}
}