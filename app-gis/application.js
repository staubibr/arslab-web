"use strict";

import Core from "../api-web-devs/tools/core.js";
import Dom from "../api-web-devs/tools/dom.js";
import Net from "../api-web-devs/tools/net.js";
import Templated from "../api-web-devs/components/templated.js";
import Playback from "../api-web-devs/widgets/playback.js";
import Recorder from '../api-web-devs/components/recorder.js';
import oSettings from '../api-web-devs/components/settings.js';
import Map from "./widgets/map.js";
import Box from "../api-web-devs/ui/box-input-files.js";
import VectorLayer from "./classes/vectorLayer.js";
import GetScale from "./classes/getScale.js";
import SimulationDEVS from "../api-web-devs/simulation/simulationDEVS.js";
import Model from "../api-web-devs/simulation/model.js";
import FrameDEVS from "../api-web-devs/simulation/frameDEVS.js";
import TransitionDEVS from "../api-web-devs/simulation/transitionDEVS.js";
import CustomParser from "./parsers/customParser.js";
import CreateCSV from "./classes/createCSV.js";
import Evented from "../api-web-devs/components/evented.js";
import Port from "../api-web-devs/simulation/port.js";
import ColorLegend from "./widgets/colorLegend.js";

import { mapOnClick } from "./widgets/mapOnClick.js";
import { simulationToTransition } from "./functions/simulationToTransition.js";
import { sortPandemicData } from "../app-gis/functions/sortPandemicData.js";
import { simAndCycleSelect } from "./ui/simAndCycleSelect.js";
import { filterFiles } from "./functions/filterFiles.js";
import { sirSelect } from "./ui/sirSelect.js";

/*
This application is a GIS environment for web-based simulations

Features: 
  - OpenStreetMap as base layer / canvas
    - Zoom in/out
    - Layer Switcher
    - Search bar
    - Sidebar 
      - Home 
      - Load Simulation 
      - Manipulating Simulations
      - Download Simulation
      - Playback
    - Legend
    - Interacting with Simulations Shown on Map
*/

export default class Application extends Templated {
  constructor(node) {
    super(node);

    this.settings = new oSettings()

    this.simulation = null;

    this.hideLegend = true;

    this.currentSIR = "Susceptible"

    // Create map container (canvas, sidebar, search, zoom, layer switcher, etc.)
    this.Widget("map").InitLayer();

    // The legend is hidden by default
    this.CreateLegend(Core.Nls("App_Legend_Title"), "translate(8,4)");
    
    // User uploads data to the program
    this.Node('upload').On("change", this.OnUpload_Change.bind(this));

    // User loads data into the program 
    this.Node('load').On("click", this.OnLoad_Click.bind(this));

    // Clear uploaded files
    this.Node('clear').On("click", this.OnClear_Click.bind(this));
    
    // Change which simulation users wish to manipulate 
    this.Node('selectSimulation').On("change", this.OnSimulationSelectChange.bind(this))

    // Modify an existing vector layer depending on the simulation cycle selector's current value
    this.Node("cycle").On("change", this.OnCycle_Change.bind(this));

    // For downloading transitions 
    this.Node("btnDownload").On("click", this.OnButtonDownload_Click.bind(this));

    // Check if user wants to visualize susceptible or infected or recovered
    this.Node("SIR-select").On("change", this.OnSIRchange.bind(this));

    // Record visualization
    this.Widget("playback").Recorder = new Recorder(this.Node("map").Elem("canvas.ol-unselectable"));

  }

  OnUpload_Change(ev){
    var numFilesBeforeFilter = this.Widget("upload").files.length;

    // Remove files that are not in the correct format
    this.Widget("upload").files = filterFiles(this.Widget("upload").files)
    
    this.files = this.Widget("upload").files;

    if(numFilesBeforeFilter != this.files.length){
      // Swap thumbs-up icon
      document
      .getElementById("upload")
      .getElementsByTagName("div")[1]
      .querySelector("i").className = "fas fa-file-upload";

      alert(
        "An invalid file has been removed.\nThe only accepted file formats are:\n .txt\n .geojson."
      );
    }

    // Accept the files if they're valid
    if (this.files.length > 2) {
      alert(
        "You've entered an invalid number of files. All files have been removed."
      );
      // Should probably deal with this a better way
      this.OnClear_Click(null);
      return;
    }
    if (
      this.files.length == 2 &&
      this.files.filter((d) => d.name.split(".").pop() == "geojson").length == 1 &&
      this.files.filter((d) => d.name.split(".").pop() == "txt").length == 1
    ) {
      // Remove zip files if they show up
      this.Elem("load").disabled = false;
      this.Elem("clear").disabled = false;
    }
  }

