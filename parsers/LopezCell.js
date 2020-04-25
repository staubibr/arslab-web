'use strict';

import Core from '../../basic-tools/tools/core.js';
import Parser from "./parser.js";
import ChunkReader from '../../basic-tools/components/chunkReader.js';
import TransitionCSV from '../simulation/transitionCSV.js';
import Simulation from '../simulation/simulation.js';

export default class LopezCell extends Parser { 
	
	constructor(files) {
		super(files);
	}

	Parse(files) {
		var d = Core.Defer();

		var simulation = new Simulation();

		var log = files.find(function(f) { return f.name.match(/.log/i); });

		var p = this.ParseFileByChunk(log, this.ParseLogChunk.bind(this));
			
		var defs = [p];
	
		Promise.all(defs).then((data) => {
			var info = {
				simulator : "Lopez",
				name : log.name.replace(/\.[^.]*$/, ''),
				files : files,
			}

			simulation.transition = this.transitionCSV;
			simulation.Initialize(info);

			d.Resolve(simulation);
		});
		
		return d.promise;
	}
		
	ParseLogChunk(chunk, progress) {
		var lines = [];
		var start = chunk.indexOf('0 / L / Y', 0);
							
		while (start > -1 && start < chunk.length) {			
			var end = chunk.indexOf('\n', start);
			
			if (end == -1) end = chunk.length + 1;
			
			var length = end - start;
			
			lines.push(chunk.substr(start, length));

			var start = chunk.indexOf('0 / L / Y', start + length);
		}
				
		lines.forEach(function(line) {
			var split = line.split("/");
			
			// Parse coordinates
			var i = split[4].indexOf('(');
			var j = split[4].indexOf(')');
			var c = split[4].substring(i + 1, j).split(',');
			
			// TODO : Does this ever happen?
			if (c.length < 2) return;
			
			// Parse coordinates, state value, timestamp used as id
			var coord = this.GetCoord(c);
			var v = parseFloat(split[6]);
			var fId = split[3].trim();
			
			var a = new TransitionCSV(fId, "", v,"", "","","",v,coord);
			
			this.transitionCSV.push(a);	
		}.bind(this));
		
		return this.transitionCSV;
	}
	
	GetCoord(sCoord) {
		// Parse coordinates
		var x = parseInt(sCoord[1],10);
		var y = parseInt(sCoord[0],10);
		var z = parseInt(sCoord.length==3 ? sCoord[2] : 0, 10);
		
		return [x, y, z];
	}
}