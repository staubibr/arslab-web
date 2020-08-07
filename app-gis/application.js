"use strict";

import Core from "../api-web-devs/tools/core.js";
import Dom from "../api-web-devs/tools/dom.js";
import Net from "../api-web-devs/tools/net.js";
import Templated from "../api-web-devs/components/templated.js";
import Playback from "../api-web-devs/widgets/playback.js";
import Header from "./widgets/header.js";
import Map from "./widgets/map.js";
import Box from "../api-web-devs/ui/box-input-files.js";
import VectorLayer from "./classes/vectorLayer.js";
import GetScale from "./classes/getScale.js";
import SimulationDEVS from "../api-web-devs/simulation/simulationDEVS.js";
import Model from "../api-web-devs/simulation/model.js";
import FrameDEVS from "../api-web-devs/simulation/frameDEVS.js";
import TransitionDEVS from "../api-web-devs/simulation/transitionDEVS.js";
import CustomParser from "./parsers/customParser.js";
import CreateCsvFileForDownload from "./classes/CreateCsvFile.js";

import { mapOnClick } from "./widgets/mapOnClick.js";
import { createTransitionFromSimulation } from "../app-gis/functions/simToTransition.js";
import { openCageChangeMapCenter } from "./widgets/changeMapCenter.js";

export default class Application extends Templated {
  constructor(node) {
    super(node);

    // By default the legend will be red-white unless otherwise specified by the user
    this.CreateLegend(Core.Nls("App_Legend_Title"), "translate(20,30)");

    // The world map prior to any vector layers being added overtop
    this.Widget("map").InitTileLayer();

    //Creates a vector layer, by default it starts at the 0th simulation cycle (time frame)
    this.Node('simResults').On("change", this.ChunkSimulationResults.bind(this))
    //this.ChunkSimulationResults() //.then(this.DataLoaded_Handler.bind(this));

    // Modifies an existing vector layer depending on the simulation cycle selector's current value
    this.Node("cycle").On("change", this.OnCycle_Change.bind(this));

    // For downloading data after all necessary files are inserted by user
    this.Node("btnDownload").On("click", this.OnButtonDownload_Click.bind(this));

    // For changing the map's center locaiton
    this.Node("address").On("change", this.OnCenterChange.bind(this));
  }

  // We may find these useful to access throughout building the application
  UserLayers(file, title) {
    // if (this.userLayerGeoJSON == undefined) {
    //   this.userLayerGeoJSON = new Array;
    // }
    // if (this.userLayerTitle == undefined) {
    //   this.userLayerTitle = new Array;
    // }
    // this.userLayerGeoJSON.push(file);
    // this.userLayerTitle.push(title);

    this.userLayerGeoJSON = file;
    this.userLayerTitle = title;
  }

  currentColorScale(scale) { this.currentScale = scale; }

  CurrentSimulationCycle(cycle) { this.curCycle = cycle; }

  simFiles(data){
    if(this.DataFromFiles == undefined){
      this.DataFromFiles = new Array;
    }
    this.DataFromFiles.push(data);
  }

  ChunkSimulationResults(event) {
    let self = this,
      file = event.target.files[0], parser = new CustomParser()
    parser.Parse(file).then(function (data) { self.DataLoaded_Handler(data); })
  }

  // Takes chunked simulation results and formats it accordingly 
  DataLoaded_Handler(data) {
    this.data = sortData(data);
    this.simFiles(this.data)
    console.log(this.DataFromFiles)

    // Set the simulaton cycle selector max value
    this.Elem("cycle").setAttribute("max", this.data.length - 1);

    // Let the choose file button be clickable
    this.Elem("vectorLayer").disabled = false;

    // Check if user selected a geojson file
    this.CheckForGeoJSON(document.querySelector("input[name='vectorLayer']"));

  }

