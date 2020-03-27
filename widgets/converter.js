'use strict';

// import Sim from '../utils/sim.js';
import Core from '../../basic-tools/tools/core.js';
import Net from '../../basic-tools/tools/net.js';
import Templated from '../../basic-tools/components/templated.js';
import BoxInput from '../../basic-tools/ui/box-input-files.js';

export default Core.Templatable("Widget.Converter", class Control extends Templated { 

	get Config() { return this.config; }
	
	constructor(node) {		
		super(node);
		
		this.files = null;
		this.config = null;
		this.parser = null;
		
		this.simulationJSON = {
			svg : null,
			log : null,
			size : null,
			modelName : null,
			simulator : null,
			style : null
		}

		this.Node("save").addEventListener("click", this.onLoadClick_Handler.bind(this));
		this.Node("dropzone").On("Change", this.onDropzoneChange_Handler.bind(this));
	}

	DownloadJSON(simulation) {	
		var myJSON = JSON.stringify(simulation.transition);
		var array = typeof myJSON != 'object' ? JSON.parse(myJSON) : myJSON;
		var CSVstring = '';
   			
		for (var i = 0; i < array.length-1; i++) {
			var line = '';
			
			for (var index in array[i]) {
				if (line != '') line += ','

				line += array[i][index];
			}

			CSVstring += line + '\r\n';
		}
			
		//for last line
		var line = '';
		
		for (var index in array[i]) {
			if (line != '') line += ','

			line += array[i][index];
		}

		CSVstring += line;

		this.simulationJSON.size = simulation.size;
		this.simulationJSON.modelName = simulation.simulatorName;
		this.simulationJSON.simulator = simulation.simulator;
		this.simulationJSON.style = simulation.palette ;
		
		var p1 = Net.CreateGistSVG(String(simulation.svg));
		var p2 = Net.CreateGistCSV(String(CSVstring));
		
		Promise.all([p1,p2]).then((data) => {
			
			this.setCSVURL (data[0], data[1]) ;
		});	
	}

	setCSVURL(SVGurl, CSVurl) {
		this.simulationJSON.svg = SVGurl;
		this.simulationJSON.log = CSVurl;
		this.Download();
	}

	Download() {
		var styleJson = [];
			
		for( var i = 0 ; i < this.simulationJSON.style.length ; i++){
   			var rangeValue = [this.simulationJSON.style[i][0],this.simulationJSON.style[i][1]];

  			var colorValue = this.simulationJSON.style[i][2];
  		
			styleJson.push({range : rangeValue,color : colorValue});
		}

		var simJSON = JSON.stringify({ 
			files : {
				svg : this.simulationJSON.svg,
				log : this.simulationJSON.log
			},
			simulator : this.simulationJSON.simulator, 
			model : {
				name : this.simulationJSON.modelName,
				size : this.simulationJSON.size 
			}
			,
			style : styleJson
		});
	
		Net.Download(this.simulationJSON.modelName + ".json", simJSON);
	}

	onLoadClick_Handler(ev) {
		this.parser.Parse(this.files).then((ev) => { this.DownloadJSON(ev.result); });
		
		this.Emit("Save");	
	}

	onDropzoneChange_Handler(ev) {
		this.files = ev.files;

		var success = this.onParserDetected_Handler.bind(this);
		var failure = this.onError_Handler.bind(this);
		
		Sim.DetectParser(ev.files).then(success, failure);	
	}
	
	onConfigParsed_Handler(ev) {
		this.config = ev.result;
	
	}	
	
	onParserDetected_Handler(ev) {
		this.parser = ev.result;
	
		this.onConfigParsed_Handler(ev);
	}
	
	onError_Handler(ev) {
		this.Node("dropzone").Reset();
		
		alert(ev.error.toString());
	}

	Template() {
		return "<div handle='dropzone' widget='Widget.Box-Input-Files'></div>" +
			   "<button handle='save' class='save' >Parse files</button>";
	}
});