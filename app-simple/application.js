'use strict';

import Header from './widgets/header.js';
import Core from '../api-web-devs/tools/core.js';
import Dom from '../api-web-devs/tools/dom.js';
import Templated from '../api-web-devs/components/templated.js';
import Configuration from '../api-web-devs/components/configuration/configuration.js';
import Styler from '../api-web-devs/components/styler.js';
import Popup from '../api-web-devs/ui/popup.js';
import Loader from '../api-web-devs/widgets/loader.js';
import Playback from '../api-web-devs/widgets/playback.js';
import Rise from '../api-web-devs/widgets/rise-loader.js';
import Settings from '../api-web-devs/widgets/settings/settings.js';
import DiagramAuto from '../api-web-devs/widgets/diagram/auto.js'
import GridAuto from '../api-web-devs/widgets/grid/auto.js'
import Recorder from '../api-web-devs/components/recorder.js';
import Zip from '../api-web-devs/tools/zip.js';

export default Core.Templatable("Application", class Application extends Templated { 

	constructor(node) {		
		super(node);
		
		Dom.AddCss(document.body, "Simple");
		
		this.simulation = null;
		this.files = null;
		
		this.AddWidget("rise", new Rise());
		this.AddWidget("settings", new Settings());
		
		this.Node('btnLoad').On('click', this.OnButtonLoader_Click.bind(this));
		this.Node('btnViz').On('click', this.OnButtonViz_Click.bind(this));
		this.Node('btnRise').On('click', this.OnButtonRise_Click.bind(this));
		this.Node('btnSettings').On('click', this.OnButtonSettings_Click.bind(this));
		this.Node('btnDownload').On('click', this.OnButtonDownload_Click.bind(this));
		
		this.Widget('upload').On('ready', this.OnUpload_Ready.bind(this));
		this.Widget('upload').On('error', this.OnWidget_Error.bind(this));
		this.Widget("rise").On("filesready", this.OnFiles_Loaded.bind(this));
		this.Widget("rise").On("error", this.OnWidget_Error.bind(this));
	}
	
	OnUpload_Ready(ev) {
		this.simulation = ev.simulation;
		this.files = ev.files;
		this.settings = ev.configuration;
		
		this.Elem("btnViz").disabled = false;
		this.Elem("btnSettings").disabled = false;
		this.Elem("btnDownload").disabled = false;
		
		this.simulation.Initialize(this.settings.playback.cache);
		
		this.ShowDropzone(false);
		this.ShowView(this.Elem("view"));
		
		this.Widget("playback").recorder = new Recorder(this.view.widget.canvas);
		this.Widget("playback").Initialize(this.simulation, this.settings.playback);
		this.Widget('settings').Initialize(this.simulation, this.settings);	
	}
	
	OnButtonRise_Click(ev) {
		this.Widget("rise").Show();
	}
	
	OnButtonLoader_Click(ev) {				
		this.ShowDropzone(true);
	}
	
	OnButtonViz_Click(ev) {				
		this.ShowDropzone(false);		
	}
	
	OnButtonSettings_Click(ev) {
		this.Widget("settings").UpdateUI();
		this.Widget("settings").Show();
	}
	
	OnButtonDownload_Click(ev) {		
		var files = [this.files.structure, this.files.messages, this.settings.ToFile()];
		
		if (this.files.diagram) files.push(this.files.diagram);
		
		Zip.SaveZipStream(this.simulation.name, files);
	}
		
	OnFiles_Loaded(ev) {
		this.Widget("rise").Hide();

		this.Widget("upload").Widget("dropzone").files = ev.files;
		this.Widget("upload").Load();
	}
	
	OnWidget_Error(ev) {
		alert (ev.error);
	}
	
	ShowDropzone(visible) {
		Dom.ToggleCss(this.Elem("dropzone"), "hidden", !visible);
		Dom.ToggleCss(this.Elem("views"), "hidden", visible);
	}
	
	ShowView(container) {
		this.Clear();
		
		if (this.simulation.type == "DEVS") {			
			this.view = new DiagramAuto(container, this.simulation, this.settings.diagram);
		}
		else if (this.simulation.type === "Cell-DEVS") {
			this.view = new GridAuto(container, this.simulation, this.settings.grid);
		}
		
		if (!this.view) throw new Error("Unable to create a view widget from simulation object.");
		
		this.view.Resize();
		this.view.Redraw();
	}
	
	Clear() {
		if (!this.view) return;		
		
		Dom.Empty(this.Elem("view"));
		
		this.view.Destroy();
		this.view = null;
	}
		
	Template() {
		return	"<main handle='main' class='dropzone-visible'>" +
					"<div handle='header' widget='Widget.Header'></div>" +
				    "<div class='centered-row'>" + 
						"<div class='button-column'>" + 
						   "<button handle='btnLoad' title='nls(Dropzone_Load)' class='fas fa-file-upload'></button>" +
						   "<button handle='btnViz' title='nls(Dropzone_Viz)' class='fas fa-eye' disabled></button>" +
						"</div>" +
						"<div class='body'>" + 
						   "<div handle='dropzone' class='dropzone-container'>" + 
							   "<div handle='upload' widget='Widget.Loader'></div>" +
						   "</div>" +
						   "<div handle='views' class='hidden'>" +
							   "<div handle='view' class='view'></div>" +
							   "<div handle='playback' widget='Widget.Playback'></div>" +
						   "</div>" +
						"</div>" +
						"<div class='button-column'>" + 
						   "<button handle='btnRise' title='nls(Dropzone_Rise)' class='fas fa-cloud-download-alt'></button>" +
						   "<button handle='btnSettings' title='nls(Playback_Settings)' class='fas fa-tools' disabled></button>" +
						   "<button handle='btnDownload' title='nls(Download_Files)' class='fas fa-download' disabled></button>" +
						"</div>" +
					"</div>" +
				"</main>";
	}
	
	static Nls() {
		return {
			"Popup_Rise_Title" : {
				"en":"Load from RISE"
			},
			"Dropzone_Load" : {
				"en":"Load simulation"
			},
			"Dropzone_Viz" : {
				"en":"Visualize simulation"
			},
			"Dropzone_Rise" : {
				"en":"Load from RISE"
			},
			"Playback_Settings" : {
				"en" : "Modify simulation playback settings"
			},
			"Download_Files" : {
				"en" : "Download normalized simulation files"
			}
		}
		
	}
});