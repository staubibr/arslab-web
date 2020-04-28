'use strict';

import Core from '../../basic-tools/tools/core.js';
import Dom from '../../basic-tools/tools/dom.js';
import Templated from '../../basic-tools/components/templated.js';
import oSettings from '../../web-devs-tools/components/settings.js';

export default Core.Templatable("Widget.Settings", class Settings extends Templated { 
	
	get Settings() { return this.settings; }

	constructor(id) {
		super(id);
		
		this.settings = new oSettings();
			
		this.settings.On("Session", this.onSettingsSession_Handler.bind(this));
			
		this.Node("height").On("change", this.onHeightChange_Handler.bind(this));
		this.Node("width").On("change", this.onWidthChange_Handler.bind(this));
		this.Node("fps").On("change", this.onFPSChange_Handler.bind(this));
		this.Node("loop").On("change", this.onLoopChange_Handler.bind(this));
		this.Node("showGrid").On("change", this.onShowGridChange_Handler.bind(this));
		
		this.UpdateUI();
	}
	
	UpdateUI() {
		this.Elem("fps").value = this.settings.FPS; 
		this.Elem("height").value = this.settings.Height; 
		this.Elem("width").value = this.settings.Width; 
		this.Elem("loop").checked = this.settings.Loop; 
		this.Elem("showGrid").checked = this.settings.ShowGrid; 
	}
	
	Template() {
		return "<div class='settings'>" +
				  "<div class='settings-line'>" +
				     "<label class='settings-label'>nls(Settings_Height)</label>" +
				     "<input class='settings-value' handle='height' type='number'></input>" +
			      "</div>" +
				  "<div class='settings-line'>" +
				     "<label class='settings-label'>nls(Settings_Width)</label>" +
				     "<input class='settings-value' handle='width' type='number'></input>" +
			      "</div>" +
			      "<div class='settings-line'>" +
				     "<label class='settings-label'>nls(Settings_FPS)</label>" +
				     "<input class='settings-value' handle='fps' type='number'></input>" +
			      "</div>" +
			      "<div class='settings-line'>" +
				     "<label for='s-loop' class='settings-label'>nls(Settings_Loop)</label>" +
			         "<input id='s-loop' class='settings-value' handle='loop' type='checkbox'></input>" +
			      "</div>"+
			      "<div class='settings-line'>" +
				     "<label for='s-showGrid' class='settings-label'>nls(Settings_ShowGrid)</label>" +
				     "<input id='s-showGrid' class='settings-value' handle='showGrid' type='checkbox' disabled></input>" +
			      "</div>" +
			   "</div>";
	}
	
	onHeightChange_Handler(ev) {
		this.settings.Height = +ev.target.value;
	}
	
	onWidthChange_Handler(ev) {
		this.settings.Width = +ev.target.value;
	}
	
	onFPSChange_Handler(ev) {
		this.settings.FPS = +ev.target.value;
	}
	
	onLoopChange_Handler(ev) {
		this.settings.Loop = ev.target.checked;
	}
	
	onShowGridChange_Handler(id, ev) {
		this.settings.ShowGrid = ev.target.checked;
	}
	
	onSettingsSession_Handler(ev) {
		this.UpdateUI();
	}
});