  CheckForGeoJSON(input) {
    let self = this;

    input.addEventListener("change", function (event) {

      let f = event.target.files[0], 
        fileReader = new FileReader();

      fileReader.onload = function (event) {
        let fileContent = event.target.result, 
          title = f.name.substring(0, f.name.indexOf("."));

        var elem = document.createElement('option')
        //elem.setAttribute("value", 5);
        let simNum = self.DataFromFiles.length
        var elemText = document.createTextNode(title + " simulation" + simNum + " with " + self.data.length + " cycles")
        elem.appendChild(elemText)
        var foo = document.getElementById("scale-select")
        foo.appendChild(elem)

        // so we can use the content for OnCycleChange and RecolorLayer
        self.UserLayers(fileContent, title);

        let scale = (self.currentScale == undefined) ? self.currentColorScale(new GetScale("red")) : self.currentScale;

        self.LayerOntoMap(fileContent, title+simNum, self.data[0].messages, scale.GS, true);
      };
      if(f != undefined){
        fileReader.readAsDataURL(f);
      }
      // Dont need file anymore
      document.querySelector('input[name="simResults"]').value= null;
      document.querySelector("input[name='vectorLayer']").value = null;
      self.Elem("vectorLayer").disabled = true;
    }, false);
  }

  /* Create the vector layer: 
  - Read layer coordinates 
  - Add a title 
  - Match simulation data to census subdivisions
  - Color in each census subdivision based on its infeced proportion value
  - Create simulation object based on data
  */
  LayerOntoMap(fileContent, title, data, scale, CreateSimulationObject) {
    let layer;

    //Title the vector layer based on what cycle it is on, might not be necessary, but keep it this code for now
    if (this.curCycle == undefined) { layer = new VectorLayer(fileContent, title + " Cycle0", data, scale); }
    else { layer = new VectorLayer(fileContent, title + " Cycle" + this.curCycle, data, scale); }

    // add vector layer onto world map
    this.Widget("map").AddLayer(title, layer);

    // make the vector layers attributes visible through clicking census subdivisions
    mapOnClick(data, this.Widget("map").map._map, title);

    // Creates the simulaiton object only once state.txt and geojson are loaded. This step does not occur twice.
    if (CreateSimulationObject == true) { layer.OL.getSource().once("change", this.OnLayerChange_Handler.bind(this)); }
  }

  CreateLegend(title, translate) {
    // Create initial legend
    this.InitialLegend(title, translate);

    // Recreate legend if user changes the color
    this.RecreateLegend(title, translate);
  }

  InitialLegend(title, translate) {
    let scale;
    if (this.currentScale == undefined) {
      this.currentColorScale(new GetScale("red"));
      scale = this.currentScale;
    }
    const svg = d3.select("svg");

    svg.append("g").attr("class", title).attr("transform", translate);

    svg.append("text").text("Proportion of the DAUID Population with Infection").attr("transform", "translate(1,25)");

    var colorLegend = d3
      .legendColor()
      .labelFormat(d3.format(".2f"))
      // To actually color the legend based on our chosen colors
      .scale(scale.GS);

    svg.select("." + title).call(colorLegend);
  }

  RecreateLegend(title, translate) {
    let self = this;
    let scale;
    // Recreate the legend if a color change is issued
    d3.select("#colorOne").on("change", function () {
      var val = d3.select(this).node().value;
      self.currentColorScale(new GetScale(val));
      scale = self.currentScale;

      const svg = d3.select("svg");

      svg.selectAll("*").remove();

      svg.append("g").attr("class", title).attr("transform", translate);

      svg.append("text").text("Proportion of the DAUID Population with Infection").attr("transform", "translate(1,25)");

      var colorLegend = d3
        .legendColor()
        .labelFormat(d3.format(".2f"))
        // To actually color the legend based on our chosen colors
        .scale(scale.GS);

      svg.select("." + title).call(colorLegend);

      self.RecolorLayer(scale);
    }, false);
  }

  RecolorLayer(scale) {
    if (this.userLayerGeoJSON != undefined) {
      let index = (this.curCycle != undefined) ? this.curCycle : 0;
      this.LayerOntoMap(this.userLayerGeoJSON, this.userLayerTitle, this.data[index].messages, scale.GS);
    }
  }

