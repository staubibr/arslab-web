'use strict';

import Core from '../../basic-tools/tools/core.js';
import Dom from '../../basic-tools/tools/dom.js';
import Templated from '../../basic-tools/components/templated.js';

export default Core.Templatable("Widget.Box-Button", class Dropzone extends Templated { 

	set Label(value) { this.Node("label").innerHTML = value; }

	set Icon(value) { Dom.AddCss(this.Node("icon"), value); }

	constructor(container) {
		super(container);
		
		this.Node("button").addEventListener("click", this.OnButton_Click.bind(this));
	}
	
	Template() {
		return "<div class='box'>" +
				  "<label handle='label'></label>" +
				  "<i handle='icon' class='fas'></i>" +
				  "<button handle='button'/>" +
			   "</div>";
	}
	
	OnButton_Click(ev) {
		this.Emit("Click", { });
	}
});