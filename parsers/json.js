'use strict';

export class Simulation { 

	constructor(name, simulator, type, transitions, svg, models, size, palette, template) {
		this.name = name || null;
		this.simulator = simulator || null;
		this.type = type || null;
		this.transitions = transitions || [];	
		this.svg = svg || null;
		this.models = models || [];	
		this.size = size || null;	
		this.palette = palette || null;
		this.template = template || null;
	}
	
	Files() {
		var files = [this.JSON(), this.CSV()];
		
		if (this.svg) files.push(this.SVG());
		
		return files;
	}
	
	ToStandardFiles() {
		var std = this.ToStandard();
		var files = [];
		
		files.push(new File([JSON.stringify(std.json)], "simulation.json", { type:"application/json",endings:'native' }));
		files.push(new File([std.csv.join("\r\n") + "\r\n"], "transitions.csv", { type:"text/plain",endings:'native' }));
		
		if (std.svg) files.push(new File([std.svg], "diagram.svg", { type:"image/svg+xml" }));
		
		return files;
	}
	
	ToStandard() {		
		return {
			json : {
				name : this.name,
				simulator : this.simulator,
				type : this.type,
				models : this.models,
				size : this.size,
				palette : this.palette,
				template : this.template
			},
			csv : this.transitions.map(t => t.ToCSV()),
			svg : this.svg
		}
	}
	
	static FromStandard(json, csv, svg) {		
		var transitions = [];
		var tClass = (json.type == "DEVS") ? TransitionDEVS : TransitionCA; 
		
		for (var i = 0; i < csv.length; i++) {
			transitions.push(tClass.FromCSV(csv[i]));
		}
		
		return new Simulation(json.name, json.simulator, json.type, transitions, svg, json.models, json.size, json.palette);
	}
}

export class Transition { 

	constructor(type, time, model, port, destination, value) {
		this.type = type;
		this.time = time;
		this.model = model && model;
		this.port = port && port;
		this.destination = destination && destination;
		this.value = value;
	}
}

export class TransitionDEVS extends Transition {
	constructor(type, time, model, port, destination, value) {
		model = model.toLowerCase();
		port = port.toLowerCase();
		destination = destination.toLowerCase();
		
		super(type, time, model, port, destination, value);
	}
	
	ToCSV() {
		return [this.type, this.time, this.model, this.port, this.destination, this.value].join(",");
	}

	static FromCSV(csv) {
		return new TransitionDEVS(csv[0], csv[1], csv[2], csv[3], csv[4], +csv[5]);
	}
}

export class TransitionCA extends Transition {
	constructor(type, time, model, coord, port, destination, value) {
		super(type, time, model, port, destination, value);
		
		if (coord.length == 2) coord.push(0);
		
		this.coord = coord;
	}
	
	ToCSV() {
		return [this.type, this.time, this.model, this.coord.join("-"), this.port, this.destination, this.value].join(",");
	}

	static FromCSV(csv) {
		var coord = csv[3].split("-").map(c => +c);
		
		return new TransitionCA(csv[0], csv[1], csv[2], coord, csv[4], csv[5], +csv[6]);
	}
}

export class PaletteBucket { 

	constructor(begin, end, color) {
		this.begin = begin;
		this.end = end;
		this.color = color;
	}
}