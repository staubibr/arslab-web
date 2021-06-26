'use strict';

import Info from './info.js';

import { ModelNode, ModelNodeCA, PortNode, Node } from './node.js';
import { ModelType, ModelTypeCA, PortType } from './nodeType.js';
import { Link } from './link.js';
 
export default class Structure { 
	
	get size() { return this.models.length; }
	get type() { return this.info.type; }
	
	get info() { return this._json.info; }
	set info(value) { this._json.info = value; }
	
	get nodes() { return this._json.nodes; }
	set nodes(value) { this._json.nodes = value; }
	
	get models() { return this.nodes; }
	set models(value) { this.nodes = value; }
	
	get links() { return this._json.links; }
	set links(value) { this._json.links = value; }
	
	get model_types() { return this._json.model_types; }
	set model_types(value) { this._json.model_types = value; }
	
	// NOTE: Standard for loops are faster than forEach. Maybe replace the forEach loops by for loops.
	constructor(info, nodes, links, model_types) {
		this._json = {
			info : info ?? null,
			nodes : [],
			links : links ?? null,
			model_types : model_types ?? null,
		}
		
		this._index = {};
		
		nodes.forEach(n => this.AddNode(n));
	}
	
	AddNode(node) {
		this._json.nodes.push(node);
		
		this._index[node.id] = node;
	}
	
	Node(id) {
		return this._index[id] || null;
	}
	
	Model(id) {
		return this.Node(id);
	}
	
	Port(model_id, port_name) {
		return this.Node(model_id).Port(port_name);
	}
	
	PortLinks(model, port) {
		return model.PortLinks(port);
	}
	
	static FromJson(json) {
		var info = new Info(json.info.name, json.info.simulator, json.info.type);
		
		var nodeTypes = json.model_types.map(t => {
			var ports = t.ports.map(p => new PortType(p.name, p.type, p.template));
		
			if ("dim" in t) return new ModelTypeCA(t.name, t.template, t.type, ports, t.dim);
			
			else return new ModelType(t.name, t.template, t.type, ports);
		});
		
		var nodes = json.nodes.map(n => {
			var nt = nodeTypes[n.model_type];
			
			if (nt instanceof ModelTypeCA) return new ModelNodeCA(n.id, nt);
			
			else return new ModelNode(n.id, nt, n.svg); 
		});
		
		var links = json.links.map(l => {
			var mA = nodes[l[0]];
			var mB = nodes[l[2]];
			var pA = mA.ports[l[1]];
			var pB = mB.ports[l[3]];
			
			return mA.AddLink(new Link(mA, pA, mB, pB, l.svg));
		});
		
		return new Structure(info, nodes, links, nodeTypes);
	}
}