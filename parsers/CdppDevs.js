'use strict';

import Core from '../../basic-tools/tools/core.js';
import Parser from "./parser.js";
import Transition from './json/transition.js';
import Simulation from './json/simulation.js';

export default class CDppDEVS extends Parser { 
		
	Parse(files) {
		var d = Core.Defer();

		var ma = files.find(function(f) { return f.name.match(/.ma/i); });
		var svg = files.find(function(f) { return f.name.match(/.svg/i); });
		var log = files.find(function(f) { return f.name.match(/.log/i); });

		if (!ma || !log) {
			d.Reject(new Error("A model (.ma) and a log (.log) file must be provided for the CD++ DEVS parser."));
		
			return d.promise;
		}
				
		var name = log.name.substr(0, log.name.length - 4);
		var simulation = new Simulation(name, "CDpp", "DEVS");
		
		var p1 = this.Read(ma, this.ParseMaFile.bind(this));
		var p2 = this.Read(svg, this.ParseSVGFile.bind(this));
		var p3 = this.ReadByChunk(log, this.ParseLogChunk.bind(this));

		var defs = [p1, p2, p3];
	
		Promise.all(defs).then((data) => {
			
			if (!data[0]) return d.Reject(new Error("Unable to parse the model (.ma) file."));
			
			if (!data[2]) return d.Reject(new Error("Unable to parse the log (.log) file or it contained no X and Y messages."));
			
			simulation.models = data[0].models;
			simulation.transitions = data[2];
			simulation.svg = data[1];
			simulation.size = data[0].size;
			simulation.palette = null;
			
			d.Resolve(simulation);
		}, (error) => {
			d.Reject(error);
		});

		return d.promise;
	}

	ParseMaFile(file) {
		var matches = file.match(/\[(.*)\]/g);
		var models = [];
		
		// Remove top from count
		for (var i = 1; i < matches.length; i++) {
			var m = matches[i];
			
			models.push(m.substr(1, m.length - 2));
		}
	
		return {
			size : models.length,
			models : models
		}
	}
	
	ParseSVGFile( file) {	
		return file;
	}
	
	ParseLogChunk(parsed, chunk, progress) {		
		function IndexOf(chunk, text, start) {
			var idx = chunk.indexOf(text, start);
			
			return idx > -1 ? idx : Infinity;
		}
		
		var yStart = IndexOf(chunk, 'Mensaje Y', 0);
		var xStart = IndexOf(chunk, 'Mensaje X', 0);
		
		while (xStart < Infinity || yStart < Infinity) {
			var type = (xStart < yStart) ? 'X' : 'Y';
			
			var start = (type == 'X') ? xStart : yStart;
			
			var end = chunk.indexOf('\n', start);
			
			if (end == -1) end = chunk.length + 1;
			
			var length = end - start;
			
			if (type == 'X') xStart = IndexOf(chunk, 'Mensaje X', start + length);
			if (type == 'Y') yStart = IndexOf(chunk, 'Mensaje Y', start + length);
			
			var split = chunk.substr(start, length).split('/');
			
			var t = split[1].trim();
			var i = split[2].trim().match(/\(([^)]+)\)/)[1];	// id / coordinate
			var m = split[2].trim().match(/^[^\(]+/)[0];		// model name
			var p = split[3].trim();							// port
			var v = parseFloat(split[4]);						// value
			var d = split[4].match(/\(([^)]+)\)/)[1]			// destination

			// NOTE: Here we replace model id by name because name is also unique (are we sure?) but more intuitive. 
			// We do this to allow users to use names when drawing SVG diagrams. This way, names in SVG will match
			// with names in transitions.
			parsed.push(new Transition(type, t, m, m, p, v, d));
		}
		
		return parsed;
	}
}