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
    var customControl = function(opt_options) {
      var elem = document.querySelector(".overlay-container");
      elem.className = 'custom-control ol-unselectable ol-control';
      ol.control.Control.call(this, {
        element: elem
      });
    };
    ol.inherits(customControl, ol.control.Control);

    this._map = new ol.Map({
      renderer: "canvas",
      // The target is an HTML component 
      target: target,
      // In case we want to add more base maps later
      layers: [new ol.layer.Group({title: 'Base map', layers: [layer]})],
      controls: ol.control.defaults({zoom:false}).extend([new ol.control.Zoom({
        className: 'custom-zoom'
    })]),
      view: new ol.View({
        center: ol.proj.transform(
          // TODO: Let users change the center or a "go-to x location"
          // Ontario coordinates
          [-85.0, 50.0],
          "EPSG:4326",
          "EPSG:3857"
        ),
        // Higher number means more close up
        zoom: 5,
      }),
    });
    this._map.addControl(new customControl);


    var sidebar = new ol.control.Sidebar({element: "sidebar", position: 'left'});
    this._map.addControl(sidebar);

    // Lets you hide the world map
    // Every time we add a GeoJSON, it gets added to the layer switcher as well
    this._map.addControl(new ol.control.LayerSwitcher({groupSelectStyle: 'group'}));

    this._map.addControl(new ol.control.FullScreen())
    // var fullscreenControl = new ol.control.FullScreen({
    //   source: document.getElementById('map').parentNode
    // });
    
    // map.addControl(fullscreenControl);


    // GEOCODER GETS ADDED AS A LAYER AS WELL WHICH IS PROBLEMATIC FOR AddLayer(id, layer)
    var geocoder = new Geocoder('nominatim', {
      provider: 'osm',
      lang: 'en',
      placeholder: 'Search for ...',
      limit: 5,
      debug: false,
      autoComplete: true,
      keepOpen: true,
      lang : 'en-US',
    });

    this._map.addControl(geocoder);


    // var search = new ol.control.SearchNominatim({
    //   target: $("#search > div").get(0),
    // });
    // let self = this;
    // search.on('select', function(e) {
    //   self._map.getView().setCenter(e.coordinate)
    //   if (self._map.getView().getZoom()<13) {
    //     self._map.getView().setZoom(13)
    //     e.getSource().clear()
    //   };
    // });
  }
  
}
