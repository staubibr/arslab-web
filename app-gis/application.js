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
import CreateCsvFileForDownload from "./classes/CreateCsvFile.js";
import Evented from "../api-web-devs/components/evented.js";
import Port from "../api-web-devs/simulation/port.js";

import { mapOnClick } from "./widgets/mapOnClick.js";
import { createTransitionFromSimulation } from "../app-gis/functions/simToTransition.js";
import { sortPandemicData } from "../app-gis/functions/sortPandemicData.js";
import { simSelectAndCycle } from "./widgets/simSelectAndCycle.js";

export default class Application extends Templated {
  constructor(node) {
    super(node);

    this.settings = new oSettings()

    this.simulation = null;

    // By default the legend will be red-white unless otherwise specified by the user
    this.CreateLegend(Core.Nls("App_Legend_Title"), "translate(23,5)");

    // The world map will appear prior to any vector layers being added overtop
    this.Widget("map").InitTileLayer();

    // User data for the application
    this.Node('upload').On("change", this.OnUpload_Change.bind(this));
    this.Node('load').On("click", this.OnLoad_Click.bind(this));
    
    // Change which simulation you wish to manipulate 
    this.Node('selectSimulation').On("change", this.OnSimulationSelectChange.bind(this))

    // Modifies an existing vector layer depending on the simulation cycle selector's current value
    this.Node("cycle").On("change", this.OnCycle_Change.bind(this));

    // For downloading simulation object as CSV 
    this.Node("btnDownload").On("click", this.OnButtonDownload_Click.bind(this));

    // Check what part of SIR the user wants to visualize
    this.Node("SIR-select").On("change", this.OnSIRchange.bind(this));

    this.Widget("playback").Recorder = new Recorder(this.Node("map").Elem("canvas.ol-unselectable"));

    // Fill sidebar with DOMs
    this.AddToSideBar()
  }

  OnUpload_Change(ev){
    this.files = this.Widget('upload').files;
    if(this.files.filter(d => d.name.split(".").pop() == "geojson" || d.name.split(".").pop() == "txt").length != 2){
      alert("You've entered an invalid number of files. Only insert a .txt and .geojson.")
      return;
    }
    this.Elem("load").disabled = false;
  }

  // Google Chrome only supports 500mb blobs. The uploaded simulation result file is uploaded to the app in chunks.
  OnLoad_Click(ev) {
    this.Elem("wait").hidden = false;

    this.fileTXT = this.files.filter(d => d.name.split(".").pop() == "txt")
    this.fileGeoJSON = this.files.filter(d => d.name.split(".").pop() == "geojson")

    let self = this,
      parser = new CustomParser();

    parser.Parse(self.fileTXT[0]).then(function (data) { self.OnLoad_DataHandler(data); })
	}

  /*
  Purpose: 

  Paramter:
    data - holds everything from the simulation results text file
  */
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

  /* 
  Purpose: 
    - Create the vector layer by: 
  Parameters:
    fileContent - Content from GeoJSON layer file
    title - Title from GeoJSON layer file
  */
  AddVectorLayerToMapCollection() {
    this.layer = new VectorLayer(this.currentSimulationLayerGeoJSON, this.currentSimulationTitle); 
    
    // add vector layer onto world map
    this.Widget("map").AddLayer(this.currentSimulationTitle, this.layer);

    // Creates the simulaiton object
    this.layer.OL.getSource().once("change", this.OnLayerCreation_Handler.bind(this)); 
  }

  RedrawLayerOnMap(index){
    this.layer = this.Widget("map").Layer(this.currentSimulationTitle)
    this.layer.ColorLayer(this.currentColorScale, this.data[index].messages, this.currentSIR)
    mapOnClick(this.data[index].messages, this.Widget("map").map.OL, this.currentSimulationTitle, this.currentSimulationCycle)
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
    this.RecreateLegendColor(title, translate);
    this.RecreateLegendClass(title, translate);
  }

  InitialLegend(title, translate) {
    // Initial legend settings 
    this.currentNumberOfClasses = 4;
    this.currentColor = "#FF0000";
    this.currentColorScale = new GetScale(this.currentColor, this.currentNumberOfClasses);

    // Draw legend on map
    this.LegendToApp(title, translate, this.currentColorScale)
  }

  LegendToApp(title, translate, scale){
    const svg = d3.select("svg");

    svg.selectAll("*").remove();

    svg.append("g").attr("class", title).attr("transform", translate);

    var colorLegend = d3
      .legendColor()
      .labelFormat(d3.format(".2f"))
      // To actually color the legend based on our chosen colors
      .scale(scale.d3Scale);

    svg.select("." + title).call(colorLegend);
  }

