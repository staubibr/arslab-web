import Core from "../api-web-devs/tools/core.js";
import Dom from "../api-web-devs/tools/dom.js";
import Net from "../api-web-devs/tools/net.js";

import Consent from "./consent.js";
import Application from "./application.js";

var model = Net.GetUrlParameter("model");

if (!model) Fail();

var p1 = Net.JSON(`../api-web-devs/nls.json`);
var p2 = Net.JSON(`./nls.json`);
var p3 = Core.WaitForDocument();
var p4 = Net.JSON(`../devs-logs/${model}/simulation.json`);

Promise.all([p1, p2, p3, p4]).then(CheckConsent, Fail);

function CheckConsent(responses) {
	Core.locale = document.documentElement.lang || "en";
	
	Core.nls = Core.Mixin(responses[0], responses[1]);
	
	if (responses[3].filesize != undefined && responses[3].filesize > 3) {
		var app = new Consent(document.body, responses[3]);
		
		app.then(() => Finish(responses[3]));
	}
	else Finish(responses[3]);
}

function Finish(json) {
	var p1 = Net.Request(`../devs-logs/${model}/transitions.csv`, null, 'blob');
	var p2 = Net.Request(`../devs-logs/${model}/options.json`, null, 'blob');
	
	var defs = [p1, p2];
	
	if (json.type == "DEVS") defs.push(Net.Request(`../devs-logs/${model}/diagram.svg`, null, 'blob'));
	
	Promise.all(defs).then((responses) => {
		var files = [];
		
		var blob = new Blob([JSON.stringify(json)], { type:"application/json" })
		
		files.push(new File([blob], 'simulation.json'));
		files.push(new File([responses[0]], 'transitions.csv'));
	
		if (json.type == "DEVS") files.push(new File([responses[2]], 'diagram.svg'));
		
		files.push(new File([responses[1]], 'options.json'));
		
		Dom.Empty(document.body);
		
		var app = new Application(document.body, files);
	}, Fail);
}

function Fail(response) {
	alert("Unable to load simulation provided through url parameters.");
	
	throw(new Error("Unable to load simulation provided through url parameters."));
}