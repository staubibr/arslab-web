'use strict';

import Core from '../../../basic-tools/tools/core.js';
import Dom from '../../../basic-tools/tools/dom.js';
import Tooltip from '../../../basic-tools/ui/tooltip.js';
import Diagram from './diagram.js';
import Automator from '../../components/automator.js';


export default Core.Templatable("Auto.Diagram", class AutoDiagram extends Automator { 

	constructor(diagram, simulation) {
		super(diagram, simulation);
		
		this.Widget.SetDiagram(this.Simulation.diagram);
		
		this.Widget.Draw(this.Simulation.CurrentFrame().transitions);
		
		this.selected = [];

		var h1 = this.Widget.On("MouseMove", this.onMouseMove_Handler.bind(this));
		var h2 = this.Widget.On("MouseOut", this.onMouseOut_Handler.bind(this));
		var h3 = this.Widget.On("Click", this.onClick_Handler.bind(this));
		var h4 = this.Simulation.On("Move", this.onSimulationMove_Handler.bind(this));
		var h5 = this.Simulation.On("Jump", this.onSimulationJump_Handler.bind(this));
		var h6 = this.Simulation.On("Selected", this.onSelected_Handler.bind(this));
		
		this.Handle([h1, h2, h3, h4, h5,h6]);
		
		this.UpdateSelected();
		this.BuildTooltip();
	}
	
	UpdateSelected() {
		this.selected = this.Simulation.Selected;
	}
		
	BuildTooltip() {
		this.tooltip = new Tooltip();
		
		this.tooltip.nodes.label = Dom.Create("div", { className:"tooltip-label" }, this.tooltip.Elem("content"));
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
		var subs = [ev.model, this.Simulation.state.models[ev.model]];
		
		this.tooltip.nodes.label.innerHTML = Core.Nls("DEVS_Diagram_Tooltip", subs);
	
		this.tooltip.Show(ev.x + 20, ev.y);
	}
	
	onClick_Handler(ev) {
		var idx = this.selected.indexOf(ev.model);

		// TODO : Selection should be handled by diagram, not auto class
		if (idx == -1) {
			this.selected.push(ev.model);
			
			this.Widget.AddModelCss(ev.svg, "selected");
		}
		else {
			this.selected.splice(idx, 1);
			
			this.Widget.RemoveModelCss(ev.svg, "selected");
		}
	}

	onMouseOut_Handler(ev) {
		this.tooltip.Hide();
	}
});