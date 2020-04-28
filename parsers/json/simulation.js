'use strict';

export default class Simulation { 

	constructor(name, simulator, type, transitions, svg, models, size, palette) {
		this.name = name || null;
		this.simulator = simulator || null;
		this.type = type || null;
		this.transitions = transitions || [];	
		this.svg = svg || null;
		this.models = models || [];	
		this.size = size || null;	
		this.palette = palette || null;
	}
	
	JSON() {
		var json = {
			name : this.name,
			simulator : this.simulator,
			type : this.type,
			models : this.models,
			size : this.size,
			palette : this.palette
		}
		
		return new File([JSON.stringify(json)], "simulation.json", { type:"application/json",endings:'native' });
	}
	
	CSV() {
		var transitions = this.transitions.map(t => t.ToCSV());
		
		return new File([transitions.join("\r\n") + "\r\n"], "transitions.csv", { type:"text/plain",endings:'native' });
	}
	
	SVG() {
		if (!this.svg) return null;
		
		return new File([this.svg], "diagram.svg", { type:"image/svg+xml" });
	}
	
	Files() {
		var files = [this.JSON(), this.CSV()];
		
		if (this.svg) files.push(this.SVG());
		
		return files;
	}
}