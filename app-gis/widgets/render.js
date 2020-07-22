import VectorLayer from "./vectorLayer.js";
import { mapOnClick } from "./mapOnClick.js";
export default class RenderVector {
  get LAYER() {
    return this._vo;
  }

  constructor(map, data, dataCycle) {
    this._vo = new VectorLayer(
      "./data/Ontario.geojson",
      "Ontario",
      data,
      dataCycle
    );
    map.addLayer(this._vo.OL);
    mapOnClick(data, map);
  }
}
