"use strict";

import Core from "../api-web-devs/tools/core.js";
import Dom from "../api-web-devs/tools/dom.js";
import Net from "../api-web-devs/tools/net.js";
import Templated from "../api-web-devs/components/templated.js";
import Playback from "../api-web-devs/widgets/playback.js";
import Header from "./widgets/header.js";
import Map from "./widgets/map.js";
import Box from "../api-web-devs/ui/box-input-files.js";

import { sort } from "./widgets/sort.js";
import { mapOnClick } from "./widgets/mapOnClick.js";
import VectorLayer from "./classes/vectorLayer.js";
import GetScale from "./classes/getScale.js";

import SimulationDEVS from "../api-web-devs/simulation/simulationDEVS.js";
import Model from "../api-web-devs/simulation/model.js";
import FrameDEVS from "../api-web-devs/simulation/frameDEVS.js";
import TransitionDEVS from "../api-web-devs/simulation/transitionDEVS.js";

export default class Application extends Templated {
  constructor(node) {
    super(node);

    // Default legend. Currently hardcoded.
    this.CreateLegend(Core.Nls("App_Legend_Title"), "translate(20,30)");

    // The world map prior to any vector layers being added overtop
    this.Widget("map").InitTileLayer();

    //Creates a vector layer, by default it starts at the 0th simulation cycle
    sort().then(this.DataLoaded_Handler.bind(this));

    // Modifies the vector layer above depending on the simulation cycle selector's current value
    this.Node("cycle").On("change", this.OnCycle_Change.bind(this));
  }

  DataLoaded_Handler(data) {
    this.data = data;

    this.Elem("cycle").setAttribute("max", this.data.length - 1);

    // We'll need this for mapOnClick
    let title = "ontario";

    let scale = new GetScale();

    /* Create the vector layer: 
		 - Read Ontario's coordinates 
		 - Add a title 
		 - Match simulation data to Ontarios census subdivisions
		 - Color in each census subdivision based on its infeced proportion value
		*/
    let layer = new VectorLayer(
      "./data/Ontario.geojson",
      title,
      data[0].messages,
      scale.GS
    );

    // add vector layer onto world map
    this.Widget("map").AddLayer("ontario", layer);

    // make the vector layers attributes visible through clicking census subdivisions
    mapOnClick(data[0].messages, this.Widget("map").map._map, title);

    // If the simulation cycle changes, updates the simulaiton object
    layer.OL.getSource().once("change", this.OnLayerChange_Handler.bind(this));
  }

  CreateLegend(title, translate) {
    let scale = new GetScale();

    const svg = d3.select("svg");

    svg.append("g").attr("class", title).attr("transform", translate);

    svg
      .append("text")
      .text("Proportion of the DAUID Population with Infection")
      .attr("transform", "translate(1,25)");

    var colorLegend = d3
      .legendColor()
	  .labelFormat(d3.format(".2f"))
	  // To actually color the legend based on our chosen colors
      .scale(scale.GS);

    svg.select("." + title).call(colorLegend);
  }

  OnCycle_Change(ev) {
    this.Elem("output").textContent = ev.target.value;

	// Access a new simulation cycle based on users choice from the simulation cycle selector
    let data = this.data[ev.target.value].messages;

    let title = "ontario";

    let scale = new GetScale();

    // New vector layer object that'll overwrite the vector layer object from the previous simulation cycle
    let layer = new VectorLayer(
      "./data/Ontario.geojson",
      title,
      data,
      scale.GS
	);
	
	let layerObjects = this.Widget("map").layers;

	// This will overwrite the previous simulation cycle vector object and add the new one
    this.Widget("map").AddLayer("ontario", layer, layerObjects);

    mapOnClick(data, this.Widget("map").map._map, title);
	
	// if the simulation cycle changes, updates the simulation object again
    layer.OL.getSource().once("change", this.OnLayerChange_Handler.bind(this));
  }

  OnLayerChange_Handler(ev) {
    var features = ev.target.getFeatures();
    this.CreateSimulation(features, this.data);
  }

  CreateSimulation(features, data) {
    // NOTE : This is crazy messy but it would create a Simulation object.
    // The way the code is currently structured makes this difficult to achieve
    // and probably not worth it. This is something I would usually do as a preload
    // step. You load all your data, build your simulation, then initialize the app.
    // As it is now, different pieces of data are loaded in various places so it's
    // difficult to have everything you need in one place. In addition, there is no
    // simulation structure file that contains all models, links, ports, etc. These
    // all have to be derived from the geojson and output file.
    var models = features.map((f) => {
      return new Model(f.getProperties().dauid, "atomic");
    });

    var simulation = new SimulationDEVS("hoya", "custom", "Cell-DEVS", models);

    for (var i = 0; i < data.length; i++) {
      var frame = new FrameDEVS(data[i].time);

      simulation.AddFrame(frame);

      for (var id in data[i].messages) {
        var transition = new TransitionDEVS(
          id,
          "infected",
          data[i].messages[id]
        );

        frame.AddTransition(transition);
      }
    }

    simulation.Initialize(10);
  }

  Template() {
    return (
      "<main handle='main'>" +
      "<div handle='header' widget='Widget.Header' class='header'></div>" +
      "<div id='map' handle='map' widget='Widget.Map' class='map'></div>" +
      "<div class='overlay-container'><span class='overlay-text' id='feature-name'>" +
      "</span><br><span class='overlay-text' id='feature-assets'></span><br>" +
      "</div>" +
      "<label>Simulation Cycle Selector:" +
      "<input handle='cycle' type='range' name='cycle' id='cycle' min='0' max = '0' step='1' value='0' >" +
      "<output handle='output' class='cycle-output' for='cycle'></output>" +
      "</label>" +
      "<svg width = '960' height = '100'></svg>" +
      "<div handle='box' widget='Widget.Box-Input-Files' class='box'></div>" +
      "<div><button>Submit</button></div>" +
      "</main>"
    );
  }
}
