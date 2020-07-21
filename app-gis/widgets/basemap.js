/* 
  NOTICE: OpenLayers uses long/lat
  Spatial reference list: https://spatialreference.org/ref/epsg/
  EPSG:4326 (CRS84 is equivalent) used by GPS nav systems and NATO for geodetic surveying
  EPSG:3857 for rendering web maps
*/

/* 
  The task will start as soon as it is invoked by the .then()
  See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

  For .find() see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
  For choropleth mapping see: https://gis.stackexchange.com/questions/276918/creating-choropleth-map-using-openlayers
  For map see: https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html

*/

export default class BaseMap {
    get OL() {
      return this._map;
    }
    
    constructor(layer) {
      /* 
      This will display the basemap
      See : https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html
      */
      this._map = new ol.Map({
        renderer: "canvas",
        target: 'map',
        layers: [layer],
        view: new ol.View({
          center: ol.proj.transform(
            // Ontario coordinates
            [	-85.000000, 	50.000000],
            "EPSG:4326",
            "EPSG:3857"
          ),
          // Higher number means more close up
          zoom: 4,
        }),
      });
    }

  }