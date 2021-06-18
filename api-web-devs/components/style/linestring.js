
import Style from "../../tools/style.js";

import BucketStroke from "./bucketStroke.js";

export default class Linestring {

	get stroke() { return this._stroke; }

	get type() { return this._type; }

	constructor(stroke) {
		this._type = "linestring";
		this._stroke = stroke;
	}
	
	Bucketize(stats) {

	}
	
	Symbol(d) {
		return new ol.style.Style({
			stroke: this.stroke.Symbol(d)
		});
	}
	
	static FromJson(json) {		
		var stroke = json.stroke ? Style.StrokeStyleFromJson(json.stroke) : BucketStroke.DefaultStroke();
		
		return new Linestring(stroke);
	}
}