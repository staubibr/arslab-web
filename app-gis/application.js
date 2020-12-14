"use strict";

import Core from "../api-web-devs/tools/core.js";
import Dom from "../api-web-devs/tools/dom.js";
import Net from "../api-web-devs/tools/net.js";
import Templated from "../api-web-devs/components/templated.js";
import Playback from "../api-web-devs/widgets/playback.js";
import Recorder from '../api-web-devs/components/recorder.js';
import oSettings from '../api-web-devs/components/settings.js';
import Map from "./ol/map.js";
import Box from "../api-web-devs/ui/box-input-files.js";
import VectorLayer from "./ol/vectorLayer.js";
import GetScale from "./utils/getScale.js";
import CustomParser from "./parsers/customParser.js";
import CreateCSV from "./export/createCSV.js";
import Evented from "../api-web-devs/components/evented.js";
import Port from "../api-web-devs/simulation/port.js";
import ColorLegend from "./utils/colorLegend.js";

import { mapOnClick } from "./ol/mapOnClick.js";
import { simulationToTransition } from "./dataHandling/simulationToTransition.js";
import { sortPandemicData } from "./dataHandling/sortPandemicData.js";
import { simAndCycleSelect } from "./ui/simAndCycleSelect.js";
import { createSimulationObject } from "./dataHandling/simulationObject.js";

