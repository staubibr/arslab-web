'use strict';

import Core from '../../../api-basic/tools/core.js';
import Dom from '../../../api-basic/tools/dom.js';
import Tooltip from '../../../api-basic/ui/tooltip.js';
import Grid from './grid.js';
import Automator from '../../components/automator.js';

export default Core.Templatable("Auto.Grid", class AutoGrid extends Automator { 

	constructor(grid, simulation, options) {
		options = options || {};	// Default empty options if not provided

		super(grid, simulation);
		
		this.AttachHandlers(options);
		
		this.BuildTooltip();
		
		this.Widget.Dimensions = this.simulation.Dimensions;
		this.Widget.Columns = options.columns;
		this.Widget.Spacing	= options.spacing;
		this.Widget.Layers	= options.layers;
		// this.Widget.Z = options.z;
		// this.Widget.Ports = options.ports;
		
		// this.z = options.z;
		// this.ports = options.ports;
	}
	
	AttachHandlers(options) {
		var h = [];
		
		if (options.hoverEnabled != false) h.push(this.Widget.On("MouseMove", this.onMouseMove_Handler.bind(this)));
		if (options.hoverEnabled != false) h.push(this.Widget.On("MouseOut", this.onMouseOut_Handler.bind(this)));
		if (options.clickEnabled != false) h.push(this.Widget.On("Click", this.onClick_Handler.bind(this)));
		
		h.push(this.Simulation.On("Move", this.onSimulationMove_Handler.bind(this)));
		h.push(this.Simulation.On("Jump", this.onSimulationJump_Handler.bind(this)));
		h.push(this.Simulation.palette.On("Change", this.onSimulationPaletteChanged_Handler.bind(this)));
		
		this.Handle(h);
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
		var labels = [];
		
		ev.data.layer.ports.forEach(port => {
			var state = this.simulation.state.GetValue([ev.data.x, ev.data.y, ev.data.layer.z], port);
			var subs = [ev.data.x, ev.data.y, ev.data.layer.z, state, port];
			
			labels.push(Core.Nls("Grid_Tooltip_Title", subs));
			
			this.tooltip.Show(ev.x + 20, ev.y);
		});
		
		this.tooltip.nodes.label.innerHTML = labels.join("<br>");
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