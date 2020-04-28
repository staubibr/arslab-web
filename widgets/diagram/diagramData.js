'use strict';

export default class DiagramData { 

	constructor(svg) {		
		svg.setAttribute("width", "100%");
		svg.setAttribute("height", "100%");
		svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
	
		this.models = {};
		this.ports = {};
		this.links = {};
		
		this.SetModels(svg);
		this.SetPorts(svg);
		this.SetLinks(svg);
	}
	
	SetModels(svg) {
		var models = svg.querySelectorAll('[type="atomic"],[type="coupled"]');
		
		models.forEach((node) => {
			var id = node.getAttribute("id");
			var type = node.getAttribute("type");
			var name = node.getAttribute("name").toLowerCase();
			
			this.models[name] = { id:id, name:name, type:type, node:node, ports:{} };
		});
	}
	
	SetPorts(svg) {
		var ports = svg.querySelectorAll('[type="iPort"],[type="oPort"]');
		
		ports.forEach((node) => {
			var id = node.getAttribute("id");
			var type = node.getAttribute("type");
			var name = node.getAttribute("name").toLowerCase();
			var model = node.getAttribute("model").toLowerCase();
			
			var m = this.ModelById(model);
			
			if (!m) return;
			
			this.ports[id] = { id:id, name:name, model:m, type:type, node:node };
			
			m.ports[name] = this.ports[id];
			
			// node.addEventListener("mousemove", this.onSvgMouseMove_Handler.bind(this));
			// node.addEventListener("click", this.onSvgClick_Handler.bind(this));
			// node.addEventListener("mouseout", this.onSvgMouseOut_Handler.bind(this));
		});
	}
	
	SetLinks(svg) {
		var links = svg.querySelectorAll('[type="link"]');
		
		links.forEach((node) => {
			var id = node.getAttribute("id");
			var type = node.getAttribute("type");
			var portA = node.getAttribute("porta").toLowerCase();
			var portB = node.getAttribute("portb").toLowerCase();
			
			var pA = this.ports[portA] || null;
			var pB = this.ports[portB] || null;
			
			this.links[id] = { type:type, portA:pA, portB:pB, node:node };
						
			// node.addEventListener("mousemove", this.onSvgMouseMove_Handler.bind(this));
			// node.addEventListener("click", this.onSvgClick_Handler.bind(this));
			// node.addEventListener("mouseout", this.onSvgMouseOut_Handler.bind(this));
		});
	}
	
	Model(model) {
		return this.models[model] || null;
	}
	
	Port(model, port) {
		var m = this.Model(model);
		
		if (!m) return null;
		
		return m.ports[port] || null;
	}
	
	OutputLink(model, port) {
		var m = this.Model(model);
		
		if (!m) return null;
		
		var p = m.ports[port] || null;
		
		if (!p) return null;
				
		return this.LinkByPortA(p);
	}
	
	ModelById(id) {
		for (var name in this.models) {
			if (this.models[name].id === id) return this.models[name];
		}
		
		return null;
	}
	
	PortById(id) {
		return this.ports[id] || null;
	}
	
	LinkById(id) {
		return this.links[id] || null;
	}
	
	LinkByPortA(port) {
		for (var id in this.links) {
			if (this.links[id].portA.id === port.id) return this.links[id];
		}
		
		return null;
	}
	
	LinkByPortB(port) {
		for (var id in this.links) {
			if (this.links[id].portB.id === port.id) return this.links[id];
		}
		
		return null;
	}
};