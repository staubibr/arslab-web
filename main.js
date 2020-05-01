import Core from "../basic-tools/tools/core.js";
import Net from "../basic-tools/tools/net.js";

import Application from "./application.js";

var model = Net.GetUrlParameter("model");
var type = Net.GetUrlParameter("type");

if (!model || !type) Fail();


var p1 = Net.JSON(`../basic-tools/nls.json`);
var p2 = Net.JSON(`../web-devs-tools/nls.json`);
var p3 = Net.JSON(`./nls.json`);
var p4 = WaitForDocument();

var p5 = Net.Request(`./log/${model}/simulation.json`, null, 'blob');
var p6 = Net.Request(`./log/${model}/transitions.csv`, null, 'blob');

var defs = [p1, p2, p3, p4, p5, p6];

if (type == "DEVS") defs.push(Net.Request(`./log/${model}/diagram.svg`, null, 'blob'));

Promise.all(defs).then(Start, Fail);

function WaitForDocument() {
	return new Promise((resolve, reject) => {
		if (document.readyState === "complete") resolve();
		
		else window.addEventListener('load', (ev) => resolve());
	});
}

function Start(responses) {	
	Core.locale = document.documentElement.lang || "en";
	
	Core.nls = responses[0];
	Core.nls = Core.Mixin(Core.nls, responses[1]);
	Core.nls = Core.Mixin(Core.nls, responses[2]);

	var files = [];
	
	files.push(new File([responses[4]], 'simulation.json'));
	files.push(new File([responses[5]], 'transitions.csv'));
	
	if (type == "DEVS") files.push(new File([responses[6]], 'diagram.svg'));

	var app = new Application(document.body, files);
}

function Fail(response) {
	alert("Unable to load simulation provided through url parameters.");
	
	throw(new Error("Unable to load simulation provided through url parameters."));
}