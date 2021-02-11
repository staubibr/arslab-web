import Core from "../api-web-devs/tools/core.js";
import Net from "../api-web-devs/tools/net.js";
import Loader from './widgets/loader.js';
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

	var config = responses[2];

	if (!path) {
		loader = new Loader(document.body);
	
		loader.On("ready", (ev) => onFiles_Ready(config, ev.files), Fail);
	}
	
	else {
		var p1 = Net.File(`./data/${path}/visualization.json`, "visualization.json");
		var p2 = Net.File(`./data/${path}/structure.json`, "structure.json");
		var p3 = Net.File(`./data/${path}/messages.log?v=0`, "messages.log");
		
		var defs = [p1, p2, p3];
		
		Promise.all([p1, p2, p3]).then((files) => onFiles_Ready(config, files), Fail);
	}
}

function onFiles_Ready(config, files) {		
	var viz = files.find((f) => f.name == "visualization.json");
	var files = files.filter(f => f.name != "visualization.json");
	
	var reader = new ChunkReader();
	
	reader.Read(viz, (json) => JSON.parse(json)).then(onViz_Ready.bind(this, config, files), Fail);
}

function onViz_Ready(config, files, viz) {
	// TODO: This may not work further down the line, risk of overwriting
	Core.Mixin(viz, config);
	
	// Load all geojson data layers contained in visualization.json
	var defs = viz.gis.layers.map(l => {
		if (l.file) {
			var f = files.find((f) => f.name == l.file);
		
			return ParseJsonFile(f);
		}
		
		else return Net.JSON(l.url);	
	});

	Promise.all(defs).then(onApplication_Ready.bind(this, files, viz));
}

function onApplication_Ready(files, viz, data) {	
	if (loader) loader.roots.forEach(r => document.body.removeChild(r));

	var app = new Application(document.body, files, viz, data);
}

function Fail(response) {
	alert("Unable to load application.");
	
	throw(new Error("Unable to load application."));
}

function ParseJsonFile(file) {
	var reader = new ChunkReader();
	
	return reader.Read(file, (json) => JSON.parse(json));
}