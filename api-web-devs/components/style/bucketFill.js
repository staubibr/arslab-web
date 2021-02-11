
export default class BucketFill {

	get Length() {
		return this.colors.length;
	}
	
	get Classification() {
		return this.classification;
	}

	constructor(property, colors, type, buckets) {
		this.type = type;
		this.attribute = "fill";
		this.property = property;
		this.colors = colors;
		this.buckets = buckets || null
	}
	
	Symbol(value) {		
		var v = value[this.property];
		
		for (var i = 0; v > this.buckets[i] && i < this.buckets.length; i++);
		
		return new ol.style.Fill({ color: this.colors[i] });
	}
	
	static FromJson(json) {
		return new BucketFill(json.property, json.colors, json.type, json.buckets);
	}
}