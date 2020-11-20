
export default class Map {
	get OL() {
		return this._ol;
	}
		
	constructor(container, basemap) {
		var sl = new ol.control.ScaleLine();
		var fs = new ol.control.FullScreen();
		var ls = new ol.control.LayerSwitcher({ groupSelectStyle: "group" })
	  	  
		this.basemap = basemap;
		
		this._ol = new ol.Map({
			target: container,
			layers: [new ol.layer.Group({
				title: 'Base Maps',
				layers: [basemap]
			})],
			controls: ol.control.defaults().extend([fs, sl, ls]),
		});
	}
	
	AddLayer(layer) {
		this.OL.addLayer(layer);
		
		return layer;
	}
	
	AddGeoJsonLayer(json) {		
		var proj = this.basemap.getSource().getProjection().getCode();
	
		var format = new ol.format.GeoJSON({ featureProjection : proj });
		
		var vs = new ol.source.Vector({features: format.readFeatures(json)});
		
		return this.AddLayer(new ol.layer.Vector({ source: vs, title: json.name  }));
	}
	
	SetView(coord, zoom) {
		this.OL.setView(new ol.View({
			center: ol.proj.transform(coord, "EPSG:4326", "EPSG:900913"),
			zoom: zoom,
		}));
	}

	static BasemapOSM() {
		return new ol.layer.Tile({ 
			source: new ol.source.OSM(),
			title: "OpenStreetMap"
		});
	}
}