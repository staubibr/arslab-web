'use strict';

export class Node {

	get svg() {  return this._json.svg; }
	set svg(value) { this._json.svg = value; }
	
	get node_type() { return this._json.node_type; }
	set node_type(value) { this._json.node_type = value; }
	
	get name() { return this.node_type.name; }
	set name(value) { this.node_type.name = value; }
	
	get type() { return this.node_type.type; }
	set type(value) { this.node_type.type = value; }
	
	get template() { return this.node_type.template; }
	set template(value) { this.node_type.template = value; }
	
	constructor(node_type, svg) {		
		this._json = {
			svg : svg ?? null,
			node_type : node_type || null
		}
	}
}

export class PortNode extends Node { 
	
	get model_id() { return this._json.model_id; }
	set model_id(value) { this._json.model_id = value; }
	
	constructor(model_id, node_type, svg) {
		super(node_type, svg);
		
		this._json.model_id = model_id ?? null;
	}
}

export class ModelNode extends Node { 
	
	get id() { return this._json.id; }
	set id(value) { this._json.id = value; }
	
	get ports() { return this.node_type.ports; }
	get links() { return this._links; }
	
	constructor(id, node_type, svg) {
		super(node_type, svg);
		
		this._json.id = id ?? null;
		
        this._links = [];
	}
	
	Port(name) {
		return this.node_type.Port(name);
	}
	
	AddLink(link) {
		this.links.push(link);
		
		return link;
	}
	
	PortLinks(port) {
		return this.links.filter(l => l.portA.name == port.name);
	}
}

export class ModelNodeCA extends ModelNode { 
	
	get dim() {  return this.node_type.dim; }
	set dim(value) { this.node_type.dim = value; }
	
	constructor(id, node_type) {
		super(id, node_type, null);
	}
}