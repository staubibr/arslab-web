"use strict";

import Core from "../api-web-devs/tools/core.js";
import Dom from "../api-web-devs/tools/dom.js";
import Net from "../api-web-devs/tools/net.js";
import Templated from "../api-web-devs/components/templated.js";
import Playback from "../api-web-devs/widgets/playback.js";
import Header from "./widgets/header.js";
import Map from "./widgets/map.js";
import Box from "../api-web-devs/ui/box-input-files.js";

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

    // By default the legend will be red-white unless otherwise specified by the user
    this.CreateLegend(Core.Nls("App_Legend_Title"), "translate(20,30)");

    // The world map prior to any vector layers being added overtop
    this.Widget("map").InitTileLayer();

    //Creates a vector layer, by default it starts at the 0th simulation cycle (time frame)
    this.ChunkSimulationResults().then(this.DataLoaded_Handler.bind(this));

    // Modifies an existing vector layer depending on the simulation cycle selector's current value
    this.Node("cycle").On("change", this.OnCycle_Change.bind(this));
  }

  // We may find these useful to access throughout building the application
  LayerFile(file, title) {
    this.userLayerGeoJSON = file;
    this.userLayerTitle = title;
  }

  currentColorScale(scale) { this.currentScale = scale; }

  CurrentSimulationCycle(cycle){ this.curCycle = cycle; }

  simResultsPromise(parsed){
    this.temp += parsed;
  }

  // ****** NEED TO SOLVE HOW TO HANDLE FILES > 1GB ******
  ChunkSimulationResults() {
    /* 
    State for model _DAUID is <1,0,16,16,0.7,0.3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0>
    The numbers have the following meaning:
    First number (1): population density
    Next number (0): The phase of the lockdown
    Next number (16): Number of infected states
    Next number (16): Number of recovered states
    Next Number(0.7): The susceptible population
    Next 16 numbers: The portion of the population in each stage of infection (the sum of which is the infected population)
    Next 16 numbers: The portion of the population in each stage of recovery (there's no really "recovered" population- 
    if someone is in a recovery phase thy cant infected, but after the last stage of recovery they can get infected again)
    */
    // NOTE: Infected: index 5 to 20
    const input = document.querySelector("input[name='simResults']");
    return new Promise(function (resolve, reject) {
      input.addEventListener("change", function (event) {
        let file = event.target.files[0];
        let fileReader = new FileReader();

        // // new line = 0x0a
        // // Max blob size is 500MiB in Chrome
        // var chunkSize = 1024 //* 300000; // 307.2 mb chunks
        // var chunks = Math.ceil(file.size/chunkSize,chunkSize);
        // var chunk = 0;
        // let chunkedData = [];
        // // 0 to 114 okay == 114 bytes
        // // 114 to 228 okay == 114 bytes
        // // 228 , 342 okay == 114 bytes
        // // 342 to 456 okay == 114 bytes
        // // 456 to 570 okay == 114 bytes
        // // 570 to 684 okay == 113 bytes
        // let customBlob = new Blob([file.slice(570,684)], {type : "text/plain"})
        // fileReader.addEventListener("loadend", function(e){
        //   let fileContent = e.srcElement.result;
        //   console.log(fileContent);
        // })
        // fileReader.readAsText(customBlob)

        // // while (chunk < chunks) {
        // //   var offset = chunk*chunkSize;
        // //   let customBlob = new Blob([file.slice(offset,offset+chunkSize)], {type : "text/plain"})
        // //   var myReader = new FileReader();
        // //   var p = new Promise(function (resolve, reject) {
        // //     myReader.addEventListener("loadend", function(e){
        // //       let fileContent = e.srcElement.result;
        // //       let text = fileContent.split("\n").map((line) => line.split(/\s+/));
        // //       let x = []
        // //       text.forEach((d) => {
        // //         if((d.length == 6) || (d[0].length == 1 && d.length == 1)){ x.push(d) }
        // //       });
        // //       resolve(x)
        // //     });
        // //   })
        // //   // Start the reading process.
        // //   myReader.readAsText(customBlob);
        // //   chunkedData.push((p))
        // //   chunk++;
        // // }
        
        // resolve(chunkedData);

        fileReader.onload = function (event) {
          let fileContent = event.target.result;
          let lines = fileContent
            .split("\n")
            .map((line) => line.split(/\s+/));
          let parsed = [];

          var current = null;

          for (var i = 0; i < lines.length; i++) {
            var l = lines[i];

            // TIME FRAME
            if (l.length == 1) {
              current = { time: l[0], messages: {} };
              parsed.push(current);
            } else {
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
          // Remove first item from array, seems like it's the initial state. I think we may
          // need to keep it but for now, it works.
          parsed.shift();

          resolve(parsed);
        };
        fileReader.readAsText(file);
        }, false);
    });
  }

  DataLoaded_Handler(data) {
    this.data = data;
    console.log(data)

    this.Elem("cycle").setAttribute("max", this.data.length - 2);

    this.CheckForGeoJSON(document.querySelector("input[name='vectorLayer']"));
  }

  CheckForGeoJSON(input) {
    var self = this;
    input.addEventListener("change", function (event) {
      let files = event.target.files;
      let f = files[0];
      let fileReader = new FileReader();
      fileReader.onload = function (event) {
        let fileContent = event.target.result;
        let title = f.name;
        // so we can use the content for OnCycleChange and RecolorLayer
        self.LayerFile(fileContent, title);

        let scale = (self.currentScale == undefined) ? self.currentColorScale(new GetScale(["red", "white"])) : self.currentScale;

        self.LayerOntoMap(fileContent, title, self.data[0].messages, scale.GS);
      };
      fileReader.readAsDataURL(f);
      }, false);
  }

  /* Create the vector layer: 
  - Read layer coordinates 
  - Add a title 
  - Match simulation data to census subdivisions
  - Color in each census subdivision based on its infeced proportion value
  */
  LayerOntoMap(fileContent, title, data, scale){
    let layer = new VectorLayer(fileContent, title, data, scale);

    let layerObjects = this.Widget("map").layers;

    // add vector layer onto world map
    this.Widget("map").AddLayer(title, layer, layerObjects);

    // make the vector layers attributes visible through clicking census subdivisions
    mapOnClick(data, this.Widget("map").map._map, title);

    // if the simulation cycle changes, updates the simulation object again
    // layer.OL.getSource().once("change", this.OnLayerChange_Handler.bind(this));
  }

  CreateLegend(title, translate) {
    let self = this;
    let scale;
    if (this.currentScale == undefined) {
      self.currentColorScale(new GetScale(["red", "white"]));
      scale = self.currentScale;
    }

    // Recreate the legend if a color change is issued
    d3.select("#scale-select").on("change", function () {
      var val = d3.select(this).node().value;
      self.currentColorScale(new GetScale(val.split(" ")));
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

  RecolorLayer(scale){
    if(this.userLayerGeoJSON != undefined){
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
        var transition = new TransitionDEVS(id, "infected", data[i].messages[id]);
        frame.AddTransition(transition);
      }
    }
    simulation.Initialize(10);
  }

  // Removed drop box for now
  // "<div handle='box' widget='Widget.Box-Input-Files' class='box'></div>" +
  // "<div><button>Submit</button></div>" +
  Template() {
    return (
      "<main handle='main'>" +
      "<div handle='header' widget='Widget.Header' class='header'></div>" +
      "<div id='map' handle='map' widget='Widget.Map' class='map'></div>" +
      "<div class='overlay-container'><span class='overlay-text' id='feature-name'>" +
      "</span><br><span class='overlay-text' id='feature-assets'></span><br>" +
      "</div>" +

      "<label>Simulation Cycle Selector: <input handle='cycle' type='range' name='cycle' id='cycle' min='0' max = '0' step='1' value='0' >" +
      "<output handle='output' class='cycle-output' for='cycle'></output></label>" +
      
      // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/color
      "<div id='controls'><label for='scale-select'>Select Colour Scale: </label><select id='scale-select'>" +
      "<option value='red white'>red-white</option><option value='orange white'>orange-white</option>" +
      "<option value='blue white'>blue-white</option><option value='green white'>green-white</option>" +
      "</select></div>" +
      
      "<svg handle='svg' width = '960' height = '100'></svg>" +

      "<p>" +
        "<div><label>Load Simulation</label></div>" +
        "</div><label>First, select your simulation results: " +
        "<br><input type='file' name='simResults' accept='.txt'></br></div>" +
        "<div><label>Second, select your GeoJSON layer: " +
        "<br><input type='file' name='vectorLayer' handle='vectorLayer' accept='.geojson'></br></div>" +
      "</p>" +

      "</main>"
    );
  }
}
