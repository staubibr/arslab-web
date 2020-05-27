'use strict';

import Core from '../api-basic/tools/core.js';
import Net from '../api-basic/tools/net.js';
import Dom from '../api-basic/tools/dom.js';
import Templated from '../api-basic/components/templated.js';

import oSettings from '../api-web-devs/components/settings.js';

import Standardized from '../api-web-devs/parsers/standardized.js'

import SimulationDEVS from '../api-web-devs/simulation/simulationDEVS.js'
import SimulationCA from '../api-web-devs/simulation/simulationCA.js'

import Playback from '../api-web-devs/widgets/playback.js';
import DiagramAuto from '../api-web-devs/widgets/diagram/auto.js'
import Diagram from '../api-web-devs/widgets/diagram/diagram.js'
import GridAuto from '../api-web-devs/widgets/grid/auto.js'
import Grid from '../api-web-devs/widgets/grid/grid.js'

export default class Main extends Templated { 

	constructor(node, files, options) {		
		super(node);
		
		this.simulation = null;
		
		this.current = null;
		
		this.settings = oSettings.FromJson(options);
		
		var parser = new Standardized();
		
		var p = parser.Parse(files);
		
		p.then(this.OnParser_Parsed.bind(this), (error) => { this.OnWidget_Error({ error:error }); });
	}
	
	OnParser_Parsed(json) {
		var clss = (json.type == "DEVS") ? SimulationDEVS : SimulationCA;
		
		this.simulation = clss.FromJson(json);
		
		this.simulation.Initialize(this.settings.Get("playback", "cache"));
		
		var widget = (this.simulation.type == "DEVS") ? "diagram" : "grid";
		
		this.SwitchWidget(widget);
		
		this.Resize(widget);
		
		this.current.Redraw();
		
		this.Elem("playback").Initialize(this.simulation, this.settings);
	}
	
	Resize(widget, nGrids) {
		if (widget == "diagram") {
			var size = this.settings.DiagramSize(this.simulation);
		}
		else if (widget == "grid") {
			var n = this.Elem("grid").layers.length;
			
			var size = this.settings.GridSize(this.simulation, n);
		}
		else {
			throw new Error("Tried to retrieve size for invalid widget.");
		}
		
		this.Elem("body").style.width = size.width + "px";
		this.Elem("body").style.height = size.height + "px";
	}
	
	SwitchWidget(widget) {		
		Dom.SetCss(this.Elem("main"), `${widget}-visible`);
		
		if (widget == "diagram") {			
			this.current = new DiagramAuto(this.Elem("diagram"), this.simulation, { clickEnabled:false });
		}
		else if (widget === "grid") {			
			var options = { 
				clickEnabled:false,
				columns:this.settings.Get("grid", "columns"), 
				spacing:this.settings.Get("grid", "spacing"), 
				layers:this.settings.Get("grid", "layers")
			}
			
			if (!options.layers) options.layers = this.simulation.LayersAndPorts();
			
			this.current = new GridAuto(this.Elem("grid"), this.simulation, options);
		}
	}
	
	Template() {
		return	"<main handle='main'>" +
				    "<div class='centered-row'>" + 
						"<div class='body-container'>" + 
						   "<div handle='body' class='body'>" +
							   "<div handle='viz' class='viz-container'>" +
								   "<div handle='diagram' widget='Widgets.Diagram' class='diagram-widget-container'></div>" +
								   "<div handle='grid' widget='Widgets.Grid' class='grid-widget-container'></div>" +
							   "</div>" +
						   "</div>" +
						"</div>" +
					"</div>" +
					"<div handle='playback' widget='Widget.Playback'></div>" +
				"</main>";
	}
}