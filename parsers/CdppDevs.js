'use strict';

import Core from '../../basic-tools/tools/core.js';
import Parser from "./parser.js";
import ChunkReader from '../../basic-tools/components/chunkReader.js';
import TransitionCSV from '../simulation/transitionCSV.js';
import Simulation from '../simulation/simulation.js';

export default class CDppDEVS extends Parser { 
		
	constructor(fileList) {
		super(fileList);
		
		this.svg ;
		this.transitionCSV = [];
		this.models = [];
		this.modelsArray =[];
	}
	
	Parse(files) {
		var d = Core.Defer();
		var simulation = new Simulation();

		var log = files.find(function(f) { return f.name.match(/.log/i); });
		var svg = files.find(function(f) { return f.name.match(/.svg/i); });

		var p1 = this.ParseFileByChunk(log, this.ParseLogChunk.bind(this));

		var p2 = this.ParseFile(svg, this.ParseSVGFile.bind(this));

		var defs = [p1, p2];
	
		Promise.all(defs).then((data) => {
			var info = {
				simulator : "DEVS",
				simulatorName : log.name.replace(/\.[^.]*$/, ''),
			}

			simulation.transition = this.transitionCSV;
			simulation.svg=this.svg;
			simulation.Initialize(info);
			simulation.size = this.models.length;
			
			d.Resolve(simulation);
		}, (errors) => {
			debugger;
		});

		return d.promise;
	}

	ParseSVGFile( file) {	
		this.svg = file;
	}

	ParseLogChunk( chunk, progress) {		
		var lines = [];
		var start = chunk.indexOf('Mensaje Y', 0);
		
		var linesX = [];
		var startX = chunk.indexOf('Mensaje X', 0);

		while (start > -1 && start < chunk.length) {			
			var end = chunk.indexOf('\n', start);
			
			if (end == -1) end = chunk.length + 1;
			
			var length = end - start;
			
			lines.push(chunk.substr(start, length));

			var start = chunk.indexOf('Mensaje Y', start + length);
		}
		
		while (startX > -1 && startX < chunk.length) {
			var endX = chunk.indexOf('\n', startX);

			if (endX == -1) endX = chunk.length + 1;

			var lengthX = endX - startX;

			linesX.push(chunk.substr(startX, lengthX));

			var startX = chunk.indexOf('Mensaje X', startX + lengthX);
		}

		var safe = [];
		
		linesX.forEach(linesX, function(line) {
			var split = line.split("/");

			var frame = split[1].trim();

			var model = split[2].substring(0,  split[2].indexOf('(')).trim();

			var stateValue = parseFloat(split[4]);

			var input = split[3].trim();

			var a = new TransitionCSV(frame, model, stateValue,input,"", "","","");
			
			this.transitionCSV.push(a);
		}.bind(this));


		lines.forEach(lines, function(line) {
			var split = line.split("/");

			var frame = split[1].trim();

			var model = split[2].substring(0,  split[2].indexOf('(')).trim();

			var stateValue = parseFloat(split[4]);

			var output = split[3].trim();

			var a = new TransitionCSV(frame, model, stateValue,"", output,"","","");
			
			this.transitionCSV.push(a);
			this.modelsArray.push(model);
		}.bind(this));

		var j = 0;
		var k = 0;
        var count = 0; 
        var start = false; 
          
        for (j = 0; j < this.modelsArray.length; j++) { 
            for (k = 0; k < this.models.length; k++) { 
                if ( this.modelsArray[j] == this.models[k] ) { 
                    start = true; 
                } 
            } 
			
            count++; 
			
            if (count == 1 && start == false) { 
                this.models.push(this.modelsArray[j]); 
            } 
			
            start = false; 
            count = 0; 
        } 

		return this.transitionCSV;
	}
}