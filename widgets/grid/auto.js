'use strict';

import Core from '../../../basic-tools/tools/core.js';
import Dom from '../../../basic-tools/tools/dom.js';
import Tooltip from '../../../basic-tools/ui/tooltip.js';
import Grid from './grid.js';
import Automator from '../../components/automator.js';

export default Core.Templatable("Auto.Grid", class AutoGrid extends Automator { 

	constructor(grid, simulation, config) {
		super(grid, simulation);
		
		var h1 = this.Widget.On("MouseMove", this.onMouseMove_Handler.bind(this));
		var h2 = this.Widget.On("MouseOut", this.onMouseOut_Handler.bind(this));
		var h3 = this.Widget.On("Click", this.onClick_Handler.bind(this));
		var h4 = this.Simulation.On("Move", this.onSimulationMove_Handler.bind(this));
		var h5 = this.Simulation.On("Jump", this.onSimulationJump_Handler.bind(this));
		var h6 = this.Simulation.palette.On("Change", this.onSimulationPaletteChanged_Handler.bind(this));
		
		this.Handle([h1, h2, h3, h4, h5, h6]);
		
		this.BuildTooltip();
		
		this.Widget.Dimensions = this.simulation.Dimensions;
		this.Widget.Columns = config.columns;
		this.Widget.Spacing	= config.spacing;
		this.Widget.Z = config.z;
	}
		
	BuildTooltip() {
		this.tooltip = new Tooltip();
		
		this.tooltip.nodes.label = Dom.Create("div", { className:"tooltip-label" }, this.tooltip.Elem("content"));
	}
	
	Redraw() {
		this.Widget.Resize();
		
		var s = this.Simulation;
		
		this.Widget.DrawState(s.state, s.Palette, s);
	}

	onSimulationMove_Handler(ev) {	
		var s = this.Simulation;
		
		this.Widget.DrawChanges(ev.frame, s.Palette, s);
	}
	
	onSimulationJump_Handler(ev) {
		var s = this.Simulation;
		
		this.Widget.DrawState(s.state, s.Palette, s);
	}
	
	onSimulationPaletteChanged_Handler(ev) {
		var s = this.Simulation;
		
		this.Widget.DrawState(s.state, s.Palette, s);
	}
	
	onMouseMove_Handler(ev) {
		var id = ev.data.x + "-" + ev.data.y + "-" + this.z;
		var state = this.simulation.state.models[id];
		var subs = [ev.data.x, ev.data.y, this.z, state];
		
		this.tooltip.nodes.label.innerHTML = Core.Nls("Grid_Tooltip_Title", subs);
	
		this.tooltip.Show(ev.x + 20, ev.y);
	}
	
	onMouseOut_Handler(ev) {
		this.tooltip.Hide();
	}
	
	onClick_Handler(ev) {
		var id = ev.data.x + "-" + ev.data.y + "-" + ev.data.z;
		var isSelected = this.Simulation.IsSelected(id);		
		
		if (!isSelected) {
			this.Simulation.Select(id);
			
			var color = this.Simulation.Palette.SelectedColor;
		} 
		
		else {
			this.Simulation.Deselect(id);

			var v = this.simulation.state.models[id];
			
			var color = this.Simulation.Palette.GetColor(v);
		}
		
		this.Widget.DrawCellBorder(ev.data.x, ev.data.y, ev.data.k, color);
	}
	
	/*
	import Recorder from '../../components/record.js';
		
	this.recorder = new Recorder(this.Widget.Canvas);

	var h6 = this.Simulation.On("RecordStart", this.onSimulationRecordStart_Handler.bind(this));
	var h7 = this.Simulation.On("RecordStop", this.onSimulationRecordStop_Handler.bind(this));
		
	onSimulationRecordStart_Handler(ev) {
		this.recorder.Start();	
	}
	
	onSimulationRecordStop_Handler(ev) {	
		this.recorder.Stop().then(function(ev) {
			this.recorder.Download(this.simulation.name);
		}.bind(this));	
	}
	*/
});