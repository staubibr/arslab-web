import Core from "../api-web-devs/tools/core.js";
import Net from "../api-web-devs/tools/net.js";

import Application from "./application.js";

var p1 = Net.JSON(`../api-web-devs/nls.json`);
var p2 = Net.JSON(`./nls.json`);
var p3 = Net.JSON(`./data/canada.geojson`);
var p4 = Core.WaitForDocument();

Promise.all([p1, p2, p3, p4]).then(Start, Fail);

function Start(responses) {	
	Core.locale = document.documentElement.lang || "en";
	
	Core.nls = Core.Mixin(responses[0], responses[1]);
	
	var data = {
		canada : responses[2]
	}
	
	var app = new Application(document.body, data);
}

function Fail(response) {
	alert("Unable to load application.");
	
	throw(new Error("Unable to load application."));
}