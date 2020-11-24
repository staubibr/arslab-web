
export default class LayerSwitcher {
	// get OL() {
	// 	return this._ol;
	// }
		
	constructor() {

	}
	
	addLayerToBaseMapGroup(map, layerToAdd){
		var innerLayers = [];
		
		// Reach into the base map group
		var baseMaps = map._ol.getLayers().array_[0]

		// This is where you will find the base maps 
		innerLayers = baseMaps.getLayers().getArray()

		// Add the new base map to the group 
		innerLayers.push(layerToAdd);
	}
}