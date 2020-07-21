"use strict";

import Core from "../../api-web-devs/tools/core.js";
import Templated from "../../api-web-devs/components/templated.js";
import BaseMap from "./basemap.js";
import { hideLayer } from "./hideLayer.js";
import { getScale } from "./getScale.js";
import { render } from "./render.js";
import { sort } from "./sort.js";

export default Core.Templatable(
  "Widget.Map",
  class Map extends Templated {
    constructor(container) {
      super(container);

      this.GetBaseMap();
    }

    GetBaseMap() {
      var layer = new ol.layer.Tile({
        source: new ol.source.OSM(),
        noWrap: true,
        wrapX: false,
        title: "OSMStandard",
      });
      this.m = new BaseMap(layer);

      hideLayer(layer);
      this.GetVectorLayer(this.m);
      return this.m;
    }

    GetVectorLayer(map) {
      const cycle = document.querySelector("#cycle");
      const output = document.querySelector(".cycle-output");
      output.textContent = cycle.value;
      (async function DataForMapping(){
        let dauidSimulationCycleData = await sort();
        const jsonFILE = render(map.OL, getScale(), dauidSimulationCycleData, 0);
        var title = "Legend",
          translate = "translate(20,30)";
        jsonFILE.GetLegend(getScale(), title, translate);
  
        cycle.addEventListener("input", function () {
          output.textContent = cycle.value;
          render(map.OL, getScale(), dauidSimulationCycleData, cycle.value);
        });
      })();

    }

    Template() {
      return "<div handle='map' id='map' class='map' style='width: 100%; height: 20%;'>Potato</div>";
    }
  }
);
