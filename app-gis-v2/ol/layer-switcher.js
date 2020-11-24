
import Map from './map.js';

export default class LayerSwitcher {
	// get OL() {
	// 	return this._ol;
	// }
		
	constructor(map) {
		this.map = map;
		
		// this.AddBasemap(Map.BasemapOSM());
		// this.AddBasemap(Map.BasemapSatellite());
	}
	
	AddBasemap(basemap) {		
		// Reach into the base map group
		var basemaps = this.map.OL.getLayers().getArray()[0];
		
		// This is where you will find the base maps 
		var innerLayers = basemaps.getLayers().getArray();

		// Add the new base map to the group 
		innerLayers.push(basemap);
	}
}