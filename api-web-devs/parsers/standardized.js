'use strict';

import Core from '../tools/core.js';
import Parser from "./parser.js";
import Settings from "../components/settings.js";

import { Simulation, Files } from './files.js';

export default class Standardized extends Parser { 
	
	Parse(files) {
		var d = Core.Defer();

		var simulation = files.find(function(f) { return f.name == 'simulation.json'; });
		var transitions = files.find(function(f) { return f.name == 'transitions.csv'; });
		var svg = files.find(function(f) { return f.name == 'diagram.svg'; });
		var options = files.find(function(f) { return f.name == 'options.json'; });

		if (!simulation || !transitions) {
			d.Reject(new Error("A simulation (.json) and transitions (.csv) file must be provided for the standardized DEVS parser."));
		
			return d.promise;
		}

		var p1 = this.Read(simulation, (content) => JSON.parse(content));
		var p2 = this.Read(svg, (content) => content);
		var p3 = this.ReadByChunk(transitions, this.ParseCsvChunk.bind(this));	// Still read by chunk because who knows if FileReader has the same limits as the browser
		var p4 = this.Read(options, (content) => JSON.parse(content));
		
		var defs = [p1, p2, p3, p4];
		
		Promise.all(defs).then((data) => {
			if (!data[0]) return d.Reject(new Error("Unable to parse the simulation (.json) file."));
			if (!data[2]) return d.Reject(new Error("Unable to parse the transitions (.csv) file."));
			
			var files = Files.FromContent(data[0], data[2], data[1], data[3]);
			
			d.Resolve(files);
		}, (error) => {
			d.Reject(error);
		});
		
		return d.promise;
	}
}