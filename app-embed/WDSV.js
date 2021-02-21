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

	get node() { return this._node; }

	constructor(node, json) {
		super();
		
		this._node = node;
		this._json = json;
		
		if (this.path == null && this.id == null) {
			throw new Error("The embedded Web DEVS Simulation Viewer requires either an 'id' to read visualization data from the Web DEVS Environment or, a 'path' to read directly from the server.");
		}
		
		var p1 = Net.JSON(`../api-web-devs/nls.json`);
		var p2 = Net.JSON(`./nls.json`);
		var p3 = Net.JSON(`./application.json`);
		var p4 = Core.WaitForDocument();

		Promise.all([p1, p2, p3, p4]).then(this.OnBaseConfig_Loaded.bind(this), this.OnWDSV_Failure.bind(this));
	
		this.Emit("Initializing");
	}
	
	OnBaseConfig_Loaded(responses) {
		Core.locale = document.documentElement.lang || "en";
		Core.nls = Core.Mixin(responses[0], responses[1]);	
		Core.config = responses[2];

		this.loader = new Loader(this.node);
		
		this.loader.On("ready", this.OnLoader_Ready.bind(this));
		this.loader.On("error", this.OnLoader_Failure.bind(this));
		
		if (this.id != null) {
			Core.config.files = [Core.config.files, this.id].join("/");
			
			Net.JSON(Core.config.files + "?v=0").then(files => this.LoadFiles(files));
		}
		
		else if (this.path) {
			Core.config.root = [Core.config.root, this.path].join("/");
			
			this.LoadFiles({
				"visualization.json" : `${Core.config.root}/visualization.json`,
				"structure.json" : `${Core.config.root}/structure.json`,
				"messages.log" : `${Core.config.root}/messages.log`,
				"diagram.svg" : `${Core.config.root}/diagram.svg`
			});
		}
		
		else this.loader.container.style.display = "block";
	}
	
	LoadFiles(files) {	
		var p1 = Net.File(files["visualization.json"], "visualization.json", true);
		var p2 = Net.File(files["structure.json"], "structure.json");
		var p3 = Net.File(files["messages.log"], "messages.log");
		var p4 = Net.File(files["diagram.svg"], "diagram.svg", true);
		
		Promise.all([p1, p2, p3, p4]).then(this.OnFiles_Ready.bind(this), this.OnWDSV_Failure.bind(this));
	}
	
	OnFiles_Ready(files) {
		this.loader.Widget("dropzone").files = files.filter(f => f != null);
		this.loader.Load();
	}

	OnLoader_Ready(ev) {
		this.loader.roots.forEach(r => this.node.removeChild(r));
		this.loader.container.style.display = "block"

		var app = new Application(this.node, ev.simulation, ev.configuration, ev.style, this.loader.Files);

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