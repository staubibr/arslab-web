
export default class BucketStroke {

	get Length() {
		return this.colors.length;
	}
	
	get Classification() {
		return this.classification;
	}

	constructor(property, colors, width, type, buckets) {
		this.type = type;
		this.attribute = "stroke";
		this.property = property;
		this.colors = colors;
		this.width = width;
		this.buckets = buckets || null
		
		// TODO: Doesn't support widths yet. Because it would have to support one or the other, or both.
	}
	
	Symbol(value) {
		var v = value[this.property];
		
		for (var i = 0; v > this.buckets[i] && i < this.buckets.length; i++);
		
		return new ol.style.Stroke({ color: this.colors[i],	width: this.width });
	}
	
	static FromJson(json) {
		return new BucketStroke(json.property, json.colors, json.width, json.type, json.buckets);
	}
}