  // Google Chrome only supports 500mb blobs. The uploaded simulation result file is uploaded to the app in chunks.
  // File chunking
  OnLoad_Click(ev) {
    this.Elem("wait").hidden = false;

    this.fileTXT = this.files.filter(d => d.name.split(".").pop() == "txt")
    this.fileGeoJSON = this.files.filter(d => d.name.split(".").pop() == "geojson")

    let self = this,
      parser = new CustomParser();

    parser.Parse(self.fileTXT[0]).then(function (data) { self.OnLoad_DataHandler(data); })
  }
  
  OnClear_Click(ev){
    // Erase the previous files and disable the load simulation button
    this.files = [];
    this.Widget("upload").files = [];

    // Clear all labels from file upload container
    document
      .getElementById("upload")
      .getElementsByTagName("div")[2].innerHTML = null;

    // Change file upload container icon
    document
      .getElementById("upload")
      .getElementsByTagName("div")[1]
      .querySelector("i").className = "fas fa-file-upload";

    this.Elem("load").disabled = true;
    this.Elem("clear").disabled = true;
  }

  OnLoad_DataHandler(data) {
    this.tempData = data;

    let self = this,
      f = self.fileGeoJSON[0], 
        fileReader = new FileReader();

    fileReader.onload = function (event) {
      let title = f.name.substring(0, f.name.indexOf(".")),
            simNum = (self.DataFromFiles == undefined) ? 0 : self.DataFromFiles.length,
              newTitle = "simulation" + simNum + "_" + title;

      // Current simulation settings
      self.currentSimulationTitle = newTitle
      self.currentSimulationLayerGeoJSON = event.target.result;
      self.currentSIR = (self.currentSIR == undefined) ? "Susceptible" : self.currentSIR;
      self.currentSimulationCycle = 0;
      
      self.AddVectorLayerToMapCollection();
    };
    fileReader.readAsDataURL(f); 
  }

  AddVectorLayerToMapCollection() {
    this.layer = new VectorLayer(this.currentSimulationLayerGeoJSON, this.currentSimulationTitle); 
    
    // add vector layer onto world map
    this.Widget("map").AddLayer(this.currentSimulationTitle, this.layer);

    // Creates the simulaiton object
    this.layer.OL.getSource().once("change", this.OnLayerCreation_Handler.bind(this)); 
  }

  RedrawLayerOnMap(index){
    this.layer = this.Widget("map").Layer(this.currentSimulationTitle);
    this.layer.ColorLayer(this.currentColorScale, this.data[index].messages, this.currentSIR);
    mapOnClick(
      this.data[index].messages,
      this.Widget("map").map.OL,
      this.currentSimulationTitle,
      this.currentSimulationCycle,
      this.currentColorScale,
      this.currentSIR
    );
  }

  /*
  Purpose: 
  Paramters:
    title - Name of the legend 
    translate - Where on the webpage the legend will appear
  */
  CreateLegend(title, translate) {
    this.InitialLegend(title, translate);
    this.RecreateLegendColor(title, translate);
    this.RecreateLegendClass(title, translate);
    this.hideOrShowlegend(title, translate);
  }

  InitialLegend(title, translate) {
    // Initial legend settings 
    this.currentNumberOfClasses = 4;
    this.currentColor = "#FF0000";
    this.currentColorScale = new GetScale(this.currentColor, this.currentNumberOfClasses);

    this.hiddenLegend()
    
  }

  hiddenLegend(){
    
    document.getElementById("legend-svg").firstChild.textContent = 
    "Legend";

    const svg = d3.select("svg");

    svg.selectAll("*").remove();

    document.getElementById("legend-svg").style.cssText =
      "padding:5px; background-color:rgba(0,60,136,.5); font-size:12px; color: white";
    document.getElementById("legend-svg").style.width = "40px";
    document.getElementById("legend-svg").style.height = "15px";


  }


