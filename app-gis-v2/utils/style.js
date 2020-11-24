
export default class Style {
	static GetStyleFunction(json) {
		if (json.type == "point") return this.PointStyleFn(json);
		
		if (json.type == "polygon") return this.PolygonStyleFn(json);
	}
	
	static GetStyle(json) {
		if (json.type == "point") return this.PointStyle(json);
		
		if (json.type == "polygon") return this.PolygonStyle(json);
	}
	
	static PointStyle(json) {
		return new ol.style.Style({
			image: new ol.style.Circle({
				radius: json.radius,
				fill: new ol.style.Fill({
					color: json.fill
				}),
				stroke: new ol.style.Stroke({
					color: json.stroke.color,
					width: json.stroke.width,
				})
			})
		});
	}

	static PolygonStyle(json) {
		return new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: json.stroke.color,
				width: json.stroke.width,
			}),
			fill: new ol.style.Fill({
				color: json.fill,
			})
		});
	}
	
	static PointStyleFn(json) {
		return (f) => {
			return this.PointStyle(json);
		}
	}
	
	static PolygonStyleFn(json) {
		return (f) => {
			return this.PolygonStyle(json);
		}
	}
}