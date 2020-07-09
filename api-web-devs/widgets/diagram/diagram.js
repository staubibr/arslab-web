'use strict';

import Core from '../../tools/core.js';
import Dom from '../../tools/dom.js';
import Templated from '../../components/templated.js';

export default Core.Templatable("Widgets.Diagram", class Diagram extends Templated { 

	constructor(node) {
		super(node);
	}

	GetNodes(root, items) {
		var selector = model.svg.map(s => `#{s}`);
		
		return root.querySelectorAll(selector);
	}

	SetDiagram(Simulation) {

		this.Elem('diagram').innerHTML = Simulation.diagram;
		
		this.Node('diagram').Elem("svg").setAttribute("preserveAspectRatio", "none");
		
		this.Simulation = Simulation;
		
		this.Simulation.models.forEach(model => {
			var nodes = this.Elem('diagram').querySelectorAll(model.svg);

			nodes.forEach(n => {	
				n.addEventListener("mousemove", this.onSvgMouseMove_Handler.bind(this, model));
				n.addEventListener("click", this.onSvgClick_Handler.bind(this, model));
				n.addEventListener("mouseout", this.onSvgMouseOut_Handler.bind(this, model));
			});
		});
	}
	
	onSvgMouseMove_Handler(model, ev) {
		this.Emit("MouseMove", { x:ev.pageX, y:ev.pageY , model:model, svg:ev.target });
	}
		
	onSvgMouseOut_Handler(model, ev) {
		this.Emit("MouseOut", { x:ev.pageX, y:ev.pageY, model:model, svg:ev.target });
	}
	
	onSvgClick_Handler(model, ev) {				
		this.Emit("Click", { x:ev.pageX, y:ev.pageY , model:model, svg:ev.target });
	}
		
	Template() {
		return "<div handle='diagram' class='diagram-container'></div>";
	}

	Resize() {
		this.size = Dom.Geometry(this.Node("diagram"));
		
		var pH = 30;
		var pV = 30;
		
		this.Node("diagram").style.margin = `${pV}px ${pH}px`;
		this.Node("diagram").style.width = `${(this.size.w - (30))}px`;	
		this.Node("diagram").style.height = `${(this.size.h - (30))}px`;
	}
	
	Draw(transitions) {
		this.Reset();
		
		transitions.forEach((t) => {
			if (t.type == "Y") this.DrawYTransition(t);
			
			// else if (t.type == "X") this.DrawXTransition(t);
		});
	}
	
	DrawYTransition(t) {  
		var m = this.Simulation.Model(t.Id);
		var p = m.Port(t.port);
				
		this.AddModelCss(m.OutputPath(t.port), ["highlighted"]);
		
		var origin = []
		
		if (m) origin = origin.concat(m.svg);
		if (p) origin = origin.concat(p.svg);
		
		this.AddModelCss(origin, ["origin"]);
	}

	AddModelCss(models, css) {		
		this.Elem("diagram").querySelectorAll(models).forEach(node => {
			css.forEach(c => node.classList.add(c));
		});
	}
	
	RemoveModelCss(models, css) {
		this.Elem("diagram").querySelectorAll(models).forEach(node => {
			css.forEach(c => node.classList.remove(c));
		});
	}
	
	Reset() {
		// Collect all nodes then clean them
		var selector = [];
		
		this.Simulation.Models.forEach(m => {
			selector = selector.concat(m.svg);
			
			m.ports.forEach(p => selector = selector.concat(p.svg));
			m.links.forEach(l => selector = selector.concat(l.svg));
		});
		
		this.RemoveModelCss(selector, ["highlighted", "origin"]);
	}
});