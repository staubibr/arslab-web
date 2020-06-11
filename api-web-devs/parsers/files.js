'use strict';

export class Simulation {
	constructor(name, simulator, type, models, size) {
		this.content = {
			name : name || null,
			simulator : simulator || null,
			type : type || null,
			models : models || [],	
			size : size || null
		}
	}
	
	static FromJSON(json) {
		return new Simulation(json.name, json.simulator, json.type, json.models, json.size);		
	}
	
	ToFile() {
		var content = JSON.stringify(this.content);
		
		return new File([content], "simulation.json", { type:"application/json",endings:'native' });
	}
}

export class Diagram {
	constructor(svg) {
		this.content = svg || null;
	}
	
	static FromSVG(svg) {
		return new Diagram(svg);
	}
	
	ToFile() {
		return new File([this.content], "diagram.svg", { type:"image/svg+xml" })
	}
}

export class Options {
	constructor(json) {
		this.content = json || null;
	}
	
	FromJSON(json) {
		return new Options(json);
	}
	
	ToFile() {
		var content = JSON.stringify(this.content);
		
		return new File([content], "options.json", { type:"application/json",endings:'native' });
	}
}

export class Transitions{
	constructor (transitions) {
		this.content = transitions;
	}
	
	ToFile() {
		var content = this.content.map(c => c.ToCSV());
		
		content = content.join("\r\n") + "\r\n";
		
		return new File([content], "transitions.csv", { type:"text/plain",endings:'native' });
	}
}

export class TransitionsDEVS extends Transitions {
	static FromCSV(csv) {
		var transitions = [];
		
		for (var i = 0; i < csv.length; i++) {
			transitions.push(TransitionDEVS.FromCSV(csv[i]));
		}
		
		return new TransitionsDEVS(transitions);
	}
}

export class TransitionsCA extends Transitions {
	static FromCSV(csv) {
		var transitions = [];
		
		for (var i = 0; i < csv.length; i++) {
			transitions.push(TransitionCA.FromCSV(csv[i]));
		}
		
		return new TransitionsCA(transitions);
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
		return new TransitionDEVS(csv[0], csv[1], csv[2], csv[3], csv[4], csv[5]);
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

export class Files { 
	constructor(simulation, transitions, diagram, options) {
		this.name = simulation.content.name;
		this.simulation = simulation;
		this.transitions = transitions;
		this.diagram = diagram;
		this.options = options;
	}
	
	Content() {
		return {
			simulation : this.simulation.content,
			transitions : this.transitions.content,
			diagram : this.diagram.content,
			options : this.options.content,
		}
	}
	
	static FromContent(simulation, transitions, diagram, options) {		
		if (transitions == null) throw new Error("No transitions provided.");
		
		var simulation = Simulation.FromJSON(simulation);
		var diagram = new Diagram(diagram);
		var options = new Options(options);
		
		if (simulation.content.type == "DEVS") {
			var transitions = TransitionsDEVS.FromCSV(transitions);
		}
		else if (simulation.content.type == "Cell-DEVS") {
			var transitions = TransitionsCA.FromCSV(transitions);
		}
		
		else throw new Error("Unrecognized simulation type.");
		
		return new Files(simulation, transitions, diagram, options);
	}
	
	AsFiles() {
		var files = [];
		
		files.push(this.simulation.ToFile());
		files.push(this.transitions.ToFile());
		
		if (this.diagram) files.push(this.diagram.ToFile());
		
		files.push(this.options.ToFile());
		
		return files;
	}
}