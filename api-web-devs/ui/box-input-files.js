'use strict';

import Core from '../tools/core.js';
import Dom from '../tools/dom.js';
import Templated from '../components/templated.js';

export default Core.Templatable("Widget.Box-Input-Files", class Dropzone extends Templated { 

	set label(value) { this.Elem("label").innerHTML = value; }

	set icon(value) { Dom.AddCss(this.Elem("icon"), value); }
	
	constructor(container) {
		super(container);
		
		this.files = [];
		
		this.Node("input").On("change", this.OnInput_Change.bind(this));
	}
	
	Template() {
		return "<div class='box-input-files'>" +
				   "<div class='box-inner'>" +
					  "<label handle='label' class='top'>nls(Dropzone_Upload_Label)</label>" +
					  "<i handle='icon' class='fas fa-file-upload'></i>" +
					  "<input handle='input' type='file' multiple />" +
				   "</div>" +
				   "<div handle='files' class='files-container hidden'></div>" +
			   "</div>";
	}
	
	Update(newFiles) {
		// Set css on condition of having files or not
		Dom.ToggleCss(this.Elem("files"), "hidden", this.files.length == 0);
		
		var css = this.files.length > 0 ? "fas fa-thumbs-up" : "fas fa-exclamation-triangle";
		
		Dom.SetCss(this.Elem("icon"), css);
		
		// Reload individual file boxes
		this.Refresh(this.files);
	}
	
	Clear() {
		this.files = [];
		
		this.Refresh(this.files);
	}
	
	Refresh(files) {
		// load the individual file label buttons
		Dom.Empty(this.Elem("files"));
				
		for (var i = 0; i < files.length; i++) {
			var options = { className:"file", title:this.nls.Ressource("Dropzone_File_Title"), innerHTML:files[i].name };
			var lbl = Dom.Create("label", options, this.Elem("files"));
			
			Dom.Create("span", { className:"fa fa-times-circle" }, lbl);
			
			lbl.addEventListener("click", this.OnFileLabel_Click.bind(this, lbl, files[i]));
		}
	}
	
	OnFileLabel_Click(lbl, file, ev) {
		this.files.splice(this.files.indexOf(file), 1);
		
		this.Elem("files").removeChild(lbl);
	}
	
	OnInput_Change(ev) {
		for (var i = 0; i < ev.target.files.length; i++) {
			var exists = this.files.find(f => f.name === ev.target.files[i].name);
			
			if (!exists) this.files.push(ev.target.files[i]);
		}
		
		this.Update(this.files);

		ev.target.value = null;

		this.Emit("change", { files:this.files });
	}
	
	static Nls() {
		return {
			"Dropzone_Upload_Label": {
				"en": "DRAG AND DROP<BR> FILES HERE",
				"fr": "GLISSER ET DÉPOSER<BR> LES FICHIERS ICI"
			},
			"Dropzone_File_Title" : {
				"en" : "Click to remove file",
				"fr" : "Cliquer pour retirer le fichier"
			}
		}
	}
});