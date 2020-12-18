
import BucketFill from "../style/bucketFill.js";
import BucketRadius from "../style/bucketRadius.js";
import BucketStroke from "../style/bucketStroke.js";
import Fill from "../style/fill.js";
import Radius from "../style/radius.js";
import Stroke from "../style/stroke.js";

export default class Style {
	static GetBucketStyleFunction(type, json, stats) {
		if (type == "point") return this.PointBucketStyleFn(json, stats);
		
		if (type == "polygon") return this.PolygonBucketStyleFn(json, stats);
	}
	
	static GetStyleFunction(type, json) {
		if (type == "point") return this.PointStyleFn(json);
		
		if (type == "polygon") return this.PolygonStyleFn(json);
	}
	
	static GetStyle(type, json) {
		if (type == "point") return this.PointStyle(json);
		
		if (type == "polygon") return this.PolygonStyle(json);
	}
	
	static PointStyle(json) {
		return new ol.style.Style({
			image: new ol.style.Circle({
				radius: json.radius,
				fill: new ol.style.Fill({
					color: json.fill.color
				}),
				stroke: new ol.style.Stroke({
					color: json.stroke.color,
					width: json.stroke.width,
				})
			})
		});
	}

	static RadiusStyle (feature) {
		return new ol.style.Style ({
			image: new ol.style.Circle({
			  radius: feature.get('size'), 
			  fill: null,
			  stroke: new ol.style.Stroke ({ width: 1, color: [0,0,0] })
			}),
			geometry: new ol.geom.Point( ol.extent.getCenter (feature.getGeometry().getExtent() ))
		  })
	  }

	static PolygonStyle(json) {
		return new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: json.stroke.color,
				width: json.stroke.width,
			}),
			fill: new ol.style.Fill({
				color: json.fill.color,
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
	
	static PointBucketStyleFn(json, stats) {
		return (f) => {
			return this.PointStyle(json);
		}
	}
	
	static PolygonBucketStyleFn(json, stats) {
		return (f) => {
			return this.PolygonStyle(json);
		}
	}
	
	static Statistics(simulation) {		
		var values = {};
		
		simulation.EachTransition((t, f) => {			
			for (var f in t.Value) {
				if (!values[f]) values[f] = [];
				
				values[f].push(t.Value[f]);
			}
		});
		
		for (var f in values) values[f] = values[f].sort((a, b) => {
			return (a < b) ? -1 : 1;
		});
		
		var stats = {};
		
		for (var f in values) {
			var length = values[f].length;
			
			stats[f] = {
				sorted: values[f],
				length: length,
				min: values[f][0],
				max: values[f][length - 1]
			}
		}
		
		return stats;
	}
	
	static BucketizeStyle(style, stats) {
		if (style.type == "quantile") {	
			style.buckets = Style.QuantileBuckets(stats[style.property].sorted, style.Length);
		}
		else if (style.type == "equivalent") {
			style.buckets = Style.EquivalentBuckets(stats[style.property].min, stats[style.property].max, style.Length);
			//style.buckets = Style.ContinuousBuckets(stats[style.property].sorted, stats[style.property].min, stats[style.property].max, style.Length);
		}
	}
	
	static QuantileBuckets(values, n) {
		var buckets = [];
		
		var interval = Math.floor(values.length / n);
		
		
		for (var i = 1; i < n; i++) buckets.push(values[i * interval]);
		
		buckets.push(values[values.length - 1]);
		
		return buckets;
	}

	static ContinuousBuckets(values, min, max, n) {
		var buckets = [];
		
		return buckets;
	}
	
	static EquivalentBuckets(min, max, n) {
		var buckets = [];
		
		var interval = (max - min) / n;
		
		for (var i = 1; i < n; i++) buckets.push(i * interval);
		
		buckets.push(max);
		
		return buckets;
	}
	
	static DefaultFill() {
		return new Fill('rgba(50,100,200,0.6)');
	}
	
	static DefaultStroke() {
		return new Stroke('rgba(0,0,0,1)', 1);
	}
	
	static DefaultRadius() {
		return new Radius(4);
	}
	
	static FillStyleFromJson(json) {
		if (json.type == "equivalent" || json.type == "quantile" || json.type == "user-defined") {
			return BucketFill.FromJson(json);
		}

		if (json.type == "static") return Fill.FromJson(json);
	}
	
	static StrokeStyleFromJson(json) {
		if (json.type == "equivalent" || json.type == "quantile" || json.type == "user-defined") {
			return BucketStroke.FromJson(json);
		}
		
		if (json.type == "static") return Stroke.FromJson(json);
	}
	
	static RadiusStyleFromJson(json) {
		if (json.type == "equivalent" || json.type == "quantile" || json.type == "user-defined") {
			return BucketRadius.FromJson(json);
		}
		
		if (json.type == "static") return Radius.FromJson(json.radius);	
	}
}