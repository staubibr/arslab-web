"use strict";

import Core from "../../api-web-devs/tools/core.js";
import Templated from "../../api-web-devs/components/templated.js";
import InitialLayer from "../classes/InitialLayer.js";

export default Core.Templatable(
  "Widget.Map",
  class Map extends Templated {
    get Map() {
      return this.map;
    }

    constructor(container) {
      super(container);
      // For storing layer objects and accessing them
      // Required for Layer() , Layers(), and AddLayer()
      this.layers = {};
    }

    // Create the initial layer (a world map from openstreetmaps in this case)
    InitTileLayer() {
      var layer = this.LayerForMap();

      // This will display the world map onto the website
      this.map = new InitialLayer(layer, this.Elem("map-container"));
      
      // Lets you hide the world map
      // Every time we add a GeoJSON, it gets added to the layer switcher as well
      this.map._map.addControl(new ol.control.LayerSwitcher({groupSelectStyle: 'group'}));

      return this.map;
    }

    LayerForMap(){
      let layer = new ol.layer.Tile({
        source: new ol.source.OSM(),
        noWrap: true,
        wrapX: false,
        title: "OSMStandard",
      });
      return layer;
    }

    Layer(id) {
      return this.layers[id];
    }
    
    // Add a vector layer onto of the world map
    // If another vector layer is below the new vector layer,
    // the new vector layer will appear on top of the bottom one
    // ** This is why a different color for each vector layer may be useful **
    // The code below is so we don't have the same vector layer on the world map multiple times
    AddLayer(id, layer) {
      this.layers[id] = layer;
      let self = this;
      this.map.OL.getLayers().forEach(function (l) {
        if (l != undefined) {
          let title = l.N.title.substring(0, l.N.title.indexOf(" "));
          if (id == title) { self.map.OL.removeLayer(l); }
        }
      })
      this.map.OL.addLayer(layer.OL);
    }

    Layers(){
      return this.layers;
    }

    Template() {
      return (
        "<div style='display: flex;flex-direction: row; text-align: center'>" +
        "</div>" +
        "<div handle='map-container' class='map-container'></div>"
      );
    }
  }
);
