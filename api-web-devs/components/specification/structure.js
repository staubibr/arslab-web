'use strict';

import Info from './info.js';

import { ModelNode, PortNode, Node } from './node.js';
import { ModelType, PortType } from './nodeType.js';
import { Link } from './link.js';
import { Message, MessageCA } from './message.js';
 
export default class Structure { 
	
	get size() { return this.models.length; }
	get type() { return this.info.type; }
	
	get info() { return this._json.info; }
	set info(value) { this._json.info = value; }
	
	get nodes() { return this._json.nodes; }
	set nodes(value) { this._json.nodes = value; }
	
	get links() { return this._json.links; }
	set links(value) { this._json.links = value; }
	
	get model_types() { return this._json.model_types; }
	set model_types(value) { this._json.model_types = value; }
	
	get port_types() { return this._json.port_types; }
	set port_types(value) { this._json.port_types = value; }
	
	get models() { return this._models; }
	set models(value) { this._models = value; }
	
	// NOTE: Standard for loops are faster than forEach. Maybe replace the forEach loops by for loops.
	constructor(info, nodes, links, model_types, port_types) {
		this._json = {
			info : info ?? null,
			nodes : nodes ?? null,
			links : links ?? null,
			model_types : model_types ?? null,
			port_types : port_types ?? null
		}
		
		this.BuildIndex(nodes);
		this.AssignPorts();
		this.AssignLinks();
		this.AssignTypes();
	}
	
	BuildIndex(nodes) {
		this._models = [];
		this._model_index = {};
		this._port_index = {};
		
		nodes.forEach(n => {
			// Note: checking for property in an object is faster than instanceof.
			// If there are large numbers of models and ports (100,000s) then this
			// may become a problem. So we check for "id" in n, model nodes have
			// ids, port nodes do not. Probably premature optimization.
			if ("id" in n) {
				this._models.push(n);
				this._model_index[n.id] = n
			}
			
			else {
				var port_type = this.port_types[n.node_type];

				if (!this._port_index[n.model_id]) this._port_index[n.model_id] = {}
				
				this._port_index[n.model_id][port_type.name] = n
			}
		})
	}
	
	AssignPorts() {
		for (var m in this._port_index) {
			for (var p in this._port_index[m]) {
				var port = this.Port(m, p);
				
				this.Model(m).ports.push(port);
				
				port.model = this.Model(m);
			}
		}
	}
	
	AssignLinks() {
		this.links.forEach(l => {
			this.Model(l.modelA).links.push(l);
			
			l.modelA = this.Model(l.modelA);
			l.portA = this.Port(l.modelA.id, l.portA);
			l.modelB = this.Model(l.modelB);
			l.portB = this.Port(l.modelB.id, l.portB);
		});
	}
	
	AssignTypes() {
		this.models.forEach(m => {
			m.node_type = this.model_types[m.node_type];
			
			m.ports.forEach(p => {
				p.node_type = this.port_types[p.node_type];
			});			
		});
		
		this.port_types.forEach(pt => {
			pt.model_type = this.model_types[pt.model_type];
		});
	}

	Model(id) {
		return this._model_index[id] || null;
	}
	
	Port(model_id, port_name) {
		return this._port_index[model_id][port_name] || null;
	}
	
	PortLinks(model, port) {
		return model.links.filter(l => l.portA.name == port.name);
	}
	
	static FromJson(json) {
		var info = Info.FromJson(json.info);
		var nodes = json.nodes.map(n => Node.FromJson(n));
		var links = json.links.map(t => Link.FromJson(t));
		var modelTypes = json.model_types.map(t => ModelType.FromJson(t));
		var portTypes = json.port_types.map(t => PortType.FromJson(t));
		
		return new Structure(info, nodes, links, modelTypes, portTypes);
	}
}