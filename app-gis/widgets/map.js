"use strict";

import Core from "../../api-web-devs/tools/core.js";
import Templated from "../../api-web-devs/components/templated.js";
import BaseMap from "./basemap.js";
import HideLayer from "./hideLayer.js";
import SimulationDEVS from "../../api-web-devs/simulation/simulationDEVS.js";
import Model from "../../api-web-devs/simulation/model.js";
import FrameDEVS from "../../api-web-devs/simulation/frameDEVS.js";
import TransitionDEVS from "../../api-web-devs/simulation/transitionDEVS.js";

export default Core.Templatable("Widget.Map", class Map extends Templated {
    get Map() {
		return this.map;
	}
	
	constructor(container) {
		super(container);

		this.layers = {};
    }

    InitTileLayer() {
      var layer = new ol.layer.Tile({
        source: new ol.source.OSM(),
        noWrap: true,
        wrapX: false,
        title: "OSMStandard",
      });

		// NOTE : Terminology, a basemap is not a map
      this.map = new BaseMap(layer, this.Elem("map-container"));

		// NOTE : Naming, HideLayer is a function name, it shouldn't be a 
		// class to instantiate
      this.ToggleTileLayer = new HideLayer(layer);
	  
	  return this.map;
    }

	Layer(id) {
		return this.layers[id];
	}

	AddLayer(id, layer) {
		this.layers[id] = layer;
		
		this.map.OL.addLayer(layer.OL);
	}
	
	RemoveLayer(id) {
		// TODO : Implement
	}
	
    // Reorganize the templated pattern later
    Template() {
      return (
        "<div handle='map-container' class='map-container'></div>" +
        "<div style='display: flex;flex-direction: row; text-align: center'><input type='checkbox' id='checkbox' checked> Show World Map</input></div>" +
        "<div class='overlay-container'><span class='overlay-text' id='feature-name'></span><br><span class='overlay-text' id='feature-assets'></span><br></div>" +
        "<svg width = '960' height = '100'></svg>"
      );
    }
  }
);
