/* 
  NOTICE: OpenLayers uses long/lat
  Spatial reference list: https://spatialreference.org/ref/epsg/
  EPSG:4326 (CRS84 is equivalent) used by GPS nav systems and NATO for geodetic surveying
  EPSG:3857 for rendering web maps
*/

export default class InitialLayer {
  // Get initial layer object
  get OL() {
    return this._map;
  }

  constructor(layer, target) {
    this._map = new ol.Map({
      renderer: "canvas",
      // The target is an HTML component 
      target: target,
      layers: [layer],
      view: new ol.View({
        center: ol.proj.transform(
          // TODO: Let users change the center or a "go-to x location"
          // Ontario coordinates
          [-85.0, 50.0],
          "EPSG:4326",
          "EPSG:3857"
        ),
        // Higher number means more close up
        zoom: 4,
      }),
  
    });
  }
}
