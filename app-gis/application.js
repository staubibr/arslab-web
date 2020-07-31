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
import CustomParser from "./parsers/customParser.js";

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

    // this.Node("btnDownload").On("click", this.OnButtonDownload_Click.bind(this));
  }

  // We may find these useful to access throughout building the application
  LayerFile(file, title) {
    this.userLayerGeoJSON = file;
    this.userLayerTitle = title;
  }

  currentColorScale(scale) { this.currentScale = scale; }

  CurrentSimulationCycle(cycle){ this.curCycle = cycle; }

  ChunkSimulationResults() {
    
    const input = document.querySelector("input[name='simResults']");
    return new Promise(function (resolve, reject) {
      input.addEventListener("change", function (event) {
        let file = event.target.files[0];
        let parser = new CustomParser()
        parser.Parse(file).then(function(data){ resolve(data); })
        }, false);
    });
  }

  DataLoaded_Handler(data) {
    // See the readme for how the simulationr results are structured
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
      if(l.length == 6) {
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
    alert("Simulation results loaded! You may now insert your GeoJSON Layer")
    this.data = parsed

    this.Elem("cycle").setAttribute("max", this.data.length - 1);

    this.CheckForGeoJSON(document.querySelector("input[name='vectorLayer']"));
  }

  CheckForGeoJSON(input) {
    var self = this;
    input.addEventListener("change", function (event) {
      let f = event.target.files[0];
      let fileReader = new FileReader();
      fileReader.onload = function (event) {
        let fileContent = event.target.result;
        let title = f.name;
        // so we can use the content for OnCycleChange and RecolorLayer
        self.LayerFile(fileContent, title);

        let scale = (self.currentScale == undefined) ? self.currentColorScale(new GetScale(["red", "white"])) : self.currentScale;

        self.LayerOntoMap(fileContent, title, self.data[0].messages, scale.GS, true);

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
  LayerOntoMap(fileContent, title, data, scale, CreateSimulationObject){
    let layer = new VectorLayer(fileContent, title, data, scale);

    let layerObjects = this.Widget("map").layers;

    // add vector layer onto world map
    this.Widget("map").AddLayer(title, layer, layerObjects);

    // make the vector layers attributes visible through clicking census subdivisions
    mapOnClick(data, this.Widget("map").map._map, title);

    if(CreateSimulationObject == true){
      layer.OL.getSource().once("change", this.OnLayerChange_Handler.bind(this));
    }
    
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

    // Let the download button be clickable
    this.Elem("btnDownload").disabled = false;
  
    //  line 55 to 64 of the CDppCell parser
  }

  // OnButtonDownload_Click(ev) {
  //   var files = []
  //   console.log(ev)
		
	// 	files.push(this.files.simulation.ToFile());
	// 	files.push(this.files.transitions.ToFile());
	// 	files.push(this.settings.ToFile());
				
	// 	if (this.files.Diagram) files.push(this.files.diagram.ToFile());
				
	// 	try {
	// 		// This is an async call, Fire and forget, pew! 
	// 		Zip.SaveZipStream(this.files.name, files);
	// 	}
	// 	catch (error) {
	// 		this.OnWidget_Error({ error:error });
	// 	}
	// }

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
        "</div><label>Select your simulation results (and then wait for further instruction from the program): " +
        "<br><input type='file' name='simResults' accept='.txt'></br></div>" +
        "<div><label>After being alerted, select your GeoJSON layer: " +
        "<br><input type='file' name='vectorLayer' handle='vectorLayer' accept='.geojson'></br></div>" +
      "</p>" +

      "<div class='button-column'>" + 
        "<button handle='btnDownload' title='nls(Download_Files)' class='fas fa-download' disabled></button>" +
      "</div>" +

      "</main>"
    );
  }
}
