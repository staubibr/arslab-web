'use strict';

import Header from './widgets/header.js';

import Core from '../api-basic/tools/core.js';
import Net from '../api-basic/tools/net.js';
import Dom from '../api-basic/tools/dom.js';
import Templated from '../api-basic/components/templated.js';

import BoxInput from '../api-basic/ui/box-input-files.js';
import Popup from '../api-basic/ui/popup.js';

import Playback from '../api-web-devs/widgets/playback.js';
import Rise from '../api-web-devs/widgets/rise-loader.js';
import Converter from '../api-web-devs/widgets/converter.js';
import Settings from '../api-web-devs/widgets/settings.js';

import Standardized from '../api-web-devs/parsers/standardized.js'

import SimulationDEVS from '../api-web-devs/simulation/simulationDEVS.js'
import SimulationCA from '../api-web-devs/simulation/simulationCA.js'

import DiagramAuto from '../api-web-devs/widgets/diagram/auto.js'
import Diagram from '../api-web-devs/widgets/diagram/diagram.js'

import GridAuto from '../api-web-devs/widgets/grid/auto.js'
import Grid from '../api-web-devs/widgets/grid/grid.js'

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
		
		this.settings.On("Change", this.OnSettings_Change.bind(this));
	}
		
	OnUpload_Change(ev) {
		this.Elem("load").disabled = false;
	}
	
	OnLoad_Click(ev) {		
		var parser = new Standardized();
		
		var files = this.Elem('upload').files;
		var options = files.find(f => f.name == "options.json");
		var defs = [parser.Parse(this.Elem('upload').files)];
		
		if (options) defs.push(options.text());

			
		parser.On("Progress", (ev) => {
			// TODO : Should use variable css colors			
			var c1 = "#198CFF";
			var c2 = "#0051A3";
			
			var bg = `linear-gradient(to right, ${c1} 0%, ${c1} ${ev.progress}%, ${c2} ${ev.progress}%, ${c2} 100%)`;
			
			this.Elem("load").style.backgroundImage = bg;		
		});
		
		Promise.all(defs).then(this.OnParser_Parsed.bind(this), (error) => { this.OnWidget_Error({ error:error }); });
	}
	
	OnParser_Parsed(results) {		
		if (results[1]) {
			var options = JSON.parse(results[1]);
			
			this.settings.json = options;
		}
		
		this.Elem("load").style.backgroundImage = null;			
		this.Elem("btnViz").disabled = false;
		
		var clss = (results[0].type == "DEVS") ? SimulationDEVS : SimulationCA;
		
		this.simulation = clss.FromJson(results[0]);
		
		this.simulation.Initialize(this.settings.Get("playback", "cache"));
		
		var widget = (this.simulation.type == "DEVS") ? "diagram" : "grid";
		
		this.SwitchWidget(widget);
		
		this.Resize(widget);
		
		this.current.auto.Redraw();
		
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
		this.widgets.settings.UpdateUI();
		
		this.ShowPopup(Core.Nls("Popup_Settings_Title"), this.widgets.settings, 'settings');
	}
	
	OnConverter_Converted(ev) {
		this.HidePopup();
	}
	
	OnRise_Loaded(ev) {
		this.HidePopup();
		
		this.SwitchWidget("dropzone");
		
		this.settings.json = ev.options;
		
		this.Elem("upload").files = ev.files;
		this.Elem("upload").Update(ev.files);
		this.Elem("load").disabled = false;
		
		this.OnLoad_Click(null);
	}
	
	OnWidget_Error(ev) {
		alert (ev.error);
	}
	
	OnSettings_Change(ev) {
		if (["height", "width", "columns", "spacing", "aspect"].indexOf(ev.property) == -1) return;
		
		this.Elem("grid").columns = this.settings.Get("grid", "columns");
		this.Elem("grid").spacing = this.settings.Get("grid", "spacing");
		
		this.Resize(this.current.id);
		
		if (this.current.auto) this.current.auto.Redraw();
	}
	
	Resize(widget, nGrids) {
		if (widget == "diagram") {
			var size = this.settings.DiagramSize(this.simulation);
		}
		else if (widget == "grid") {
			var n = this.Elem("grid").layers.length;
			
			var size = this.settings.GridSize(this.simulation, n);
		}
		else {
			throw new Error("Tried to retrieve size for invalid widget.");
		}
		
		this.Elem("body").style.width = size.width + "px";
		this.Elem("body").style.height = size.height + "px";
	}
	
	SwitchWidget(widget) {
		if (widget == this.current.id) return;
		
		Dom.SetCss(this.Elem("main"), `${widget}-visible`);
		
		if (this.current.auto) this.current.auto.Destroy();
		
		if (widget == "diagram") {			
			this.current.auto = new DiagramAuto(this.Elem("diagram"), this.simulation, { clickEnabled:false });
		}
		else if (widget === "grid") {			
			// TODO : Always only one model in cell-devs?			
			var options = { 
				clickEnabled:false,
				columns:this.settings.Get("grid", "columns"), 
				spacing:this.settings.Get("grid", "spacing"), 
				layers:this.settings.Get("grid", "layers")
			}
			
			if (!options.layers) options.layers = this.simulation.LayersAndPorts();
			
			this.current.auto = new GridAuto(this.Elem("grid"), this.simulation, options);
		}
		else {
			this.Elem("body").style.width = null;
			this.Elem("body").style.height = null;
			
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
				    "<div class='centered-row'>" + 
						"<div class='button-column'>" + 
						   "<button handle='btnLoad' title='nls(Dropzone_Load)' class='fas fa-file-upload'></button>" +
						   "<button handle='btnViz' title='nls(Dropzone_Viz)' class='fas fa-eye' disabled></button>" +
						"</div>" +
						"<div class='body-container'>" + 
						   "<div handle='body' class='body'>" +
							   "<div handle='dropzone' class='dropzone-container'>" + 
								   "<div handle='upload' widget='Widget.Box-Input-Files'></div>" +
								   "<button handle='load' class='save' disabled>nls(Dropzone_Load)</button>" +
							   "</div>" +
							   "<div handle='viz' class='viz-container'>" +
								   "<div handle='diagram' widget='Widgets.Diagram' class='diagram-widget-container'></div>" +
								   "<div handle='grid' widget='Widgets.Grid' class='grid-widget-container'></div>" +
							   "</div>" +
						   "</div>" +
						"</div>" +
						"<div class='button-column'>" + 
						   "<button handle='btnConvert' title='nls(Dropzone_Convert)' class='fas fa-exchange-alt'></button>" +
						   "<button handle='btnRise' title='nls(Dropzone_Rise)' class='fas fa-cloud-download-alt'></button>" +
						   "<button handle='btnSettings' title='nls(Playback_Settings)' class='fas fa-tools'></button>" +
						"</div>" +
					"</div>" +
					"<div handle='playback' widget='Widget.Playback'></div>" +
				"</main>";
	}
}