import VectorLayer from "./vectorLayer.js";
import { mapOnClick } from "./mapOnClick.js";

// TODO : We should maybe move away from wrapping OL objects. It might be too much
// complexity for a first app.
export default  class RenderVector {
  get LAYER() {
    return this._vo;
  }

	// NOTE : This class is impossible to reuse because ontario.geojson is hardcoded.
  constructor(map, data) {
    this._vo = new VectorLayer(
      "./data/Ontario.geojson",
      "Ontario",
      data
    );
	
    map.AddLayer(this._vo);
    
	mapOnClick(data, map);
  }
}
