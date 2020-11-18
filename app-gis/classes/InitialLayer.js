export default class InitialLayer {
  // Get initial layer object
  get OL() {
    return this._map;
  }

  constructor(layer, target) {
    var Legend = function (opt_options) {
      var options = opt_options || {};

      var leg = document.querySelector(".svg");

      var element = document.querySelector(".svg-div");
      element.className = "legend-svg";
      element.appendChild(leg);

      ol.control.Control.call(this, {
        element: element,
        target: options.target,
      });
    };
    ol.inherits(Legend, ol.control.Control);

    this._map = new ol.Map({
      renderer: "canvas",
      target: target,
      layers: [layer],
      controls: ol.control.defaults({ zoom: false }).extend([
        new ol.control.Zoom({ className: "custom-zoom" }),
        new ol.control.FullScreen(),
        new Legend(),
        new ol.control.Sidebar({ element: "sidebar", position: "left" }),
        new ol.control.LayerSwitcher({ groupSelectStyle: "group" }),
        // GEOCODER GETS ADDED AS A LAYER, FIND A WAY TO REMOVE IT LATER
        // Seems to break with AdBlock
        new Geocoder("nominatim", {
          provider: "osm",
          lang: "en",
          placeholder: "Search for ...",
          limit: 5,
          debug: false,
          autoComplete: true,
          keepOpen: true,
          lang: "en-US",
        }),
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
