export default class GetScale {
  get GS() {
    return this._getscale;
  }

  constructor() {
    
    // TODO:
    // Create a color wheel for users
    var indexToColor = d3.scaleLinear().domain([0, 5]).range(["white", "blue"]);
    // Break up the scale into 4 quartered categories
    this._getscale = d3
      .scaleQuantize()
      .domain([0, 1])
      .range(d3.range(4).map(indexToColor));
  }
}
