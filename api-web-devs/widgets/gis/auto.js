'use strict';

import Core from '../../tools/core.js';
import Dom from '../../tools/dom.js';
import Net from '../../tools/net.js';
import Tooltip from '../../ui/tooltip.js';
import Automator from '../../components/automator.js';
import GIS from '../gis/gis.js';
import ChunkReader from '../../components/chunkReader.js';

export default Core.Templatable("Auto.GIS", class AutoGIS extends Automator { 

	get canvas() { return this.widget.canvas; }
	
	constructor(node, simulation, options, files) {
		if (!options) throw new Error("No options provided for the GIS widget");
		
		super(new GIS(node), simulation);
		
		this.config = options;		
		
		this.Load(options, files).then(data => {
			this.widget.Load(options, data, simulation).then(this.onMap_Ready.bind(this), this.OnMap_Error.bind(this));
		});
		
		this.simulation.On("Move", this.onSimulation_Move.bind(this));
		this.simulation.On("Jump", this.onSimulation_Jump.bind(this));
	}
	
	Load(config, files) {
		// Load all geojson data layers contained in visualization.json
		var defs = config.layers.map(l => {
			if (l.file) {
				Core.Log(`GIS`, `Loading layer ${l.id} from the files provided by user.`)
				var f = files.find((f) => f.name == l.file);
				
				if (f) return ChunkReader.Read(f, (json) => JSON.parse(json));
				
				if (!Core.URLs.models) { 
					throw new Error(`Required file for layer ${l.id} was not provided by the user. Unable to fall back on server-side load, Core root is not configured.`);
				}
				
				Core.Log(`GIS`, `Unable to find file for layer ${l.id} in the files provided by user.`);
				l.url = Core.URLs.models + "/" + l.file;
			}
			
			Core.Log(`GIS`, `Loading layer ${l.id} from the server.`);
			
			return Net.JSON(l.url);	
		});
		
		return Promise.all(defs);
	}
	
	onMap_Ready(ev) {		
		this.config.On("change", this.OnSettings_Change.bind(this));
		
		this.Emit("ready", { view:this });
	}
	
	Redraw() {
		this.widget.Draw(this.simulation.state.data);
	}
	
	Resize() {
		
	}
	
	onSimulation_Jump(ev) {
		this.widget.Draw(ev.state.data);
	}
	
	onSimulation_Move(ev) {
		var data = {};
		
		ev.frame.state_messages.forEach(t => data[t.model.id] = t.value);
		
		this.widget.Draw(data);
	}
	
	OnSettings_Change(ev) {			
		
	}
	
	OnMap_Error(error) {
		alert(error.toString());
	}
});