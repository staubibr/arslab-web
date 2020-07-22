// export const getScale = () => {
//   var indexToColor = d3.scaleLinear().domain([0, 5]).range(["white", "red"]);
//   var scale = d3
//     .scaleQuantize()
//     .domain([0, 1])
//     .range(d3.range(4).map(indexToColor));
//   return scale;
// };

export default class GetScale {
  get GS() {
    return this._getscale;
  }

  constructor() {
    // https://d3-legend.susielu.com/
    // https://github.com/susielu/d3-legend
    // https://bl.ocks.org/katielong/352d6ffbfebe6fbecd45e17b8ce65486
    var indexToColor = d3.scaleLinear().domain([0, 5]).range(["white", "red"]);
    this._getscale = d3
      .scaleQuantize()
      .domain([0, 1])
      .range(d3.range(4).map(indexToColor));
  }
}
