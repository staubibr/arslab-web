
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

	addLayerToGroup(layerToAdd, groupTitle){
		// https://gis.stackexchange.com/questions/165447/dynamically-add-layers-to-layer-group
		var innerLayers = [];
		// loop through all the layers in the map
		this.OL.getLayers().forEach(function (layer) {
		if (layer instanceof ol.layer.Group) {
			// Find the ol.layer.Group and see if they have layers
			if (layer.get("title") === groupTitle && layer.getLayers) {
				// get inner layers from group layer as Collection
				innerLayers = layer.getLayers();
				// new layer to Collection
				innerLayers.push(layerToAdd);
				if (innerLayers instanceof ol.Collection) {
				// set the layer collection of the grouplayer
				layer.setLayers(innerLayers);
				}
			}
		}
		});
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

	// For more base maps, see:
	// https://wiki.openstreetmap.org/wiki/Tile_servers
	static BasemapOSM() {
		return new ol.layer.Tile({ 
			source: new ol.source.OSM(),
			title: "OpenStreetMap"
		});
	}


	// For logistics research maybe?
	// https://openlayers.org/en/latest/examples/osm-vector-tiles.html
	static BuildingsRoadsAndWaterOSM(){
		return new ol.layer.Tile({ 
			source: new ol.source.OSM(),
			title: "OpenStreetMap"
		});
	}

	static SatelliteOSM() {
		return new ol.layer.Tile({ 
			source: new ol.source.XYZ({
				// attributions: ['Powered by Esri',
				// 			   'Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'],
				attributionsCollapsible: false,
				url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
				maxZoom: 23
			  }),
			title: "Satellite"
		});
	}
}