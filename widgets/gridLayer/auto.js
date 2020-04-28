'use strict';

import Lang from '../../utils/lang.js';
import Array from '../../utils/array.js';
import Dom from '../../utils/dom.js';
import Tooltip from '../../ui/tooltip.js';
import Grid from './grid.js';
import Automated from '../automated.js';
// import Recorder from '../../components/record.js';

export default Lang.Templatable("Auto.Grid", class AutoGrid extends Automated { 

	constructor(config, simulation) {
		super(new Grid(), simulation);
		
		// this.recorder = new Recorder(this.Widget.Canvas);

		this.z = config.z;
		
		var h1 = this.Widget.On("MouseMove", this.onMouseMove_Handler.bind(this));
		var h2 = this.Widget.On("MouseOut", this.onMouseOut_Handler.bind(this));
		var h3 = this.Widget.On("Click", this.onClick_Handler.bind(this));
		var h4 = this.Simulation.On("Move", this.onSimulationMove_Handler.bind(this));
		var h5 = this.Simulation.On("Jump", this.onSimulationJump_Handler.bind(this));
		var h6 = this.Simulation.On("RecordStart", this.onSimulationRecordStart_Handler.bind(this));
		var h7 = this.Simulation.On("RecordStop", this.onSimulationRecordStop_Handler.bind(this));
		var h8 = this.Simulation.palette.On("Change", this.onSimulationPaletteChanged_Handler.bind(this));
		
		this.Handle([h1, h2, h3, h4, h5, h6, h7, h8]);
		
		this.BuildTooltip();
	}
	
	Destroy() {
		super.Destroy();
	}
	
	BuildTooltip() {
		this.tooltip = new Tooltip(document.body);
		
		this.tooltip.nodes.label = Dom.Create("div", { className:"tooltip-label" }, this.tooltip.Node("content"));
	}
	
	Refresh() {
		this.Resize();
		this.Draw();
	}
	
	Resize() {
		var size = this.Simulation.size;
		
		size = Array.Map(size, function(s) { return (+s); });
		size = { x:size[0], y:size[1], z:size[2] };
		
		this.Widget.Resize(size);
	}
	
	Draw() {
		var s = this.Simulation;
		
		this.Widget.Draw(s.state, this.z, s.Palette, s);
	}

	onSimulationMove_Handler(ev) {	
		var s = this.Simulation;
		
		this.Widget.DrawChanges(ev.frame, this.z, s.Palette, s);
	}
	
	onSimulationJump_Handler(ev) {
		var s = this.Simulation;
		
		this.Widget.Draw(s.state, this.z, s.Palette, s);
	}
	
	onSimulationPaletteChanged_Handler(ev) {
		var s = this.Simulation;
		
		this.Widget.Draw(s.state, this.z, s.Palette, s);
	}
	
	onSimulationRecordStart_Handler(ev) {
		this.recorder.Start();	
	}
	
	onSimulationRecordStop_Handler(ev) {	
		this.recorder.Stop().then(function(ev) {
			this.recorder.Download(this.simulation.name);
		}.bind(this));	
	}
	
	onMouseMove_Handler(ev) {
		var id = ev.data.x + "-" + ev.data.y + "-" + this.z;
		var state = this.simulation.state.models[id];
		var subs = [ev.data.x, ev.data.y, this.z, state];
		
		this.tooltip.nodes.label.innerHTML = Lang.Nls("Widget_AutoGrid_Tooltip_Title", subs);
	
		this.tooltip.Show(ev.x + 20, ev.y);
	}
	
	onMouseOut_Handler(ev) {
		this.tooltip.Hide();
	}
	
	onClick_Handler(ev) {
		var id = ev.data.x + "-" + ev.data.y + "-" + this.z;
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
		
		this.Widget.DrawCellBorder(ev.data.x, ev.data.y, color);
	}
	
	Save() {
		return { name:"Auto.Grid", config:{ z:this.z }}
	}
});