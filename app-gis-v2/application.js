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
import Point from "./style/point.js";
import Polygon from "./style/polygon.js";
import Geometry from "./utils/geometry.js"

export default class Main extends Templated { 

	constructor(node, config, files) {		
		super(node);
		
		this.selected = null;
		this.config = config;
		this.files = files;
		
		// Load the simulation data
		var parser = new Parser();
		
		var p1 = parser.Parse(this.files).then(this.onSimulation_Loaded.bind(this), this.onApplication_Error.bind(this));
		
		var p2 = this.LoadMap().then(this.onData_Loaded.bind(this));
		
		Promise.all([p1, p2]).then(this.onApplication_Ready.bind(this));
	}
	
	onData_Loaded(data) {	
		// Add layers to the map according to the loaded geojson data
		var layers = data.map((d, i) => {	
			var config = this.config.layers[i];	
			
			d.name = config.id;

			var layer = this.map.AddGeoJsonLayer(config.id, d);

			Geometry.convertPolygonToPoint(layer)
			
			layer.set('visible', false);

		});
	}
		
	onSimulation_Loaded(ev) {
		// Initialize simulation and simulation settings
		this.settings = new oSettings();
		this.simulation = ev.simulation;
		
		this.settings.json.playback.speed = 10;
		
		var n = Math.ceil(this.simulation.frames.length / 10);
		
		this.simulation.Initialize(n);
	}

	onApplication_Ready(ev) {		
		// Initialize simulation widgets
		var canvas = this.Elem("map").querySelector(".ol-layer").firstChild;
		
		this.Widget("playback").Initialize(this.simulation, this.settings);
		this.Widget("playback").Recorder = new Recorder(canvas);
		
		// TODO: There's an issue with play backwards with the GIS version, needs to be fixed
		this.Widget("playback").Elem("stepBack").disabled = true;
		this.Widget("playback").Elem("rewind").disabled = true;
		this.Widget("playback").Elem("stepBack").title = Core.Nls("sorry_unavailable");
		this.Widget("playback").Elem("rewind").title = Core.Nls("sorry_unavailable");
		
		// Hook simulation events for the playback bar
		this.simulation.On("Jump", this.onSimulation_Jump.bind(this));
		this.simulation.On("Move", this.onSimulation_Move.bind(this));
		
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
	}
	
	LoadMap() {	
		this.map = new Map(this.Elem("map"), [Map.BasemapOSM(true), Map.BasemapSatellite()]);
		
		this.map.SetView([-75.7, 45.3], 10);

		this.map.On("click", this.onMap_Click.bind(this));
		
		// Load all geojson data layers contained in visualization.json
		var defs = this.config.layers.map(l => {
			var base = location.href.split("/").slice(0,-1);
			
			base.push(l.url);
			
			return Net.JSON(base.join("/"));			
		});
		
		return Promise.all(defs);
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
		this.map.RemoveControl(this.legend);

		var style = this.current.style

		var rowsAdded = this.addFillLegend(style)

		if(style.radius != undefined && style.radius.type == "user-defined"){
			this.addRadiusLegend(style, rowsAdded)
		}
	}

	addFillLegend(style){
		var prev = null;
		var rowsAdded = 0;
		this.legend = new ol.control.Legend({ title: `Legend (${style.fill.type})`, margin: 5, collapsed: false });
	
		style.fill.buckets.forEach((b, i) => {
			var curr = b.toFixed(4).toString();
			var title = (prev) ? `${prev} - ${curr}` : `0 - ${curr}`;

			var json = {
				radius : 8, 
				stroke: { color: "#000", width: 1 } ,
				fill: { color: style.fill.colors[i] }
			}
			
			this.legend.addRow({ title:title, size:[40,40], typeGeom:"Point", style: Style.PointStyle(json) });
			rowsAdded++;
			prev = curr;
		});

		this.map.AddControl(this.legend);
		return rowsAdded
	}

	addRadiusLegend(style, rowsAdded){
		this.legend2 = new ol.control.Legend({ 
			title: `Legend (${style.radius.type})`, 
			style: Style.RadiusStyle,
			margin: 5, 
			//size: [35, 5],
			target: this.legend.element
		});

		style.radius.radii.forEach((b, i) =>  {
			this.legend2.addRow({ 
				title:b.toFixed(2).toString(), 
				properties: { size: style.radius.radii[i] }, 
				typeGeom: 'Point'
			})
		})

		var len = style.radius.radii.length
		while(len < rowsAdded){
			this.legend2.addRow();
			len++;
		}
		this.map.AddControl(this.legend2);
	}

	AddLayerSwitcher() {
		var ls = new ol.control.LayerSwitcher({ groupSelectStyle: "group" });
		
		this.map.AddControl(ls);
	}
	
	PrepareSimulationVisualization() {
		var stats = Style.Statistics(this.simulation);
		// Continuous scale for points
		
		this.config.simulation.forEach(s => {
			var layer = this.config.layers.find(l => l.id == s.layer);
			
			if (layer.type == "polygon") s.style = Polygon.FromJson(s);
			
			if (layer.type == "point") s.style = Point.FromJson(s);
			
			s.style.Bucketize(stats);
		});
		
		return this.config.simulation;
	}

	onVariableSelect_Change(ev){
		// Change to the style of the newly selected variable
		this.current = this.styles[ev.target.value];
		
		this.Draw(this.simulation.state.data);

		this.AddLegend(this.current.style.fill);
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
			var symbol = this.current.style.Symbol(data[id]);
			
			
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

			content += `<li>${this.config.join}: ${id}</li>`
			
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
					
					"<div handle='variable-select-container' class='variable-select-container custom-control'>" + 
						"<label>nls(label_variable_select)</label>" +
						"<select handle='variable-select' title=nls(title_variable_select)></select></div>" +
					"</div>" +
				"</main>";
	}
}
