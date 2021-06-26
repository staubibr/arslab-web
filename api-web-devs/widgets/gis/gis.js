'use strict';

import Core from '../../tools/core.js';
import Dom from '../../tools/dom.js';
import Style from '../../tools/style.js'
import Templated from '../../components/templated.js';
import ChunkReader from '../../components/chunkReader.js';
import VariableSelect from './variable-select.js';

import Map from '../../components/ol/map.js'
import Legend from "../../components/ol/legend.js";

export default Core.Templatable("Widgets.GIS", class GIS extends Templated { 

	get canvas() { 
		return this.Elem("map").querySelector(".ol-layer").firstChild; 
	}
	
	get Current() {
		return this.Widget("variable-select").Selected;
	}
	
	constructor(node) {
		super(node);
	}
	
	Load(config, data, simulation) {
		// TODO: This shouldn't be here but, just trying to get it done for now. I'll come back later.
		this.simulation = simulation;
		this.config = config;
		this.data = data;

		var d = Core.Defer();
	
		var basemap1 = Map.BasemapOSM(this.config.basemap == "openstreetmap");
		var basemap2 = Map.BasemapSatellite(this.config.basemap == "satellite");
	
		this.map = new Map(this.Elem("map"), [basemap1, basemap2]);
		
		if (config.view) this.map.SetView(config.view.center, config.view.zoom);

		else this.map.SetView([-75.7, 45.3], 10);
		
		// Add layers to the map according to the loaded geojson data
		data.forEach((data, i) => {
			var style = config.styles.find(s => s.id == config.layers[i].style);
		
			this.LoadLayer(data, config.layers[i], style);
		});

		this.map.On("click", this.OnMap_Click.bind(this));
		this.map.On("rendercomplete", this.OnMap_RenderComplete.bind(this, d));
		
		return d.promise;
	}
		
	LoadLayer(data, layerConfig, styleConfig) {
		data.name = layerConfig.id;
		
		var layer = this.map.AddGeoJsonLayer(layerConfig.id, data);
		
		layer.set('visible', false);
		
		var style = Style.FromJson(layerConfig.type, styleConfig);
		
		layer.setStyle(style.Symbol());
	}
	
	OnMap_RenderComplete(d, ev) {		
		// Show geo layers and draw simulation state
		for (var id in this.map.layers) {
			this.map.layers[id].set('visible', true);
		}
		
		// Prepare simulation styles, set first one as currently selected, 
		// update the variable selector to reflect the current property being coloured
		this.PrepareSimulationVisualization();
		
		// Add variable-select widget
		this.Widget("variable-select").AddSelectors(this.config.layers, this.config.variables);
		this.Widget("variable-select").On("Change", this.onVariableSelect_Change.bind(this));
		
		this.map.AddControl(this.Widget("variable-select").control);
		
		this.Draw(this.simulation.state.data);
		
		this.AddLegend();
		this.AddLayerSwitcher();
		
		d.Resolve(this.map);
	}
	
	Draw(data) {
		if (!this.map) return;
		
		for (var id in this.Current) {
			var features = this.map.LayerFeatures(id);
			var variable = this.Current[id];
			
			features.forEach(f => {
				var id = f.getProperties()[variable.layer.join];
				var d = data[id];
				
				if (d != null) f.setStyle(variable.style.Symbol(data[id]));
			});
		}
		
	}
	
	AddLegend(){	
		if (this.legend) this.map.RemoveControl(this.legend.control);

		this.legend = new Legend(this.Current);
		
		for (var id in this.Current) this.legend.AddLegend(this.Current[id]);
		
		this.map.AddControl(this.legend.control);
	}

	AddLayerSwitcher() {
		var ls = new ol.control.LayerSwitcher({ groupSelectStyle: "group" });
		
		this.map.AddControl(ls);
	}
	
	PrepareSimulationVisualization() {
		var stats = Style.Statistics(this.simulation);
		
		this.config.variables.forEach(s => {
			s.layer = this.config.layers.find(l => l.id == s.layer);
			s.style = Style.FromJson(s.layer.type, s);

			s.style.Bucketize(stats);
		});
	}

	onVariableSelect_Change(ev){		
		this.Draw(this.simulation.state.data);

		this.AddLegend();
	}
	
	OnMap_Click(ev) {
		this.ResetSelected();
		
		this.map.ShowPopup(null);
		
		this.selected = this.GetSelected(ev.features);
		
		if (!this.selected) return;
		
		this.HighlightSelected();
		
		var content = this.GetContent(this.selected);
		
		if (content.length > 0) this.map.ShowPopup(ev.coordinates, content);
	}
	
	GetSelected(features) {
		var selected = features.filter(f => {
			return !!this.Current[f.layer];			
		});
		
		return selected.length > 0 ? selected : null;
	}
	
	GetContent(selected) {
		var content = [];
		var messages = this.simulation.current_frame.output_messages;
		
		selected.forEach(s => {
			var variable = this.Current[s.layer];
			
			if (!variable) return;
			
			
			// state messages
			var props = s.feature.getProperties();
			var id = props[variable.layer.join];
			var model = this.simulation.Model(id);
			var data = this.simulation.state.GetValue(model);
			
			var line = `<div class='title'>${variable.layer.label}</div>`;
			
			line += `<ul class='properties'><li>Attributes</li>`;
			
			variable.layer.fields.forEach(f => line += `<li>${f}: ${props[f]}</li>`);
			
			line += `</ul>`;
			line += `<ul class='state-message'><li>State</li>`;
			
			for (var p in data) line += `<li>${p}: ${data[p]}</li>`
			
			line += `</ul>`;
			
			// output messages
			var tY = messages.filter(t => t.model.id == id);
			
			tY.forEach(t => {
				line += `<ul class='output-message'><li>Output</li>`;
				
				for (var p in t.value) line += `<li>${p}: ${t.value[p]}</li>`
				
				line += `</ul>`;
			});
			
			content.push(line);
		});
		
		return content.join(`<hr>`);
	}
	
	ResetSelected() {
		if (!this.selected) return;
		
		this.selected.forEach(s => {
			var variable = this.Current[s.layer];
			
			if (!variable) return;
			
			var id = s.feature.getProperties()[variable.layer.join];
			var model = this.simulation.Model(id);
			var data = this.simulation.state.GetValue(model);
			var style = variable.style.Symbol(data);
			
			s.feature.setStyle(style);
		});
	}
	
	HighlightSelected() {		
		if (!this.selected) return;
		
		this.selected.forEach(s => {
			// TODO: There's an issue here, highlight style has to be geometry type specific.
			var json = this.config.styles.find(s => s.id == "highlight");
			var type = s.feature.getGeometry().getType().toLowerCase();
			var style = Style.GetStyle(type, json);
		
			s.feature.setStyle(style);
		});
	}
	
	Template() {
		return "<div class='map-container'>" + 
				   "<div handle='map' class='map'></div>" +
				   "<div handle='variable-select' widget='Widgets.GIS.VariableSelect'></div>" +
			   "</div>";
	}
	
});