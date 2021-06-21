'use strict';

import Core from '../../tools/core.js';
import Dom from '../../tools/dom.js';
import Templated from '../../components/templated.js';
import Popup from '../../ui/popup.js';
import Select from '../../ui/select.js';
import Ports from './ports.js';

export default Core.Templatable("Widget.Settings.Layers", class Layers extends Templated { 
	
	set settings(value) { this._settings = value; }
	
	get settings() { return this._settings; }

	constructor(id) {
		super(id);
		
		this.items = null;
		
		this.Node('addLayer').On("click", this.OnButtonAddLayer_Click.bind(this));
	}
	
	Refresh() {
		this.items.forEach(item => {
			item.style.Empty();
			
			this.settings.styles.forEach((style, i) => {
				item.style.Add(i, null, i);
		
				item.style.Select((s, i) => i == item.data.style);
			});
		});
	}
	
	Initialize(simulation, settings) {	
		this.items = [];
		
		this.simulation = simulation;
		this.settings = settings;
		
		this.settings.layers.forEach((l) => this.AddLayer(l));
	}
	
	AddLayer(l) {
		var item = {}
		
		item.data = l;
		item.row = Dom.Create("tr", { className:"table-row" }, this.Elem("body"));		
		item.z = this.AddZ(item, this.simulation.maxZ);
		item.ports = this.AddPorts(item, this.simulation.ports);
		item.style = this.AddStyle(item, this.settings.styles);
		item.btnDelete = this.AddDeleteButton(item);
		
		this.items.push(item);
	}
	
	RemoveLayer(item) {
		var i = this.items.indexOf(item);
		
		this.items.splice(i, 1);
	}
	
	AddZ(item, max, selected) {
		var td = Dom.Create("td", { className:"grid-z"}, item.row);
		var select = new Select(td);

		for (var i = 0; i < max; i++) select.Add(i, null, i);
		
		select.Select(s => s == item.data.z);
		
		select.On("Change", ev => {
			item.data.z = ev.item;
			
			this.settings.Set("layers", this.settings.layers);
		})
		
		return select;
	}
	
	AddPorts(item, ports, selected) {
		var td = Dom.Create("td", { className:"grid-ports"}, item.row);
		
		var select = new Ports(td);
		
		select.available = ports;
		
		select.Select(item.data.ports);
		
		select.On("Change", ev => {
			item.data.ports = ev.target.value;
			
			this.settings.Set("layers", this.settings.layers);
		})
		
		return select;
	}
		
	AddStyle(item, styles, selected) {
		var td = Dom.Create("td", { className:"grid-styles"}, item.row);
		
		var select = new Select(td);

		styles.forEach((s, i) => select.Add(i, null, s));
		
		select.Select((s, i) => i == item.data.style);
		
		select.On("Change", ev => {
			item.data.style = styles.indexOf(ev.item);
			
			this.settings.Set("layers", this.settings.layers);
		})
		
		return select;
	}
	
	AddDeleteButton(item) {
		var td = Dom.Create("td", { className:"grid-delete"}, item.row);
		var btn = Dom.Create("button", { className:"table-button button-delete image-button" }, td);
		var img = Dom.Create("img", { className:"image-icon", src:"./assets/delete.png", title:this.nls.Ressource("Settings_Layers_Delete_Title") }, btn);
		
		btn.addEventListener('click', this.OnButtonDelete_Click.bind(this, item));
		
		return btn;
	}
	
	OnButtonAddLayer_Click(ev) {
		var layer = this.settings.AddLayer(0, this.simulation.ports, 0);
		
		this.AddLayer(layer);
		
		this.Elem("layers").scrollTop = this.Elem("layers").scrollHeight;
		
		this.settings.Set("layers", this.settings.layers);
	}
		
	OnButtonDelete_Click(item, ev) {		
		this.settings.RemoveLayer(item.data);
		
		this.RemoveLayer(item)
		
		Dom.Remove(item.row, this.Elem("body"));
		
		this.items.forEach((item, i) => item.data.i = i + 1);
		
		this.settings.Set("layers", this.settings.layers);
	}		
	
	Template() {
		return  "<div handle='layers' class='layers'>" + 
				   "<table>" + 
					  "<thead>" +
						 "<tr>" + 
							"<td class='col-1'>nls(Settings_Layers_Z)</td>" +
							"<td class='col-2'>nls(Settings_Layers_Ports)</td>" +
							"<td class='col-3'>nls(Settings_Layers_Styles)</td>" +
							"<td class='col-4'></td>" +
						 "</tr>" +
					  "</thead>" + 
					  "<tbody handle='body'></tbody>" + 
					  "<tfoot handle='foot'>" + 
						 "<tr>" + 
							"<td class='col-1'></td>" +
							"<td class='col-2'></td>" +
							"<td class='col-3'></td>" +
							"<td class='col-4'>" + 
							   "<button handle='addLayer' class='table-button image-button' title='nls(Settings_Layers_Add_Title)'>" + 
								  "<img src='./assets/add.png' class='image-icon'/>" +
							   "</button>" +								
							"</td>" +
						 "</tr>" +
					  "</tfoot>" + 
				   "</table>" + 
				"</div>";
	}
	
	static Nls() {
		return {
			"Settings_Layers_Z" : {
				"en" : "Z"
			},
			"Settings_Layers_Ports" : {
				"en" : "Ports"
			},
			"Settings_Layers_Styles" : {
				"en" : "Style"
			},
			"Settings_Layers_Add_Title" : {
				"en" : "Add another grid to the visualization"
			},
			"Settings_Layers_Delete_Title" : {
				"en" : "Remove grid no from visualization"
			}
		}
	}
});