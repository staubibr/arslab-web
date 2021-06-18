
import Style from "../../tools/style.js";

import BucketScale from "./bucketScale.js";

export default class PointIcon {

	get scale() { return this._scale; }

	get src() { return this._src; }

	get type() { return this._type; }

	constructor(scale, src) {
		this._type = "point";
		this._scale = scale;
		this._src = src;
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
		
		var scale = json.scale ? Style.ScaleStyleFromJson(json.scale) : BucketScale.DefaultScale();
		
		return new PointIcon(scale, json.src);
	}
}