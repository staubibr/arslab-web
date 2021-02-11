
'use strict';

import Core from '../api-web-devs/tools/core.js';
import Dom from '../api-web-devs/tools/dom.js';
import Templated from '../api-web-devs/components/templated.js';
import Configuration from '../api-web-devs/components/configuration/configuration.js';
import DiagramAuto from '../api-web-devs/widgets/diagram/auto.js'
import GridAuto from '../api-web-devs/widgets/grid/auto.js'
import GisAuto from '../api-web-devs/widgets/gis/auto.js'
import Playback from '../api-web-devs/widgets/playback.js';
import Recorder from '../api-web-devs/components/recorder.js';

export default class Main extends Templated { 

	constructor(node, simulation, config, style, files) {		
		super(node);
		
		this.files = files;
		this.simulation = simulation;
		
		this.Configure(config, style);
		
		this.simulation.Initialize(this.settings.playback.cache);
		
		this.ShowView(this.Elem("view")).then(view => {
			this.view = view;
			
			if (!this.view) throw new Error("Unable to create a view widget from simulation object.");
			
			this.Widget("playback").Recorder = new Recorder(this.view.Widget.Canvas);
			this.Widget("playback").Initialize(this.simulation, this.settings.playback);
		
			this.view.Resize();
			this.view.Redraw();
		});
		
	}
	
	Configure(config, style) {
		if (config) this.settings = Configuration.FromJson(config);
		
		else this.settings = Configuration.FromSimulation(this.simulation);
		
		if (this.simulation.Type == "Cell-DEVS" && style) this.settings.grid.styles = style;
	}
	
	ShowView(container) {
		var d = Core.Defer();
		
		if (this.simulation.Type == "DEVS") {
			d.Resolve(new DiagramAuto(container, this.simulation, this.settings.diagram));
		}
		else if (this.simulation.Type === "Cell-DEVS") {
			d.Resolve(new GridAuto(container, this.simulation, this.settings.grid));
		}
		else if (this.simulation.Type === "Irregular Cell-DEVS") {
			var geojson = this.files.convert.filter(f => f.name.match(/.geojson/i));
			var view = new GisAuto(container, this.simulation, this.settings.gis, geojson);

			Dom.AddCss(document.body, "GIS");
			Dom.Place(this.Elem("playback"), view.Widget.roots[0]);
			
			view.On("ready", ev => d.Resolve(view));
		}
				
		return d.promise;
	}
	
	OnWidget_Error(ev) {
		alert (ev.error);
	}						   
						   
	Template() {
		return	"<main handle='main' class='view-container'>" +
					"<div handle='view' class='view'></div>" +
					"<div handle='playback' widget='Widget.Playback'></div>" +
				"</main>";
	}
}