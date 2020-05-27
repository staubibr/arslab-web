'use strict';

import Core from '../api-basic/tools/core.js';
import Net from '../api-basic/tools/net.js';
import Dom from '../api-basic/tools/dom.js';
import Templated from '../api-basic/components/templated.js';
import oSettings from '../api-web-devs/components/settings.js';
import Standardized from '../api-web-devs/parsers/standardized.js'
import SimulationCA from '../api-web-devs/simulation/simulationCA.js'
import Playback from '../api-web-devs/widgets/playback.js';
import GridAuto from '../api-web-devs/widgets/grid/auto.js'
import Grid from '../api-web-devs/widgets/grid/grid.js'

export default class Main extends Templated { 

	constructor(node, files, options) {		
		super(node);
		
		this.simulation = null;
		this.grid = null;
		this.settings = oSettings.FromJson(options);
		
		var parser = new Standardized();
		
		var p = parser.Parse(files);
		
		p.then(this.OnParser_Parsed.bind(this), (error) => { this.OnWidget_Error({ error:error }); });
	}
	
	OnParser_Parsed(json) {		
		this.simulation = SimulationCA.FromJson(json);
		
		this.simulation.Initialize(this.settings.Get("playback", "cache"));
		
		var layers = [{ z:0, ports:["out_ty"]}, 
					  { z:0, ports:["out_c"]}];

		var options = { 
			clickEnabled:false,
			columns:this.settings.Get("grid", "columns"), 
			spacing:this.settings.Get("grid", "spacing"), 
			layers:layers
		}
		
		this.grid = new GridAuto(this.Elem("grid"), this.simulation, options);
		
		var size = this.settings.GridSize(this.simulation, layers.length);
		
		this.Elem("body").style.width = size.width + "px";
		this.Elem("body").style.height = size.height + "px";
		
		this.grid.Redraw();
		
		this.Elem("playback").Initialize(this.simulation, this.settings);
	}
	
	Template() {
		return	"<main handle='main'>" +
				    "<div class='centered-row'>" + 
						"<div class='body-container'>" + 
						   "<div handle='body' class='body'>" +
							   "<div handle='viz' class='viz-container'>" +
								   "<div handle='grid' widget='Widgets.Grid' class='grid-widget-container'></div>" +
							   "</div>" +
						   "</div>" +
						"</div>" +
					"</div>" +
					"<div handle='playback' widget='Widget.Playback'></div>" +
				"</main>";
	}
}