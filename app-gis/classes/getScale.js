/* 
  Accept values between x to y 
  and then map them between a 
  certain range
*/

export default class GetScale {
  get d3Scale() {
    return this._scale;
  }
  get Domain() {
    return this._scale.domain();
  }

  constructor(val, classes) {
    // The gradient is always from red to whatever color the user chooses
    var indexToColor = d3.scaleLinear().domain([0, 5]).range(["white", val]);

    this._scale = d3
      .scaleQuantize()
      .domain([0, 1])
      .range(d3.range(classes).map(indexToColor));
  }

  // Class function
  GetColor(feature, value) {
    // Implement highlight feature through here (draw border)
    //if (feature.selected) return "white";

    return this._scale(value);
  }
}
