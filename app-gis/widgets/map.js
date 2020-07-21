"use strict";

import Core from "../../api-web-devs/tools/core.js";
import Templated from "../../api-web-devs/components/templated.js";
import HideLayer from "./hideLayer.js";
import { getScale } from "./getScale.js";
import { render } from "./render.js";
import { sort } from "./sort.js";
import BaseMap from "./basemap.js";

export default Core.Templatable(
  "Widget.Map",
  class Map extends Templated {
    constructor(container) {
      super(container);
    }

    InitTileLayer() {
      var layer = new ol.layer.Tile({
        source: new ol.source.OSM(),
        noWrap: true,
        wrapX: false,
        title: "OSMStandard",
      });

      this.m = new BaseMap(layer, this.Elem("map-container"));

      this.ToggleTileLayer = new HideLayer(layer);

      this.GetVectorLayer(this.m);
    }

    GetVectorLayer(map) {
      const cycle = document.querySelector("#cycle");
      const output = document.querySelector(".cycle-output");

      output.textContent = cycle.value;

      var DataForMapping = async function () {
        let dauidSimulationCycleData = await sort();

        const jsonFILE = render(
          map.OL,
          getScale(),
          dauidSimulationCycleData,
          0
        );

        var title = "Legend";
        var translate = "translate(20,30)";

        jsonFILE.GetLegend(getScale(), title, translate);

        cycle.addEventListener("input", function () {
          output.textContent = cycle.value;
          render(map.OL, getScale(), dauidSimulationCycleData, cycle.value);
        });
      };

      DataForMapping();
    }
    // Reorganize the templated pattern later
    Template() {
      return (
        "<div handle='map-container' class='map-container'> <label for='price'>Simulation Cycle Selector:</label><input type='range' name='cycle' id='cycle' min='0' max='50' step='1' value='0'><output class='cycle-output' for='cycle'></output> </div>" +
        "<div style='display: flex;flex-direction: row; text-align: center'><input type='checkbox' id='checkbox' checked> Show World Map</input></div>" +
        "<div class='overlay-container'><span class='overlay-text' id='feature-name'></span><br><span class='overlay-text' id='feature-assets'></span><br></div>" +
        "<svg width = '960' height = '100'></svg>"
      );
    }
  }
);
