'use strict';

import Core from '../../api-web-devs/tools/core.js';
import Templated from '../../api-web-devs/components/templated.js';

export default Core.Templatable("Widget.Header", class Header extends Templated { 

	constructor(container) {
		super(container);		
	}
	
	Template() {
		return "<h1 class='first-row'><a href='https://arslab.sce.carleton.ca/' target='_blank'>nls(Header_Lab)</a></h1>" +
			   "<div class='second-row'>" +
				  "<h2><a href='https://staubibr.github.io/arslab-prd/app-simple/index.html' target='_blank'>nls(Header_App)</a></h2>" +
				  "<div class='links-container'>" +
				     "<a href='http://www.sce.carleton.ca/faculty/wainer/wbgraf/doku.php?id=model_samples:start' target='_blank'>nls(Header_Sample)</a> &emsp;" +
				 	 "<a href='mailto:bruno.st-aubin@carleton.ca?Subject=[CellDEVSViewer][alpha]' target='_blank'>nls(Header_Problem)</a>" +
				  "</div>" +
			   "</div>";
	}
	
	static Nls() {
		return {
			"Header_Lab": {
				"en": "ARSLab"
			},
			"Header_App": {
				"en": "DEVS Web Viewer"
			},
			"Header_Sample": {
				"en": "&#9733; samples"
			},
			"Header_Problem": {
				"en": "&#9749; report a problem"
			}
		}
	}
});