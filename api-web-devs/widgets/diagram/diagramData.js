'use strict';

export default class DiagramData { 

	constructor(svg,models_sim) {		
		this.nodes = [];
		this.models = {};
		this.ports = {};
		this.links = {};
		this.link_branches = [];
		this.dependenceTreeMap = new Map();	//Added

		this.SetModels(svg,models_sim);
		this.SetPorts(svg,models_sim);
		this.SetLinks(svg,models_sim);
		this.setDependenceTreeMap(models_sim)
	}
	
	setDependenceTreeMap(models_sim){	//Added
		for (var model in models_sim) {
			if (Object.prototype.hasOwnProperty.call(models_sim,model)) {	
				if (models_sim[model].type=="atomic"){
					models_sim[model].ports.forEach(p => { 
						if (p.type == "output"){
							var tree = new DependenceTree(models_sim[model],p);
							this.searchDependencies(models_sim[model],p.name,tree);
							this.dependenceTreeMap.set(models_sim[model].name + p.name,tree)	//Insert tree head in the map
						} 
					});
				}
			}
		}
		// console.log(this.dependenceTreeMap);
	}

	searchDependencies(model,port,tree){	//Added
		if (!this.link_branches[model.name].out){return;}
		this.link_branches[model.name].out.forEach(	outlink => {
			if (outlink.portA == port){
				if (outlink.modelB){
					tree.branch_nodes.push( this.models[outlink.modelB].node);	
					if (this.ports[outlink.modelB]){
						if (this.ports[outlink.modelB][outlink.portB]){
							if (Array.isArray(this.ports[outlink.modelB][outlink.portB].node)){
								this.ports[outlink.modelB][outlink.portB].node.forEach( port => {
									tree.branch_nodes.push(port);		
								});
							}else{
								tree.branch_nodes.push( this.ports[outlink.modelB][outlink.portB].node);	
							}
						}
					}
					tree.branch_nodes.push( outlink.node);	
					var mk=outlink.marker;
					if (mk) {
						tree.branch_nodes.push(mk);	
					}
					if (this.models[outlink.modelB].type=="coupled"){
						tree.coupled.push(this.models[outlink.modelB].name);
						this.searchDependencies(this.models[outlink.modelB],outlink.portB,tree);
					}else{
						tree.atomic.push(this.models[outlink.modelB].name);
					}
				}
			}
		})
	}

	SetModels(svg,models_sim) {

		models_sim.forEach(m => {
			var str = m.id;
			var node = svg.querySelectorAll('[id='+str+']');	
			node=node[0];
			this.nodes.push(node);
			var type = m.type;
			var name = m.name;
			this.models[name] = { name:name, type:type, node:node };
			

			console.log(this.models);
		});
	}
	
	SetPorts(svg,models_sim) {

		
		models_sim.forEach(m => {
			m.ports.forEach(p => {
				var str = p.id;
				var node = svg.querySelectorAll('[id='+str+']');	
				node=node[0];
				this.nodes.push(node);
				var type = p.type;
				var name = p.name;
				var model = m.name;
				
				if (!this.ports[model]) this.ports[model] = {};
				
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
			console.log(this.ports);
		});
	}
	
	SetLinks(svg,models_sim) {
		models_sim.forEach(m => {
			m.links.forEach(l => {
				var str = l.id;
				var node = svg.querySelectorAll('[id='+str+']');	
				node = node[0] ;
				this.nodes.push(node);
				var type = "link";		//This needs to be removed
				
				// All these 4 attributes may not be specified or null
				var modelA =l.modelA;
				var modelB =l.modelB;
				var portA =l.portA;
				var portB =l.portB;
				
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