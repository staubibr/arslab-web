'use strict';

import Core from '../../tools/core.js';
import Dom from '../../tools/dom.js';
import Net from '../../tools/net.js';
import Templated from '../../components/templated.js';
import Select from '../../ui/select.js';

export default Core.Templatable("Widget.Settings.Styles", class Styles extends Templated { 
	
	constructor(container) {
		super(container);
		
		this.items = null;
		this.tooltip = null;
		this.bIdx = null;
		
		this.BuildTooltip();
		
		// Need to make Node access uniform (widget vs node vs element)
		this.Widget('selectStyle').On("Change", this.OnSelectStyle_Change.bind(this));
		this.Node('btnAddStyle').On("click", this.OnButtonAddStyle_Click.bind(this));
		this.Node('btnDelStyle').On("click", this.OnButtonDelStyle_Click.bind(this));
		
		this.Node('addClass').On("click", this.OnButtonAddClass_Click.bind(this));
	}
	
	BuildTooltip() {
		this.tooltip = Dom.Create("div", { className:"color-picker-container hidden" }, document.body);
		
		this.picker = new iro.ColorPicker(this.tooltip, {
			width : 170,
			layoutDirection : "vertical",
			sliderSize : 15
		});
		
		this.picker.base.children[0].tabIndex = 0;
		this.picker.base.children[1].tabIndex = 0;
		
		this.picker.on("input:end", this.onPicker_ColorChange.bind(this));
		
		this.tooltip.addEventListener("mouseleave", (ev) => {
			Dom.AddCss(this.tooltip, "hidden");
		
			this.bIdx = null;
		});
	}
	
	Initialize(settings, style) {
		this.settings = settings;
		
		this.LoadStylesDropdown();		
		this.ShowStyle(style);
	}
	
	LoadStylesDropdown() {
		this.Widget('selectStyle').Empty();
		
		this.settings.styles.forEach((s, i) => this.Widget('selectStyle').Add(i, null, s));
	}
	
	ShowStyle(style) {
		this.Widget("selectStyle").value = style;
		
		Dom.Empty(this.Elem("body"));
		
		this.items = [];
		
		this.settings.styles[style].buckets.forEach(c => this.AddStyleClass(c));
	}
	
	AddStyleClass(c) {
		var item = {};
		
		item.data = c;
		item.row = Dom.Create("tr", { className:"table-row" }, this.Elem("body"));
		item.start = this.AddStart(item.row, c);
		item.end = this.AddEnd(item.row, c);
		item.color = this.AddColor(item.row, c, this.items.length);
		item.btnDelete = this.AddDeleteButton(item);
		
		item.start.addEventListener("change", ev => {
			item.data.start = +ev.target.value;
		
			this.settings.Set("styles", this.settings.styles);
		});
		
		item.end.addEventListener("change", ev => { 
			item.data.end = +ev.target.value;
		
			this.settings.Set("styles", this.settings.styles);
		});
		
		this.items.push(item);
	}
	
	AddStart(tr, c) {
		var td = Dom.Create("td", { className:"styles-start"}, tr);
		
		return Dom.Create("input", { value:c.start, type:'number' }, td);
	}
	
	AddEnd(tr, c) {
		var td = Dom.Create("td", { className:"styles-end"}, tr);
		
		return Dom.Create("input", { value:c.end, type:'number' }, td);
	}
	
	AddColor(tr, c, i) {
		var td = Dom.Create("td", { className:"styles-color"}, tr);
		var btn = Dom.Create("button", { className:"color" }, td);

		btn.style.backgroundColor = `rgb(${c.color})`;

		btn.addEventListener("click", (ev) => {
			this.bIdx = i;
			
			var geom = ev.target.getBoundingClientRect();
			
			this.tooltip.style.left = (geom.left - window.scrollX) + "px";
			this.tooltip.style.top = (geom.top - window.scrollY) + "px";
			
			Dom.RemoveCss(this.tooltip, "hidden");
		});

		return btn;
	}
	
	AddDeleteButton(item) {
		var td = Dom.Create("td", { className:"grid-delete"}, item.row);
		var btn = Dom.Create("button", { className:"table-button button-delete image-button" }, td);
		var img = Dom.Create("img", { className:"image-icon", src:"./assets/delete.png", title:this.nls.Ressource("Settings_Class_Delete_Title") }, btn);
		
		btn.addEventListener('click', this.OnButtonDeleteClass_Click.bind(this, item));
		
		return btn;
	}
	
	OnButtonAddClass_Click(ev) {	
		var i = this.Widget('selectStyle').value;
		var c = { start:0, end:0, color:[255, 255, 255] };
		
		this.settings.styles[i].buckets.push(c);
	
		this.AddStyleClass(c);
		
		this.Elem("classes").scrollTop = this.Elem("classes").scrollHeight;
	}	
	
	OnButtonDeleteClass_Click(item, ev) {		
		var i = this.Widget('selectStyle').value;
		var j = this.items.indexOf(item);
		
		this.settings.styles[i].buckets.splice(j, 1);
		this.items.splice(j, 1);
		
		Dom.Remove(item.row, this.Elem("body"));
		
		this.settings.Set("styles", this.settings.styles);
	}
	
	OnSelectStyle_Change(ev) {		
		this.ShowStyle(ev.target.value);
	}	
	
	OnButtonAddStyle_Click(ev) {
		var style = this.settings.AddStyle([]);
		
		this.LoadStylesDropdown(this.settings.styles);
		
		this.ShowStyle(this.settings.styles.length - 1);
		
		this.settings.Set("styles", this.settings.styles);
	}
	
	OnButtonDelStyle_Click(ev) {
		this.settings.RemoveStyle(this.Widget("selectStyle").selected)
		
		this.LoadStylesDropdown(this.settings.styles);
		
		this.ShowStyle(0);
		
		this.settings.Set("styles", this.settings.styles);
		
		Dom.ToggleCss(this.Elem('btnDelStyle'), 'hidden', this.settings.styles.length == 1);
		
		this.Emit("styleDeleted");
	}
	
	onPicker_ColorChange(ev) {
		var c = this.picker.color.rgb;
		
		this.items[this.bIdx].color.style.backgroundColor = this.picker.color.rgbString;
		this.items[this.bIdx].data.color = [c.r, c.g, c.b];
		
		this.settings.Set("styles", this.settings.styles);
	}
	
	Template() {
		return	 "<div class='settings-title-container'>" +
				    "<h3 class='settings-group-label Cell-DEVS'>nls(Settings_Styles)</h3>" +
				    "<div handle='selectStyle' class='style-add' widget='Basic.UI.Select'></div>" +
					"<button handle='btnAddStyle' class='table-button image-button' title='nls(Settings_Layers_Add_Style_Title)'>" + 
					   "<img src='./assets/add.png' class='image-icon'/>" +
					"</button>" +		
					"<button handle='btnDelStyle' class='table-button image-button' title='nls(Settings_Layers_Del_Style_Title)'>" + 
					   "<img src='./assets/delete.png' class='image-icon'/>" +
					"</button>" +		
				 "</div>" + 
				 "<div handle='classes' class='style'>" + 
					"<table>" + 
						"<thead>" +
							"<tr>" + 
								"<td class='col-1'>nls(Settings_Style_Start)</td>" +
								"<td class='col-2'>nls(Settings_Style_End)</td>" +
								"<td class='col-3'>nls(Settings_Style_Color)</td>" +
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
									"<button handle='addClass' class='table-button image-button' title='nls(Settings_Class_Add_Title)'>" + 
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
			"Settings_Styles" : {
				"en" : "Modify style no."
			},
			"Settings_Layers_Add_Style_Title" : {
				"en" : "Add a new style to the visualization"
			},
			"Settings_Layers_Del_Style_Title" : {
				"en" : "Remove this style from the visualization"
			},
			"Settings_Style_Start" : {
				"en" : "Start"
			},
			"Settings_Style_End" : {
				"en" : "End"
			},
			"Settings_Style_Color" : {
				"en" : "Color"
			},
			"Settings_Class_Add_Title" : {
				"en" : "Add a color classification to the visualization"
			},
			"Settings_Class_Delete_Title" : {
				"en" : "Remove color classification from visualization"
			}			
		}
	}
})