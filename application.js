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

	constructor(node) {		
		super(node);
		
		this.popup = new Popup();
		
		this.widgets = {
			converter : new Converter(),
			rise : new Rise(),
			settings : new Settings()
		}
		
		this.Node('upload').Icon = 'fa-file-upload';
		this.Node('upload').Label = Core.Nls('Dropzone_Upload_Label');
		this.Node('upload').Label = Core.Nls('Dropzone_Upload_Label');
		
		this.Node('convert').addEventListener('click', this.OnButtonConvert_Click.bind(this));
		this.Node('rise').addEventListener('click', this.OnButtonRise_Click.bind(this));
		this.Node('settings').addEventListener('click', this.OnButtonSettings_Click.bind(this));
	}
	
	OnButtonRise_Click(ev) {
		this.ShowPopup(Core.Nls("Popup_Rise_Title"), this.widgets.rise, 'rise-loader');
	}
	
	OnButtonConvert_Click(ev) {
		this.ShowPopup(Core.Nls("Popup_Converter_Title"), this.widgets.converter, 'converter');
	}
	
	OnButtonSettings_Click(ev) {
		this.ShowPopup(Core.Nls("Popup_Settings_Title"), this.widgets.settings, 'settings');
	}
	
	ShowPopup(title, widget, css) {
		this.popup.Widget = widget;
		this.popup.Title = title;
		
		this.popup.SetCss(`popup ${css}`);
		
		this.popup.Show();
	}
	
	Template() {
		return	"<main>" +
					"<div handle='header' widget='Widget.Header'></div>" +
					
					"<div class='dropzone-container'>" + 
					   "<div class='dropzone-column'></div>" +
					   "<div handle='upload' widget='Widget.Box-Input-Files'></div>" +
					   "<div class='dropzone-column'>" + 
						  "<button handle='convert' title='nls(Dropzone_Convert)' class='fas fa-exchange-alt'></button>" +
						  "<button handle='rise' title='nls(Dropzone_Rise)' class='fas fa-cloud-download-alt'></button>" +
						  "<button handle='settings' title='nls(Playback_Settings)' class='fas fa-tools' disabled></button>" +
					   "</div>" +
					"</div>" +
					
					"<div handle='playback' widget='Widget.Playback'></div>" +
				"</main>";
	}
}