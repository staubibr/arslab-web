"use strict";

import Core from "../../api-web-devs/tools/core.js";
import Templated from "../../api-web-devs/components/templated.js";
import InitialLayer from "./InitialLayer.js";

export default Core.Templatable("Widget.Map", class Map extends Templated {
    get Map() { return this.map; }

    constructor(container) {
      super(container);
      this.layers = {};
    }

    // Create the initial layer (a world map from openstreetmaps in this case)
    InitLayer() {
      var layer = this.LayerForBaseMap();

      // Display OSM map and add controls to the map (sidebar, search, zoom, full screen, etc.)
      this.map = new InitialLayer(layer, this.Elem("map-container"));

      // Add DOMs to the sidebar from app-gis/application.js
      this.AddToSidebar();

      return this.map;
    }

    LayerForBaseMap(){
      return new ol.layer.Tile({
        source: new ol.source.OSM(),
        noWrap: true,
        wrapX: false,
        title: "OpenStreetMap",
      });
    }

    Layer(id) { return this.layers[id]; }

    Layers(){ return this.layers; }
    
    // Add a vector layer onto of the world map
    AddLayer(id, layer) {
      this.layers[id] = layer;
      this.map.OL.addLayer(layer.OL);
    }

    AddToSidebar(){
      document
        .getElementById("loadDataSidebar")
        .appendChild(document.getElementById("loadDataApp"));
      document
        .getElementById("editSimulationSidebar")
        .appendChild(document.getElementById("editSimulationApp"));
      document
        .getElementById("playSidebar")
        .appendChild(document.getElementById("playbackApp"));
      document
        .getElementById("downloadDataSidebar")
        .appendChild(document.getElementById("downloadDataApp"));
    }

    Template() {
      return (
        // Map container where functionality will be held
        '<div id="map" handle="map-container" class="sidebar-map">' +

          // Sidebar
          '<div id="sidebar" handle="sidebar" class="sidebar collapsed">' +
              // Sidebar tabs
              '<div class="sidebar-tabs">'+
                '<ul role="tablist">'+
                  '<li><a href="#home" role="tab"><i class="fa fa-home"></i></a></li>'+
                  '<li><a href="#loadDataSidebar" role="tab"><i class="fa fa-database"></i></a></li>'+
                  '<li><a href="#editSimulationSidebar" role="tab"><i class="fa fa-filter"></i></a></li>'+
                  '<li><a href="#playSidebar" role="tab"><i class="fa fa-play"></i></a></li>'+
                  '<li><a href="#downloadDataSidebar" role="tab"><i class="fa fa-download"></i></a></li>'+
                  // '<li><a href="#featureInfoSidebar" role="tab"><i class="fa fa-info"></i></a></li>'+
                '</ul>'+

                // Lowest sidebar tab (settings)
                '<ul role="tablist">'+
                  '<li><a href="#settings" role="tab"><i class="fa fa-gear"></i></a></li>'+
                '</ul>'+
              '</div>'+

              // Sidebar content
              '<div class="sidebar-content">' +
                '<div class="sidebar-pane" id="home">' +
                  '<h1 class="sidebar-header">Home<span class="sidebar-close"><i class="fa fa-caret-left"></i></span></h1>'+
                  '<p><h3>Resources</h3></p>' +
                  '<p><a href="https://github.com/staubibr/arslab-dev/tree/master/app-gis" target="new">Documentation and Source Code</a></p>' +
                  '<p><a href="https://www.youtube.com/watch?v=eAaeGtoMDUQ" target="new">Video Tutorial</a></p>' +
                  '<p><h3>Contact</h3></p>' +
                  '<p><a href="https://arslab.sce.carleton.ca/" target="new">ARSLab</a></p>' +
                '</div>'+
          
                '<div class="sidebar-pane" id="loadDataSidebar">'+
                  '<h1 class="sidebar-header">Load Data<span class="sidebar-close"><i class="fa fa-caret-left"></i></span></h1>'+
                '</div>'+

                '<div class="sidebar-pane" id="editSimulationSidebar">'+
                '<h1 class="sidebar-header">Visualization<span class="sidebar-close"><i class="fa fa-caret-left"></i></span></h1>'+
                '</div>'+

                '<div class="sidebar-pane" id="playSidebar">'+
                '<h1 class="sidebar-header">Play Visualization<span class="sidebar-close"><i class="fa fa-caret-left"></i></span></h1>'+
                '<p></p>' +
                '</div>'+

                '<div class="sidebar-pane" id="downloadDataSidebar">'+
                  '<h1 class="sidebar-header">Download Data (as CSV)<span class="sidebar-close"><i class="fa fa-caret-left"></i></span></h1>'+
                  '<p></p>' +
                '</div>'+

                // '<div class="sidebar-pane" id="featureInfoSidebar">'+
                // '<h1 class="sidebar-header">Feature Information<span class="sidebar-close"><i class="fa fa-caret-left"></i></span></h1>'+
                // '</div>'+
          
                '<div class="sidebar-pane" id="settings">'+
                  '<h1 class="sidebar-header">Settings<span class="sidebar-close"><i class="fa fa-caret-left"></i></span></h1>'+
                  '<p>No settings yet<br/></p>'+
                '</div>'+

              '</div>'+
            '</div>'+
          '</div>'+
        '</div>' 
      );
    }
  }
);
