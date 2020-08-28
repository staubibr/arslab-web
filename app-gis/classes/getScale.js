// export default class GetScale {
//   get GS() {
//     return this._getscale;
//   }

//   constructor(val, classes) {
//     var indexToColor = d3.scaleLinear().domain([0, 5]).range(["white", val]);
//     // Break up the scale into 4 quartered categories

//     // this._getscale = d3
//     //   .scaleQuantize()
//     //   .domain([0, 1])
//     //   .range(d3.range(classes).map(indexToColor));
//   }
// }

export default class GetScale {
  
  get d3Scale() {
	  return this._scale;
  }
  
  GetColor(feature, value){
    // Implement highlight feature through here (draw border)
	  if (feature.selected) return "white";
	  
	  return this._scale(value);
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