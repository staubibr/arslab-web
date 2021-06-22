'use strict';

import Core from '../tools/core.js';
import Dom from '../tools/dom.js';
import Templated from '../components/templated.js';
import BoxInputFiles from '../ui/box-input-files.js';
import Parser from '../components/parser.js';
import ChunkReader from '../components/chunkReader.js';
import SimulationDEVS from '../simulation/simulationDEVS.js';
import SimulationCA from '../simulation/simulationCA.js';

export default Core.Templatable("Widget.Loader", class Loader extends Templated { 

	set files(value) {
		this._files = { 
			structure: value.find(f => f.name == 'structure.json'),
			messages: value.find(f => f.name == 'messages.log'),
			diagram: value.find(f => f.name == 'diagram.svg'),
			visualization: value.find(f => f.name == 'visualization.json'),
			style: value.find(f => f.name == 'style.json')
		}
	}
	
	get files() { return this._files; }
		
	constructor(node) {		
		super(node);
		
        if (!Core.URLs.conversion) throw new Error("Config Error: conversion url not defined in application configuration.");
		
		this.parser = new Parser();
		
		this.parser.On("Progress", this.OnParser_Progress.bind(this));
		
		this.Node("parse").On("click", this.onParseButton_Click.bind(this));
		this.Node("clear").On("click", this.onClearButton_Click.bind(this));
		this.Widget("dropzone").On("change", this.onDropzone_Change.bind(this));
	}
	
	UpdateButton() {
		this.Elem("parse").disabled = this.Widget("dropzone").files.length == 0;
	}

	RestoreUI() {
		Dom.AddCss(this.Elem("wait"), "hidden");
		
		this.Elem("parse").style.backgroundImage = null;	
	}
	
	Load(files) {		
		if (!files.structure) this.onWidget_Error(new Error("Missing structure.json file, cannot parse."));
		
		else if (!files.messages) this.onWidget_Error(new Error("Missing messages.log file, cannot parse."));
		
		else this.Parse(files);
	}
	
	async Parse(files) {
		var structure = await this.parser.ParseStructure(files.structure);
		var messages = await this.parser.ParseMessages(structure, files.messages);
		var diagram = await this.parser.ParseDiagram(files.diagram);
		
		if (structure.type == "Cell-DEVS") var simulation = new SimulationCA(structure, messages);
		
		else var simulation = new SimulationDEVS(structure, messages, diagram);

		var configuration = await this.parser.ParseConfiguration(simulation, files.visualization, files.style);
		
		this.RestoreUI();
		
		if (simulation.type == "DEVS" && !simulation.diagram) {
			this.onWidget_Error(new Error("Diagram not found for DEVS simulation. Please provide a diagram.svg file and reload the simulation."));
		}

		else this.Emit("ready", { files: files, simulation: simulation, configuration: configuration });			
	}
	
	OnParser_Progress(ev) {		
		var c1 = "#198CFF";
		var c2 = "#0051A3";
		
		var bg = `linear-gradient(to right, ${c1} 0%, ${c1} ${ev.progress}%, ${c2} ${ev.progress}%, ${c2} 100%)`;
		
		this.Elem("parse").style.backgroundImage = bg;		
	}
	
	onDropzone_Change(ev) {		
		this.UpdateButton();
	}
		
	onParseButton_Click(ev) {
		Dom.RemoveCss(this.Elem("wait"), "hidden");
		
		this.files = this.Widget("dropzone").files;
		
		this.Load(this.files);
	}
	
	onClearButton_Click(ev) {
		this.Widget("dropzone").Clear();
		
		this.UpdateButton();
	}
	
	onWidget_Error(error) {
		this.Emit("error", { error:error });
		this.RestoreUI();
	}

	Template() {
		return "<div class='loader'>" +
				  "<div handle='wait' class='wait hidden'><img src='./assets/loading.svg'></div>" + 
			      "<div handle='dropzone' widget='Widget.Box-Input-Files'></div>" +
				  "<div class='box-input-files'>" +
					 "<button handle='clear' class='clear'>nls(Loader_Clear)</button>" +
					 "<button handle='parse' class='parse' disabled>nls(Loader_Parse)</button>" +
			      "</div>" +
			   "</div>";
	}
	
	static Nls() {
		return {
			"Loader_Clear" : {
				"en" : "Clear"
			},
			"Loader_Parse" : {
				"en" : "Load simulation"
			},
			"Dialog_Linker": {
				"en": "This visualization uses an SVG diagram. Do you want to review the associations between the diagram and the structure file?"
			}
		}
	}
});
