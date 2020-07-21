import VectorLayer from "./vectorLayer.js";
import { mapOnClick } from "./mapOnClick.js";
export const render = (map, scale, data, dataCycle) => {
  const jsonFILE = new VectorLayer(
    "./data/Ontario.geojson",
    "Ontario",
    scale,
    data,
    dataCycle
  );
  map.addLayer(jsonFILE.OL);
  mapOnClick(data, map);

  return jsonFILE;
};
