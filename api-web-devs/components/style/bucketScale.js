
import Style from "../../tools/style.js";

export default class BucketScale {

	get Length() {
		return this.classes;
	}
	
	get Classification() {
		return this.classification;
	}

	constructor(property, classes, scale, type, buckets) {
		this.type = type;
		this.attribute = "scale";
		this.property = property;
		this.classes = classes;
		this.scale = scale;
		this.buckets = buckets || null
	}
	
	Symbol(value) {
		var v = value[this.property];
		
		for (var i = 0; v > this.buckets[i] && i < this.buckets.length; i++);
		
		return this.scale[i];
	}
	
	static FromJson(json) {
		if (json.type == "user-defined") var scale = json.scale;

		else var scale = Style.EquivalentBuckets(json.min, json.max, json.classes);
		
		return new BucketScale(json.property, json.classes, scale, json.type, json.buckets);
	}
}