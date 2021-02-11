'use strict';

import Core from '../../tools/core.js';
import Dom from '../../tools/dom.js';
import Tooltip from '../../ui/tooltip.js';
import Automator from '../../components/automator.js';
import Styler from '../../components/styler.js';
import Grid from '../grid/grid.js';

export default Core.Templatable("Auto.Grid", class AutoGrid extends Automator { 

	get Canvas() { return this.Widget.Canvas; }

	constructor(node, simulation, options) {
		if (!options) throw new Error("No options provided for the Grid widget");
		
		super(new Grid(node), simulation);
		
		this.options = options;
				
		this.Widget.Dimensions = this.simulation.Dimensions;
		this.Widget.Columns = options.columns;
		this.Widget.Spacing	= options.spacing;
		this.Widget.Layers	= options.layers;
		this.Widget.Styles	= options.styles;
		
		this.AttachHandlers(options);
		
		this.BuildTooltip();
	}
	
	AttachHandlers(options) {
		var h = [];
		
		if (options.hoverEnabled != false) h.push(this.Widget.On("MouseMove", this.onMouseMove_Handler.bind(this)));
		if (options.hoverEnabled != false) h.push(this.Widget.On("MouseOut", this.onMouseOut_Handler.bind(this)));
		if (options.clickEnabled != false) h.push(this.Widget.On("Click", this.onClick_Handler.bind(this)));
		
		h.push(this.Simulation.On("Move", this.onSimulationMove_Handler.bind(this)));
		h.push(this.Simulation.On("Jump", this.onSimulationJump_Handler.bind(this)));
		
		h.push(this.Widget.Styler.On("Change", this.onSimulationPaletteChanged_Handler.bind(this)));
		
		options.On("Change", this.OnSettings_Change.bind(this));
		
		this.Handle(h);
	}
	
	BuildTooltip() {
		this.tooltip = new Tooltip();
		
		this.tooltip.nodes.label = Dom.Create("div", { className:"tooltip-label" }, this.tooltip.Elem("content"));
	}
	
	Resize() {
		var n = this.Widget.layers.length;
		var size = this.options.CanvasSize(this.Simulation, n);
			
		this.Widget.container.style.width = size.width + "px";
		this.Widget.container.style.height = size.height + "px";	
	}
	
	Redraw() {
		this.Widget.Resize();
		
		this.Widget.DrawState(this.Simulation.state, this.Simulation);
	}
	
	OnSettings_Change(ev) {			
		var check = ["height", "width", "columns", "spacing", "aspect", "layers"];

		if (check.indexOf(ev.property) == -1) return;
		
		this.Widget.Columns = this.options.columns;
		this.Widget.Spacing = this.options.spacing;
		this.Widget.Layers = this.options.layers;
		this.Widget.Styles = this.options.styles;
			
		this.Resize();
		this.Redraw();
	}
	
	onSimulationMove_Handler(ev) {		
		var s = this.Simulation;
		
		this.Widget.DrawChanges(ev.frame, s);
	}
	
	onSimulationJump_Handler(ev) {
		var s = this.Simulation;
		
		this.Widget.DrawState(s.state, s);
	}
	
	onSimulationPaletteChanged_Handler(ev) {
		var s = this.Simulation;
		
		this.Widget.DrawState(s.state, s);
	}
	
	onMouseMove_Handler(ev) {
		var labels = [];
		
		ev.data.layer.ports.forEach(port => {
			var state = this.simulation.state.GetValue([ev.data.x, ev.data.y, ev.data.layer.z]);
			var subs = [ev.data.x, ev.data.y, ev.data.layer.z, state[port], port];
			
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
});