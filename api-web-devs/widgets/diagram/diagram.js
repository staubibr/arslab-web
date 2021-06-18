'use strict';

import Core from '../../tools/core.js';
import Dom from '../../tools/dom.js';
import Templated from '../../components/templated.js';

export default Core.Templatable("Widgets.Diagram", class Diagram extends Templated { 

	get canvas() { return this.Elem("canvas"); }

	constructor(node) {
		super(node);
	}

	SetDiagram(simulation) {
		Dom.Empty(this.Elem('diagram'));
		
		this.Elem('diagram').appendChild(simulation.diagram);
		
		this.Node('diagram').Elem("svg").setAttribute("preserveAspectRatio", "none");
		
		this.simulation = simulation;
		
		this.simulation.models.forEach(model => {
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
		return "<div>" +
				   "<div handle='diagram' class='diagram-container'></div>" +
				   "<canvas handle='canvas' class='diagram-canvas hidden'></canvas>" +
			   "</div>";
	}

	Resize() {
		this.size = Dom.Geometry(this.Elem("diagram"));
		
		var pH = 30;
		var pV = 30;
		
		// this.Elem("diagram").style.margin = `${pV}px ${pH}px`;
		// this.Elem("diagram").style.width = `${(this.size.w - (30))}px`;	
		// this.Elem("diagram").style.height = `${(this.size.h - (30))}px`;
		this.Elem("canvas").setAttribute('width', this.size.w);	
		this.Elem("canvas").setAttribute('height', this.size.h);
	}
		
	DrawToCanvas(node) {
		var serializer = new XMLSerializer();
		var source = serializer.serializeToString(node);
		var canvas = this.Elem("canvas");
		
		// create a file blob of our SVG.
		var blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
		var url = window.URL.createObjectURL(blob);
		
		var img = new Image();

		img.onload = function() {
			var ctx = canvas.getContext('2d');
			
			ctx.fillStyle = "#f9f9f9";
			ctx.fillRect(0, 0, canvas.getAttribute("width"), canvas.getAttribute("height"));
			ctx.drawImage(img, 0, 0, canvas.getAttribute("width"), canvas.getAttribute("height"));
			
			window.URL.revokeObjectURL(url);
		}
		
		img.src = url;
	}
	
	Draw(messages) {
		this.Reset();
		
		messages.forEach((m) => {
			this.DrawYMessage(m);
		});
		
		this.DrawToCanvas(this.Node('diagram').Elem("svg"));
	}
	
	DrawYMessage(message) {  
		var p = message.emitter;
		var m = p && p.model;

		if (p) this.AddCss(p.svg, ["origin"]);
			
		if (m) {
			this.AddCss(this.OutputPath(m, p), ["highlighted"]);
			
			this.AddCss(m.svg, ["origin"]);
		}
		
		this.simulation.structure.PortLinks(m, p).forEach(l => this.AddCss(l.svg, ["origin"]));
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
		
		this.simulation.models.forEach(m => {
			this.RemoveCss(m.svg, ["highlighted", "origin"]);
			
			m.ports.forEach(p => this.RemoveCss(p.svg, ["highlighted", "origin"]));
			m.links.forEach(l => this.RemoveCss(l.svg, ["highlighted", "origin"]));
		});
	}
	
	OutputPath(model, port) {
		var svg = model.svg.concat(port.svg);
		var links = this.simulation.structure.PortLinks(model, port);
		
		for (var i = 0; i < links.length; i++) {
			var l = links[i];
			
			svg = svg.concat(l.svg);
			svg = svg.concat(l.portB.svg);			
			svg = svg.concat(l.modelB.svg);
			
			if (l.modelB.type == "atomic") continue;
			
			links = links.concat(this.simulation.structure.PortLinks(l.modelB, l.portB));
		}
		
		return svg;
	}
});