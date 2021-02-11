
import Style from "../../tools/style.js";

export default class Polygon {

	get Fill() {
		return this.fill;
	}

	get Stroke() {
		return this.stroke;
	}

	constructor(fill, stroke) {
		this.type = "polygon";
		this.fill = fill;
		this.stroke = stroke;
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
		var fill = json.fill ? Style.FillStyleFromJson(json.fill) : Style.DefaultFill();
		
		var stroke = json.stroke ? Style.StrokeStyleFromJson(json.stroke) : Style.DefaultStroke();
		
		return new Polygon(fill, stroke);
	}
}