  RecreateLegendColor(title, translate) {
    let self = this;
    
    // Recreate the legend if a color change is issued
    d3.select("#colorOne").on("change", function () {
      
      var val = d3.select(this).node().value;
      self.currentColor = val;

      if(self.DataFromFiles != undefined){
        var currentDataFileIndex = document.getElementById('sim-select').selectedIndex;
        self.DataFromFiles[currentDataFileIndex].layerColor = val;
      }   
      
      // Get current number of classes for scale
      let classes = (self.currentClass == undefined) ? 4 : self.currentClass;

      self.currentColorScale = new GetScale(val, classes);

      if (self.hideLegend == true) {
          self.recreateLegend(title, translate);
        } else {
          self.AppLegend = new ColorLegend( title, translate, self.currentColorScale );
        }

      self.RecolorLayer();
    }, false);
  }

  RecreateLegendClass(title, translate) {
    let self = this;

    // Recreate the legend if a class change is issued
    d3.select("#class-select").on(
      "change",
      function () {
        self.currentClass = d3.select(this).node().value;
        self.currentNumberOfClasses = self.currentClass;
        self.currentColorScale = new GetScale( self.currentColor, self.currentClass );
        if (self.hideLegend == true) {
          self.recreateLegend(title, translate);
        } else {
          self.AppLegend = new ColorLegend( title, translate, self.currentColorScale );
        }
        if (self.DataFromFiles != undefined) {
          var currentDataFileIndex = document.getElementById("sim-select")
            .selectedIndex;

          self.DataFromFiles[currentDataFileIndex].layerClasses =
            self.currentClass;
        }

        self.RecolorLayer();
      },
      false
    );
  }

  hideOrShowlegend(title, translate){
    var legend = document.querySelector(".legend-svg");

    let self = this;

    legend.addEventListener("click", function () {
      // Use document.getElementById("legend-svg").style.width = "80px" instead?
      if (self.hideLegend == false) {
        self.hideLegend  = true;
        self.hiddenLegend()
      } 
      else{
        self.hideLegend  = false;
        self.recreateLegend(title, translate)
        
      }
    });

  }

  recreateLegend(title, translate){
    this.currentColorScale = new GetScale(this.currentColor, this.currentNumberOfClasses);
    document.getElementById("legend-svg").firstChild.textContent = this.currentSIR
    this.AppLegend = new ColorLegend(title, translate, this.currentColorScale)
    
  }

  RecolorLayer() {
    if (this.currentSimulationLayerGeoJSON != undefined) {
      this.RedrawLayerOnMap(this.currentSimulationCycle);
    }
  }

  /*
  Purpose: 
    - Change the current simulation being manipulated 
  Paramters:
    event - event.target.value would tell us which simulation we selected
  Information leaving the method:
    - Change previous simulation information to the current one
    - An updated color scale, number of classes, and legend
    - Simulation cycle set to the correct cycle
  */
  OnSimulationSelectChange(ev){
    this.PreviousSimulationToCurrentSimulation(document.getElementById('sim-select').selectedIndex);
    this.UpdateLegendToCurrentSimulation(Core.Nls("App_Legend_Title"), "translate(8,4)");
    this.UpdateSimulationCycleSelectorToCurrentSimulation();
  }

  PreviousSimulationToCurrentSimulation(index){
    var element = this.DataFromFiles[index];
    this.currentSimulationTitle = element.simulation;
    this.data = element.simulationData;
    this.currentSimulationLayerGeoJSON = element.GeoJSON;
    this.currentSimulationCycle = element.layerCycle;
    this.currentNumberOfClasses = element.layerClasses;
    this.currentColor = element.layerColor;
    this.currentSIR = element.layerSIR;
  }

  UpdateLegendToCurrentSimulation(title, translate){
    this.currentColorScale = new GetScale(this.currentColor, this.currentNumberOfClasses);

    this.RedrawLayerOnMap(this.currentSimulationCycle);

    document.getElementById('colorOne').value = this.currentColor

    document.getElementById("legend-svg").firstChild.textContent = this.currentSIR;

    sirSelect(this.currentSIR)

    document.getElementById('class-select').selectedIndex = this.currentNumberOfClasses == 5 ? 1 : 0

    this.AppLegend = new ColorLegend(title, translate, this.currentColorScale)
  }

  UpdateSimulationCycleSelectorToCurrentSimulation(){
    this.Elem("cycle").setAttribute("max", this.data.length - 1);
    this.Elem("output").textContent = this.currentSimulationCycle;
    document.getElementById("cycle").value = this.currentSimulationCycle;
  }
  
