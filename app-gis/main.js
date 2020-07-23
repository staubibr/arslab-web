import Core from "../api-web-devs/tools/core.js";
import Net from "../api-web-devs/tools/net.js";

import Application from "./application.js";

// NOTE: The idea here was to load all external files before starting to load 
// the app. But I saw you weren't using the ontario file loaded here so I took it out.

// NOTE: nls files are supposed to hold all your application strings. You're not really 
// using it so maybe we should remove them.

// NOTE : if none of the above is used, then there's no point in having a preloader main
// script like this one.
var p1 = Net.JSON(`../api-web-devs/nls.json`);
var p2 = Net.JSON(`./nls.json`);
var p3 = Core.WaitForDocument();


Promise.all([p1, p2, p3]).then(Start, Fail);

function Start(responses) {	
	Core.locale = document.documentElement.lang || "en";
	
	Core.nls = Core.Mixin(responses[0], responses[1]);
	
	var app = new Application(document.body);
}

function Fail(response) {
	alert("Unable to load application.");
	
	throw(new Error("Unable to load application."));
}