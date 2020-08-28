export default class GetScale {
  get GS() {
    return this._getscale;
  }
  
  get Domain() {
	  return this._scale.domain();
  }
  
  GetColor(feature, value){
	  if (feature.selected) return "white";
	  
	  return this._scale(value);
  }

  constructor(val, classes) {
	  var indexToColor = d3.scaleLinear().domain([0, 5]).range(["white", val]);
	  
	  this._scale = d3.scaleQuantize()
					  .domain([0, 1])
					  .range(d3.range(classes).map(indexToColor));
  }
}
