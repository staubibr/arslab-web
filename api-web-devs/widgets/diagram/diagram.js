'use strict';

import Core from '../../tools/core.js';
import Dom from '../../tools/dom.js';
import Templated from '../../components/templated.js';

export default Core.Templatable("Widgets.Diagram", class Diagram extends Templated { 

	get canvas() { return this.Elem("canvas"); }

	get svg() { return this.simulation.diagram; }

	constructor(node) {
		super(node);
	}

	SetDiagram(simulation) {
		this.simulation = simulation;
		
		this._svg = { dests: {}, origins: {} };
		
		this.LoadOriginSVGNodes();
		this.LoadDestinationSVGs();
		
		Dom.Empty(this.Elem('diagram'));
		
		this.Elem('diagram').appendChild(this.svg);
		
		this.svg.setAttribute("preserveAspectRatio", "none");

		this.SetPointerEvents();
	}
	
	SetPointerEvents() {		
		this.svg.querySelectorAll("*").forEach(n => {			
			n.style.cursor = "none";
			n.style.pointerEvents = "none";
		});
		
		this.svg.querySelectorAll("[devs-model-id]").forEach(n => {
			n.style.cursor = "pointer";
			n.style.pointerEvents = "all"
			
			n.addEventListener("mousemove", this.onSvgMouseMove_Handler.bind(this, n));
			n.addEventListener("click", this.onSvgClick_Handler.bind(this, n));
			n.addEventListener("mouseout", this.onSvgMouseOut_Handler.bind(this, n));
		});
	}
	
	GetLinkSVGNodes(l) {
		var selector = `[devs-link-mA=${l.modelA.id}][devs-link-pA=${l.portA.name}]`;
		
		return Array.from(this.svg.querySelectorAll(selector));
	}
	
	GetPortSVGNodes(m, p) {
		var selector = `[devs-model-id=${m.id}],[devs-port-model=${m.id}][devs-port-name=${p.name}]`;
		
		return Array.from(this.svg.querySelectorAll(selector));
	}
	
	LoadOriginSVGNodes() {
		this.simulation.models.forEach(m => {
			m.ports.forEach(p => {
				if (!this._svg.origins[m.id]) this._svg.origins[m.id] = {};

				var nodes = this.GetPortSVGNodes(m, p);
				
				m.PortLinks(p).forEach(l => nodes = nodes.concat(this.GetLinkSVGNodes(l)));
				
				this._svg.origins[m.id][p.name] = nodes;
			});
		});
	}
	
	LoadDestinationSVGs() {
		this.simulation.models.forEach(m => {
			m.ports.forEach(p => {
				if (!this._svg.dests[m.id]) this._svg.dests[m.id] = {};
				
				var links = m.PortLinks(p);
				
				for (var i = 0; i < m.PortLinks(p).length; i++) {
					var mB = links[i].modelB;
					var pB = links[i].portB;
					
					if (mB.type == "atomic") continue;
					
					links = links.concat(mB.PortLinks(pB));
				}
				
				var svg = [];
				
				links.forEach(l => {
					svg = svg.concat(this.GetLinkSVGNodes(l));
					svg = svg.concat(this.GetPortSVGNodes(l.modelB, l.portB));
				});
				
				this._svg.dests[m.id][p.name] = Array.from(svg);
			});
		});
	}
	
	GetDestination(model, port) {
		return this._svg.dests[model.id][port.name];
	}
	
	GetOrigin(model, port) {
		return this._svg.origins[model.id][port.name];
	}
	
	onSvgMouseMove_Handler(node, ev) {
		var id = node.getAttribute("devs-model-id");
		
		this.Emit("MouseMove", { x:ev.pageX, y:ev.pageY, model:this.simulation.Model(id), svg:ev.target });
	}
		
	onSvgMouseOut_Handler(node, ev) {
		var id = node.getAttribute("devs-model-id");
		
		this.Emit("MouseOut", { x:ev.pageX, y:ev.pageY, model:this.simulation.Model(id), svg:ev.target });
	}
	
	onSvgClick_Handler(node, ev) {	
		var id = node.getAttribute("devs-model-id");
		
		this.Emit("Click", { x:ev.pageX, y:ev.pageY, model:this.simulation.Model(id), svg:ev.target });
	}

	Resize() {		
		this.size = Dom.Geometry(this.Elem("diagram"));
		
		var pH = 30;
		var pV = 30;

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
		
		messages.forEach((m) => this.DrawYMessage(m));
		
		this.DrawToCanvas(this.svg);
	}
	
	DrawYMessage(message) {
		var p = message.port;
		var m = message.model;

		this.AddCss(this.GetOrigin(m, p), ["highlighted", "origin"]);
		
		this.AddCss(this.GetDestination(m, p), ["highlighted"]);		
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
		for (var m in this._svg.dests) {
			for (var p in this._svg.dests[m]) {
				this.RemoveCss(this._svg.dests[m][p], ["highlighted", "origin"]);
			}
		}
		
		for (var m in this._svg.origins) {
			for (var p in this._svg.origins[m]) {
				this.RemoveCss(this._svg.origins[m][p], ["highlighted", "origin"]);
			}
		}
	}
		
	Template() {
		return "<div>" +
				   "<div handle='diagram' class='diagram-container'></div>" +
				   "<canvas handle='canvas' class='diagram-canvas hidden'></canvas>" +
			   "</div>";
	}
});