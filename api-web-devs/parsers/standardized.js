'use strict';

import Core from '../tools/core.js';
import Parser from "./parser.js";
import Settings from "../components/settings.js";

import { Simulation, TransitionDEVS, TransitionsDEVS, TransitionCA, TransitionsCA, Diagram, Options, Files } from './files.js';

export default class Standardized extends Parser { 
	
	Parse(files) {
		var d = Core.Defer();

		var simulation = files.find(function(f) { return f.name == 'structure.json'; });
		var transitions = files.find(function(f) { return f.name == 'messages.log'; });
		var svg = files.find(function(f) { return f.name == 'diagram.svg'; });
		var options = files.find(function(f) { return f.name == 'options.json'; });

		if (!simulation || !transitions) {
			d.Reject(new Error("A simulation (.json) and transitions (.csv) file must be provided for the standardized DEVS parser."));
		
			return d.promise;
		}

		this.Read(simulation, this.ParseStructure.bind(this)).then(struc => {
			this.ports = struc.ports;
			this.simulation = new Simulation(struc.info.name, struc.info.simulator, struc.info.type, struc.models, struc.size);
			
			var p1 = this.Read(svg, (content) => content);
			var p2 = this.ReadByChunk(transitions, this.ParseLogChunk.bind(this));
			var p3 = this.Read(options, (content) => JSON.parse(content));
			
			var defs = [p1, p2, p3];
		
			Promise.all(defs).then((data) => {				
				if (!data[1]) return d.Reject(new Error("Unable to parse the messages (.log) file."));
				
				var transitions = this.simulation.content.type == "DEVS" ? new TransitionsDEVS(data[1]) : new TransitionsCA(data[1]);
				var diagram = new Diagram(data[0]);
				var options = new Options(data[2]);
				
				var files = new Files(this.simulation, transitions, diagram, options);
				
				d.Resolve(files);
			}, (error) => {
				d.Reject(error);
			});
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
		
		if (json.ports) json.ports.forEach(p => index[p.model].ports.push(p));
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
			var t = messages[0];
			
			for (var i = 1; i < messages.length; i++) {
				var v = messages[i].split(",");
				
				if (v.length == 2) {
					var p = this.ports[v[0]];
					
					parsed.push(new TransitionDEVS(t, p.model, p.name, v[1]));
				}
				else if (v.length == 5) {
					var c = [v[0],v[1],v[2]];
					var p = this.ports[v[3]];
					
					parsed.push(new TransitionCA(t, p.model, c, p.name, v[4]));
				}
				else {
					throw new Error("Message format not recognized.");
				}
			}
		});
		
		return parsed;
	}
}