
import Style from "../utils/style.js";

export default class BucketRadius {

	get Length() {
		return this.classes;
	}
	
	get Classification() {
		return this.classification;
	}

	constructor(property, classes, radii, type, buckets) {
		this.property = property;
		this.classes = classes;
		this.radii = radii;
		this.type = type;
		this.attribute = "radius";
		this.buckets = buckets;
	}
	
	Symbol(value) {
		var v = value[this.property];
		
		for (var i = 0; v > this.buckets[i] && i < this.buckets.length; i++);
		
		return this.radii[i];
	}
	
	Bucketize(type, stats) {
		var n = this.classes;

		if(type == "user-defined"){
			return
		}else if (type == "quantile_classes") {
			this.buckets = Style.QuantileBuckets(stats[this.property].sorted, n);
		}
		else if (type == "equivalent_classes") {
			this.buckets = Style.EquivalentBuckets(stats[this.property].min, stats[this.property].max, n);
		}
	}
	
	static FromJson(json) {
		let radii
		if(json.type == "user-defined"){
			var i = json.radius.length - 1
			radii = Style.EquivalentBuckets(json.radius[0], json.radius[i], json.classes);
			this.buckets = json.buckets
		}else{
			radii = Style.EquivalentBuckets(json.min, json.max, json.classes);
		}
		return new BucketRadius(json.property, json.classes, radii, json.type, this.buckets);
	}
}