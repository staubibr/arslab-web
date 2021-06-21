'use strict';

import Core from '../../tools/core.js';
import Dom from '../../tools/dom.js';
import Templated from '../../components/templated.js';
import Popup from '../../ui/popup.js';
import Layers from './layers.js';
import Styles from './styles.js';

export default Core.Templatable("Popup.Palette", class PopupPalette extends Popup { 
	
	set settings(value) { this._settings = value; }
	
	get settings() { return this._settings; }
	
	Initialize(simulation, settings) {		
		this.simulation = simulation;
		this.settings = settings.grid;
		
		this.Widget("styles").On(`styleDeleted`, ev => this.Widget("layers").Refresh());
		
		this.Widget("layers").Initialize(simulation, this.settings);
		this.Widget("styles").Initialize(this.settings, 0);
	}
	
	Template() {
		return "<div handle='popup' class='popup'>" +
				  "<div class='popup-header'>" +
					  "<h2 class='popup-title' handle='title'>nls(Popup_Palette_Title)</h2>" +
					  "<button class='close' handle='close' title='nls(Popup_Close)'>×</button>" +
				  "</div>" +
				  "<div class='popup-body popup-layers popup-settings' handle='body'>" + 
				     "<div class='settings-title-container'>" +
				        "<h3 class='settings-group-label Cell-DEVS'>nls(Settings_Layers)</h3>"+ 
				     "</div>" + 
					 "<div handle='layers' class='layers' widget='Widget.Settings.Layers'></div>" +
					 "<div handle='styles' class='styles' widget='Widget.Settings.Styles'></div>" +
				  "</div>" +
			   "</div>";
	}
	
	static Nls() {
		return {
			"Popup_Close": {
				"en": "Close",
				"fr": "Fermer"
			},
			"Popup_Palette_Title" : {
				"en":"Modify grid palette"
			},
			"Settings_Layers" : {
				"en" : "Modify grids"
			},
			"Settings_Layers_Style_Title" : {
				"en" : "Modify the style for grid"
			}
		}
	}
});