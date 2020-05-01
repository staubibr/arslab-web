'use strict';

import Core from '../../basic-tools/tools/core.js';
import Parser from "./parser.js";
import Transition from './json/transition.js';
import PaletteBucket from './json/paletteBucket.js';
import Simulation from './json/simulation.js';

import State from '../simulation/state.js';

export default class CDpp extends Parser { 
	
	Parse(files) {
		var d = Core.Defer();
		
		var val = files.find(function(f) { return f.name.match(/\.val/i); });
		var pal = files.find(function(f) { return f.name.match(/\.pal/i); });
		var ma = files.find(function(f) { return f.name.match(/\.ma/i); });
		var log = files.find(function(f) { return f.name.match(/\.log/i); });
		
		if (!ma || !log) {
			d.Reject(new Error("A model (.ma) and a log (.log) file must be provided for the CD++ Cell-DEVS parser."));
		
			return d.promise;
		}
		
		var name = ma.name.substr(0, ma.name.length - 3);
		var simulation = new Simulation(name, "CDpp", "Cell-DEVS");
		
		var p1 = this.Read(val, this.ParseValFile.bind(this));
		var p2 = this.Read(pal, this.ParsePalFile.bind(this));
		var p3 = this.Read(ma, this.ParseMaFile.bind(this));
		var p4 = this.ReadByChunk(log, this.ParseLogChunk.bind(this));
			
		var defs = [p1, p2, p3, p4];
	
		Promise.all(defs).then((data) => {
			var val = data[0];
			var ma = data[2];
			
			if (!data[2]) return d.Reject(new Error("Unable to parse the model (.ma) file."));
			
			if (!data[3]) return d.Reject(new Error("Unable to parse the log (.log) file or it contained no X and Y messages."));
						
			// Other simulators probably don't have to merge, CDpp-Cell-DEVS is complicated (val, global value, initial value, row value, etc.)
			var initial = this.MergeFrames(ma.initial.global, ma.initial.rows);
			
			if (val) initial = this.MergeFrames(initial, val);
			
			if (initial.length > 0) {
				var transitions = initial.map(t => {
					return new Transition("Y", "00:00:00:000", ma.model, t.id, null, t.value, null);
				});
			}
			
			simulation.transitions = transitions.concat(data[3]);
			simulation.palette = data[1];
			simulation.size = ma.size;
			
			d.Resolve(simulation);
		}, (error) => {
			d.Reject(error);
		});
		
		return d.promise;
	}
	
	ParseValFile(file) {
		// Each line looks like this: (y,x,z)=value
		return file.trim().split(/\n/).map(function(line) {
			if (line.length < 4) return; // probably empty line
			
			var cI = line.indexOf('('); // coordinate start
			var cJ = line.indexOf(')'); // coordinate end
			var vI = line.indexOf('='); // value start
			
			var id = line.substring(cI + 1, cJ).replace(/,/g, "-");
			var value = parseFloat(line.substr(vI + 1));
			
			return { id:id, value:value };
		}.bind(this));
	}
	
	ParsePalFile(file) {	
		var lines = file.trim().split(/\n/);
				
		if (lines[0].indexOf('[') != -1) return this.ParsePalTypeA(lines);
			
		else return this.ParsePalTypeB(lines);
	}	
	
	ParseMaFile(file) {
		var ma = {}
		
		var dim = null;
		var raw = file.match(/dim\s*:\s*\((.+)\)/);
		
		if (raw) dim = raw[1].split(",")
		
		else {
			var raw_h = file.match(/height\s*:\s*(.+)/);
			var raw_w = file.match(/width\s*:\s*(.+)/);
			
			dim = [raw_h[1], raw_w[1]];
		}
		
		if (dim.length == 2) dim.push(1);
		
		var size = [+dim[0], +dim[1], +dim[2]];
		
		for (var x = 0; x < size[0]; i++) 
		
		return {
			size : size,
			initial : {
				global : this.GlobalFrame(size, file),
				rows : this.RowsFrame(file)
			}
		}
	}
	
