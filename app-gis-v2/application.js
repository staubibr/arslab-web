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

export default class Main extends Templated { 

	constructor(node, config) {		
		super(node);
		
		this.config = config;
		
		this.map = new Map(this.Elem("map"), Map.BasemapOSM());
		
		this.map.SetView([-75.7, 45.3], 10);
		
		var p1 = Net.JSON("http://localhost:81/app-gis-v2/data/DA_Ottawa.geojson");
		var p2 = Net.JSON("http://localhost:81/app-gis-v2/data/Hospitals.geojson");
		
		Promise.all([p1, p2]).then(this.onData_Loaded.bind(this));
	}
	
	onData_Loaded(data) {
		var layers = data.map(d => {			
			var layer = this.map.AddGeoJsonLayer(d);
			
			layer.setStyle(this.StyleFunction);
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
				"</main>";
	}
}