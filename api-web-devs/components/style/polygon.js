
import Style from "../../tools/style.js";

import BucketFill from "./bucketFill.js";
import BucketStroke from "./bucketStroke.js";

export default class Polygon {

	get fill() { return this._fill; }

	get stroke() { return this._stroke; }

	get type() { return this._type; }

	constructor(fill, stroke) {
		this._type = "polygon";
		this._fill = fill;
		this._stroke = stroke;
	}
	
	Bucketize(stats) {
		Style.BucketizeStyle(this.fill, stats);
		Style.BucketizeStyle(this.stroke, stats);
	}
	
	Symbol(d) {		
		return new ol.style.Style({
			stroke: this.stroke.Symbol(d),
			fill: this.fill.Symbol(d)
		});
	}
	
	static FromJson(json) {		
		var fill = json.fill ? Style.FillStyleFromJson(json.fill) : BucketFill.DefaultFill();
		
		var stroke = json.stroke ? Style.StrokeStyleFromJson(json.stroke) : BucketStroke.DefaultStroke();
		
		return new Polygon(fill, stroke);
	}
}