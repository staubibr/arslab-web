import Core from "../api-basic/tools/core.js";
import Dom from "../api-basic/tools/dom.js";
import Net from "../api-basic/tools/net.js";

import Consent from "./consent.js";
import Application from "./application.js";

var model = Net.GetUrlParameter("model");
var type = Net.GetUrlParameter("type");

if (!model || !type) Fail();

var p1 = Net.JSON(`../api-basic/nls.json`);
var p2 = Net.JSON(`../api-web-devs/nls.json`);
var p3 = Net.JSON(`./nls.json`);
var p4 = WaitForDocument();
var p5 = Net.JSON(`../devs-logs/${model}/simulation.json`);

Promise.all([p1, p2, p3, p4, p5]).then(CheckConsent, Fail);

function WaitForDocument() {
	return new Promise((resolve, reject) => {
		if (document.readyState === "complete") resolve();
		
		else window.addEventListener('load', (ev) => resolve());
	});
}

function CheckConsent(responses) {
	Core.locale = document.documentElement.lang || "en";
	
	Core.nls = responses[0];
	Core.nls = Core.Mixin(Core.nls, responses[1]);
	Core.nls = Core.Mixin(Core.nls, responses[2]);
	
	if (responses[4].filesize != undefined && responses[4].filesize > 2) {
		var app = new Consent(document.body, responses[4]);
		
		app.then(() => Finish(responses[4]));
	}
	else Finish(responses[4]);
}

function Finish(json) {
	var p1 = Net.Request(`../devs-logs/${model}/transitions.csv`, null, 'blob');
	var p2 = Net.JSON(`../devs-logs/${model}/options.json`);
	
	var defs = [p1, p2];
	
	if (type == "DEVS") defs.push(Net.Request(`../devs-logs/${model}/diagram.svg`, null, 'blob'));
	
	Promise.all(defs).then((responses) => {
		var options = responses[1];

		var files = [];
		
		var blob = new Blob([JSON.stringify(json)], { type:"application/json" })
		
		files.push(new File([blob], 'simulation.json'));
		files.push(new File([responses[0]], 'transitions.csv'));
	
		if (type == "DEVS") files.push(new File([responses[2]], 'diagram.svg'));
		
		Dom.Empty(document.body);
		
		var app = new Application(document.body, files, options);
	}, Fail);
}

function Fail(response) {
	alert("Unable to load simulation provided through url parameters.");
	
	throw(new Error("Unable to load simulation provided through url parameters."));
}