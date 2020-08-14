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
          let title = (l.N.title != undefined) ? l.N.title.substring(0, l.N.title.indexOf(" ")) : "";
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
        "<div style='display: flex;flex-direction: row; text-align: center'></div>" +
        
        '<div id="map" handle="map-container" class="sidebar-map">' +
        // https://github.com/Turbo87/sidebar-v2/blob/master/doc/usage.md
          '<div id="sidebar" handle="sidebar" class="sidebar collapsed">' +
              '<div class="sidebar-tabs">'+
                '<ul role="tablist">'+
                  '<li><a href="#home" role="tab"><i class="fa fa-info"></i></a></li>'+
                  '<li><a href="#profile" role="tab"><i class="fa fa-database"></i></a></li>'+
                  '<li><a href="#downloadCSV" role="tab"><i class="fa fa-download"></i></a></li>'+
                  '<li><a href="#manipulate" role="tab"><i class="fa fa-pencil-square"></i></a></li>'+
                  '<li class="disabled"><a href="#messages" role="tab"><i class="fa fa-envelope"></i></a></li>'+
                  '<li><a href="https://github.com/staubibr/arslab-dev" role="tab" target="_blank"><i class="fa fa-link"></i></a></li>'+
                '</ul>'+

                '<ul role="tablist">'+
                  '<li><a href="#settings" role="tab"><i class="fa fa-gear"></i></a></li>'+
                '</ul>'+
              '</div>'+

              '<div class="sidebar-content">' +
              '<div class="sidebar-pane" id="home">' +
                '<h1 class="sidebar-header">Information<span class="sidebar-close"><i class="fa fa-caret-left"></i></span></h1>'+
                '<p>Insert Text Here</p>' +
              '</div>'+
        
              '<div class="sidebar-pane" id="profile">'+
                '<h1>Load and Download Data</h1>'+
                '<div></div>'+
                '<p>'+
                '</p>'+
              '</div>'+

              '<div class="sidebar-pane" id="downloadCSV">'+
              '<h1>Load and Download Data</h1>'+
              '<div></div>'+
              '<p>'+
              '</p>'+
            '</div>'+
        
              '<div class="sidebar-pane" id="manipulate">'+
                '<h1>Manipulate Simulations</h1>'+
                '<div></div>'+
                '<p></p>'+
              '</div>'+
        
              '<div class="sidebar-pane" id="messages">'+
                '<h1 class="sidebar-header">Messages<span class="sidebar-close"><i class="fa fa-caret-left"></i></span></h1>'+
              '</div>'+
        
              '<div class="sidebar-pane" id="settings">'+
                '<h1 class="sidebar-header">Settings<span class="sidebar-close"><i class="fa fa-caret-left"></i></span></h1>'+
                '<p>Insert some settings here<br/>'+
                '</p>'+
                '<p>Insert more settings here<br/>'+
                '</p>'+
              '</div>'+
            '</div>'+
          '</div>'+
              
              
            '</div>'+

          '</div>'+
        '</div>' 
      );
    }
  }
);
