
export default class StaticScale {

	constructor(scale) {
		this.type = "static";
		this.attribute = "scale";
		this.scale = scale;
	}
	
	Symbol() {
		return this.scale;
	}
	
	static FromJson(json) {
		return new StaticScale(json.scale);
	}
}