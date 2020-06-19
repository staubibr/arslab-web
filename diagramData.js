'use strict';

export default class DiagramData { 

	constructor(svg) {		
		this.nodes = [];
		this.models = {};
		this.ports = {};
		this.links = {};
		this.link_branches = [];

		this.SetModels(svg);
		this.SetPorts(svg);
		this.SetLinks(svg);
	}
	
	SetModels(svg) {
		var models = svg.querySelectorAll('[type="atomic"],[type="coupled"]');
		
		models.forEach((node) => {
			this.nodes.push(node);
			
			var type = node.getAttribute("type");
			var name = node.getAttribute("name").toLowerCase();
			
			this.models[name] = { name:name, type:type, node:node };
			
			node.setAttribute("name", name);
		});
	}
	
	SetPorts(svg) {
		var ports = svg.querySelectorAll('[type="iPort"],[type="oPort"]');
		
		ports.forEach((node) => {
			this.nodes.push(node);
			
			var type = node.getAttribute("type");
			var name = node.getAttribute("name").toLowerCase();
			var model = node.getAttribute("model").toLowerCase();
			
			if (!this.ports[model]) this.ports[model] = {};
			
			// this.ports[model][name] = { name:name, model:model, type:type, node:node };
			//Array of port nodes in case of multiple tags...
			if (!this.ports[model][name]) {
				var nodeArray=[];
				nodeArray.push(node);
				this.ports[model][name] = { name:name, model:model, type:type, node:nodeArray };
			}else{
				var nodeArray=[];
				nodeArray=this.ports[model][name].node;
				nodeArray.push(node);
				this.ports[model][name] = { name:name, model:model, type:type, node:nodeArray };
			}
		});
	}
	
	SetLinks(svg) {
		var links = svg.querySelectorAll('[type="link"]');
		
		links.forEach((node) => {
			this.nodes.push(node);
			
			var type = node.getAttribute("type");
			
			// All these 4 attributes may not be specified or null
			var modelA = this.GetAttribute(node, "modela");
			var modelB = this.GetAttribute(node, "modelb");
			var portA = this.GetAttribute(node, "porta");
			var portB = this.GetAttribute(node, "portb");

			// markerEnd may not be specified
			var markerEnd = node.style["marker-end"];
			
			var marker = markerEnd ? svg.querySelector(`${markerEnd.slice(5, -2)} > *`) : null;

			if (marker) this.nodes.push(marker);

			// link object to be shared at both ends
			var link = { type:type, portA:portA, portB:portB, modelA:modelA, modelB:modelB, node:node, marker:marker };
			
			if (modelA) {
				if (!this.links[modelA]) this.links[modelA] = { in:{}, out:{} };
				if (!this.link_branches[modelA]) this.link_branches[modelA] = { in:[], out:[] }; 

				this.links[modelA].out[portA] = link;
				this.link_branches[modelA].out.push(link);	//Ports with multiple destinations
			}
			
			if (modelB) {
				if (!this.links[modelB]) this.links[modelB] = { in:{}, out:{} };
				if (!this.link_branches[modelB]) this.link_branches[modelB] = { in:[], out:[] };

				this.links[modelB].in[portB] = link;
				this.link_branches[modelB].in.push(link);	//Ports with multiple input links
			}
		});
	}
	
	GetAttribute(node, attribute) {
		var value = node.getAttribute(attribute);

		if (value == null || value == "null") return null;

		return value.toLowerCase();
	}
	
	Model(model) {
		return this.models[model] || null;
	}
	
	Port(model, port) {
		var m = this.ports[model]
		
		if (!m) return null;
		
		return m[port] || null;
	}
	
	Link(model, port, direction) {
		var m = this.links[model]
		
		if (!m) return null;
		
		var dir = direction == "X" ? "in" : "out";
		
		return m[dir][port] || null;
	}

	LinkBranches(model, port) {		//Added
		var m = this.link_branches[model]

		if (!m) return null;

		var lks = m["out"];

		// console.log("Link_tree retrieved by dir and port: ",lks);
		return lks || null;
	}

	Nodes() {
		return this.nodes;
	}
};