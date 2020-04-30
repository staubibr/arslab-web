'use strict';

export default class DiagramData { 

	constructor(svg) {		
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
		});
	}
	
	SetLinks(svg) {
		var links = svg.querySelectorAll('[type="link"]');
		
		links.forEach((node) => {
			var id = node.getAttribute("id");
			var type = node.getAttribute("type");
			var portA = node.getAttribute("porta").toLowerCase();
			var portB = node.getAttribute("portb").toLowerCase();

			var markerEnd = node.style["marker-end"];
			
			var marker = markerEnd ? svg.querySelector(`${markerEnd.slice(5, -2)} > *`) : null;
			
			var pA = this.ports[portA] || null;
			var pB = this.ports[portB] || null;
			
			this.links[id] = { type:type, portA:pA, portB:pB, node:node, marker:marker };
		});
	}
	
	Model(model) {
		return this.models[model] || null;
	}
	
	Port(model, port) {
		return model.ports[port] || null;
	}
	
	Link(port, direction) {
		var target = direction == "X" ? "portB" : "portA";
		
		for (var id in this.links) {
			var l = this.links[id][target];
			
			if (!l) continue;
			
			if (l.id === port.id) return this.links[id];
		}
		
		return null;
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
	
	LinkByPortB(port) {
		for (var id in this.links) {
			if (this.links[id].portB.id === port.id) return this.links[id];
		}
		
		return null;
	}
};