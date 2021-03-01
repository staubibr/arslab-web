'use strict';

import Core from '../../tools/core.js';
import Dom from '../../tools/dom.js';
import Net from '../../tools/net.js';
import Style from '../../tools/style.js'
import Templated from '../../components/templated.js';
import ChunkReader from '../../components/chunkReader.js';

import Map from '../../components/ol/map.js'
import Legend from "../../components/ol/legend.js";

export default Core.Templatable("Widgets.GIS", class GIS extends Templated { 

	get Canvas() { 
		return this.Elem("map").querySelector(".ol-layer").firstChild; 
	}
	
	constructor(node) {
		super(node);
	}
	
	Load(config, files, simulation) {
		// TODO: This shouldn't be here but, just trying to get it done for now. I'll come back later.
		this.simulation = simulation;
		this.config = config;
		
		var d = Core.Defer();
		
		this.LoadGeoData(config, files).then(data => {
			this.LoadMap(config, data).then(map => {
				d.Resolve({ map:map });
			});
		});
		
		return d.promise;
	}
	
	LoadGeoData(config, files) {
		// Load all geojson data layers contained in visualization.json
		var defs = config.layers.map(l => {
			if (l.file) {
				Core.Log(`GIS`, `Loading layer ${l.id} from the files provided by user.`)
				var f = files.find((f) => f.name == l.file);
				
				if (f) return ChunkReader.Read(f, (json) => JSON.parse(json));
				
				if (!Core.URLs.models) { 
					throw new Error(`Required file for layer ${l.id} was not provided by the user. Unable to fall back on server-side load, Core root is not configured.`);
				}
				
				Core.Log(`GIS`, `Unable to find file for layer ${l.id} in the files provided by user.`);
				l.url = Core.URLs.models + "/" + l.file;
			}
			
			Core.Log(`GIS`, `Loading layer ${l.id} from the server.`);
			return Net.JSON(l.url);	
		});
		
		return Promise.all(defs);
	}
	
	LoadMap(config, data) {	
		var d = Core.Defer();
	
		this.data = data;
		this.map = new Map(this.Elem("map"), [Map.BasemapOSM(true), Map.BasemapSatellite()]);
		
		if (config.view) this.map.SetView(config.view.center, config.view.zoom);

		else this.map.SetView([-75.7, 45.3], 10);
		
		// Add layers to the map according to the loaded geojson data
		data.forEach((data, i) => {				
			this.LoadLayer(data, config.layers[i]);
		});

		this.map.On("click", this.OnMap_Click.bind(this));
		this.map.On("rendercomplete", this.OnMap_RenderComplete.bind(this, d));
		
		this.simulation.On("Move", this.onSimulation_Move.bind(this));
		this.simulation.On("Jump", this.onSimulation_Jump.bind(this));
				
		return d.promise;
	}
	
	LoadLayer(data, config) {
		data.name = config.id;
		
		var layer = this.map.AddGeoJsonLayer(config.id, data);
		
		layer.set('visible', false);
					
		var style = Style.FromJson(config.type, config.style);
					
		layer.setStyle(style.Symbol());
	}
	
	OnMap_RenderComplete(d, ev) {		
		// Show geo layers and draw simulation state
		for (var id in this.map.Layers) this.map.Layers[id].set('visible', true);
		
		// Prepare simulation styles, set first one as currently selected, 
		// update the variable selector to reflect the current property being coloured
		this.styles = this.PrepareSimulationVisualization();
		this.current = this.styles[0];
		
		this.Draw(this.simulation.state.data);

		// Add map widgets, some of them require everything to be ready
		this.AddSelector();
		this.AddLegend();
		this.AddLayerSwitcher();
		
		d.Resolve(this.map);
	}
	
	Draw(data) {
		if (!this.map) return;
		
		var layer = this.map.Layer(this.current.layer.id);
		var features = layer.getSource().getFeatures();
		
		features.forEach(f => {
			var id = f.getProperties()[this.current.layer.join];
			var d = data[id];
			
			if (!d) return;
			
			var symbol = this.current.style.Symbol(data[id]);

			f.setStyle(symbol);
		});
	}
	
	AddSelector() {
		var control = new ol.control.Control({
			element: this.Elem("variable-select-container")
		});
		
		this.config.simulation.forEach((s, i) => {
			var option = Dom.Create("option", { "text":s.name, "value":i });
			
			this.Elem("variable-select").add(option);
		});
		
		this.Elem("variable-select").selectedIndex = 0;
		
		this.map.AddControl(control);

		this.Node("variable-select").On("change", this.onVariableSelect_Change.bind(this));
	}

	AddLegend(){	
		if (this.legend) this.map.RemoveControl(this.legend.OL);

		this.legend = new Legend(this.current.style);
		
		this.map.AddControl(this.legend.OL);
	}

	AddLayerSwitcher() {
		var ls = new ol.control.LayerSwitcher({ groupSelectStyle: "group" });
		
		this.map.AddControl(ls);
	}
	
	PrepareSimulationVisualization() {
		var stats = Style.Statistics(this.simulation);
		
		this.config.simulation.forEach(s => {
			s.layer = this.config.layers.find(l => l.id == s.layer);
			s.style = Style.FromJson(s.layer.type, s);

			s.style.Bucketize(stats);
		});
		
		return this.config.simulation;
	}
	
	onSimulation_Jump(ev) {
		this.Draw(ev.state.data);
	}
	
	onSimulation_Move(ev) {
		var data = {};
		
		ev.frame.StateMessages.forEach(t => data[t.Emitter.Name] = t.Value);
		
		this.Draw(data);
	}

	onVariableSelect_Change(ev){
		// Change to the style of the newly selected variable
		this.current = this.styles[ev.target.value];
		
		this.Draw(this.simulation.state.data);

		this.AddLegend(this.current.style.fill);
	}
	
	OnMap_Click(ev) {
		this.ResetSelected();
						
		this.selected = ev.features.length > 0 ? ev.features[0] : null;
				
		if (this.selected) {
			this.HighlightSelected();
						
			var id = this.selected.feature.getProperties()[this.current.layer.join];
			var emitter = this.simulation.Model(id);
			var props = this.simulation.state.GetValue(emitter);
			
			var content = "<ul>";

			content += `<li>${this.current.layer.join}: ${id}</li>`
			
			for (var p in props) content += `<li>${p}: ${props[p]}</li>`
			
			content += "</ul>";
			
			this.map.ShowPopup(ev.coordinates, content);
		}
		
		else this.map.ShowPopup(null);
	}
	
	ResetSelected() {
		if (!this.selected) return;
		
		var id = this.selected.feature.getProperties()[this.current.layer.join];
		var emitter = this.simulation.Model(id);
		var data = this.simulation.state.GetValue(emitter);
		var style = this.current.style.Symbol(data);
		
		this.selected.feature.setStyle(style);
	}
	
	HighlightSelected() {		
		if (!this.selected) return;
		
		var json = this.config.styles.find(s => s.id == "highlight");
		var style = Style.GetStyle("polygon", json);
		
		this.selected.feature.setStyle(style);
	}
	
	Template() {
		return "<div class='map-container'>" + 
				   "<div handle='map' class='map'></div>" +
				   "<div handle='variable-select-container' class='variable-select-container custom-control'>" + 
					  "<label>nls(label_variable_select)</label>" +
					  "<select handle='variable-select' title=nls(title_variable_select)></select></div>" +
				   "</div>" +
			   "</div>";
	}
	
	static Nls() {
		return {
			"label_variable_select" : {
				"en": "Select a variable:",
				"fr": "Choisissez une variable:"
			},
			"title_variable_select" : {
				"en": "Select a simulation variable to display on the map",
				"fr": "Choisissez une variable de simulation à afficher sur la carte"
			}
		}
	}
});