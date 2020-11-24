
import Evented from '../../api-web-devs/components/evented.js';

export default class Map extends Evented {
	get OL() {
		return this._ol;
	}
		
	constructor(container, basemaps) {
		super(); 
		
		var sl = new ol.control.ScaleLine();
		var fs = new ol.control.FullScreen();
		var ls = new ol.control.LayerSwitcher({ groupSelectStyle: "group" })
	  	  
		this.basemaps = basemaps;
		
		this._ol = new ol.Map({
			target: container,
			layers: [new ol.layer.Group({
				title: 'Basemaps',
				layers: basemaps
			})],
			controls: ol.control.defaults().extend([fs, sl, ls]),
		});
			
		var select = new ol.interaction.Select();
	
		this.OL.addInteraction(select);
		
		select.on("select", ev => { 
			var features = select.getFeatures().getArray();
			var coord = ev.mapBrowserEvent.coordinate;

			this.Emit("click", { "features" : features, "coordinates" : coord });
		});
	
		this.projection = basemaps[0].getSource().getProjection();
		
		this.popup = new ol.Overlay.Popup();
   
		this.OL.addOverlay(this.popup);
	}
	
	AddLayer(layer) {
		this.OL.addLayer(layer);
		
		return layer;
	}
	
	AddGeoJsonLayer(json) {			
		var format = new ol.format.GeoJSON({ featureProjection : this.projection });
		
		var vs = new ol.source.Vector({features: format.readFeatures(json)});
		
		return this.AddLayer(new ol.layer.Vector({ source: vs, title: json.name  }));
	}
	
	SetView(coord, zoom) {
		this.OL.setView(new ol.View({
			center: ol.proj.transform(coord, "EPSG:4326", "EPSG:900913"),
			zoom: zoom,
		}));
	}

	ShowPopup(coord, content) {
        this.popup.setPosition(coord);
		
		this.popup.show(coord, content);
	}

	static BasemapOSM(visible) {
		return new ol.layer.Tile({ 
			title: "OpenStreetMap",
			source: new ol.source.OSM(),
			visible: !!visible,
			baseLayer: true
		});
	}

	static BasemapSatellite(visible) {
		return new ol.layer.Tile({ 
			title: "Satellite",
			source: new ol.source.XYZ({
				// attributions: ['Powered by Esri',
				// 			   'Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'],
				attributionsCollapsible: false,
				url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
				maxZoom: 23
			}),
			visible: !!visible,
			baseLayer: true
		});
	}
}