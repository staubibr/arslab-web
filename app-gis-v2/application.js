'use strict';

import Core from '../api-web-devs/tools/core.js';
import Dom from '../api-web-devs/tools/dom.js';
import Net from '../api-web-devs/tools/net.js';
import Templated from '../api-web-devs/components/templated.js';
import Tooltip from '../api-web-devs/ui/tooltip.js';
import oSettings from '../api-web-devs/components/settings.js';
import Standardized from '../api-web-devs/parsers/standardized.js';
import SimulationDEVS from '../api-web-devs/simulation/simulationDEVS.js';
import Playback from '../api-web-devs/widgets/playback.js';
import Recorder from '../api-web-devs/components/recorder.js';
import Parser from '../api-web-devs/parsers/standardized.js';

import Map from './ol/map.js';

import Style from "./utils/style.js";
import Point from "./utils/point.js";
import Polygon from "./utils/polygon.js";

export default class Main extends Templated { 

	constructor(node, config, files) {		
		super(node);
		
		this.config = config;
		this.files = files;
		
		var baseLayers = [Map.BasemapOSM(true), Map.BasemapSatellite()];
	
		this.map = new Map(this.Elem("map"), baseLayers);
		
		this.map.SetView([-75.7, 45.3], 10);

		this.selected = null;

		this.map.On("click", this.onMap_Click.bind(this));
		
		var defs = this.config.layers.map(l => {
			var base = location.href.split("/").slice(0,-1);
			
			base.push(l.url);
			
			return Net.JSON(base.join("/"));			
		});
		
		Promise.all(defs).then(this.onData_Loaded.bind(this));
	}
	
	onData_Loaded(data) {	
		var layers = data.map((d, i) => {	
			var config = this.config.layers[i];	
			
			d.name = config.id;
			
			var layer = this.map.AddGeoJsonLayer(config.id, d);
			
			layer.set('visible', false);
		});
		
		var parser = new Parser();
		
		parser.Parse(this.files).then(this.onSimulation_Loaded.bind(this), this.onApplication_Error.bind(this));
	}
		
	onSimulation_Loaded(ev) {
		this.settings = new oSettings();
		this.simulation = ev.simulation;
		
		this.settings.json.playback.speed = 10;
		
		var n = Math.ceil(this.simulation.frames.length / 10);
		
		this.simulation.Initialize(n);
		
		this.styles = this.PrepareSimulationVisualization();
		this.current = this.styles[0];		
		
		var canvas = this.Elem("map").querySelector(".ol-layer").firstChild;
		
		this.Widget("playback").Initialize(this.simulation, this.settings);
		this.Widget("playback").Recorder = new Recorder(canvas);
		
		this.simulation.On("Jump", this.onSimulation_Jump.bind(this));
		this.simulation.On("Move", this.onSimulation_Move.bind(this));
		
		for (var id in this.map.Layers) this.map.Layers[id].set('visible', true);
		
		this.Draw(this.simulation.state.data);
	}
	
	PrepareSimulationVisualization() {
		var stats = Style.Statistics(this.simulation);
		
		this.config.simulation.forEach(s => {
			var layer = this.config.layers.find(l => l.id == s.layer);
			
			if (layer.type == "polygon") s.style = Polygon.FromJson(s);
			
			if (layer.type == "point") s.style = Point.FromJson(s);
			
			s.style.Bucketize(stats);
		});
		
		return this.config.simulation;
	}
	
	onSimulation_Jump(ev) {
		this.Draw(ev.state.data);
	}
	
	onSimulation_Move(ev) {
		var data = {};
		
		ev.frame.Transitions.forEach(t => data[t.model] = t.Value);
		
		this.Draw(data);
	}
	
	Draw(data) {
		var layer = this.map.Layer(this.current.layer);
		var features = layer.getSource().getFeatures();
		
		features.forEach(f => {
			var id = f.getProperties()[this.config.join];
			var d = data[id];
			var symbol = this.current.style.Symbol(d);
			
			f.setStyle(symbol);
		});
	}
	
	onApplication_Error(error) {
		alert(error.toString());
	}
	
	ResetSelected() {
		if (!this.selected) return;
		
		var id = this.selected.feature.getProperties()[this.config.join];
		var data = this.simulation.state.GetValue(id);
		var style = this.current.style.Symbol(data);
		
		this.selected.feature.setStyle(style);
	}
	
	HighlightSelected() {		
		if (!this.selected) return;
		
		var json = this.config.styles.find(s => s.id == "highlight");
		var style = Style.GetStyle("polygon", json);
		
		this.selected.feature.setStyle(style);
	}
	
	onMap_Click(ev) {
		this.ResetSelected();
						
		this.selected = ev.features.length > 0 ? ev.features[0] : null;
				
		if (this.selected) {
			this.HighlightSelected();
						
			var id = this.selected.feature.getProperties()[this.config.join];
			var props = this.simulation.state.GetValue(id);
			
			var content = "<ul>";
			
			this.config.popup.fields.forEach(f => content += `<li>${f}: ${props[f]}</li>`);
			
			content += "</ul>";
			
			this.map.ShowPopup(ev.coordinates, content);
		}
		
		else this.map.ShowPopup(null);
	}
	
	Template() {
		return	"<main handle='main'>" +
					"<div handle='map' class='map'></div>" +
					"<div handle='playback' widget='Widget.Playback'></div>" +
				"</main>";
	}
}