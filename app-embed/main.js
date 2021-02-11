import Core from "../api-web-devs/tools/core.js";
import Net from "../api-web-devs/tools/net.js";
import Loader from '../api-web-devs/widgets/loader.js';
import ChunkReader from '../api-web-devs/components/chunkReader.js';

import Application from "./application.js";

var loader = null;
var path = Net.GetUrlParameter("path");
var id = Net.GetUrlParameter("id");

var p1 = Net.JSON(`../api-web-devs/nls.json`);
var p2 = Net.JSON(`./nls.json`);
var p3 = Net.JSON(`./application.json`);
var p4 = Core.WaitForDocument();

Promise.all([p1, p2, p3, p4]).then(onNls_Loaded, Fail);

function onNls_Loaded(responses) {
	Core.locale = document.documentElement.lang || "en";
	Core.nls = Core.Mixin(responses[0], responses[1]);	
	Core.config = responses[2];

	loader = new Loader(document.body);
	
	loader.On("ready", onLoader_Ready);
	loader.On("error", Fail);
	
	if (id != null) {
		Core.config.files = [Core.config.files, id].join("/");
		
		Net.FetchJson(Core.config.files + "?v=0").then(files => LoadFiles(files));
	}
	
	else if (path) {
		Core.config.root = [Core.config.root, path].join("/");
		
		LoadFiles({
			"visualization.json" : `${Core.config.root}/visualization.json`,
			"structure.json" : `${Core.config.root}/structure.json`,
			"messages.log" : `${Core.config.root}/messages.log`,
			"diagram.svg" : `${Core.config.root}/diagram.svg`
		});
	}
	
	else loader.container.style.display = "block";
}

function LoadFiles(files) {	
	var p1 = Net.File(files["visualization.json"], "visualization.json", true);
	var p2 = Net.File(files["structure.json"], "structure.json");
	var p3 = Net.File(files["messages.log"], "messages.log");
	var p4 = Net.File(files["diagram.svg"], "diagram.svg", true);
	
	Promise.all([p1, p2, p3, p4]).then(onFiles_Ready, Fail);
}

function onFiles_Ready(files) {
	loader.Widget("dropzone").files = files.filter(f => f != null);
	loader.Load();
}

function onLoader_Ready(ev) {
	loader.roots.forEach(r => document.body.removeChild(r));
	loader.container.style.display = "block"
	
	var app = new Application(document.body, ev.simulation, ev.configuration, ev.style, loader.Files);
}

function Fail(response) {
	var message = "Unable to load application.";
	
	if (response.type === "error") message = response.error.toString();
	
	alert(message);
	
	throw(new Error(message));
}