  RecreateLegendColor(title, translate) {
    let self = this;
    let scale;
    
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
      scale = self.currentColorScale;

      self.LegendToApp(title, translate, scale)

      self.RecolorLayer();
    }, false);
  }

  RecreateLegendClass(title, translate) {
    let self = this;
    let scale;
    
    // Recreate the legend if a color change is issued
    d3.select("#class-select").on("change", function () {
      self.currentClass = d3.select(this).node().value;
      self.currentColorScale = new GetScale(self.currentColor, self.currentClass);
      scale = self.currentColorScale;

      if(self.DataFromFiles != undefined){
        var currentDataFileIndex = document.getElementById('sim-select').selectedIndex;
        self.DataFromFiles[currentDataFileIndex].layerClasses = self.currentClass;
      }

      self.LegendToApp(title, translate, scale)

      self.RecolorLayer();
    }, false);
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
    this.UpdateLegendToCurrentSimulation(Core.Nls("App_Legend_Title"), "translate(23,5)");
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
    let scale = this.currentColorScale;

    this.RedrawLayerOnMap(this.currentSimulationCycle);

    document.getElementById('colorOne').value = this.currentColor

    document.getElementById("legend-svg").firstChild.textContent = "Proportion " + this.currentSIR;

    if(this.currentSIR == "Susceptible"){
      document.getElementById("SIR-select").selectedIndex = 0;
    } else if (this.currentSIR == "Infected") {
      document.getElementById("SIR-select").selectedIndex = 1;
    } else {
      document.getElementById("SIR-select").selectedIndex = 2;
    }

    if(this.currentNumberOfClasses == 5){
      document.getElementById('class-select').selectedIndex = 1
    } else {
      document.getElementById('class-select').selectedIndex = 0
    }

    const svg = d3.select("svg");

    svg.selectAll("*").remove();

    svg.append("g").attr("class", title).attr("transform", translate);

    var colorLegend = d3
      .legendColor()
      .labelFormat(d3.format(".2f"))
      // To actually color the legend based on our chosen colors
      .scale(scale.d3Scale);

    svg.select("." + title).call(colorLegend);
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
      document.getElementById("legend-svg").firstChild.textContent = "Proportion " + ev.target.value;
      this.RedrawLayerOnMap(this.currentSimulationCycle);
    }
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
    simSelectAndCycle(this.currentSimulationTitle, data.length-1)
    this.KeepTrackOfSubmittedUserFiles(data, 
      this.currentSimulationTitle, 
      this.currentSimulationLayerGeoJSON, 
      this.currentNumberOfClasses, 
      this.currentColor, 
      0, 
      this.currentSIR
      )
    var ports = ["Susceptible", "Infected", "Recovered"]
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

    //ev.frame.transitions.filter(t => t.port == "Infected")

    this.simulation = simulation;

    this.transitions = createTransitionFromSimulation(simulation.frames)

    this.ArrayOfTransitions(this.transitions, this.currentSimulationTitle)

    // Let the download button be clickable
    this.Elem("btnDownload").disabled = false;

  }

  OnButtonDownload_Click(ev) {
    var index = document.getElementById('sim-download').selectedIndex
    new CreateCsvFileForDownload(this.allTransitions[index].transitionData);
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

  AddToSideBar(){
    document.getElementById("loadDataSidebar").appendChild(document.getElementById("loadDataApp"))
    document.getElementById("editSimulationSidebar").appendChild(document.getElementById("editSimulationApp"))
    document.getElementById("playSidebar").appendChild(document.getElementById("playbackApp"))
    document.getElementById("downloadDataSidebar").appendChild(document.getElementById("downloadDataApp"))
  }

  Template() {
    return (
      
      "<div id='map' handle='map' widget='Widget.Map' class='map' ></div>" +

      // Load Simulation
      "<div handle='loadDataApp' id='loadDataApp'>" +
        // Drag and drop files
        "<div handle='dropzone' class='dropzone-container'>" + 
          "<div handle='upload' widget='Widget.Box-Input-Files'></div>" +
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

        "<br><label>Select Simulation Cycle: <input handle='cycle' type='range' name='cycle' id='cycle' min='0' max = '0' step='1' value='0' >" +
        "<output handle='output' class='cycle-output' for='cycle'></output></label><br><br>" +

        "<div>" +
          "<label for='favcolor'>Select colour scale: </label>" +
          "<input type='color' id='colorOne' name='favcolor' value='#ff0000'><br>" +
        "</div>" +

        "<br><div id='classControls'><label for='class-select'>Select # of classes: </label>" +
        "<select handle = 'selectClasses' id='class-select'>" +
          "<option>4</option>" +
          "<option>5</option>" +
        "</select></div>" +

        "<br><div id='SIRControls'><label for='class-select'>Choose what to visualize: </label>" +
        "<select handle = 'SIR-select' id='SIR-select'>" +
          "<option>Susceptible</option>" +
          "<option>Infected</option>" +
          "<option>Recovered</option>" +
        "</select></div>" +
        
        "<legend id='legend-svg' class='svg-div'>Proportion Susceptible<svg id='svg' class='svg' handle='svg' width = '960' height = '150'></svg></legend>" +
      "</div>" +

      // Video
      "<div class='playbackApp' id='playbackApp'>" +
        "<br><br><div id='playback' handle='playback' widget='Widget.Playback'></div>" +
      "</div>" +
     
      // Overlay text for vector layers
      "<div id = 'overlay-container' class='overlay-container' style='none'>" +
          "<span class='overlay-text' id='feature-name'></span>" +
          "</span><br><br><span class='overlay-text' id='feature-simulation'></span>" +
          "</span><br><br><span class='overlay-text' id='feature-cycle'></span>" +
          "</span><br><br><span class='overlay-text' id='feature-init-pop'></span>" +
          "</span><br><br><span class='overlay-text' id='feature-current-pop'></span>" +
          "</span><br><br><span class='overlay-text' id='feature-fatal'></span>" +
          "</span><br><br><span class='overlay-text' id='feature-susceptible'></span>" +
          "</span><br><br><span class='overlay-text' id='feature-infected'></span>" +
          "</span><br><br><span class='overlay-text' id='feature-recovered'></span></div>" 
    );
  }
}
