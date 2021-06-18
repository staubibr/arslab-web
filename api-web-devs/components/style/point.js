
import Style from "../../tools/style.js";

import BucketFill from "./bucketFill.js";
import BucketStroke from "./bucketStroke.js";
import BucketRadius from "./bucketRadius.js";

export default class Point {

	get radius() { return this._radius; }

	get stroke() { return this._stroke; }

	get fill() { return this._fill; }

	get type() { return this._type; }

	constructor(radius, fill, stroke) {
		this._type = "point";
		this._radius = radius;
		this._fill = fill;
		this._stroke = stroke;
	}
	
	Bucketize(stats) {
		Style.BucketizeStyle(this.radius, stats);
		Style.BucketizeStyle(this.fill, stats);
		Style.BucketizeStyle(this.stroke, stats);
	}
	
	Symbol(d) {
		if (this.radius) {
			return new ol.style.Style({
				image: new ol.style.Circle({
					radius: this.radius.Symbol(d),
					fill: this.fill.Symbol(d),
					stroke: this.stroke.Symbol(d)
				})
			});
		}
	}
	
	static FromJson(json) {
		var radius = json.radius ? Style.RadiusStyleFromJson(json.radius) : BucketRadius.DefaultRadius();
		
		var fill = json.fill ? Style.FillStyleFromJson(json.fill) : BucketFill.DefaultFill();
		
		var stroke = json.stroke ? Style.StrokeStyleFromJson(json.stroke) : BucketStroke.DefaultStroke();
		
		return new Point(radius, fill, stroke);
	}
}