  OnCycle_Change(ev) {
    // Let the user know what cycle theyre on
    this.Elem("output").textContent = ev.target.value;

    // Update the current cycle
    this.CurrentSimulationCycle(ev.target.value);

    // Access the data in the new simulation cycle
    let data = this.data[ev.target.value].messages;

    // New vector layer object that'll overwrite the vector layer object from the previous simulation cycle
    // This will overwrite the previous simulation cycle vector object and add the new one
    this.LayerOntoMap(this.userLayerGeoJSON, this.userLayerTitle, data, this.currentScale.GS);
  }

  OnLayerChange_Handler(ev) {
    var features = ev.target.getFeatures();
    this.CreateSimulation(features, this.data);
  }

  CreateSimulation(features, data) {
    // NOTE : Creates a Simulation object.
    // This is something I would usually do as a preload
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
        var transition = new TransitionDEVS(id, "infected", data[i].messages[id]);
        frame.AddTransition(transition);
      }
    }
    simulation.Initialize(10);

    this.transitions = createTransitionFromSimulation(simulation.frames)

    // Let the download button be clickable
    this.Elem("btnDownload").disabled = false;

  }

  OnButtonDownload_Click(ev) {
    new CreateCsvFileForDownload(this.transitions);
  }

  OnCenterChange(ev) {
    // openCageChangeMapCenter(city, OSM map)
    openCageChangeMapCenter(ev.target.value, this.Widget("map").map._map)
  }

  Template() {
    return (
      "<main handle='main'>" +

      "<div handle='header' widget='Widget.Header' class='header'></div>" +

      "<div id='map' handle='map' widget='Widget.Map' class='map'>" +
      "<label>Type a location and press enter to change the center of the map </label>" +
      "<input handle = 'address' id='address' type='textbox' value=''/></div>" +

      "<div id='controls'>" +
      "<label for='scale-select'>Select Simulation to manipulate: </label>" +
      "<select handle = cycleOptions id='scale-select'>" +
      "</select>" +
      "</div>" +

      "<div class='overlay-container'><span class='overlay-text' id='feature-name'>" +
      "</span><span class='overlay-text' id='feature-infected'></span><br>" +
      "</span><span class='overlay-text' id='feature-susceptible'></span><br>" +
      "</span><span class='overlay-text' id='feature-recovered'></span></div>" +

      "<label>Simulation Cycle Selector: <input handle='cycle' type='range' name='cycle' id='cycle' min='0' max = '0' step='1' value='0' >" +
      "<output handle='output' class='cycle-output' for='cycle'></output></label><br><br>" +



      "<div><label for='favcolor'>Change colour scale: </label>" +
      "<input type='color' id='colorOne' name='favcolor' value='#ff0000'><br></div>" +

      "<svg handle='svg' width = '960' height = '100'></svg>" +

      "<p>" +
      "<div><label>Load Simulation</label></div>" +

      "<p></p>" +
      "</div><label>Select your simulation results: " +
      "<br><input type='file' handle = 'simResults' name='simResults' accept='.txt'></br></div>" +

      "<p></p>" +
      "<div><label>After simulationr results are loaded, you may select your GeoJSON layer: " +
      "<br><input type='file' name='vectorLayer' handle='vectorLayer' accept='.geojson' disabled></br></div>" +
      "</p>" +

      "<div class='button-column'><label>Download data as csv </label>" +
      "<button handle='btnDownload' title='nls(Download_Files)' class='fas fa-download' disabled></button></div>" +

      "</main>"
    );
  }
}

function sortData(data) {
  let lines = data.map((line) => line.split(/\s+/));
  let parsed = [];
  let current = null;

  for (var i = 0; i < lines.length; i++) {
    var l = lines[i];

    // TIME FRAME
    if (l.length == 1 && l != "") {
      current = { time: l[0], messages: {} };
      parsed.push(current);
    }
    if (l.length == 6) {
      let model = l[3].substring(1);
      let infected = l[5]
        .split(",")
        .splice(5, 20)
        .reduce((a, b) => +a + +b, 0);
      // A single message, add all properties you may want
      // to put on the map here
      current.messages[model] = infected;
    }
  }
  // Remove first item from array since it's the initial state. 
  parsed.shift()
  return parsed;
}
