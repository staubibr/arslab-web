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

import Map from './ol/map.js';
import LayerSwitcher from './ol/layer-switcher.js';

import Style from "./utils/style.js";

export default class Main extends Templated { 

	constructor(node, config) {		
		super(node);
		
		this.config = config;
		
		var baseLayers = [Map.BasemapOSM(true), Map.BasemapSatellite()];
	
		this.map = new Map(this.Elem("map"), baseLayers);
		
		this.map.SetView([-75.7, 45.3], 10);

		this.selected = null;

		this.map.On("click", this.onMap_Click.bind(this));

		this.layerSwitcher = new LayerSwitcher(this.map);
		
		var defs = config.layers.map(l => {
			var base = location.href.split("/").slice(0,-1);
			
			base.push(l.url);
			
			return Net.JSON(base.join("/"));			
		});
		
		Promise.all(defs).then(this.onData_Loaded.bind(this));
	}
	
	onData_Loaded(data) {
		var layers = data.map((d, i) => {			
			var layer = this.map.AddGeoJsonLayer(d);
			
			var style = this.config.layers[i].style;
			
			layer.setStyle(Style.GetStyleFunction(style));
		});
	}
	
	onMap_Click(ev) {
		var original = Style.GetStyle(this.config.layers[0].style);
		var style = Style.GetStyle(this.config.styles.highlight);
		
		if (this.selected) this.selected.setStyle(original);
		
		this.selected = ev.features.length > 0 ? ev.features[0] : null;
		
		if (this.selected) this.selected.setStyle(style);
		
		if (this.selected) {
			var props = this.selected.getProperties();
			
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