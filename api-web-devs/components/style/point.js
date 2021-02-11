
import Style from "../../tools/style.js";

export default class Point {

	get Radius() {
		return this.fill;
	}

	get Stroke() {
		return this.stroke;
	}

	constructor(radius, fill, stroke) {
		this.type = "point";
		this.radius = radius;
		this.fill = fill;
		this.stroke = stroke;
	}
	
	Bucketize(stats) {
		Style.BucketizeStyle(this.radius, stats);
		Style.BucketizeStyle(this.fill, stats);
		Style.BucketizeStyle(this.stroke, stats);
	}
	
	Symbol(d) {		
		return new ol.style.Style({
			image: new ol.style.Circle({
				radius: this.radius.Symbol(d),
				fill: this.fill.Symbol(d),
				stroke: this.stroke.Symbol(d)
			})
		});
	}
		
	static FromJson(json) {
		var radius = json.radius ? Style.RadiusStyleFromJson(json.radius) : Style.DefaultRadius();
		
		var fill = json.fill ? Style.FillStyleFromJson(json.fill) : Style.DefaultFill();
		
		var stroke = json.stroke ? Style.StrokeStyleFromJson(json.stroke) : Style.DefaultStroke();
		
		return new Point(radius, fill, stroke);
	}
}