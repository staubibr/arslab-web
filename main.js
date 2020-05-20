import Core from "../api-basic/tools/core.js";
import Net from "../api-basic/tools/net.js";

import Application from "./application.js";

var p1 = Net.JSON(`../api-basic/nls.json`);
var p2 = Net.JSON(`../api-web-devs/nls.json`);
var p3 = Net.JSON(`./nls.json`);
var p4 = Net.JSON(`./application.json`);
var p5 = Core.WaitForDocument();

Promise.all([p1, p2, p3, p4, p5]).then(Start, Fail);

function Start(responses) {	
	Core.locale = document.documentElement.lang || "en";
	
	Core.nls = responses[0];
	Core.nls = Core.Mixin(Core.nls, responses[1]);
	Core.nls = Core.Mixin(Core.nls, responses[2]);

	var app = new Application(document.body, responses[3]);
}

function Fail(response) {
	alert("Unable to load application.");
	
	throw(new Error("Unable to load application."));
}