export default class Application extends Templated {
  constructor(node) {
    // For inheritance 
    super(node);

    this.settings = new oSettings()

    this.simulation = null;

    this.hideLegend = true;

    // For creating simulation object and changing SIR in HTML
    this.ports = ["Susceptible", "Infected", "Recovered", "newInfected"]

    this.currentSIR = this.ports[0]

    // Initial legend settings 
    this.currentNumberOfClasses = 4;
    this.currentColor = "#FF0000";
    this.currentColorScale = new GetScale(this.currentColor, this.currentNumberOfClasses);
    this.AppLegend = new ColorLegend();

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

  /**
   * @description Check if user file input is valid. If the input is 
   * valid then they can load simulation. Otherwise clear the files.
   * @param {event} ev - change 
   */
  OnUpload_Change(ev){
    var userFiles = this.Widget("upload").files
    var numUserFiles = userFiles.length;

    userFiles = userFiles.filter(function (item) {
      var temp = item.name;
      var ext = temp.split(".").pop();
      // Accepted file formats
      if (ext === "txt" || ext === "geojson") {
        return true;
      } else {
        var Dom = document.querySelector(".files-container").children;
        for (let index = 0; index < Dom.length; index++) {
          if (Dom[index].outerText == temp) {
            Dom[index].remove();
          }
        }
        return false;
      }
    });

    this.Widget("upload").files = userFiles
    this.files = userFiles

    if(userFiles.length > 2 || numUserFiles != userFiles.length){
      this.clearUploadedFiles()

      alert(
        "Invalid File Entry.\n" +
        "Stick to inserting no more than 2 files.\n" +
        "The only accepted file formats are:\n - .txt\n - .geojson."
      );
    }
    else {
      this.Elem("load").disabled = false;
      this.Elem("clear").disabled = false;

      var Dom = document.querySelector(".files-container")
      let self = this;

      Dom.addEventListener("click", function () {
        if(Dom.children.length < 2 ){
          self.Elem("load").disabled = true;
          self.Elem("clear").disabled = true;
        }
      })
    }
  }

    /**
   * @description When the user wishes to load the simulation,
   * read data in as blobs and then begin the data handling process.
   * The text file and geojson file are declared here. 
   * @param {event} ev - load  
   */
  OnLoad_Click(ev) {
    this.Elem("wait").hidden = false;

    var txtFile  = this.files.filter(d => d.name.split(".").pop() == "txt")
    var fileGeoJSON = this.files.filter(d => d.name.split(".").pop() == "geojson")

    // Google Chrome only supports 500mb blobs. 
    // The uploaded simulation result file is uploaded to the app in chunks.
    // File chunking
    let self = this,
      parser = new CustomParser();
      
    parser.Parse(txtFile[0]).then(function (data) { self.OnLoad_DataHandler(data, fileGeoJSON); })
  }
  
   /**
   * @description On clear click, remove all user entries and 
   * disable some DOMs
   * @param {*} ev - clear 
   */
  OnClear_Click(ev){
    this.clearUploadedFiles()
  }

  clearUploadedFiles(){
    // Erase files and disable the load simulation button
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

  /**
   * @description Sort the simulation data and draw the layer
   * onto the map.
   * @param {*} data - Array composed of text
   * @param {*} layer - GeoJSON Vector file contents
   */
  OnLoad_DataHandler(data, layer) {
    this.tempData = data;

    let self = this,
      f = layer[0], 
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
    this.AppLegend.hideLegend()
    
    // Legend listeners
    this.RecreateLegendColor(title, translate);
    this.RecreateLegendClass(title, translate);
    this.hideOrShowlegend(title, translate);
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

      self.AppLegend.showLegend( title, translate, self.currentColorScale, self.currentSIR);


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
        self.AppLegend.showLegend( title, translate, self.currentColorScale, self.currentSIR);

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

    let self = this;

    document
      .querySelector(".legend-svg")
      .addEventListener("click", function () {

        self.AppLegend.hideOrShowLegend(
          title,
          translate,
          self.currentColorScale,
          self.hideLegend,
          self.currentSIR
        );

        if (self.hideLegend == false) { self.hideLegend = true; } 
        else { self.hideLegend = false; }
      });

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

    for (let index = 0; index < this.ports.length; index++) {
      if(this.currentSIR == ports[index]){
        document.getElementById("SIR-select").selectedIndex = index;
      }
    }

    document.getElementById('class-select').selectedIndex = this.currentNumberOfClasses == 5 ? 1 : 0

    this.AppLegend.showLegend(title, translate, this.currentColorScale, this.currentSIR)
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
      this.RedrawLayerOnMap(this.currentSimulationCycle);
    }

    // This is to prevent us from changing the svg legend "button"
    if(document.getElementById("legend-svg").style.width== "120px"){
      document.getElementById("legend-svg").firstChild.textContent = this.currentSIR;
    }

    // Change SIR select
    for (let index = 0; index < this.ports.length; index++) {
      if(this.currentSIR == this.ports[index]){
        document.getElementById("SIR-select").selectedIndex = index;
      }
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
    /*
      Uncaught TypeError: Cannot read property 'Reverse' of undefined
      at SimulationDEVS.GoToPreviousFrame (simulation.js:132)
        --> var reverse = frame.Reverse();
    */

    // Until the above error is solved
    if( this.data[this.simulation.state.i] != undefined ){
      this.layer.ColorLayer(this.currentColorScale, this.data[this.simulation.state.i].messages, this.currentSIR);
    }    
  }

  CreateSimulation(features) {
    let data = sortPandemicData(this.tempData);
    this.data = data;

    this.simulation = createSimulationObject(features, this.ports, data);

    simAndCycleSelect(this.currentSimulationTitle, data.length-1)
    this.KeepTrackOfSubmittedUserFiles(data, 
      this.currentSimulationTitle, 
      this.currentSimulationLayerGeoJSON, 
      this.currentNumberOfClasses, 
      this.currentColor, 
      0, 
      this.currentSIR,
      simulationToTransition(this.simulation.frames)
    )
    

    // Let the download button be clickable
    this.Elem("btnDownload").disabled = false;
    this.clearUploadedFiles()
  }

  OnButtonDownload_Click(ev) {
    var index = document.getElementById('sim-download').selectedIndex
    new CreateCSV(this.DataFromFiles[index].transitions);
  }

  /*
    - When a user finishes inserted their files, we get an array composed of an object holding:
      - Simulation title
      - Simulation data
      - GeoJSON layer file content...
    - The array length increases as the user adds more simulations to the webpage
  */
  KeepTrackOfSubmittedUserFiles(data, title, layerFile, classNum, color, cycle, SIR, transitions){
    if(this.DataFromFiles == undefined){ this.DataFromFiles = new Array; }
    this.DataFromFiles.push({
        simulation: title, 
        simulationData: data, 
        GeoJSON: layerFile, 
        layerClasses: classNum, 
        layerColor: color, 
        layerCycle: cycle,
        layerSIR: SIR,
        transitions: transitions
      });
  }

  CurrentColorScale(scale) { this.currentColorScale = scale; }

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
          "<option>newInfected</option>" +
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
