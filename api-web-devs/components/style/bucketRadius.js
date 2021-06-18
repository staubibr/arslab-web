
import Style from "../../tools/style.js";
import StaticRadius from "./staticRadius.js";

export default class BucketRadius {

	get length() { return this.classes; }

	constructor(property, classes, radius, type, buckets, zero) {
		this.type = type;
		this.attribute = "radius";
		this.property = property;
		this.classes = classes;
		this.radius = radius;
		this.buckets = buckets || null;
		this.zero = zero || null;
	}
	
	Symbol(value) {
		var v = value[this.property];
		
		if (v == 0 && this.zero) return new ol.style.Fill({ color: this.zero });
		
		for (var i = 0; v > this.buckets[i] && i <= this.buckets.length; i++);
		
		return this.radius[i];
	}
	
	static FromJson(json) {
		if (json.type == "user-defined") var radius = json.radius;

		else var radius = Style.EquivalentBuckets(json.min, json.max, json.classes);
		
		return new BucketRadius(json.property, json.classes, radius, json.type, json.buckets, json.zero);
	}
	
	static DefaultRadius() {
		return new StaticRadius(4);
	}
}