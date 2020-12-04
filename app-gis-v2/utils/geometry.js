
export default class Geometry {
	static extractAndDrawCentroids(layer, idField){
		var features = layer.getSource().getFeatures();

		let centroids = features.map(f => {
			// Get center of the feature
			var e = f.getGeometry().getExtent();
			var c = ol.extent.getCenter(e);

			var id = f.getProperties()[idField];

			return new ol.Feature({ 'geometry': new ol.geom.Point([c[0], c[1]]), 'id':id });
		});
	}
}