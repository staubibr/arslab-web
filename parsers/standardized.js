'use strict';

import Core from '../../basic-tools/tools/core.js';
import Parser from "./parser.js";
import Transition from './json/transition.js';
import Simulation from './json/simulation.js';

export default class Standardized extends Parser { 
	
	Parse(files) {
		var d = Core.Defer();

		var json = files.find(function(f) { return f.name.match(/.json/i); });
		var csv = files.find(function(f) { return f.name.match(/.csv/i); });
		var svg = files.find(function(f) { return f.name.match(/.svg/i); });

		if (!json || !csv) {
			d.Reject(new Error("A json (.json) and csv (.csv) file must be provided for the standardized DEVS parser."));
		
			return d.promise;
		}

		var p1 = this.Read(json, (content) => JSON.parse(content));
		var p2 = this.Read(svg, (content) => content);
		var p3 = this.ReadByChunk(csv, this.ParseCsvChunk.bind(this));	// Still read by chunk because who knows if FileReader has the same limits as the browser
			
		var defs = [p1, p2, p3];
	
		Promise.all(defs).then((data) => {
			if (!data[0]) return d.Reject(new Error("Unable to parse the json (.json) file."));
			if (!data[2]) return d.Reject(new Error("Unable to parse the csv (.csv) file."));
			
			var json = data[0];
			
			if (json.models) json.models = json.models.map(m => m.toLowerCase());
			
			var simulation = new Simulation(json.name, json.simulator, json.type, data[2], data[1], json.models, json.size, json.palette);
		
			d.Resolve(simulation);
		}, (error) => {
			d.Reject(error);
		});
		
		return d.promise;
	}
	
	ParseCsvChunk(parsed, chunk, progress) {
		var lines = chunk.split("\n");
		
		for (var i = 0; i < lines.length; i++) {
			var s = lines[i].trim().split(",");
			
			s[1] = s[1].toLowerCase();
			s[3] = s[3].toLowerCase();
			s[5] = s[5].toLowerCase();
			
			parsed.push(new Transition(s[0], s[1], s[2], s[3], s[4], s[5], s[6]));
		}
		
		return parsed;
	}
}