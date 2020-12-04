
export default class StaticFill {

	constructor(color) {
		this.type = "static";
		this.attribute = "fill";
		this.color = color;
	}
	
	Symbol() {
		return new ol.style.Fill({ color: this.color });
	}
	
	static FromJson(json) {
		return new StaticFill(json.color);
	}
}