import Core from "../api-web-devs/tools/core.js";
import Net from "../api-web-devs/tools/net.js";

import Application from "./application.js";

var p1 = Net.JSON(`../api-web-devs/nls.json`);
var p2 = Net.JSON(`./nls.json`);
var p3 = Core.WaitForDocument();

Promise.all([p1, p2, p3]).then(Start);

function Start(responses) {	

	var path = location.href.split("/").slice(0,-2).join("/");

	streamSaver.mitm = path + "/api-web-devs/references/StreamSaver/mitm.html";

	Core.locale = document.documentElement.lang || "en";
	
	Core.nls = Core.Mixin(responses[0], responses[1]);

	var app = new Application(document.body);
}