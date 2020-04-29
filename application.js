'use strict';

import Header from './widgets/header.js';

import Core from '../basic-tools/tools/core.js';
import Net from '../basic-tools/tools/net.js';
import Dom from '../basic-tools/tools/dom.js';
import Templated from '../basic-tools/components/templated.js';

import BoxInput from '../basic-tools/ui/box-input-files.js';
import Popup from '../basic-tools/ui/popup.js';

import Playback from '../web-devs-tools/widgets/playback.js';
import Rise from '../web-devs-tools/widgets/rise-loader.js';
import Converter from '../web-devs-tools/widgets/converter.js';
import Settings from '../web-devs-tools/widgets/settings.js';

import Standardized from '../web-devs-tools/parsers/standardized.js'

import Simulation from '../web-devs-tools/simulation/simulation.js'

import DiagramAuto from '../web-devs-tools/widgets/diagram/auto.js'
import Diagram from '../web-devs-tools/widgets/diagram/diagram.js'

export default class Main extends Templated { 

	get Settings() { return this.Elem("settings").Settings; }

	constructor(node) {		
		super(node);
		
		this.simulation = null;
		
		this.popup = new Popup(this.Elem('main'));
		
		this.widgets = {
			converter : new Converter(),
			rise : new Rise(),
			settings : new Settings()
		}
		
		this.current = {
			id : "dropzone",
			auto : null
		}
		
		this.settings = this.widgets.settings.Settings;
		
		this.Elem('body').style.height = this.settings.Height + 'px';
		this.Elem('body').style.width = this.settings.Width + 'px';
		
		this.Elem('upload').Icon = 'fa-file-upload';
		this.Elem('upload').Label = Core.Nls('Dropzone_Upload_Label');
		this.Elem('upload').Label = Core.Nls('Dropzone_Upload_Label');
		
		this.Node('upload').On("change", this.OnUpload_Change.bind(this));
		this.Node('load').On("click", this.OnLoad_Click.bind(this));
		
		this.Node('btnLoad').On('click', this.OnButtonLoader_Click.bind(this));
		this.Node('btnViz').On('click', this.OnButtonViz_Click.bind(this));
		this.Node('btnConvert').On('click', this.OnButtonConvert_Click.bind(this));
		this.Node('btnRise').On('click', this.OnButtonRise_Click.bind(this));
		this.Node('btnSettings').On('click', this.OnButtonSettings_Click.bind(this));
		
		this.widgets.converter.On("converted", this.OnConverter_Converted.bind(this));
		this.widgets.converter.On("error", this.OnWidget_Error.bind(this));
		
		this.widgets.rise.On("FilesReady", this.OnRise_Loaded.bind(this));
		this.widgets.rise.On("error", this.OnWidget_Error.bind(this));
	}
		
	OnUpload_Change(ev) {
		this.Elem("load").disabled = false;
	}
	
	OnLoad_Click(ev) {		
		var parser = new Standardized();
		
		var p = parser.Parse(this.Elem('upload').files);
		
		p.then(this.OnParser_Parsed.bind(this), (error) => { this.OnWidget_Error({ error:error }); });
	}
	
	OnParser_Parsed(json) {
		this.Elem("btnViz").disabled = false;
		
		this.simulation = Simulation.FromJson(json);
		
		this.simulation.Initialize(this.settings.Cache);
		
		var widget = (this.simulation.type == "DEVS") ? "diagram" : "grid";
		
		this.SwitchWidget(widget);
		
		this.Elem("playback").Initialize(this.simulation, this.settings);
	}
	
	OnButtonRise_Click(ev) {
		this.ShowPopup(Core.Nls("Popup_Rise_Title"), this.widgets.rise, 'rise-loader');
	}
	
	OnButtonLoader_Click(ev) {				
		this.SwitchWidget("dropzone");
	}
	
	OnButtonViz_Click(ev) {		
		var widget = (this.simulation.type == "DEVS") ? "diagram" : "grid";
		
		this.SwitchWidget(widget);
	}
	
	OnButtonConvert_Click(ev) {
		this.ShowPopup(Core.Nls("Popup_Converter_Title"), this.widgets.converter, 'converter');
	}
	
	OnButtonSettings_Click(ev) {
		this.ShowPopup(Core.Nls("Popup_Settings_Title"), this.widgets.settings, 'settings');
	}
	
	OnConverter_Converted(ev) {
		this.HidePopup();
	}
	
	OnRise_Loaded(ev) {
		this.HidePopup();
		
		this.Elem("upload").Update(ev.files);
	}
	
	OnWidget_Error(ev) {
		alert (ev.error);
	}
	
	SwitchWidget(widget) {
		if (widget == this.current.id) return;
		
		Dom.SetCss(this.Elem("main"), `${widget}-visible`);
		
		if (this.current.auto) this.current.auto.Destroy();
		
		if (widget == "diagram") {
			this.current.auto = new DiagramAuto(this.Elem("diagram"), this.simulation);
		}
		else if (widget === "grid") {
			// this.current.auto = new GridAuto(this.Elem("grid"), this.simulation);
		}
		else {
			this.current.auto = null;
		}
		
		this.current.id = widget;
	}
	
	ShowPopup(title, widget, css) {
		this.popup.Widget = widget;
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
					
					"<div class='body-container'>" + 
					   "<div class='body-column'>" + 
						  "<button handle='btnLoad' title='nls(Dropzone_Load)' class='fas fa-file-upload'></button>" +
						  "<button handle='btnViz' title='nls(Dropzone_Viz)' class='fas fa-eye' disabled></button>" +
					   "</div>" +
					   "<div handle='body'>" +
						   "<div handle='dropzone' class='dropzone-container'>" + 
							   "<div handle='upload' widget='Widget.Box-Input-Files'></div>" +
							   "<button handle='load' class='save' disabled>nls(Dropzone_Load)</button>" +
						   "</div>" +
						   "<div handle='viz' class='viz-container'>" +
							   "<div handle='diagram' widget='Widgets.Diagram' class='diagram-widget-container'></div>" +
							   "<div handle='playback' widget='Widget.Playback'></div>" +
						   "</div>" +
					   "</div>" +
					   "<div class='body-column'>" + 
						  "<button handle='btnConvert' title='nls(Dropzone_Convert)' class='fas fa-exchange-alt'></button>" +
						  "<button handle='btnRise' title='nls(Dropzone_Rise)' class='fas fa-cloud-download-alt'></button>" +
						  "<button handle='btnSettings' title='nls(Playback_Settings)' class='fas fa-tools'></button>" +
					   "</div>" +
					"</div>" +
					
					
				"</main>";
	}
}