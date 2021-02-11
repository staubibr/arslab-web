
import Style from "../../tools/style.js";

export default class BucketRadius {

	get Length() {
		return this.classes;
	}
	
	get Classification() {
		return this.classification;
	}

	constructor(property, classes, radii, type, buckets) {
		this.type = type;
		this.attribute = "radius";
		this.property = property;
		this.classes = classes;
		this.radii = radii;
		this.buckets = buckets || null
	}
	
	Symbol(value) {
		var v = value[this.property];
		
		for (var i = 0; v > this.buckets[i] && i < this.buckets.length; i++);
		
		return this.radii[i];
	}
	
	static FromJson(json) {
		if (json.type == "user-defined") var radii = json.radius;

		else var radii = Style.EquivalentBuckets(json.min, json.max, json.classes);
		
		return new BucketRadius(json.property, json.classes, radii, json.type, json.buckets);
	}
}