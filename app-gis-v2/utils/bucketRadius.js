
import Style from "./style.js";

export default class BucketRadius {

	get Length() {
		return this.colors.length;
	}
	
	get Classification() {
		return this.classification;
	}

	constructor(property, radii, type) {
		this.type = type;
		this.attribute = "radius";
		this.property = property;
		this.radii = radii;
		this.buckets = null;
	}
	
	Symbol(value) {
		var v = value[this.property];
		
		for (var i = 0; v > this.buckets[i] && i < this.buckets.length; i++);
		
		return this.radii[i];
	}
	
	Bucketize(type, stats) {
		var n = this.classes;
		
		if (type == "quantile_classes") {
			this.buckets = Style.QuantileBuckets(stats[this.property].sorted, n);
		}
		else if (type == "equivalent_classes") {
			this.buckets = Style.EquivalentBuckets(stats[this.property].min, stats[this.property].max, n);
		}
	}
	
	static FromJson(json) {
		var radii = Style.EquivalentBuckets(json.min, json.max, json.classes);
		
		return new BucketRadius(json.property, radii, json.type);
	}
}