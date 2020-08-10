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

    // The world map will appear prior to any vector layers being added overtop
    this.Widget("map").InitTileLayer();

    // Usining simulation results and a chosen geojson layer, we create a vector layer 
    this.Node('simResults').On("change", this.ChunkSimulationResults.bind(this))
    
    // Change which simulation you wish to manipulate 
    this.Node('selectSimulation').On("change", this.OnSimulationSelectChange.bind(this))

    // Modifies an existing vector layer depending on the simulation cycle selector's current value
    this.Node("cycle").On("change", this.OnCycle_Change.bind(this));

    // For downloading data as CSV after all necessary files are inserted by user
    this.Node("btnDownload").On("click", this.OnButtonDownload_Click.bind(this));

    // For changing the map's center locaiton
    this.Node("address").On("change", this.OnCenterChange.bind(this));
  }

  /*
  Purpose: Information we may find useful to access throughout the program

  @Method: CurrentSimulationTitle(layerFileTitle)
    - Report the current simulation's title
  @Method: CurrentSimulationGeoJSON(file)
    - Report the current simulation's geojson layer file content
    - Used for OnCycleChange() and RecolorLayer()
  @Method: ArrayOfTransitions(data, title)
    - From simulation object, we store created transitions in this method via array
    - Used for letting users download a CSV of the currently selected simulation
  @Method: currentColorScale(scale)
    - Report the current color scale listed on the web page
  @Method: KeepTrackOfSubmittedUserFiles(data, title, layerFile)
    - When a user finishes inserted their files, we get an array composed of an object holding:
      - Simulation title
      - Simulation data
      - GeoJSON layer file content
    - The array length increases as the user adds more simulations to the webpage
  */
  CurrentSimulationTitle(layerFileTitle){ this.currentSimulationTitle = layerFileTitle }

  CurrentSimulationGeoJSON(file) { this.userLayerGeoJSON = file; }

  ArrayOfTransitions(data, title){
    if(this.allTransitions == undefined){ this.allTransitions = new Array; }
    this.allTransitions.push({simulation: title, transitionData: data});
  }

  currentColorScale(scale) { this.currentScale = scale; }

  CurrentSimulationCycle(cycle) { this.curCycle = cycle; }

  KeepTrackOfSubmittedUserFiles(data, title, layerFile){
    if(this.DataFromFiles == undefined){ this.DataFromFiles = new Array; }
    this.DataFromFiles.push({simulation: title, simulationData: data, GeoJSON: layerFile});
  }

  /*
  Purpose: 
    - Browsers have limitations. Google Chrome only supports 500mb blobs. 
    - As a work around to this limitation, the upload simulation result file is uploaded to the app in chunks.
    - Once the text file has been safely chunked, we call DataLoaded_Handler(data) to now sort the text file accordingly 
  Paramter:
    event - The event being that the user just submitted a file
  */
  ChunkSimulationResults(event) {
    let self = this,
      file = event.target.files[0], parser = new CustomParser()
    parser.Parse(file).then(function (data) { self.DataLoaded_Handler(data); })
  }

  /*
  Purpose: 
    - After Safely chunking simulation results, we can now sort the data. 
    - After sorting data, the user can now upload their GeoJSON layer file.
  Paramter:
    data - holds everything from the simulation results text file
  Information leaving the method:
    - this.data for CheckForGeoJSON(input)
  */
  DataLoaded_Handler(data) {
    this.data = sortData(data);
    // User can now insert a GeoJSON layer file
    this.Elem("vectorLayer").disabled = false;
    this.CheckForGeoJSON(document.querySelector("input[name='vectorLayer']"));
  }

  /*
  Purpose: Once a user enters a GeoJSON layer file, we go through the following process:
    - Read content of the GeoJSON layer file
    - Read the title of the GeoJSON layer file
    - Count how many simulations we've done so far
    - Update the simulation selector on the webpage
    - Update the Simulation cycle selector max number of cycles on the webpage
    - Update the current simulation on webpage
    - Display the vector layer onto the map in the webpage
    - Erase chosen files from the web page so that the user can now sequentially insert new files again
  Paramters:
    - input (a .geojson file)
  Information leaving the method:
    - KeepTrackOfSubmittedUserFiles(data, title, layerFile)
    - CurrentSimulationTitle(title)
    - CurrentSimulationGeoJSON(layerFileTitle);
  */
  CheckForGeoJSON(input) {
    let self = this;
    input.addEventListener("change", function (event) {
      let f = event.target.files[0], 
        fileReader = new FileReader();

      fileReader.onload = function (event) {
        let fileContent = event.target.result, 
          title = f.name.substring(0, f.name.indexOf("."));
        
        let simNum = (self.DataFromFiles == undefined) ? 0 : self.DataFromFiles.length;
        let newTitle = "simulation" + simNum + "_" + title;

        // Information leaving the method
        self.KeepTrackOfSubmittedUserFiles(self.data, newTitle, fileContent)
        self.CurrentSimulationTitle(newTitle)
        self.CurrentSimulationGeoJSON(fileContent);

        // For simulation selector 
        var elem = document.createElement('option')
        var elemText = document.createTextNode(newTitle + " with " + self.data.length + " cycles")
        elem.appendChild(elemText)
        var foo = document.getElementById("scale-select")
        foo.appendChild(elem)

        // For simulaton cycle selector 
        self.Elem("cycle").setAttribute("max", self.data.length - 1);

        // For current simulation 
        document.getElementById('currentSimulation').innerText = "Current simulation: " + newTitle + " with " + self.data.length + " cycles"
        
        // Display the vector layer onto map
        let scale = (self.currentScale == undefined) ? self.currentColorScale(new GetScale("red")) : self.currentScale;
        self.LayerOntoMap(fileContent, newTitle, self.data[0].messages, scale.GS, true);
      };
      if(f != undefined){ fileReader.readAsDataURL(f); }

      // Dont need files anymore
      document.querySelector('input[name="simResults"]').value= null;
      document.querySelector("input[name='vectorLayer']").value = null;
      self.Elem("vectorLayer").disabled = true;
    }, false);
  }

  /* 
  Purpose: 
    - Create the vector layer by: 
      - Reading layer coordinates 
      - Adding a title 
      - Matching simulation data to census subdivisions
      - Coloring in each census subdivision based on its infeced proportion value
    - Create simulaton object if we are entering from CheckForGeoJSON(input)
    - Click and see vector layer data of current simulation
  Parameters:
    fileContent - Content from GeoJSON layer file
    title - Title from GeoJSON layer file
    data - data from simulation results
    scale - color scale based on whats selected by the user on the webpage (or default red)
    CreateSimulationObject - a boolean to tell us whether to make a smulation object (only true in CheckForGeoJSON(input))
  */
  LayerOntoMap(fileContent, title, data, scale, CreateSimulationObject) {
    let layer;
    let cycle;

    //Title the vector layer based on what cycle it is on, might not be necessary, but keep it this code for now
    let newTitle;
    if (this.curCycle == undefined || CreateSimulationObject == true) { 
      newTitle = title + " Cycle0"
      cycle = 0;
      layer = new VectorLayer(fileContent, newTitle, data, scale); 
    }
    else { 
      newTitle = title + " Cycle" + this.curCycle;
      cycle = this.curCycle
      layer = new VectorLayer(fileContent, newTitle, data, scale); 
    }

    // add vector layer onto world map
    this.Widget("map").AddLayer(title, layer);

    // make the vector layers attributes visible through clicking census subdivisions
    mapOnClick(data, this.Widget("map").map._map, newTitle, cycle);

    // Creates the simulaiton object only once state.txt and geojson are loaded. This step does not occur twice.
    if (CreateSimulationObject == true) { layer.OL.getSource().once("change", this.OnLayerChange_Handler.bind(this)); }
  }


  /*
  Purpose: 
    - Create the initial legend (red) whent the webpage loads
    - Recreate the the legend on the webpage based on user selection
      - Also recolors the current simulation vector layer (if there is a current one)
  Paramters:
    title - Name of the legend 
    translate - Where on the webpage the legend will appear
  */
  CreateLegend(title, translate) {
    this.InitialLegend(title, translate);
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
      this.LayerOntoMap(this.userLayerGeoJSON, this.currentSimulationTitle, this.data[index].messages, scale.GS);
    }
  }

  // Change the current simulation
  OnSimulationSelectChange(ev){
    let title = ev.target.value.substring(0, ev.target.value.indexOf(" "));
    this.CurrentSimulationTitle(title)
    // Change the current array data being used 
    for (let index = 0; index < this.DataFromFiles.length; index++) {
      const element = this.DataFromFiles[index];
      if(element.simulation == title){
        this.data = element.simulationData;
        this.userLayerGeoJSON = element.GeoJSON;
        
        document.getElementById('currentSimulation').innerText = "Current simulation: " + title + " with " + this.data.length + " cycles"
        this.Elem("cycle").setAttribute("max", this.data.length - 1);
        this.Elem("output").textContent = 0;
        document.getElementById("cycle").value = 0
      }
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
    this.LayerOntoMap(this.userLayerGeoJSON, this.currentSimulationTitle, data, this.currentScale.GS);
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

    this.ArrayOfTransitions(this.transitions, this.currentSimulationTitle)

    // Let the download button be clickable
    this.Elem("btnDownload").disabled = false;

  }

  OnButtonDownload_Click(ev) {
    for (let index = 0; index < this.allTransitions.length; index++) {
      const element = this.allTransitions[index];
      
      if(element.simulation == this.currentSimulationTitle){
        
        new CreateCsvFileForDownload(element.transitionData);
      }
    }
    
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

      "<div><p className='element' handle ='currentSimulation' id='currentSimulation'></p></div>" +

      "<div id='controls'>" +
      "<label for='scale-select'>Select Simulation to manipulate: </label>" +
      "<select handle = 'selectSimulation' id='scale-select'>" +
      "</select>" +
      "</div>" +

      "<div class='overlay-container'><span class='overlay-text' id='feature-name'>" +
      "</span><br><span class='overlay-text' id='feature-cycle'></span><br>" +
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

      "<div class='button-column'><label id='btnDownloadHTMLtext'>Download current simulation data as csv </label>" +
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
