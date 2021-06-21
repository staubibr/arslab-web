'use strict';

import Core from "../api-web-devs/tools/core.js";
import Net from "../api-web-devs/tools/net.js";
import Evented from '../api-web-devs/components/evented.js';
import Loader from '../api-web-devs/widgets/loader.js';
import ChunkReader from '../api-web-devs/components/chunkReader.js';
import Application from "./application.js";

export default class Main extends Evented { 

	get path() { return this._json.path; }

	get id() { return this._json.id; }

	get diagram() { return this._json.diagram; }

	get node() { return this._node; }

	constructor(node, json) {
		super();
		
		this._node = node;
		this._json = json;
		/*
		if (this.path == null && this.id == null) {
			throw new Error("The embedded Web DEVS Simulation Viewer requires either an 'id' to read visualization data from the Web DEVS Environment or, a 'path' to read directly from the server.");
		}
		*/
		Core.WaitForDocument().then(this.OnBaseConfig_Loaded.bind(this), this.OnWDSV_Failure.bind(this));
	
		this.Emit("Initializing");
	}
	
	OnBaseConfig_Loaded(responses) {
		// Core.URLs.conversion = "http://localhost:8080/parser/auto";
		// Core.URLs.models = "http://localhost/Dev/arslab-logs/devs-logs/";
		// Core.URLs.files = "http://arslab-services.herokuapp.com/get/model/simulation";
	
		this.loader = new Loader(this.node);
		
		this.loader.On("ready", this.OnLoader_Ready.bind(this));
		this.loader.On("error", this.OnLoader_Failure.bind(this));
		
		if (this.id != null) {
			var files = [Core.URLs.files, this.id].join("/");
			
			Net.JSON(files + "?v=0").then(files => this.LoadFiles(files));
		}
		
		else if (this.path) {
			Core.URLs.models = [Core.URLs.models, this.path].join("/");
			
			var files = {
				visualization : `${Core.URLs.models}/visualization.json`,
				structure : `${Core.URLs.models}/structure.json`,
				messages : `${Core.URLs.models}/messages.log`
			}
			
			if (this.diagram) files.diagram = `${Core.URLs.models}/diagram.svg`;
			
			this.LoadFiles(files);
		}
		
		else this.loader.container.style.display = "block";
	}
	
	LoadFiles(files) {	
		var p1 = Net.File(files.visualization, "visualization.json", true);
		var p2 = Net.File(files.structure, "structure.json");
		var p3 = Net.File(files.messages, "messages.log");
		
		var defs = [p1,p2,p3];
		
		if (files.diagram) defs.push(Net.File(files.diagram, "diagram.svg", true));
		
		Promise.all(defs).then(this.OnFiles_Ready.bind(this), this.OnWDSV_Failure.bind(this));
	}
	
	OnFiles_Ready(files) {
		this.files = { 
			structure: files.find(f => f.name == 'structure.json'),
			messages: files.find(f => f.name == 'messages.log'),
			diagram: files.find(f => f.name == 'diagram.svg'),
			visualization: files.find(f => f.name == 'visualization.json'),
			style: files.find(f => f.name == 'style.json')
		}
		
		this.loader.Load(this.files);
	}

	OnLoader_Ready(ev) {
		this.loader.roots.forEach(r => this.node.removeChild(r));
		this.loader.container.style.display = "block"

		var app = new Application(this.node, ev.simulation, ev.configuration, ev.style, this.files);

		this.Emit("Ready", { application:app });
	}
	
	OnLoader_Failure(ev) {
		this.OnWDSV_Failure(ev.error);
	}
	
	OnWDSV_Failure(error) {
		console.error(error);
		
		this.Emit("Error", { error:error });
	}
}