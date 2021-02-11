
import Evented from '../evented.js';

export default class Map extends Evented {
	get OL() {
		return this._ol;
	}
	
	get Layers() {
		return this.layers;
	}
		
	constructor(container, basemaps) {
		super(); 
		
		this.layers = {};
		
		var sl = new ol.control.ScaleLine();
		var fs = new ol.control.FullScreen();
	  	
		this.basemaps = basemaps;
		
		this._ol = new ol.Map({
			target: container,
			layers: [new ol.layer.Group({
				title: 'Basemaps',
				layers: basemaps
			})],
			controls: ol.control.defaults({ attributionOptions: { collapsible: true } }).extend([fs, sl]),
		});
		
		this._ol.on("click", (ev) => {
			var features = [];
			
			this._ol.forEachFeatureAtPixel(ev.pixel, function (feature, layer) {
				features.push({ layer:layer.get('title'), feature:feature });
			});

			this.Emit("click", { "features" : features, "coordinates" : ev.coordinate });
		})
		
		this._ol.once("rendercomplete", (ev) => {
			this.Emit("rendercomplete", null);
		});
		
		this.projection = basemaps[0].getSource().getProjection();
		
		this.popup = new ol.Overlay.Popup();
   
		this.OL.addOverlay(this.popup);
	}
	
	Layer(id) {
		return this.layers[id];
	}

	AddControl(controls, options) {
		if (!Array.isArray(controls)) controls = [controls];
		
		controls.forEach(c => this.OL.addControl(c));
	}
	
	RemoveControl(controls) {
		if (!Array.isArray(controls)) controls = [controls];
		
		controls.forEach(c => this.OL.removeControl(c));
	}
	
	AddLayer(id, layer) {
		this.OL.addLayer(layer);
		
		this.layers[id] = layer;
		
		return layer;
	}
	
	AddGeoJsonLayer(id, json) {			
		var format = new ol.format.GeoJSON({ featureProjection : this.projection });
		var vs = new ol.source.Vector({features: format.readFeatures(json)});
		
		return this.AddLayer(id, new ol.layer.Vector({ source: vs, title: json.name  }));
	}
	
	AddVectorLayer(id, features, title, style) {
		// TODO: Not sure about the wrapX thing.
		var source = new ol.source.Vector({ features:features, wrapX:false });
		
		var vector = new ol.layer.Vector({ source:source, title:title, style:style });

		return this.AddLayer(id, vector);
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