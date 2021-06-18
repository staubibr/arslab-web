'use strict';

import Core from '../tools/core.js';
import Dom from '../tools/dom.js';
import Templated from '../components/templated.js';
import DialogYesNo from '../ui/yesNo.js';
import BoxInputFiles from '../ui/box-input-files.js';
import PopupLinker from './linker/popup-linker.js';
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
	
	get files() {
		return this._files;
	}
	
	constructor(node) {		
		super(node);
		
        if (!Core.URLs.conversion) throw new Error("Config Error: conversion url not defined in application configuration.");
		
		this.dialog = new DialogYesNo();
		this.dialog.message = this.nls.Ressource("Dialog_Linker");
		
		this.linker = new PopupLinker();
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
	
	Load() {
		this.files = this.Widget("dropzone").files;
		
		if (!this.files.structure) this.onWidget_Error(new Error("Missing structure.json file, cannot parse."));
		
		else if (!this.files.messages) this.onWidget_Error(new Error("Missing messages.log file, cannot parse."));
		
		else this.PreParse();
	}
	
	async PreParse() {		
		var json = await ChunkReader.ReadAsJson(this.files.structure);
		
		if (json.info.type != "DEVS") return this.Parse();
		
		await this.dialog.Show();
		
		if (this.dialog.answer == "no") return this.Parse();
		
		await this.linker.Show(this.files.structure, this.files.diagram);
		
		this.files.structure = this.linker.structure_file;
		this.files.diagram = this.linker.diagram_file;
		
		return this.Parse();
	}
	
	async Parse() {
		var structure = await this.parser.ParseStructure(this.files.structure);
		var messages = await this.parser.ParseMessages(structure, this.files.messages);
		var diagram = await this.parser.ParseDiagram(this.files.diagram);
		
		if (structure.type == "Cell-DEVS") var simulation = new SimulationCA(structure, messages);
		
		else var simulation = new SimulationDEVS(structure, messages, diagram);

		var configuration = await this.parser.ParseConfiguration(simulation, this.files.visualization, this.files.style);
		
		this.RestoreUI();
		
		if (simulation.type == "DEVS" && !simulation.diagram) {
			this.onWidget_Error(new Error("Diagram not found for DEVS simulation. Please provide a diagram.svg file and reload the simulation."));
		}

		else this.Emit("ready", { files: this.files, simulation: simulation, configuration: configuration });			
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
		
		this.Load();
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
