
export default class baseMaps {
	// get OL() {
	// 	return this._ol;
	// }
		
	constructor() {

	}
	
	// For more base maps, see:
	// https://wiki.openstreetmap.org/wiki/Tile_servers


	// For logistics research maybe?
	// https://openlayers.org/en/latest/examples/osm-vector-tiles.html
	BuildingsRoadsAndWaterOSM(){
		return new ol.layer.Tile({ 
			source: new ol.source.OSM(),
			title: "OpenStreetMap"
		});
	}

	SatelliteOSM() {
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