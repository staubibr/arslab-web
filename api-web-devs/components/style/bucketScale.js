
import Style from "../../tools/style.js";
import StaticScale from "./staticScale.js";

export default class BucketScale {

	get length() { return this.classes; }

	constructor(property, classes, scale, type, buckets, zero) {
		this.type = type;
		this.attribute = "scale";
		this.property = property;
		this.classes = classes;
		this.scale = scale;
		this.buckets = buckets || null;
		this.zero = zero || null;
	}
	
	Symbol(value) {
		var v = value[this.property];
		
		if (v == 0 && this.zero) return new ol.style.Fill({ color: this.zero });
		
		for (var i = 0; v > this.buckets[i] && i <= this.buckets.length; i++);
		
		return this.scale[i];
	}
	
	static FromJson(json) {
		if (json.type == "user-defined") var scale = json.scale;

		else var scale = Style.EquivalentBuckets(json.min, json.max, json.classes);
		
		return new BucketScale(json.property, json.classes, scale, json.type, json.buckets, json.zero);
	}
	
	static DefaultScale() {
		return new StaticScale(0.5);
	}
}