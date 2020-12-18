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
import Style from "./utils/style.js";

import { mapOnClick } from "./ol/mapOnClick.js";
import { simulationToTransition } from "./dataHandling/simulationToTransition.js";
import { sortPandemicData } from "./dataHandling/sortPandemicData.js";
import { simAndCycleSelect } from "./utils/simAndCycleSelect.js";
import { createSimulationObject } from "./dataHandling/simulationObject.js";
import { updateVariableSelect } from "./utils/updateVariableSelect.js";

export default class Application extends Templated {
  constructor(node) {
    // For inheritance 
    super(node);

    this.settings = new oSettings()

    this.simulation = null;

    // Initial legend settings
    this.classNumberOfCurrentSimulation = 4;
    this.currentColor = "#FF0000";
    this.currentColorScale = new GetScale(this.currentColor, this.classNumberOfCurrentSimulation);

    // Create map container (canvas, sidebar, search, zoom, layer switcher, etc.)
    this.Widget("map").InitLayer();

    // Legend properties selector
    this.Node("colorSelect").On("change", this.RecreateLegendColor.bind(this));
    this.Node("selectClasses").On("change", this.RecreateLegendClass.bind(this));

    // User upload, load, and clear files to the program
    this.Node('upload').On("change", this.OnUpload_Change.bind(this));
    this.Node('load').On("click", this.OnLoad_Click.bind(this));
    this.Node('clear').On("click", this.OnClear_Click.bind(this));
    
    // User selection (simulation, cycle, and port)
    this.Node('selectSimulation').On("change", this.OnSimulationSelectChange.bind(this))
    this.Node("cycle").On("change", this.OnCycle_Change.bind(this));
    this.Node("variable-select").On("change", this.OnVariableChange.bind(this));

    // For downloading transitions 
    this.Node("btnDownload").On("click", this.OnButtonDownload_Click.bind(this));

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

    if(userFiles.length > 2 || numUserFiles != userFiles.length){
      this.clearUploadedFiles()
      alert(
        "Invalid File Entry.\n" +
        "Stick to inserting no more than 2 files.\n" +
        "The only accepted file formats are:\n - .txt\n - .geojson."
      );
    }
    else {
      this.Widget("upload").files = userFiles
      this.files = userFiles

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

    var textFile  = this.files.filter(d => d.name.split(".").pop() == "txt")
    var fileGeoJSON = this.files.filter(d => d.name.split(".").pop() == "geojson")

    // Google Chrome only supports 500mb blobs. 
    // The uploaded simulation result file is uploaded to the app in chunks.
    let self = this,
      parser = new CustomParser();
      
    parser.Parse(textFile[0]).then(function (data) { self.OnLoad_DataHandler(data, textFile, fileGeoJSON); })
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
  OnLoad_DataHandler(data, textFile, layer) {
    this.tempData = data;

    let self = this;
    let fileReader = new FileReader();

    fileReader.onload = function (event) {
      let title = layer[0].name.substring(0, layer[0].name.indexOf("."));
      let simNum = (self.collection == undefined) ? 0 : self.collection.length;
      let newTitle = title + " & " + textFile[0].name.substring(0, textFile[0].name.indexOf(".")) + " Viz" + simNum ;

      // Current simulation settings
      self.titleOfCurrentSimulation = newTitle;

      self.currentVariableSelection = (self.currentVariableSelection == undefined) ? "Susceptible" : self.currentVariableSelection;
      self.cycleNumberOfCurrentSimulation = 0;
      
      self.layer = new VectorLayer(event.target.result, self.titleOfCurrentSimulation); 
    
      // add vector layer onto world map
      self.Widget("map").AddLayer(self.titleOfCurrentSimulation, self.layer);

      // Creates the simulaiton object
      self.layer.OL.getSource().once("change", self.OnLayerCreation_Handler.bind(self)); 
    };
    fileReader.readAsDataURL(layer[0]); 
  }

  // TODO: Improve mapOnClick
  RedrawLayerOnMap(index){
    this.layer = this.Widget("map").Layer(this.titleOfCurrentSimulation);
    this.layer.ColorLayer(this.currentColorScale, this.data[index].messages, this.currentVariableSelection);
    mapOnClick(
      this.data[index].messages,
      this.Widget("map").map.OL,
      this.titleOfCurrentSimulation,
      this.cycleNumberOfCurrentSimulation,
      this.currentColorScale,
      this.currentVariableSelection
    );
  }

  /**
   * @description Clear existing legend and define a new one
   */
  UpdateLegend(){
    if(this.data != undefined){
      this.Widget("map").RemoveControl(this.legend);
    
      var domain = [], index = 0; 

      while(index <= 1){
        domain.push(index.toFixed(2));
        index += (1 / this.classNumberOfCurrentSimulation);
      }

      var prev = null;
      index = 0;

      while(index < domain.length){

        var curr = domain[index];

        if (curr == "0.00") {
          this.legend = new ol.control.Legend({ 
            title: `${this.currentVariableSelection}`,
            margin: 5, 
            collapsed: false 
          });
        }
        
        else {
          var title = (prev) ? `${prev} - ${curr}` : `0 - ${curr}`;
          var color = this.currentColorScale.d3Scale(domain[index-1]);

          this.legend.addRow({ 
            title: title, 
            size:[40,40], 
            typeGeom:"Point",  
            style: Style.PointStyle(color) 
          });
        }

        index++;
        prev = curr;
      }

      this.Widget("map").AddControl(this.legend);
    }
    
  }

  /**
   * @description Activates When a user changes the color property of the legend.
   * If a simulation exists, it will also be recoloured. 
   * @param {*} ev 
   */
  RecreateLegendColor(ev) {
    this.currentColor = ev.target.value;

    if(this.collection != undefined){
      var currentDataFileIndex = document.getElementById('sim-select').selectedIndex;
      this.collection[currentDataFileIndex].visualProperties.layerColor = this.currentColor;
    }   

    this.currentColorScale = new GetScale(this.currentColor, this.classNumberOfCurrentSimulation);

    this.UpdateLegend();

    this.RecolorLayer();
  }

  /**
   * @description Activates When a user changes the class property of the legend.
   * If a simulation exists, it will also be recoloured based on the new classification. 
   * @param {*} ev 
   */
  RecreateLegendClass(ev) {
    this.classNumberOfCurrentSimulation = ev.target.value;
    this.currentColorScale = new GetScale( this.currentColor, this.classNumberOfCurrentSimulation );

    if (this.collection != undefined) {
      var currentDataFileIndex = document.getElementById("sim-select")
        .selectedIndex;

      this.collection[currentDataFileIndex].visualProperties.classNum =
      this.classNumberOfCurrentSimulation;
    }

    this.UpdateLegend();

    this.RecolorLayer();
  }

  RecolorLayer() {
    if (this.data != undefined) {
      this.RedrawLayerOnMap(this.cycleNumberOfCurrentSimulation);
    }
  }

  /**
  * @description Change the simulation being manipulated and update legend color, 
  * legend classes, variable select, and simulation cycle.
  * @param {*} ev - event.target.value would tell us which simulation we selected
  */
  OnSimulationSelectChange(ev){
    // Switch simulations to manipulate 
    this.PreviousSimulationToCurrentSimulation(document.getElementById('sim-select').selectedIndex);

    // Update variable select
    updateVariableSelect(this.variables);
    
    // Update legend
    this.UpdateLegendToCurrentSimulation();

    // Update simulation cycle
    this.Elem("cycle").setAttribute("max", this.data.length - 1);
    this.Elem("output").textContent = this.cycleNumberOfCurrentSimulation;
    document.getElementById("cycle").value = this.cycleNumberOfCurrentSimulation;

    // Update video playback to current simulation object
    this.simulation.On("Move", this.OnSimulation_Move.bind(this));
    this.simulation.On("Jump", this.OnSimulation_Jump.bind(this));
    this.Widget("playback").Initialize(this.simulation, this.settings);
  }

  /**
   * @description When the user swaps between simulations, update
   * existing configurations
   * @param {*} index - The selected simulation
   */
  PreviousSimulationToCurrentSimulation(index){
    var element = this.collection[index];
    this.titleOfCurrentSimulation = element.title;
    this.simulation = element.simulationObject;
    this.data = element.data;
    this.cycleNumberOfCurrentSimulation = element.visualProperties.cycleNum;
    this.classNumberOfCurrentSimulation = element.visualProperties.classNum;
    this.currentColor = element.visualProperties.layerColor;
    this.currentVariableSelection = element.visualProperties.variable;
    this.variables = element.visualProperties.variables;
  }

  /**
   * @description Visual Properties are saved for each simulation, 
   * this function will update the color of the simulation's layer
   * and update the legend
   */
  UpdateLegendToCurrentSimulation(){
    this.currentColorScale = new GetScale(this.currentColor, this.classNumberOfCurrentSimulation);

    this.RedrawLayerOnMap(this.cycleNumberOfCurrentSimulation);

    document.getElementById('colorSelect').value = this.currentColor;

    for (let index = 0; index < this.variables.length; index++) {
      if(this.currentVariableSelection == this.variables[index]){
        document.getElementById("variable-select").selectedIndex = index;
      }
    }

    document.getElementById('class-select').selectedIndex = this.classNumberOfCurrentSimulation == 5 ? 1 : 0;

    this.UpdateLegend();
  }
  
  /**
  * @description Change the current simulation cycle and display 
  * the updated simulation based on simulation cycle
  * @param {*} ev - To find which simulation cycle user selected
  */
  OnCycle_Change(ev) {
    // Let the user know what cycle theyre on
    this.Elem("output").textContent = ev.target.value;

    // Update the current cycle
    this.cycleNumberOfCurrentSimulation = ev.target.value;
    var currentDataFileIndex = document.getElementById('sim-select').selectedIndex;
    this.collection[currentDataFileIndex].visualProperties.cycleNum = ev.target.value;

    // Recolor the current layer accordingly
    this.RedrawLayerOnMap(ev.target.value);
  }

  /**
   * @description Change the colouring of the simulation's layer on variable change 
   * and update HTML 
   * @param {*} ev - ev.target.value will tell use which 
   * variable the user changed to
   */
  OnVariableChange(ev){
    this.currentVariableSelection = ev.target.value;
    var currentDataFileIndex = document.getElementById('sim-select').selectedIndex;

    // Change layer if there is one
    if(this.titleOfCurrentSimulation != undefined){
      this.collection[currentDataFileIndex].visualProperties.variable = ev.target.value;
      this.RedrawLayerOnMap(this.cycleNumberOfCurrentSimulation);
    }

    // Change variable select
    for (let index = 0; index < this.variables.length; index++) {
      if(this.currentVariableSelection == this.variables[index]){
        document.getElementById("variable-select").selectedIndex = index;
      }
    }

    this.UpdateLegend();
  }
  
  /**
   * @description create simulation object, draw simulation layer on map, 
   * create legend for the simulation, set up playback feature 
   * and up some HTML elements
   * @param {*} ev - ev.target.getFeatures() are all the polygons 
   * in a simulation layer
   */
  OnLayerCreation_Handler(ev) {
    var features = ev.target.getFeatures();
    this.CreateSimulation(features);

    this.RedrawLayerOnMap(this.cycleNumberOfCurrentSimulation);
    this.UpdateLegend();
    this.Elem("wait").hidden = true;
    this.Widget("playback").Enable(true);

    this.simulation.On("Move", this.OnSimulation_Move.bind(this));
    this.simulation.On("Jump", this.OnSimulation_Jump.bind(this));
    this.Widget("playback").Initialize(this.simulation, this.settings);
  }

  OnSimulation_Jump(ev){
    this.layer.ColorLayer(
      this.currentColorScale, 
      this.data[this.simulation.state.i].messages, 
      this.currentVariableSelection
    );
  }

  OnSimulation_Move(ev){
    /*
      Uncaught TypeError: Cannot read property 'Reverse' of undefined
      at SimulationDEVS.GoToPreviousFrame (simulation.js:132)
        --> var reverse = frame.Reverse();
    */

    // Until the above error is solved
    if( this.data[this.simulation.state.i] != undefined ){
      this.layer.ColorLayer(
        this.currentColorScale, 
        this.data[this.simulation.state.i].messages, 
        this.currentVariableSelection
      );
    }    
  }

  // TODO: Switch this.data to simulation object 
  CreateSimulation(features) {
    this.data = sortPandemicData(this.tempData);

    this.updateVariables();

    // TODO: Try this with simulations that have a different number of cycles
    simAndCycleSelect(this.titleOfCurrentSimulation, this.data.length-1);

    this.simulation = createSimulationObject(features, this.variables, this.data);

    this.collectionOfSimulations(
      this.simulation,
      this.data, 
      this.titleOfCurrentSimulation, 
      simulationToTransition(this.simulation.frames),
      {
        classNum : this.classNumberOfCurrentSimulation, 
        layerColor: this.currentColor, 
        cycleNum : this.cycleNumberOfCurrentSimulation, 
        variable : this.currentVariableSelection,
        variables: this.variables
      }
    );

    // Let the download button be clickable
    this.Elem("btnDownload").disabled = false;
    this.clearUploadedFiles();
  }

  updateVariables(){
    for (var firstKey in this.data[0]["messages"]) break;
    // For creating simulation object
    this.variables = Object.keys(this.data[0].messages[firstKey]);
    // Population is always [0], remove it since it is does not have a domain of [0,1]
    // Comment this line of code out if your population is in proportion [0,1]
    this.variables.shift();
    this.currentVariableSelection = this.variables[0];
    // Update variables in HTML
    updateVariableSelect(this.variables);
  }

  /**
   * @description Create CSV and make downloadable
   * @param {*} ev 
   */
  OnButtonDownload_Click(ev) {
    var index = document.getElementById('sim-download').selectedIndex;
    new CreateCSV(this.collection[index].transitions);
  }

  /**
   * @description Collection of all the simulations the user has entered
   * @param {*} simulation - simulation object 
   * @param {*} data - data for visualization 
   * @param {*} title - Title of the simulation
   * @param {*} transitions - Data for CSV file download
   * @param {*} visualProperties - [classNum, layerColor, cycleNum, variable, variables]
   */
  collectionOfSimulations(simulation, data, title, transitions, visualProperties){
    if(this.collection == undefined) {this.collection = new Array; }
    this.collection.push({
      simulationObject: simulation,
      data : data, 
      title : title, 
      transitions : transitions,
      visualProperties : visualProperties
    }) 
  }

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
          "<input type='color' handle='colorSelect' id='colorSelect' name='favcolor' value='#ff0000'><br>" +
        "</div>" +

        // Classes select (4 or 5)
        "<br><div id='classControls'><label for='class-select'>Select # of classes: </label>" +
        "<select handle = 'selectClasses' id='class-select'>" +
          "<option>4</option>" +
          "<option>5</option>" +
        "</select></div>" +

        // Simulation select
        "<br><div id='variableControls'><label for='class-select'>Choose what to visualize: </label>" +
        "<select handle = 'variable-select' id='variable-select'>" +
        "</select></div>" +

      // Video
      "<div class='playbackApp' id='playbackApp'>" +
        "<br><br><div id='playback' handle='playback' widget='Widget.Playback'></div>" +
      "</div>" 

    );
  }
}
