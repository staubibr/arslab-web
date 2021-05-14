'use strict';

import Core from '../../tools/core.js';
import Dom from '../../tools/dom.js';
import Net from '../../tools/net.js';
import Style from '../../tools/style.js'
import Templated from '../../components/templated.js';
import ChunkReader from '../../components/chunkReader.js';
import Select from '../../ui/select.js';

import Map from '../../components/ol/map.js'
import Legend from "../../components/ol/legend.js";

export default Core.Templatable("Widgets.GIS.VariableSelect", class GIS extends Templated { 
	
	get Selected() { return this._selected; }
	
	get control() { return this._control; }
	
	constructor(node) {
		super(node);
		
		this._selected = {};
		
		this._control = new ol.control.Control({ element: this.Elem("variable-select-container") });
	}
	
	AddSelectors(layers, variables) {
		// Add map widgets, some of them require everything to be ready		
		layers.forEach(l => {
			var filtered = variables.filter(s => s.layer.id == l.id);
			
			if (filtered.length == 0) return; 
			
			this.AddSelector(l, filtered);
		});
	}
	
	AddSelector(layer, variables) {
		var title = this.nls.Ressource("title_variable_select")
		var select = new Select(this.Elem("variable-select-container"));
		
		variables.forEach((v, i) => {			
			select.Add(v.name, null, { layer:layer, variable:v });
		});
		
		select.value = 0;

		this.Selected[layer.id] = variables[0];
		
		select.On("Change", this.onVariableSelect_Change.bind(this));
	}

	onVariableSelect_Change(ev){
		this.Selected[ev.item.layer.id] = ev.item.variable;
		
		this.Emit("Change", { selected:this.Selected });
	}
	
	Template() {
		return "<div handle='variable-select-container' class='variable-select-container custom-control'>" + 
				   "<label>nls(label_variable_select)</label>" +
				"</div>";
	}
	
	static Nls() {
		return {
			"label_variable_select" : {
				"en": "Select layer variables:",
				"fr": "Choisissez les variables:"
			},
			"title_variable_select" : {
				"en": "Select a simulation variable to display on the map",
				"fr": "Choisissez une variable de simulation à afficher sur la carte"
			}
		}
	}
});