'use strict';

import Core from '../basic-tools/tools/core.js';
import Net from '../basic-tools/tools/net.js';
import Dom from '../basic-tools/tools/dom.js';
import Templated from '../basic-tools/components/templated.js';

import oSettings from '../web-devs-tools/components/settings.js';

import Standardized from '../web-devs-tools/parsers/standardized.js'

import Simulation from '../web-devs-tools/simulation/simulation.js'

import Playback from '../web-devs-tools/widgets/playback.js';
import DiagramAuto from '../web-devs-tools/widgets/diagram/auto.js'
import Diagram from '../web-devs-tools/widgets/diagram/diagram.js'
import GridAuto from '../web-devs-tools/widgets/grid/auto.js'
import Grid from '../web-devs-tools/widgets/grid/grid.js'

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
		this.simulation = Simulation.FromJson(json);
		
		this.simulation.Initialize(this.settings.Get("playback", "cache"));
		
		var widget = (this.simulation.type == "DEVS") ? "diagram" : "grid";
		
		this.SwitchWidget(widget);
		
		this.settings.SetRatio(widget, this.simulation.Ratio);
		
		this.Resize(widget, this.simulation.Dimensions.z);
		
		this.current.Redraw();
		
		this.Elem("playback").Initialize(this.simulation, this.settings);
	}
	
	Resize(widget, nGrids) {
		if (widget == "diagram") {
			var size = this.settings.DiagramSize();
		}
		else if (widget == "grid") {
			var size = this.settings.GridSize(nGrids);
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
			var z = [];
			
			for (var i = 0; i < this.simulation.Dimensions.z; i++) z.push(i);
			
			var options = { 
				clickEnabled:false,
				columns:this.settings.Get("grid", "columns"), 
				spacing:this.settings.Get("grid", "spacing"), 
				z:z 
			}
			
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