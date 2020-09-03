'use strict';

import Header from './widgets/header.js';
import Core from '../api-web-devs/tools/core.js';
import Net from '../api-web-devs/tools/net.js';
import Dom from '../api-web-devs/tools/dom.js';
import Templated from '../api-web-devs/components/templated.js';
import oSettings from '../api-web-devs/components/settings.js';
import BoxInput from '../api-web-devs/ui/box-input-files.js';
import Popup from '../api-web-devs/ui/popup.js';
import Loader from '../api-web-devs/widgets/loader.js';
import Playback from '../api-web-devs/widgets/playback.js';
import Rise from '../api-web-devs/widgets/rise-loader.js';
import Settings from '../api-web-devs/widgets/settings/settings.js';
import Standardized from '../api-web-devs/parsers/standardized.js'
import SimulationDEVS from '../api-web-devs/simulation/simulationDEVS.js'
import SimulationCA from '../api-web-devs/simulation/simulationCA.js'
import MultiView from '../api-web-devs/widgets/multiView.js'
import Recorder from '../api-web-devs/components/recorder.js';
import Zip from '../api-web-devs/tools/zip.js';

export default class Main extends Templated { 

	get Settings() { return this.Widget("settings").Settings; }

	constructor(node) {		
		super(node);
		
		this.simulation = null;
		this.files = null;
		
		this.popup = new Popup();
		
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
		this.settings = ev.options;
		this.files = ev.files;
		
		this.Elem("btnViz").disabled = false;
		this.Elem("btnSettings").disabled = false;
		this.Elem("btnDownload").disabled = false;
		
		this.simulation.Initialize(this.settings.Get("playback", "cache"));
		this.ShowDropzone(false);	
		this.Widget("playback").Initialize(this.simulation, this.settings);
		this.Widget('multi').Initialize(this.simulation, this.settings);	
		this.Widget('settings').Initialize(this.simulation, this.settings);	
		
		this.Widget("playback").Recorder = new Recorder(this.Widget("multi").Canvas);
		
		this.Widget("multi").Resize();
		this.Widget("multi").Redraw();
	}
	
	OnButtonRise_Click(ev) {
		this.ShowPopup(Core.Nls("Popup_Rise_Title"), this.Widget("rise"), 'rise-loader');
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
		this.HidePopup();

		// TODO: This is kinda weird. Rise-Loader shouldn't rely on Loader to parse its files. 
		// They could inherit the same class but implement a different UI.
		this.Widget("upload").Parse(ev.files);
	}
	
	OnWidget_Error(ev) {
		alert (ev.error);
	}
	
	ShowDropzone(visible) {
		Dom.ToggleCss(this.Elem("dropzone"), "hidden", !visible);
		Dom.ToggleCss(this.Elem("views"), "hidden", visible);
	}
	
	ShowPopup(title, content, css) {
		this.popup.Content = content;
		this.popup.Title = title;
		
		this.popup.SetCss(`popup popup-${css}`);
		
		this.popup.Show();
	}
	
	HidePopup() {
		this.popup.Hide();
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
							   "<div handle='multi' widget='Widget.MultiView'></div>" +
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
}