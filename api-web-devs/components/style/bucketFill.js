
import StaticFill from "./staticFill.js";

export default class BucketFill {

	get length() { return this.colors.length; }

	constructor(property, colors, type, buckets, zero) {
		this.type = type;
		this.attribute = "fill";
		this.property = property;
		this.colors = colors;
		this.buckets = buckets || null;
		this.zero = zero || null;
	}
	
	Symbol(value) {
		var v = value[this.property];
		
		if (v == 0 && this.zero) return new ol.style.Fill({ color: this.zero });
		
		for (var i = 0; v > this.buckets[i] && i <= this.buckets.length; i++);
		
		return new ol.style.Fill({ color: this.colors[i] });
	}
	
	static FromJson(json) {
		return new BucketFill(json.property, json.colors, json.type, json.buckets, json.zero);
	}
	
	static DefaultFill() {
		return new StaticFill('rgba(50,100,200,0.6)');
	}
}