	MergeFrames(f1, f2) {
		var index = {};
		
		f1.forEach(t => index[t.id] = t);
		
		// f2 over f1, modifies f1, who cares.
		f2.forEach(function(t2) {
			// frame 1 has transition id from frame 2, replace
			if (index[t2.id])  {
				index[t2.id].value = t2.value;
				index[t2.id].diff = t2.diff;
			}
			
			// frame 1 doesn't have transition id from frame 2, add it
			else f1.push(t2);
		});
		
		return f1;
	}
	
	GlobalFrame(size, file) {
		var f = [];
		var raw = file.match(/initialvalue\s*:\s*(.+)/);
		
		if (!raw || raw[1] == "0") return f;
		
		for (var x = 0; x < size[0]; x++) {
			for (var y = 0; y < size[1]; y++) {
				for (var z = 0; z < size[2]; z++) {
					f.push({ id:[x, y, z].join("-"), value:+raw[1] });
				}
			}
		}
		
		return f;
	}
	
	RowsFrame(file) {
		var raw = file.matchAll(/initialrowvalue\s*:\s*(.+)/g);
		var f = [];
		
		for (var r of raw) {
			var d = r[1].split(/\s+/);
			var values = d[1].split('');
			
			for (var y = 0; y < values.length; y++) {
				var v = +values[y];
				
				if (v == 0) continue;
				
				f.push({ id:[d[0], y].join("-"), value:v });
			}
		}
		
		return f;
	}
	
	ParsePalTypeA(lines) {		
		// Type A: [rangeBegin;rangeEnd] R G B
		return lines.map(function(line) { 
			// skip it it's probably an empty line
			if (line.length < 7) return;
			
			var begin = parseFloat(line.substr(1));
			var end   = parseFloat(line.substr(line.indexOf(';') + 1));
			var rgb = line.substr(line.indexOf(']') + 2).trim().split(' ');
			
			// clean empty elements
			for (var j = rgb.length; j-- > 0;) {
				if (rgb[j].trim() == "") rgb.splice(j, 1);
			}			
			
			// Parse as decimal int
			var r = parseInt(rgb[0], 10);
			var g = parseInt(rgb[1], 10);
			var b = parseInt(rgb[2], 10);
			
			return new PaletteBucket(begin, end, [r, g, b]);
		});
	}
	
	ParsePalTypeB(lines) {
		// Type B (VALIDSAVEFILE: lists R,G,B then lists ranges)
		var palette = [];
		var paletteRanges = [];
		var paletteColors =[];
		
		for (var i = lines.length; i-->0;){
			// check number of components per line
			var components = lines[i].split(',');
			
			if(components.length == 2) {
			// this line is a value range [start, end]
				// Use parseFloat to ensure we're processing in decimal not oct
				paletteRanges.push([parseFloat(components[0]), parseFloat(components[1])]); 
			}
			else if (components.length == 3){ 
			// this line is a palette element [R,G,B]
				// Use parseInt(#, 10) to ensure we're processing in decimal not oct
				paletteColors.push([parseInt(.95*parseInt(components[0],10)), 
									parseInt(.95*parseInt(components[1],10)), 
									parseInt(.95*parseInt(components[2],10))]); 
			}
		}

		// populate grid palette object
		for (var i = paletteRanges.length; i-- > 0;){			
			palette.push(new PaletteBucket(paletteRanges[i][0], paletteRanges[i][1], paletteColors[i]));
		}
		
		return palette;
	}
		
	ParseLogChunk(parsed, chunk, progress) {		
		var lines = [];
		var start = chunk.indexOf('Mensaje Y', 0);		
		
		while (start > -1) {	
			var end = chunk.indexOf('\n', start);
			
			if (end == -1) end = chunk.length + 1;
			
			var length = end - start;
			var split = chunk.substr(start, length).split("/");
			
			// Parse coordinates, state value & frame timestamp
			var tmp = split[2].trim().split("(")
			
			// NOTE : Don't use regex, it's super slow.
			var t = split[1].trim();							// time
			var m = tmp[0];										// model name
			var c = tmp[1].slice(0, -1);						// id / coordinate
			var p = split[3].trim();							// port
			var v = parseFloat(split[4]);						// value
			var d = split[4].trim().split("(")[1].slice(0,-1)	// destination
			
			c = c.replace(/,/g, "-");
			
			parsed.push(new Transition("Y", t, m, c, p, v, d));
			
			var start = chunk.indexOf('Mensaje Y', start + length);
		};
				
		return parsed;
	}
}