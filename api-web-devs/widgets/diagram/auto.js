'use strict';

import Core from '../../../api-basic/tools/core.js';
import Dom from '../../../api-basic/tools/dom.js';
import Tooltip from '../../../api-basic/ui/tooltip.js';
import Diagram from './diagram.js';
import Automator from '../../components/automator.js';


export default Core.Templatable("Auto.Diagram", class AutoDiagram extends Automator { 

	constructor(diagram, simulation, options) {
		options = options || {};	// Default empty options if not provided
		
		super(diagram, simulation);
		
		this.Widget.SetDiagram(this.Simulation.diagram);
		
		this.Widget.Draw(this.Simulation.CurrentFrame().transitions);
		
		this.selected = [];

		this.AttachHandlers(options);
		
		this.UpdateSelected();

		this.tooltip = new Tooltip();
	}
	
	AttachHandlers(options) {
		var h = [];

		if (options.hoverEnabled != false) h.push(this.Widget.On("MouseMove", this.onMouseMove_Handler.bind(this)));
		if (options.hoverEnabled != false) h.push(this.Widget.On("MouseOut", this.onMouseOut_Handler.bind(this)));
		if (options.clickEnabled != false) h.push(this.Widget.On("Click", this.onClick_Handler.bind(this)));
		
		h.push(this.Simulation.On("Move", this.onSimulationMove_Handler.bind(this)));
		h.push(this.Simulation.On("Jump", this.onSimulationJump_Handler.bind(this)));
		h.push(this.Simulation.On("Selected", this.onSelected_Handler.bind(this)));
		
		this.Handle(h);
	}
	
	UpdateSelected() {
		this.selected = this.Simulation.Selected;
	}
		
	onSimulationJump_Handler(ev) {		
		var f = this.Simulation.frames[ev.state.i];
		
		// Shouldn't pass transition objects, diagram should be agnostic to transitions maybe?
		this.Widget.Draw(f.transitions);
	}
	
	onSimulationMove_Handler(ev) {
		var f = this.simulation.CurrentFrame();
		
		// Shouldn't pass transition objects, diagram should be agnostic to transitions maybe?
		this.Widget.Draw(f.transitions);
	}
	
	onSelected_Handler(ev) {
		var f = this.Simulation.frames[ev.state.i];
		
		// Shouldn't pass transition objects, diagram should be agnostic to transitions maybe?
		this.Widget.Draw(f.transitions);
	}
	
	onMouseMove_Handler(ev) {
		var f = this.Simulation.CurrentFrame();
		
		Dom.Empty(this.tooltip.Elem("content"));
		
		var tX = f.transitions.filter(t => t.Type == "X" && t.Destination == ev.model);
		var tY = f.transitions.filter(t => t.Type == "Y" && t.Model == ev.model);
		
		if (tX.length == 0 && tY.length == 0) return;
			
		tX.forEach(t => {
			var html = Core.Nls("Diagram_Tooltip_X", [t.Destination, t.Value, t.Model, t.Port]);
			
			Dom.Create("div", { className:"tooltip-label", innerHTML:html }, this.tooltip.Elem("content"));
		});
		
		tY.forEach(t => {
			var html = Core.Nls("Diagram_Tooltip_Y", [t.Model, t.Value, t.Destination, t.Port]);
			
			Dom.Create("div", { className:"tooltip-label", innerHTML:html }, this.tooltip.Elem("content"));
		});
		
		this.tooltip.Show(ev.x + 20, ev.y);
	}
	
	onClick_Handler(ev) {
		var idx = this.selected.indexOf(ev.model);

		// TODO : Selection should be handled by diagram, not auto class
		if (idx == -1) {
			this.selected.push(ev.model);
			
			this.Widget.AddModelCss(ev.svg, ["selected"]);
		}
		else {
			this.selected.splice(idx, 1);
			
			this.Widget.RemoveModelCss(ev.svg, ["selected"]);
		}
	}

	onMouseOut_Handler(ev) {
		this.tooltip.Hide();
	}
});