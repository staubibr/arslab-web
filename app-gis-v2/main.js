import Core from "../api-web-devs/tools/core.js";
import Net from "../api-web-devs/tools/net.js";

import Application from "./application.js";

var path = Net.GetUrlParameter("path");

if (!path) throw new Error("Must provide path to simulation experiment.");

var p1 = Net.JSON(`../api-web-devs/nls.json`);
var p2 = Net.JSON(`./nls.json`);
var p3 = Net.JSON(`./data/${path}/visualization.json`);
var p4 = Net.Request(`./data/${path}/structure.json`, null, 'blob');
var p5 = Net.Request(`./data/${path}/messages.log?v=1`, null, 'blob');
var p6 = Core.WaitForDocument();

Promise.all([p1, p2, p3, p4, p5, p6]).then(Start, Fail);

function Start(responses) {	
	Core.locale = document.documentElement.lang || "en";
	
	Core.nls = Core.Mixin(responses[0], responses[1]);

	var files = [];
		
	files.push(new File([responses[3]], 'structure.json'));
	files.push(new File([responses[4]], 'messages.log'));
	
	var app = new Application(document.body, responses[2], files);
}

function Fail(response) {
	alert("Unable to load application.");
	
	throw(new Error("Unable to load application."));
}
