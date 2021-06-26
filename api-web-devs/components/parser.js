'use strict';

import Core from '../tools/core.js';
import Evented from "../components/evented.js";
import ChunkReader from "../components/chunkReader.js";
import Configuration from '../components/configuration/configuration.js';
import Structure from "../components/specification/structure.js";
import SimulationDEVS from "../simulation/simulationDEVS.js";
import SimulationCA from "../simulation/simulationCA.js";
import Frame from "../simulation/frame.js";

import { StateMessage, OutputMessage, StateMessageCA } from "./specification/message.js"

export default class Parser extends Evented { 
	
	async ParseConfiguration(simulation, fViz, fStyle) {
		var visualization = await ChunkReader.ReadAsJson(fViz);
		var style = await ChunkReader.ReadAsJson(fStyle);
		
		if (visualization) var config = Configuration.FromJson(visualization);
		
		else var config = Configuration.FromSimulation(simulation);
		
		if (simulation.type == "Cell-DEVS" && style) config.grid.styles = style;
		
		return config;
	}
	
	async ParseStructure(fStruct) {
		var json = await ChunkReader.ReadAsJson(fStruct);
		
		return Structure.FromJson(json);
	}
	
	async ParseDiagram(fDiag) {
		return await ChunkReader.ReadAsText(fDiag);
	}
	
	async ParseMessages(structure, file) {
		this.frame = null;
		
		var parseFn = structure.info.type == "Cell-DEVS" ? this.ParseLineCA : this.ParseLine;
		
		return ChunkReader.ReadByChunk(file, "\n", (parsed, chunk, progress) => {
			if (parsed == null) parsed = [];
			
			// If line has only one item, then it's a timestep. Otherwise, it's a simulation message, 
			// the format then depends on the whether it's a DEVS, Cell-DEVS or Irregular model
			var lines = chunk.split("\n");
		
			for (var i = 0; i < lines.length; i++) {
				var data = lines[i].trim().split(";");
			
				if (data.length == 1) {
					this.frame = new Frame(data[0]);
					
					parsed.push(this.frame);
				}
				
				else {					
					data = data.map(d => d.split(","));
				
					parseFn(this.frame, structure, data[0], data[1]);
				}
			}
			
			this.Emit("Progress", { progress: progress });
			
			return parsed;
		});
	}
	
	ParseLine(frame, structure, emitter, values) {
		var model = structure.nodes[emitter[0]];
		var port = emitter.length == 2 ? model.ports[emitter[1]]: null ; 

		if (port) frame.AddOutputMessage(new OutputMessage(model, port, values));

		else frame.AddStateMessage(new StateMessage(model, values));		
	}
	
	ParseLineCA(frame, structure, coord, values) {
		var values = structure.model_types[1].Template(values);

		frame.AddStateMessage(new StateMessageCA(coord, values));
	}
	
	ReadByChunk(file, delegate) {		
		return ChunkReader.ReadByChunk(file, "\n", (parsed, chunk, progress) => {
			if (!parsed) parsed = [];
		
			parsed = delegate(parsed, chunk);
			
			this.Emit("Progress", { progress: progress });
			
			return parsed;
		});
	}
}