
import Style from "../../tools/style.js";

export default class PointIcon {

	get Scale() {
		return this.scale;
	}

	get Src() {
		return this.src;
	}

	constructor(scale, src) {
		this.type = "point";
		this.scale = scale;
		this.src = src;
	}
	
	Bucketize(stats) {
		Style.BucketizeStyle(this.scale, stats);
	}
	
	Symbol(d) {		
		return new ol.style.Style({
			image: new ol.style.Icon({
				anchor: [0.5, 0.5],
				anchorXUnits: 'fraction',
				anchorYUnits: 'fraction',
				scale: this.scale.Symbol(d),
				offset: [0,0],
				opacity: 1,
				src: this.src
			})
		});
	}
		
	static FromJson(json) {
		if (!json.src) {
			throw new Error("Cannot create a default point icon style. It must be created from json.");
		}
		
		var scale = json.scale ? Style.ScaleStyleFromJson(json.scale) : Style.DefaultScale();
		
		return new PointIcon(scale, json.src);
	}
}