'use strict';

import Core from '../../api-basic/tools/core.js';
import Dom from '../../api-basic/tools/dom.js';
import Templated from '../../api-basic/components/templated.js';
import oSettings from '../../api-web-devs/components/settings.js';

export default Core.Templatable("Widget.Settings", class Settings extends Templated { 
	
	get Settings() { return this.settings; }

	constructor(id) {
		super(id);
		
		this.settings = new oSettings();
		
		// Link UI to setting parameters
		// Each item requires two delegates, setting is used to update the settings object from the ui, ui is used to
		// update the ui from the settings object
		this.ui = [
			{ group:"diagram", property:"height", node:"diagramHeight", setting: el => +el.value, ui: (el,v) => { el.value = v; }},
			{ group:"diagram", property:"width", node:"diagramWidth", setting: el => +el.value, ui: (el,v) => { el.value = v; } },
			{ group:"diagram", property:"aspect", node:"diagramAspect", setting: el => el.checked, ui: (el,v) => { el.checked = v; } },
			{ group:"grid", property:"columns", node:"gridColumns", setting: el => +el.value, ui: (el,v) => { el.value = v; } },
			{ group:"grid", property:"height", node:"gridHeight", setting: el => +el.value, ui: (el,v) => { el.value = v; } },
			{ group:"grid", property:"width", node:"gridWidth", setting: el => +el.value, ui: (el,v) => { el.value = v; } },
			{ group:"grid", property:"spacing", node:"gridSpacing", setting: el => +el.value, ui: (el,v) => { el.value = v; } },
			{ group:"grid", property:"showGrid", node:"gridShowGrid", setting: el => el.checked, ui: (el,v) => { el.checked = v; } },
			{ group:"grid", property:"aspect", node:"gridAspect", setting: el => el.checked, ui: (el,v) => { el.checked = v; } },
			{ group:"playback", property:"speed", node:"playbackSpeed", setting: el => +el.value, ui: (el,v) => { el.value = v; } },
			{ group:"playback", property:"loop", node:"playbackLoop", setting: el => el.checked, ui: (el,v) => { el.checked = v; } }
		]
		
		// Hook up change event for each ui element, when ui element changes, update corresponding setting
		this.ui.forEach(u => {
			this.Node(u.node).On("change", ev => {
				this.settings.Set(u.group, u.property, u.setting(ev.target));
			});
		})
		
		this.Elem(this.ui[0].node).disabled = this.settings.Get("diagram", "aspect");
		this.Elem(this.ui[4].node).disabled = this.settings.Get("grid", "aspect");
		
		this.Node(this.ui[2].node).On("change", (ev) => {
			this.Elem(this.ui[0].node).disabled = this.settings.Get("diagram", "aspect");
		});
		
		this.Node(this.ui[8].node).On("change", (ev) => {
			this.Elem(this.ui[4].node).disabled = this.settings.Get("grid", "aspect");
		});
		
		// Special cases height and width because of aspect ratio
		// this.Node(this.ui[0].node).On("change", ev => this.UpdateElement(this.ui[1]));
		// this.Node(this.ui[1].node).On("change", ev => this.UpdateElement(this.ui[0]));
		// this.Node(this.ui[4].node).On("change", ev => this.UpdateElement(this.ui[5]));
		// this.Node(this.ui[5].node).On("change", ev => this.UpdateElement(this.ui[4]));
		
		// Initial UI values
		this.UpdateUI();
	}
	
	UpdateElement(u) {
		var value = this.settings.Get(u.group, u.property);
		
		u.ui(this.Elem(u.node), value);
	}
	
	UpdateUI() {
		this.ui.forEach(u => {
			this.UpdateElement(u);
		});
	}
	
	//onSettingsChange_Handler(ev) {
	//	ev.changes.forEach(c => {
	//		var ui = this.ui.find(ui => ui.group == c.group && ui.property == c.property);
	//		
	//		ui.ui(this.Elem(ui.node), c.value);
	//	});
	//}
	
	Template() {
		return "<div class='settings'>" +
					"<h3 class='settings-group-label'>nls(Settings_Diagram_Options)</h3>" +
					"<div class='settings-group'>" + 
						"<div class='settings-line'>" +
							"<label class='settings-label'>nls(Settings_Diagram_Width)" +
								"<input class='settings-value' handle='diagramWidth' type='number' min=300></input>" +
							"</label>" +
						"</div>" +
						"<div class='settings-line'>" +
							"<label class='settings-label'>nls(Settings_Diagram_Height)" +
								"<input class='settings-value' handle='diagramHeight' type='number' min=300></input>" +
							"</label>" + 
						"</div>" +
						"<div class='settings-line'>" +
							"<label class='settings-label'>nls(Settings_Diagram_Aspect)" +
								"<input class='settings-value' handle='diagramAspect' type='checkbox'></input>" +
							"</label>" + 
						"</div>" +
					"</div>" +
					"<h3 class='settings-group-label'>nls(Settings_Grid_Options)</h3>" +
					"<div class='settings-group'>" + 
						"<div class='settings-line'>" +
							"<label class='settings-label'>nls(Settings_Grid_Width)" +
								"<input class='settings-value' handle='gridWidth' type='number' min=100></input>" +
							"</label>" + 
						"</div>" +
						"<div class='settings-line'>" +
							"<label class='settings-label'>nls(Settings_Grid_Height)" +
								"<input class='settings-value' handle='gridHeight' type='number' min=100></input>" +
							"</label>" + 
						"</div>" +
						"<div class='settings-line'>" +
							"<label class='settings-label'>nls(Settings_Grid_Aspect)" +
								"<input class='settings-value' handle='gridAspect' type='checkbox'></input>" +
							"</label>" + 
						"</div>" +
						"<div class='settings-line'>" +
							"<label class='settings-label'>nls(Settings_Grid_Columns)" +
								"<input class='settings-value' handle='gridColumns' type='number' min=1 max=4></input>" +
							"</label>" + 
						"</div>" +
						"<div class='settings-line'>" +
							"<label class='settings-label'>nls(Settings_Grid_Spacing)" +
								"<input class='settings-value' handle='gridSpacing' type='number' min=100></input>" +
							"</label>" + 
						"</div>" +
						"<div class='settings-line'>" +
							"<label class='settings-label'>nls(Settings_Grid_ShowGrid)" +
								"<input class='settings-value' handle='gridShowGrid' type='checkbox' disabled></input>" +
							"</label>" + 
						"</div>" +
					
					"</div>" +
					"<h3 class='settings-group-label'>nls(Settings_Playback_Options)</h3>" +
					"<div class='settings-group'>" + 
						"<div class='settings-line'>" +
							"<label class='settings-label'>nls(Settings_Playback_Speed)</label>" +
								"<input class='settings-value' handle='playbackSpeed' type='number' min=1 max=50></input>" +
							"</label>" + 
						"</div>" +
						"<div class='settings-line'>" +
							"<label class='settings-label'>nls(Settings_Playback_Loop)" +
								"<input class='settings-value' handle='playbackLoop' type='checkbox'></input>" +
							"</label>" + 
						"</div>"+
						"<div class='settings-line'>" +
							"<label class='settings-label'>nls(Settings_Playback_Cache)" +
								"<input class='settings-value' handle='playbackCache' type='number' min=10 max=1000 disabled></input>" +
							"</label>" + 
						"</div>"+
					"</div>" +
			   "</div>";
	}
});