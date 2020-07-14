'use strict';

import Core from '../tools/core.js';
import Dom from '../tools/dom.js';
import Templated from '../components/templated.js';

export default Core.Templatable("Widget.Box-Input-Files", class Dropzone extends Templated { 

	set Label(value) { this.Elem("label").innerHTML = value; }

	set Icon(value) { Dom.AddCss(this.Elem("icon"), value); }
	
	constructor(container) {
		super(container);
		
		this.Node("input").On("change", this.OnInput_Change.bind(this));
	}
	
	Template() {
		return "<div class='box'>" +
				  "<label handle='label' class='top'>nls(Dropzone_Upload_Label)</label>" +
				  "<i handle='icon' class='fas fa-file-upload'></i>" +
				  "<label handle='bottom' class='bottom hidden'>nls(Dropzone_Upload_Files)</label>" +
				  "<input handle='input' type='file' multiple />" +
			   "</div>";
	}
	
	Update(files) {
		Dom.ToggleCss(this.Elem("bottom"), "hidden", files.length == 0);
		
		if (files.length == 0) return;
		
		var names = [];
		
		for (var i = 0; i < files.length; i++) names.push(files[i].name);
				
		this.Elem("bottom").innerHTML = Core.Nls("Dropzone_Upload_Files", [names.join(", ")]);
		
		var css = files.length > 0 ? "fas fa-thumbs-up" : "fas fa-exclamation-triangle";
		
		Dom.SetCss(this.Elem("icon"), css);
	}
	
	OnInput_Change(ev) {
		this.files = []
				
		for (var i = 0; i < ev.target.files.length; i++) {
			this.files.push(ev.target.files[i]);
		}
		
		this.Update(this.files);

		this.Emit("change", { files:this.files });
	}
});