  /*
  Purpose: 
    - Change the current simulation cycle
    - Display the updated vectory layer based on simulation cycle
  Paramters:
    event - To find which simulation cycle user selected
  */
  OnCycle_Change(ev) {
    // Let the user know what cycle theyre on
    this.Elem("output").textContent = ev.target.value;

    // Update the current cycle
    this.currentSimulationCycle = ev.target.value;
    var currentDataFileIndex = document.getElementById('sim-select').selectedIndex;
    this.DataFromFiles[currentDataFileIndex].layerCycle = ev.target.value;

    // Recolor the current layer accordingly
    this.RedrawLayerOnMap(ev.target.value);
  }

  OnSIRchange(ev){
    this.currentSIR = ev.target.value;
    var currentDataFileIndex = document.getElementById('sim-select').selectedIndex;

    // Change layer if there is one
    if(this.currentSimulationTitle != undefined){
      this.DataFromFiles[currentDataFileIndex].layerSIR = ev.target.value;
      //document.getElementById("legend-svg").firstChild.textContent =  ev.target.value;
      this.RedrawLayerOnMap(this.currentSimulationCycle);
    }

    // This is to prevent us from changing the svg legend "button"
    if(document.getElementById("legend-svg").style.width== "120px"){
      document.getElementById("legend-svg").firstChild.textContent = this.currentSIR;
    }

    sirSelect(this.currentSIR)
    

    

  }
  
  // Create the simulation object when the simulation is first introduced
  OnLayerCreation_Handler(ev) {
    var features = ev.target.getFeatures();
    this.CreateSimulation(features);

    this.RedrawLayerOnMap(this.currentSimulationCycle)
    this.Elem("wait").hidden = true;
    this.Widget("playback").Enable(true)

    this.simulation.On("Move", this.OnSimulation_Move.bind(this))
    this.simulation.On("Jump", this.OnSimulation_Jump.bind(this))
    this.Widget("playback").Initialize(this.simulation, this.settings)
  }

  OnSimulation_Jump(ev){
    this.layer.ColorLayer(this.currentColorScale, this.data[this.simulation.state.i].messages, this.currentSIR);
  }

  OnSimulation_Move(ev){
    this.layer.ColorLayer(this.currentColorScale, this.data[this.simulation.state.i].messages, this.currentSIR);
  }

  CreateSimulation(features) {
    let data = sortPandemicData(this.tempData);
    this.data = data;
    //ev.frame.transitions.filter(t => t.port == "Infected")
    simAndCycleSelect(this.currentSimulationTitle, data.length-1)
    this.KeepTrackOfSubmittedUserFiles(data, 
      this.currentSimulationTitle, 
      this.currentSimulationLayerGeoJSON, 
      this.currentNumberOfClasses, 
      this.currentColor, 
      0, 
      this.currentSIR
    )

    var ports = ["Susceptible", "Infected", "Recovered", ]
    ports = ports.map(p => new Port(p, "output"))

    var models = features.map((f) => {
      return new Model(f.getProperties().dauid, "atomic", null, ports);
    });

    var simulation = new SimulationDEVS("hoya", "custom", "Cell-DEVS", models);

    for (var i = 0; i < data.length; i++) {
      
      var frame = new FrameDEVS(data[i].time);

      simulation.AddFrame(frame);

      for (var id in data[i].messages) {
        ports.forEach(p => {
          var transition = new TransitionDEVS(id, p.name, data[i].messages[id][p.name]);
          frame.AddTransition(transition);
        })
        
      }
    }
    simulation.Initialize(10);

    this.simulation = simulation;

    this.transitions = simulationToTransition(simulation.frames)

    this.ArrayOfTransitions(this.transitions, this.currentSimulationTitle)

    // Let the download button be clickable
    this.Elem("btnDownload").disabled = false;
    // Erase the previous files and disable the load simulation button
    this.file = [];
    this.Widget('upload').files = [];
    document.getElementById("upload").getElementsByTagName("div")[2].innerHTML = null;
    document.getElementById("upload").getElementsByTagName("div")[1].querySelector("i").className = "fas fa-file-upload"
    this.Elem("load").disabled = true;
    this.Elem("clear").disabled = true;
  }

  OnButtonDownload_Click(ev) {
    var index = document.getElementById('sim-download').selectedIndex
    new CreateCSV(this.allTransitions[index].transitionData);
  }

