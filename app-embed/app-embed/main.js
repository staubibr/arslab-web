import Core from "../api-web-devs/tools/core.js";
import Net from "../api-web-devs/tools/net.js";
import Loader from '../api-web-devs/widgets/loader.js';
import ChunkReader from '../api-web-devs/components/chunkReader.js';

import Application from "./application.js";

var loader = null;
var path = Net.GetUrlParameter("path");

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
	
	loader.On("ready", onLoader_Ready, Fail);
	
	if (path) {
		Core.config.root = [Core.config.root, path].join("/");
		
		var p1 = Net.File(`${Core.config.root}/visualization.json`, "visualization.json");
		var p2 = Net.File(`${Core.config.root}/structure.json`, "structure.json");
		var p3 = Net.File(`${Core.config.root}/messages.log`, "messages.log");
		var p4 = Net.File(`${Core.config.root}/diagram.svg`, "diagram.svg", true);
		
		Promise.all([p1, p2, p3, p4]).then(onFiles_Ready, Fail);
	}
	
	else loader.container.style.display = "block";
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
	alert("Unable to load application.");
	
	throw(new Error("Unable to load application."));
}