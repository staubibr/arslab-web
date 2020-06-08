'use strict';

import Core from '../../api-web-devs/tools/core.js';
import Templated from '../../api-web-devs/components/templated.js';

export default Core.Templatable("Widget.Header", class Header extends Templated { 

	constructor(container) {
		super(container);		
	}
	
	Template() {
		return "<h1 class='first-row'><a href='http://vs3.sce.carleton.ca/wordpress/' target='_blank'>nls(Header_Lab)</a></h1>" +
			   "<div class='second-row'>" +
				  "<h2><a href='http://cell-devs.sce.carleton.ca/intranet/webviewer/' target='_blank'>nls(Header_App)</a></h2>" +
				  "<div class='links-container'>" +
				     "<a href='https://goo.gl/S7agHi' target='_blank'>nls(Header_Sample)</a> &emsp;" +
				 	 "<a href='mailto:bruno.st-aubin@carleton.ca?Subject=[CellDEVSViewer][alpha]' target='_blank'>nls(Header_Problem)</a>" +
				  "</div>" +
			   "</div>";
	}
});