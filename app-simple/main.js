import Core from "../api-web-devs/tools/core.js";
import Net from "../api-web-devs/tools/net.js";

import Application from "./application.js";

Core.WaitForDocument().then(Start);

function Start() {	

	var path = location.href.split("/").slice(0,-2).join("/");

	streamSaver.mitm = path + "/api-web-devs/references/StreamSaver/mitm.html";
	
	// Core.URLs.conversion = "http://localhost:8080/parser/auto";
	// Core.URLs.models = "http://localhost/Dev/arslab-logs/devs-logs/";
	
	var app = new Application(document.body);
}