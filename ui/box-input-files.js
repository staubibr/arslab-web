'use strict';

import Core from '../../basic-tools/tools/core.js';
import Dom from '../../basic-tools/tools/dom.js';
import Templated from '../../basic-tools/components/templated.js';

export default Core.Templatable("Widget.Box-Input-Files", class Dropzone extends Templated { 

	set Label(value) { this.Node("label").innerHTML = value; }

	set Icon(value) { Dom.AddCss(this.Node("icon"), value); }
	
	constructor(container) {
		super(container);
		
		this.Node("input").addEventListener("change", this.OnInput_Change.bind(this));
	}
	
	Template() {
		return "<div class='box'>" +
				  "<label handle='label'>nls(Dropzone_Upload_Label)</label>" +
				  "<i handle='icon' class='fas fa-file-upload'></i>" +
				  "<input handle='input' type='file' multiple />" +
			   "</div>";
	}
	
	OnInput_Change(ev) {
		if (ev.target.files.length == 0) return;
		
		// var css = ev.target.files.length > 0 ? "fas fa-thumbs-up" : "fas fa-exclamation-triangle";
		
		// Dom.SetCss(this.Node("icon"), css);
		
		this.Emit("Change", { files:ev.target.files });
	}
});