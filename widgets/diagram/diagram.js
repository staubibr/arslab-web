'use strict';

import Core from '../../../basic-tools/tools/core.js';
import Dom from '../../../basic-tools/tools/dom.js';
import Templated from '../../../basic-tools/components/templated.js';
import DiagramData from './diagramData.js';

export default Core.Templatable("Widgets.Diagram", class Diagram extends Templated { 

	constructor(node) {
		super(node);
	}
	
	SetSVG(svg) {
		this.Elem('diagram').innerHTML = svg;
		
		var models = this.Node('diagram').Elems("[type='atomic'],[type='coupled']");

		models.forEach((model) => {			
			model.addEventListener("mousemove", this.onSvgMouseMove_Handler.bind(this));
			model.addEventListener("click", this.onSvgClick_Handler.bind(this));
			model.addEventListener("mouseout", this.onSvgMouseOut_Handler.bind(this));
		});
		
		this.data = new DiagramData(this.Elem('diagram').firstElementChild);
	}
	
	onSvgMouseMove_Handler(ev) {
		var model = ev.target.getAttribute('name');
		
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
		return "<div class='devs-diagram'>" + 
				  "<div handle='diagram-container' class='devs-diagram-container'>" +
					"<div handle='diagram' ></div>" +
				  "</div>" + 
			   "</div>";
	}

	Resize() {
		this.size = Dom.Geometry(this.Node("diagram-container"));
		
		var pH = 30;
		var pV = 30;
		
		this.Node("diagram").style.margin = `${pV}px ${pH}px`;
		this.Node("diagram").style.width = `${(this.size.w - (30))}px`;	
		this.Node("diagram").style.height = `${(this.size.h - (30))}px`;
	}
	
	Draw(transitions) {
		this.Reset();
		
		transitions.forEach((t) => {
			var m = this.data.Model(t.id);
			
			if (!m) return;
		
			this.AddModelCss(m.node, "highlighted");
			
			var p = this.data.Port(t.id, t.port);
			
			if (!p) return;
		
			this.AddModelCss(p.node, "highlighted");
			
			var l = this.data.OutputLink(t.id, t.port);
			
			if (!l) return;
		
			this.AddModelCss(l.node, "highlighted");
		});
	}

	AddModelCss(model, css) {
		model.classList.add(css);
	}
	
	RemoveModelCss(model, css) {
		model.classList.remove(css);
	}
	
	Reset() {
		for (var name in this.data.models) {
			this.RemoveModelCss(this.data.models[name].node, "highlighted");
		}
		
		for (var id in this.data.ports) {
			this.RemoveModelCss(this.data.ports[id].node, "highlighted");
		}
		
		for (var id in this.data.links) {
			this.RemoveModelCss(this.data.links[id].node, "highlighted");
		}
	}
});