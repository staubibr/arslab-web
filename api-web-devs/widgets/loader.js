'use strict';

import Core from '../tools/core.js';
import Dom from '../tools/dom.js';
import Net from '../tools/net.js';
import Zip from '../tools/zip.js';
import Styler from '../components/styler.js';
import Templated from '../components/templated.js';
import Parser from '../components/parser.js';
import ChunkReader from '../components/chunkReader.js';
import BoxInput from '../ui/box-input-files.js';

import SimulationDEVS from '../simulation/simulationDEVS.js';
import SimulationCA from '../simulation/simulationCA.js';


// A lot of async going on, sorry.
export default Core.Templatable("Widget.Loader", class Loader extends Templated { 
	
	static get URL() {
		return Core.URLs.conversion;
	}
	
	set Files(value) {
		this.files = { ready:[], convert:[] };
		
		var ready = ["structure.json", "messages.log", "diagram.svg", "style.json", "visualization.json"];
		
		value.forEach(f => {
			ready.indexOf(f.name) > -1 ? this.Files.ready.push(f) : this.Files.convert.push(f);
		});
	}
	
	get Files() {
		return this.files;
	}
	
	get Disabled() {
		return this.Elem("parse").disabled;
	}
	
	constructor(node) {		
		super(node);
		
        if (!Core.URLs.conversion) throw new Error("Config Error: conversion url not defined in application configuration.");
						
		this.Node("parse").On("click", this.onParseButton_Click.bind(this));
		this.Node("clear").On("click", this.onClearButton_Click.bind(this));
		this.Widget("dropzone").On("change", this.onDropzone_Change.bind(this));
	}
	
	UpdateButton() {
		this.Elem("parse").disabled = this.Widget("dropzone").files.length == 0;
	}

	Finish() {
		Dom.AddCss(this.Elem("wait"), "hidden");
		
		this.Elem("parse").style.backgroundImage = null;	
	}
	
	Load() {
		this.Files = this.Widget("dropzone").files;
		
		var n = this.Files.ready.length;
		
		if (n == 3 || n == 4) var p = this.Parse();
		
		else if (this.Files.convert.length > 0) var p = this.Convert();
		
		else var p = Core.Rejected("Files cannot be converted or parsed automatically.");
		
		p.then(this.OnParser_Finished.bind(this), (error) => this.OnError(error));
	}
	
	Convert() {
		var d = Core.Defer();
		var form = new FormData();
		
		this.Files.convert.forEach(f => form.append("files", f));
		
		var p = Net.Fetch(Loader.URL, { method: 'POST', body: form });
		
		p.then(this.onFiles_Converted.bind(this, d), (error) => { d.Reject(error); });
		
		return d.promise;
	}
	
	Parse() {
		var d = Core.Defer();
		var parser = new Parser();
		
		parser.On("Progress", this.OnParser_Progress.bind(this));
		
		var config = this.Files.ready.find(f => f.name.match(/visualization.json/));
		
		var p1 = parser.Parse(this.Files.ready);
		var p2 = ChunkReader.Read(config, (content) => JSON.parse(content));
		
		Promise.all([p1, p2]).then(responses => d.Resolve(responses), (error) => d.Reject(error));
		
		return d.promise;
	}
	
	onFiles_Converted(d, response) {
		response.blob().then(blob => {			
			Zip.LoadZip(blob).then(response => {
				this.Files.ready.push(...response.files);
				
				this.Parse().then(result => d.Resolve(result), (error) => d.Reject(error));
			}, error => d.Reject(error));
		}, error => d.Reject(error));
	}

	OnParser_Progress(ev) {		
		var c1 = "#198CFF";
		var c2 = "#0051A3";
		
		var bg = `linear-gradient(to right, ${c1} 0%, ${c1} ${ev.progress}%, ${c2} ${ev.progress}%, ${c2} 100%)`;
		
		this.Elem("parse").style.backgroundImage = bg;		
	}
	
	OnParser_Finished(responses) {	
		this.Finish();
		
		var simulation = responses[0].simulation;
		
		if (simulation.Type == "DEVS" && !simulation.Diagram) {
			alert("Diagram not found for DEVS simulation. Please provide a diagram.svg file and reload the simulation.");
		}
		
		var output = {
			files: this.files.ready,
			simulation: responses[0].simulation,
			configuration : responses[1] || null,
			style : responses[0].style || null
		}
		
		this.Emit("ready", output);
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

	OnError(error) {
		this.Finish();
		
		this.Emit("error", { error:error });
	}

	Template() {
		return "<div class='loader'>" +
				  "<div handle='wait' class='wait hidden'><img src='./assets/loading.svg'></div>" + 
			      "<div handle='dropzone' widget='Widget.Box-Input-Files'></div>" +
				  "<div>" +
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
			}
		}
	}
});
