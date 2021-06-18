
import StaticStroke from "./staticStroke.js";

export default class BucketStroke {

	get length() { return this.colors.length; }
	
	constructor(property, colors, width, type, buckets, zero) {
		this.type = type;
		this.attribute = "stroke";
		this.property = property;
		this.colors = colors;
		this.width = width;
		this.buckets = buckets || null;
		this.zero = zero || null;
		
		// TODO: Doesn't support widths yet. Because it would have to support one or the other, or both.
	}
	
	Symbol(value) {
		var v = value[this.property];
		
		if (v == 0 && this.zero) return new ol.style.Fill({ color: this.zero });
		
		for (var i = 0; v > this.buckets[i] && i <= this.buckets.length; i++);
		
		return new ol.style.Stroke({ color: this.colors[i],	width: this.width });
	}
	
	static FromJson(json) {
		return new BucketStroke(json.property, json.colors, json.width, json.type, json.buckets, json.zero);
	}
	
	static DefaultStroke() {
		return new StaticStroke('rgba(0,0,0,1)', 1);
	}
}