
export default class StaticStroke {

	constructor(color, width) {
		this.type = "static";
		this.attribute = "stroke";
		this.color = color;
		this.width = width;
	}
	
	Symbol() {
		return new ol.style.Stroke({ color: this.color,	width: this.width });
	}
	
	static FromJson(json) {
		return new StaticStroke(json.color, json.width);
	}
}