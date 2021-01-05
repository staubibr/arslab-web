export default class Style {
    static PointStyle(c) {
		return new ol.style.Style({
			image: new ol.style.Circle({
				radius: 12,
				fill: new ol.style.Fill({
					color: c
				}),
				stroke: new ol.style.Stroke({
					color: "000000",
					width: 0.4,
				})
			})
		});
	}
}
