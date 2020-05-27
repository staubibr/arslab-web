'use strict';

import Core from '../../api-basic/tools/core.js';
import Parser from "./parser.js";

import { Simulation, PaletteBucket } from './json.js';

export default class Standardized extends Parser { 
	
	Parse(files) {
		var d = Core.Defer();

		var json = files.find(function(f) { return f.name == 'simulation.json'; });
		var csv = files.find(function(f) { return f.name == 'transitions.csv'; });
		var svg = files.find(function(f) { return f.name == 'diagram.svg'; });

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
			
			d.Resolve(Simulation.FromStandard(data[0], data[2], data[1]));
		}, (error) => {
			d.Reject(error);
		});
		
		return d.promise;
	}
}