    /*
    Purpose: Information we may find useful to access throughout the program
    @Method: ArrayOfTransitions(data, title)
      - From simulation object, we store created transitions in this method via array
      - Used for letting users download a CSV of the currently selected simulation
    @Method: KeepTrackOfSubmittedUserFiles(data, title, layerFile)
      - When a user finishes inserted their files, we get an array composed of an object holding:
        - Simulation title
        - Simulation data
        - GeoJSON layer file content
      - The array length increases as the user adds more simulations to the webpage
    */
  ArrayOfTransitions(data, title){
    if(this.allTransitions == undefined){ this.allTransitions = new Array; }
    this.allTransitions.push({simulation: title, transitionData: data});
  }

  CurrentColorScale(scale) { this.currentColorScale = scale; }

  KeepTrackOfSubmittedUserFiles(data, title, layerFile, classNum, color, cycle, SIR){
    if(this.DataFromFiles == undefined){ this.DataFromFiles = new Array; }
    this.DataFromFiles.push({
        simulation: title, 
        simulationData: data, 
        GeoJSON: layerFile, 
        layerClasses: classNum, 
        layerColor: color, 
        layerCycle: cycle,
        layerSIR: SIR});
  }

  CurrentSIRselected(SIR){ this.currentSIR = SIR; }

  Template() {
    return (
      
      // Map container
      "<div id='map' handle='map' widget='Widget.Map' class='map' ></div>" +

      // Load Simulation
      "<div handle='loadDataApp' id='loadDataApp'>" +
        // Drag and drop files
        "<div handle='dropzone' class='dropzone-container'>" + 
          "<div id='upload' handle='upload' widget='Widget.Box-Input-Files'></div>" +
          "<button handle='clear' class='clear' disabled>nls(Dropzone_Clear)</button>" +
          "<button handle='load' class='save' disabled>nls(Dropzone_Load)</button>" +
        "</div>" +
        // Loading Icon
        "<div id='wait' handle='wait' class='wait' hidden><img src='./assets/loading.gif'></div>" + 
      "</div>" +
      

      // Download data
      "<div id='downloadDataApp'>" +
        "<label for='sim-type'>Current Simulation: </label>" +
        "<select class='select-css' handle = 'sim-download' id='sim-download'></select>" +
        '<br><br><button class="btnDownload" handle="btnDownload" title="nls(Download_Files)" disabled><i class="fa fa-download"></i> Download</button>' +
      "</div>"+

      // Manipulate simulation
      "<div class='sim-navigation'  id='editSimulationApp'>" +
        "<div class='select-css-box' id='select-simulation'>" +
          "<br><label for='sim-select'>Current Simulation: </label>" +
          "<select class='select-css' handle = 'selectSimulation' id='sim-select'>" +
          "</select>" +
        "</div>" +

        // Simulation cycle select
        "<br><label>Select Simulation Cycle: <input handle='cycle' type='range' name='cycle' id='cycle' min='0' max = '0' step='1' value='0' >" +
        "<output handle='output' class='cycle-output' for='cycle'></output></label><br><br>" +

        // Color select
        "<div>" +
          "<label for='favcolor'>Select colour scale: </label>" +
          "<input type='color' id='colorOne' name='favcolor' value='#ff0000'><br>" +
        "</div>" +

        // Classes select (4 or 5)
        "<br><div id='classControls'><label for='class-select'>Select # of classes: </label>" +
        "<select handle = 'selectClasses' id='class-select'>" +
          "<option>4</option>" +
          "<option>5</option>" +
        "</select></div>" +

        // Simulation select
        "<br><div id='SIRControls'><label for='class-select'>Choose what to visualize: </label>" +
        "<select handle = 'SIR-select' id='SIR-select'>" +
          "<option>Susceptible</option>" +
          "<option>Infected</option>" +
          "<option>Recovered</option>" +
        "</select></div>" +
        
        // Legend 
        "<legend id='legend-svg' class='svg-div'>Place Holder" +
        "<svg id='svg' class='svg' handle='svg' width = '150px' height = '120px'></svg>" +
        "</legend>" +
      "</div>" +

      // Video
      "<div class='playbackApp' id='playbackApp'>" +
        "<br><br><div id='playback' handle='playback' widget='Widget.Playback'></div>" +
      "</div>" 

    );
  }
}
