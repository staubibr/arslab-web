'use strict';

import Core from '../../tools/core.js';
import Dom from '../../tools/dom.js';
import Tooltip from '../../ui/tooltip.js';
import Automator from '../../components/automator.js';
import Diagram from '../diagram/diagram.js';

export default Core.Templatable("Auto.Diagram", class AutoDiagram extends Automator { 

	constructor(node, simulation, options) {
		if (!options) throw new Error("No options provided for the Diagram widget");
		
		super(new Diagram(node), simulation);
		
		this.options = options;
		
		this.Widget.SetDiagram(this.Simulation);
		
		this.Widget.Draw(this.Simulation.CurrentFrame.OutputMessages);
		
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
		
		h.push(this.Simulation.On("Move", this.onSimulationChange_Handler.bind(this)));
		h.push(this.Simulation.On("Jump", this.onSimulationChange_Handler.bind(this)));
		h.push(this.Simulation.On("Selected", this.onSimulationChange_Handler.bind(this)));
		
		options.On("Change", this.OnSettings_Change.bind(this));
		
		this.Handle(h);
	}
	
	UpdateSelected() {
		this.selected = this.Simulation.Selected;
	}
	
	Resize() {
		var size = this.options.DiagramSize(this.simulation);
		
		this.Widget.container.style.width = size.width + "px";
		this.Widget.container.style.height = size.height + "px";	
	}
	
	Redraw() {
		this.Widget.Resize();
	}
	
	OnSettings_Change(ev) {
		if (["height", "width", "aspect"].indexOf(ev.property) == -1) return;

		this.Resize();
		this.Redraw();
	}
		
	onSimulationChange_Handler(ev) {		
		var messages = this.simulation.CurrentFrame.OutputMessages;
		
		this.Widget.Draw(messages);
	}
	
	onMouseMove_Handler(ev) {
		var messages = this.Simulation.CurrentFrame.OutputMessages;
		
		Dom.Empty(this.tooltip.Elem("content"));
		
		var tY = messages.filter(t => t.Emitter.Model.Name == ev.model.Name);
		
		if (tY.length == 0) return;
		
		tY.forEach(t => {
			var subs = [t.Emitter.Model.Name, t.Value.value, t.Emitter.Name];
			var html = this.nls.Ressource("Diagram_Tooltip_Y", subs);
			
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
	
	static Nls() {
		return {
			"Diagram_Tooltip_Y" : {
				"en" : "<b>{0}</b> emitted an output (<b>{1}</b>) through port <b>{2}</b>"		
			}
		}
	}
});