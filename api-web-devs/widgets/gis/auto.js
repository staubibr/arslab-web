'use strict';

import Core from '../../tools/core.js';
import Dom from '../../tools/dom.js';
import Tooltip from '../../ui/tooltip.js';
import Automator from '../../components/automator.js';
import GIS from '../gis/gis.js';

export default Core.Templatable("Auto.GIS", class AutoGIS extends Automator { 

	get Canvas() { return this.Widget.Canvas; }
	
	constructor(node, simulation, options, files) {
		if (!options) throw new Error("No options provided for the GIS widget");
		
		super(new GIS(node), simulation);
		
		this.config = options;		
		
		this.Widget.Load(options, files, simulation).then(this.onMap_Ready.bind(this), this.OnMap_Error.bind(this));
	}
	
	onMap_Ready(ev) {		
		this.config.On("Change", this.OnSettings_Change.bind(this));
				
		this.Emit("ready", { view:this });
	}
	
	Redraw() {
		this.Widget.Draw(this.simulation.State.data);
	}
	
	Resize() {
		
	}
	
	onSimulation_Jump(ev) {
		this.Widget.Draw(ev.state.data);
	}
	
	onSimulation_Move(ev) {
		var data = {};
		
		ev.frame.StateMessages.forEach(t => data[t.Emitter.Name] = t.Value);
		
		this.Widget.Draw(data);
	}
	
	OnSettings_Change(ev) {			
		
	}
	
	OnMap_Error(error) {
		alert(error.toString());
	}
});