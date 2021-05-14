'use strict';

import Core from '../tools/core.js';
import Evented from "../components/evented.js";
import ChunkReader from "../components/chunkReader.js";
import Structure from "../components/parsing/structure.js";
import SimulationDEVS from "../simulation/simulationDEVS.js";
import SimulationCA from "../simulation/simulationCA.js";
import SimulationIRR from "../simulation/simulationIRR.js";
import Model from "../simulation/model.js";

export default class Parser extends Evented { 
	
	ReadByChunk(file, delegate) {		
		return ChunkReader.ReadByChunk(file, "\n", (parsed, chunk, progress) => {
			if (!parsed) parsed = [];
		
			parsed = delegate(parsed, chunk);
			
			this.Emit("Progress", { progress: progress });
			
			return parsed;
		});
	}
		
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

		ChunkReader.Read(structure, this.ParseStructure.bind(this)).then(response => {
			this.structure = response;
			
			var type = this.structure.info.type;
			
			this.t = null;
			
			var p1 = this.ReadLog(messages);
			var p2 = ChunkReader.Read(diagram, (content) => content);
			var p3 = ChunkReader.Read(style, (content) => JSON.parse(content));
			
			Promise.all([p1, p2, p3]).then((data) => {			
				if (!data[0]) return d.Reject(new Error("Unable to parse the messages (.log) file."));
				
				var simulation = null;
				
				if (type == "DEVS" || type == "GIS-DEVS") simulation = new SimulationDEVS(this.structure, data[0], data[1]);
				if (type == "Cell-DEVS") simulation = new SimulationCA(this.structure, data[0]);
				// if (type == "Irregular Cell-DEVS") simulation = new SimulationIRR(this.structure, data[0]);
				
				d.Resolve({ simulation:simulation, style:data[2] || null });
			}, (error) => d.Reject(error));
		});
		
		return d.promise;
	}
	
	ParseStructure(file) {
		var json = JSON.parse(file);
		
		return Structure.FromJson(json);
	}
	
	ReadLog(file) {
		return ChunkReader.ReadByChunk(file, "\n", (parsed, chunk, progress) => {
			if (parsed == null) parsed = { state:[], output:[] };
			
			parsed = this.ParseLogChunk(parsed, chunk);
			
			this.Emit("Progress", { progress: progress });
			
			return parsed;
		});
	}
	
	ParseLogChunk(parsed, chunk) {
		// If line has only one item, then it's a timestep. Otherwise, it's a simulation message, 
		// the format then depends on the whether it's a DEVS, Cell-DEVS or Irregular model
		var lines = chunk.split("\n");
		
		for (var i = 0; i < lines.length; i++) {
			var v = lines[i].trim().split(",");
			
			if (v.length == 1) this.t = v[0];
			
			else if (this.structure.info.type == "GIS-DEVS") {
				var node = this.structure.nodes[v[0]];
				
				if (node.port != undefined) {
					var type = this.structure.portTypes[node.port];
					var data = this.structure.TemplateData(type, v.slice(1));
					
					parsed.output.push({ time:this.t, model:node.model, port:type.name, value:data });
				}
				
				else if (node.id != undefined) {
					var type = this.structure.modelTypes[node.model];
					var data = this.structure.TemplateData(type, v.slice(1));
				
					parsed.state.push({ time:this.t, model:node.id, value:data });
				}
				
				else if (node.cell != undefined) {
					var cell = [+v[0],+v[1],+v[2]];
					var type = this.structure.modelTypes[0];
					var data = this.structure.TemplateData(type, v.slice(1));
				
					parsed.state.push({ time:this.t, cell:cell, value:data });
				}
				
			}
			
			else throw new Error(this.structure.info.type + " simulation not supported yet.");
		}
		
		return parsed;
	}
}