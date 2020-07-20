'use strict';

import Core from '../../tools/core.js';
import Dom from '../../tools/dom.js';
import Templated from '../../components/templated.js';

export default Core.Templatable("Widgets.Diagram", class Diagram extends Templated { 

	constructor(node) {
		super(node);
	}

	SetDiagram(simulation) {
		Dom.Empty(this.Elem('diagram'));
		
		this.Elem('diagram').appendChild(simulation.Diagram);
		
		this.Node('diagram').Elem("svg").setAttribute("preserveAspectRatio", "none");
		
		this.Simulation = simulation;
		
		this.Simulation.models.forEach(model => {
			model.svg.forEach(n => {	
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
			this.DrawYTransition(t);
		});
	}
	
	DrawYTransition(t) {  
		var m = this.Simulation.Model(t.Id);
		var p = m.Port(t.port);
		
		if (m) {
			this.AddCss(m.OutputPath(t.port), ["highlighted"]);
			
			this.AddCss(m.svg, ["origin"]);
		}
		
		if (p) this.AddCss(p.svg, ["origin"]);
				
		m.PortLinks(p.name).forEach(l => this.AddCss(l.svg, ["origin"]));
	}

	AddCss(nodes, css) {		
		nodes.forEach(node => {
			css.forEach(c => node.classList.add(c));
		});
	}
	
	RemoveCss(nodes, css) {
		nodes.forEach(node => {
			css.forEach(c => node.classList.remove(c));
		});
	}
	
	Reset() {
		// Collect all nodes then clean them
		var selector = [];
		
		this.Simulation.Models.forEach(m => {
			this.RemoveCss(m.svg, ["highlighted", "origin"]);
						
			m.ports.forEach(p => this.RemoveCss(p.svg, ["highlighted", "origin"]));
			m.links.forEach(l => this.RemoveCss(l.svg, ["highlighted", "origin"]));
		});
	}
});