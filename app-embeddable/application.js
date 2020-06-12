'use strict';

import Core from '../api-web-devs/tools/core.js';
import Templated from '../api-web-devs/components/templated.js';
import oSettings from '../api-web-devs/components/settings.js';
import Standardized from '../api-web-devs/parsers/standardized.js'
import SimulationDEVS from '../api-web-devs/simulation/simulationDEVS.js'
import SimulationCA from '../api-web-devs/simulation/simulationCA.js'
import Playback from '../api-web-devs/widgets/playback.js';
import MultiView from '../api-web-devs/widgets/multiView.js'

export default class Main extends Templated { 

	constructor(node, files) {		
		super(node);
		
		this.simulation = null;
		this.settings = null;
		
		var parser = new Standardized();
		
		var p = parser.Parse(files);
		
		p.then(this.OnParser_Parsed.bind(this), (error) => { this.OnWidget_Error({ error:error }); });
	}
	
	OnParser_Parsed(files) {
		var content = files.Content();
		
		var clss = (content.simulation.type == "DEVS") ? SimulationDEVS : SimulationCA;

		this.settings = oSettings.FromJson(content.options);
		this.simulation = clss.FromFiles(content);
		
		this.simulation.Initialize(this.settings.Get("playback", "cache"));
		
		this.Widget("playback").Initialize(this.simulation, this.settings);
		this.Widget('multi').Initialize(this.simulation, this.settings);

		if (this.simulation.type == "Cell-DEVS") {
			var n = this.settings.Get("grid", "layers").length;
			var size = this.settings.CanvasSize(this.simulation, n);
		}
		else {
			var size = this.settings.DiagramSize(this.simulation);
		}
		
		size = this.FitSize(size);

		this.Widget("multi").Size = size;
		this.Widget("multi").Redraw();
	}
	
	FitSize(size) {
		var target = size.width / size.height;

		// 20 for margin, 30 in height for playback
		var width = document.documentElement.clientWidth - 10;
		var height = document.documentElement.clientHeight - 50;
		var ratio = width / height;
		
		if (ratio > target) {
			height = width / ratio;
			width = height * target;
		}
		else {
			width = height * ratio;
			height = width / target;
		}
		
		return { width:width, height:height };
	}
	
	Template() {
		return	"<main handle='main'>" +
					"<div handle='multi' widget='Widget.MultiView' class='multi'></div>" +
					"<div handle='playback' widget='Widget.Playback'></div>" +
				"</main>";
	}
}