'use strict';

import Core from '../basic-tools/tools/core.js';
import Net from '../basic-tools/tools/net.js';
import Dom from '../basic-tools/tools/dom.js';
import Templated from '../basic-tools/components/templated.js';
import BoxInput from '../basic-tools/ui/box-input-files.js';
import Popup from '../basic-tools/ui/popup.js';

import Header from './widgets/header.js';

import Playback from '../web-devs-tools/widgets/playback.js';
import Rise from '../web-devs-tools/widgets/rise-loader.js';
import Converter from '../web-devs-tools/widgets/converter.js';
import Settings from '../web-devs-tools/widgets/settings.js';

export default class Main extends Templated { 

	get Settings() { return this.Elem("settings").Settings; }

	constructor(node) {		
		super(node);
		
		this.popup = new Popup(this.Elem('main'));
		
		this.widgets = {
			converter : new Converter(),
			rise : new Rise(),
			settings : new Settings()
		}
		
		this.Elem('upload').Icon = 'fa-file-upload';
		this.Elem('upload').Label = Core.Nls('Dropzone_Upload_Label');
		this.Elem('upload').Label = Core.Nls('Dropzone_Upload_Label');
		
		this.Elem('convert').addEventListener('click', this.OnButtonConvert_Click.bind(this));
		this.Elem('rise').addEventListener('click', this.OnButtonRise_Click.bind(this));
		this.Elem('settings').addEventListener('click', this.OnButtonSettings_Click.bind(this));
		
		this.widgets.converter.On("converted", this.OnConverter_Converted.bind(this));
		this.widgets.converter.On("error", this.OnWidget_Error.bind(this));
		
		this.widgets.rise.On("FilesReady", this.OnRise_Loaded.bind(this));
		this.widgets.rise.On("error", this.OnWidget_Error.bind(this));
	}
	// this.Elem("playback").Initialize(this.simulation, this.Settings);
	
	OnButtonRise_Click(ev) {
		this.ShowPopup(Core.Nls("Popup_Rise_Title"), this.widgets.rise, 'rise-loader');
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
		return	"<main handle='main'>" +
					"<div handle='header' widget='Widget.Header'></div>" +
					
					"<div class='dropzone-container'>" + 
					   "<div class='dropzone-column'></div>" +
					   "<div handle='upload' widget='Widget.Box-Input-Files'></div>" +
					   "<div class='dropzone-column'>" + 
						  "<button handle='convert' title='nls(Dropzone_Convert)' class='fas fa-exchange-alt'></button>" +
						  "<button handle='rise' title='nls(Dropzone_Rise)' class='fas fa-cloud-download-alt'></button>" +
						  "<button handle='settings' title='nls(Playback_Settings)' class='fas fa-tools'></button>" +
					   "</div>" +
					"</div>" +
					
					"<div handle='playback' widget='Widget.Playback'></div>" +
				"</main>";
	}
}