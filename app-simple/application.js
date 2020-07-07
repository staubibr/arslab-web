'use strict';

import Header from './widgets/header.js';
import Core from '../api-web-devs/tools/core.js';
import Net from '../api-web-devs/tools/net.js';
import Dom from '../api-web-devs/tools/dom.js';
import Templated from '../api-web-devs/components/templated.js';
import oSettings from '../api-web-devs/components/settings.js';
import BoxInput from '../api-web-devs/ui/box-input-files.js';
import Popup from '../api-web-devs/ui/popup.js';
import Playback from '../api-web-devs/widgets/playback.js';
import Rise from '../api-web-devs/widgets/rise-loader.js';
import Converter from '../api-web-devs/widgets/converter.js';
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
		
		this.popup = new Popup();
		
		this.AddWidget("converter", new Converter());
		this.AddWidget("rise", new Rise());
		this.AddWidget("settings", new Settings());
		
		this.Widget('upload').Icon = 'fa-file-upload';
		this.Widget('upload').Label = Core.Nls('Dropzone_Upload_Label');
		this.Widget('upload').Label = Core.Nls('Dropzone_Upload_Label');
		
		this.Node('upload').On("change", this.OnUpload_Change.bind(this));
		this.Node('load').On("click", this.OnLoad_Click.bind(this));
		
		this.Node('btnLoad').On('click', this.OnButtonLoader_Click.bind(this));
		this.Node('btnViz').On('click', this.OnButtonViz_Click.bind(this));
		this.Node('btnConvert').On('click', this.OnButtonConvert_Click.bind(this));
		this.Node('btnRise').On('click', this.OnButtonRise_Click.bind(this));
		this.Node('btnSettings').On('click', this.OnButtonSettings_Click.bind(this));
		this.Node('btnDownload').On('click', this.OnButtonDownload_Click.bind(this));
		
		this.Widget("converter").On("converted", this.OnFiles_Loaded.bind(this));
		this.Widget("converter").On("error", this.OnWidget_Error.bind(this));
		
		this.Widget("rise").On("filesready", this.OnFiles_Loaded.bind(this));
		this.Widget("rise").On("error", this.OnWidget_Error.bind(this));
		
		this.Widget("playback").Recorder = new Recorder(this.Widget("multi").Canvas);
	}
		
	OnUpload_Change(ev) {
		this.Elem("load").disabled = false;
	}
	
	OnLoad_Click(ev) {		
		var parser = new Standardized();

		parser.On("Progress", (ev) => {
			// TODO : Should use variable css colors			
			var c1 = "#198CFF";
			var c2 = "#0051A3";
			
			var bg = `linear-gradient(to right, ${c1} 0%, ${c1} ${ev.progress}%, ${c2} ${ev.progress}%, ${c2} 100%)`;
			
			this.Elem("load").style.backgroundImage = bg;		
		});
		
		var p = parser.Parse(this.Widget('upload').files);
		
		p.then(this.OnParser_Parsed.bind(this), (error) => { this.OnWidget_Error({ error:error }); });
	}
	
	OnParser_Parsed(files) {
		this.Elem("load").style.backgroundImage = null;			
		this.Elem("btnViz").disabled = false;
		this.Elem("btnSettings").disabled = false;
		this.Elem("btnDownload").disabled = false;
		
		this.files = files;
		
		var content = files.Content();
		
		this.settings = oSettings.FromJson(content.options);
		
		if (content.options) this.settings.json = content.options;
		
		var clss = (content.simulation.type == "DEVS") ? SimulationDEVS : SimulationCA;
		
		this.simulation = clss.FromFiles(content);
		
		this.simulation.Initialize(this.settings.Get("playback", "cache"));
		
		this.ShowDropzone(false);	
		
		this.Widget("playback").Initialize(this.simulation, this.settings);
		this.Widget('multi').Initialize(this.simulation, this.settings);	
		this.Widget('settings').Initialize(this.simulation, this.settings);	
		
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
	
	OnButtonConvert_Click(ev) {
		this.ShowPopup(Core.Nls("Popup_Converter_Title"), this.Widget("converter"), 'converter');
	}
	
	OnButtonSettings_Click(ev) {
		this.Widget("settings").UpdateUI();
		this.Widget("settings").Show();
	}
	
	OnButtonDownload_Click(ev) {	
		var files = []
		
		files.push(this.files.simulation.ToFile());
		files.push(this.files.transitions.ToFile());
		files.push(this.settings.ToFile());
				
		try {
			// This is an async call, Fire and forget, pew! 
			Zip.SaveZipStream(this.files.name, files);
		}
		catch (error) {
			this.OnWidget_Error({ error:error });
		}
	}
		
	OnFiles_Loaded(ev) {
		this.HidePopup();
		
		this.Widget("upload").files = ev.files;
		this.Widget("upload").Update(ev.files);
		this.Elem("load").disabled = false;
		
		this.OnLoad_Click(null);
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
							   "<div handle='upload' widget='Widget.Box-Input-Files'></div>" +
							   "<button handle='load' class='save' disabled>nls(Dropzone_Load)</button>" +
						   "</div>" +
						   "<div handle='views' class='hidden'>" +
							   "<div handle='multi' widget='Widget.MultiView'></div>" +
							   "<div handle='playback' widget='Widget.Playback'></div>" +
						   "</div>" +
						"</div>" +
						"<div class='button-column'>" + 
						   "<button handle='btnConvert' title='nls(Dropzone_Convert)' class='fas fa-exchange-alt'></button>" +
						   "<button handle='btnRise' title='nls(Dropzone_Rise)' class='fas fa-cloud-download-alt'></button>" +
						   "<button handle='btnSettings' title='nls(Playback_Settings)' class='fas fa-tools' disabled></button>" +
						   "<button handle='btnDownload' title='nls(Download_Files)' class='fas fa-download' disabled></button>" +
						"</div>" +
					"</div>" +
				"</main>";
	}
}