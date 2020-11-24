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
import { mapOnClick } from "./mapOnClick.js";

import Map from './ol/map.js';
import LayerSwitcher from './ol/layerSwitcher.js';
import baseMaps from './ol/baseMaps.js';

export default class Main extends Templated { 

	constructor(node, config) {		
		super(node);
		
		this.config = config;
		
		this.map = new Map(this.Elem("map"), Map.BasemapOSM());
		
		this.map.SetView([-75.7, 45.3], 10);

		this.layerSwitcher = new LayerSwitcher()

		this.baseMaps = new baseMaps()

		this.layerSwitcher.addLayerToBaseMapGroup(this.map, this.baseMaps.SatelliteOSM())

		var defs = config.layers.map(l => {
			var base = location.href.split("/").slice(0,-1);
			
			base.push(l.url);
			
			return Net.JSON(base.join("/"));			
		});
		
		Promise.all(defs).then(this.onData_Loaded.bind(this));
	}
	
	onData_Loaded(data) {
		var layers = data.map(d => {			
			var layer = this.map.AddGeoJsonLayer(d);
			
			layer.setStyle(this.StyleFunction);

			mapOnClick(d, this.map.OL)
		});
	}
	
	StyleFunction(f) {
		var styles = {
			'MultiPoint': new ol.style.Style({
				image: new ol.style.Circle({
					radius: 4,
					fill: new ol.style.Fill({
						color: 'rgba(240, 78, 14, 1)'
					}),
					stroke: new ol.style.Stroke({color: 'black', width: 1}),
				})
			}),
			'MultiPolygon': new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'black',
					width: 0.5,
				}),
				fill: new ol.style.Fill({
					color: 'rgba(194, 231, 231, 0.75)',
				})
			})
		};

		return styles[f.getGeometry().getType()];
	}
	
	Template() {
		return	"<main handle='main'>" +
					"<div handle='map' class='map'></div>" +
					"<div handle='playback' widget='Widget.Playback'></div>" +
				"</main>";
	}
}