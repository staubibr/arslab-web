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
		
		this.widget.SetDiagram(this.simulation);
		
		this.widget.Draw(this.simulation.current_frame.output_messages);
		
		this.selected = [];

		this.AttachHandlers(options);
		
		this.UpdateSelected();

		this.tooltip = new Tooltip();
	}
	
	AttachHandlers(options) {
		var h = [];

		if (options.hoverEnabled != false) h.push(this.widget.On("MouseMove", this.onMouseMove_Handler.bind(this)));
		if (options.hoverEnabled != false) h.push(this.widget.On("MouseOut", this.onMouseOut_Handler.bind(this)));
		if (options.clickEnabled != false) h.push(this.widget.On("Click", this.onClick_Handler.bind(this)));
		
		h.push(this.simulation.On("Move", this.onSimulationChange_Handler.bind(this)));
		h.push(this.simulation.On("Jump", this.onSimulationChange_Handler.bind(this)));
		h.push(this.simulation.On("Selected", this.onSimulationChange_Handler.bind(this)));
		
		options.On("change", this.OnSettings_Change.bind(this));
		
		this.Handle(h);
	}
	
	UpdateSelected() {
		this.selected = this.simulation.selected;
	}
	
	Resize() {
		var size = this.options.DiagramSize(this.simulation);
		
		this.widget.container.style.width = size.width + "px";
		this.widget.container.style.height = size.height + "px";	
	}
	
	Redraw() {
		this.widget.Resize();
	}
	
	OnSettings_Change(ev) {
		if (["height", "width", "aspect"].indexOf(ev.property) == -1) return;

		this.Resize();
		this.Redraw();
	}
		
	onSimulationChange_Handler(ev) {		
		var messages = this.simulation.current_frame.output_messages;
		
		this.widget.Draw(messages);
	}
	
	onMouseMove_Handler(ev) {
		var messages = this.simulation.current_frame.output_messages;
		
		Dom.Empty(this.tooltip.Elem("content"));
		
		var tY = messages.filter(t => t.emitter.model.id == ev.model.id);
		
		if (tY.length == 0) return;
		
		tY.forEach(t => {
			var value = JSON.stringify(t.value);
			var subs = [t.emitter.model.id, value, t.emitter.name];
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
			
			this.widget.AddModelCss(ev.svg, ["selected"]);
		}
		else {
			this.selected.splice(idx, 1);
			
			this.widget.RemoveModelCss(ev.svg, ["selected"]);
		}
	}

	onMouseOut_Handler(ev) {
		this.tooltip.Hide();
	}
	
	static Nls() {
		return {
			"Diagram_Tooltip_Y" : {
				"en" : "<b>{0}</b> emitted <b>{1}</b> through port <b>{2}</b>"		
			}
		}
	}
});