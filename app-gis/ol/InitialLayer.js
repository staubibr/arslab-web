export default class InitialLayer {
  // Get initial layer object
  get OL() {
    return this._map;
  }

  constructor(layer, target) {
    this._map = new ol.Map({
      renderer: "canvas",
      target: target,
      layers: [layer],
      controls: ol.control.defaults({ zoom: false }).extend([
        new ol.control.Zoom({ className: "custom-zoom" }),
        new ol.control.FullScreen(),
        new ol.control.Legend(),
        new ol.control.Sidebar({ element: "sidebar", position: "left" }),
        new ol.control.LayerSwitcher({ groupSelectStyle: "group" }),
      ]),
      view: new ol.View({
        center: ol.proj.transform(
          // Ontario coordinates
          [-85.0, 50.0],
          "EPSG:4326",
          "EPSG:3857"
        ),
        // Higher number means more close up
        zoom: 5,
      }),
    });
  }
}
