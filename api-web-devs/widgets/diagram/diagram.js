'use strict';

import Core from '../../../api-basic/tools/core.js';
import Dom from '../../../api-basic/tools/dom.js';
import Templated from '../../../api-basic/components/templated.js';
import DiagramData from './diagramData.js';

export default Core.Templatable("Widgets.Diagram", class Diagram extends Templated { 

	constructor(node) {
		super(node);
	}
	
	SetDiagram(svg) {
		this.Elem('diagram').innerHTML = svg;
		
		this.Node('diagram').Elem("svg").setAttribute("preserveAspectRatio", "none");
		
		var models = this.Node('diagram').Elems("[type='atomic'],[type='coupled']");

		models.forEach((model) => {			
			model.addEventListener("mousemove", this.onSvgMouseMove_Handler.bind(this));
			model.addEventListener("click", this.onSvgClick_Handler.bind(this));
			model.addEventListener("mouseout", this.onSvgMouseOut_Handler.bind(this));
		});
		
		this.data = new DiagramData(this.Elem('diagram').firstElementChild);
	}
	
	SetCss() {
		var models = this.Node('diagram').Elems("[type='atomic'],[type='coupled']");
		
		models.forEach(m => this.AddModelCss(m, ["model"]));
	}
	
	onSvgMouseMove_Handler(ev) {
		var model = ev.target.getAttribute('name').toLowerCase();
				
		this.Emit("MouseMove", { x:ev.pageX, y:ev.pageY , model:model });
	}
		
	onSvgMouseOut_Handler(ev) {
		this.Emit("MouseOut", { x:ev.pageX, y:ev.pageY });
	}
	
	onSvgClick_Handler(ev) {
		var model = ev.target.getAttribute('name');
		
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
			
			else if (t.type == "X") this.DrawXTransition(t);
		});
	}

	DrawXTransition(t) {		
		var m = this.data.Model(t.destination);
		
		if (m) this.AddModelCss(m.node, ["highlighted", t.type]);
		
		var p = this.data.Port(t.destination, t.port);
		
		if (p) this.AddModelCss(p.node, ["highlighted", t.type]);
		
		var l = this.data.Link(t.destination, t.port, t.type);
		
		if (l) this.AddModelCss(l.node, ["highlighted", t.type]);	
		
		if (l && l.marker) this.AddModelCss(l.marker, ["highlighted", t.type]);	
	}

	DrawYTransition(t) {
		var m = this.data.Model(t.Id);
		
		if (m) this.AddModelCss(m.node, ["highlighted", t.type]);
		
		var p = this.data.Port(t.Id, t.port);
		
		if (p) this.AddModelCss(p.node, ["highlighted", t.type]);
		
		var l = this.data.Link(t.Id, t.port, t.type);
		
		if (l) this.AddModelCss(l.node, ["highlighted", t.type]);
		
		if (l && l.marker) this.AddModelCss(l.marker, ["highlighted", t.type]);	
	}

	AddModelCss(model, css) {
		css.forEach(c => model.classList.add(c));
	}
	
	RemoveModelCss(model, css) {
		css.forEach(c => model.classList.remove(c));
	}
	
	Reset() {
		this.data.Nodes().forEach(n => { this.RemoveModelCss(n, ["highlighted", "X", "Y"]); })
	}
});