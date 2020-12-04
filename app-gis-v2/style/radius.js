
export default class StaticRadius {

	constructor(radius) {
		this.type = "static";
		this.attribute = "radius";
		this.radius = radius;
	}
	
	Symbol() {
		return this.radius;
	}
	
	static FromJson(json) {
		return new StaticRadius(json.radius);
	}
}