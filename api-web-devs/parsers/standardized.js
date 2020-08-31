'use strict';

import Core from '../tools/core.js';
import Parser from "./parser.js";
import Settings from "../components/settings.js";
import SimulationDEVS from "../simulation/simulationDEVS.js";
import SimulationCA from "../simulation/simulationCA.js";
import Model from "../simulation/model.js";

export default class Standardized extends Parser { 
	
	Parse(files) {
		var d = Core.Defer();

		var structure = files.find(function(f) { return f.name == 'structure.json'; });
		var messages = files.find(function(f) { return f.name == 'messages.log'; });
		var diagram = files.find(function(f) { return f.name == 'diagram.svg'; });
		var style = files.find(function(f) { return f.name == 'style.json'; });

		if (!structure || !messages) {
			d.Reject(new Error("A structure (.json) and messages (.log) file must be provided for the standardized DEVS parser."));
		
			return d.promise;
		}

		this.Read(structure, this.ParseStructure.bind(this)).then(response => {
			this.structure = response;
			
			var type = this.structure.info.type;
			
			if (type == "DEVS" && !diagram) return d.Reject(new Error("Unable to parse the diagram (.svg) file."));
			
			var p1 = this.ReadByChunk(messages, this.ParseLogChunk.bind(this));
			var p2 = this.Read(diagram, (content) => content);
			var p3 = this.Read(style, (content) => JSON.parse(content));
			
			Promise.all([p1, p2, p3]).then((data) => {			
				if (!data[0]) return d.Reject(new Error("Unable to parse the messages (.log) file."));
				
				var simulation = null;
				
				if (type == "DEVS") simulation = SimulationDEVS.FromJson(this.structure, data[0], data[1]);
				if (type == "Cell-DEVS") simulation = SimulationCA.FromJson(this.structure, data[0]);
				
				var oFiles = { structure:structure, messages:messages }
				
				if (diagram) oFiles.diagram = diagram;
				if (style) oFiles.style = style;
				
				d.Resolve({ simulation:simulation, style:data[2], files:oFiles });
			}, (error) => d.Reject(error));
		});
		
		return d.promise;
	}
	
	ParseStructure(file) {
		var json = JSON.parse(file);
		var index = {};
		
		var size;
		
		var models = json.nodes.map(n => {
			index[n.name] = n
			
			if (!n.submodels) n.submodels = [];
			
			n.ports = [];
			n.links = [];
			
			// TODO: This doesn't work, size can be per model but the API uses a single size for the whole simulation.
			if (n.size) size = n.size;
			
			return index[n.name];
		});
		
		if (!size) size = models.length;
		
		if (json.ports) json.ports.forEach(p => {
			// When a DEVS model is connected to a Cell-DEVS model, there will be ports linked to the main model with coords, 
			// these are not in the models list. It has to be fixed someday.
			var model = index[p.model];
			
			if (!model) return;
			
			model.ports.push(p)
		});
		
		if (json.links) json.links.forEach(l => index[l.modelA].links.push(l));
		
		return {
			ports: json.ports, 
			info: json.info,
			models: models,
			size : size
		};
	}
	
	ParseLogChunk(parsed, chunk) {
		chunk.split("\n").forEach(l => {
			var messages = l.split(";");
			
			for (var i = 1; i < messages.length; i++) {
				var v = messages[i].split(",");
					
				if (v.length == 2) {
					var p = this.structure.ports[v[0]];
					
					parsed.push({ time:messages[0], model:p.model, port:p.name, value:v[1] });
				}
				else if (v.length == 5) {
					var c = [v[0],v[1],v[2]];
					var p = this.structure.ports[v[3]];
					
					parsed.push({ time:messages[0], coord:c, model:p.model, port:p.name, value:v[4] });
				}
				else {
					throw new Error("Message format not recognized.");
				}
			}
		});
		
		return parsed;
	}
}