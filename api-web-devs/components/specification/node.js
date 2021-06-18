'use strict';

export class Node {

	get svg() {  return this._json.svg; }
	set svg(value) { this._json.svg = value; }
	
	constructor(svg) {		
		this._json = {
			svg : svg ?? null
		}
	}
	
	static FromJson(json) {
		if ("model_id" in json && "port_type" in json) return PortNode.FromJson(json);
		
		else return ModelNode.FromJson(json);
	}
}

export class PortNode extends Node { 
	
	get model_id() { return this._json.model_id; }
	set model_id(value) { this._json.model_id = value; }
	
	get node_type() { return this._json.port_type; }
	set node_type(value) { this._json.port_type = value; }
	
	get name() { return this.node_type.name; }
	set name(value) { this.node_type.name = value; }
	
	get type() { return this.node_type.type; }
	set type(value) { this.node_type.type = value; }
	
	get template() { return this.node_type.template; }
	set template(value) { this.node_type.template = value; }
	
	get model() { return this._model; }
	set model(value) { this._model = value; }
	
	constructor(model_id, port_type, svg) {
		super(svg);
		
		this._json.model_id = model_id ?? null;
		this._json.port_type = port_type ?? null;
		
		this._model = null;
	}
		
	static FromJson(json) {
		return new PortNode(json.model_id, json.port_type, json.svg);
	}
}

export class ModelNode extends Node { 
	
	get id() { return this._json.id; }
	set id(value) { this._json.id = value; }
	
	get node_type() { return this._json.model_type; }
	set node_type(value) { this._json.model_type = value; }
	
	get name() { return this.node_type.name; }
	set name(value) { this.node_type.name = value; }
	
	get template() {  return this.node_type.template; }
	set template(value) { this.node_type.template = value; }
	
	get type() {  return this.node_type.type; }
	set type(value) { this.node_type.type = value; }
	
	get dim() {  return this.node_type.dim; }
	set dim(value) { this.node_type.dim = value; }
	
	get ports() { return this._ports; }
	get links() { return this._links; }
	
	constructor(id, model_type, svg) {
		super(svg);
		
		this._json.id = id ?? null;
		this._json.model_type = model_type ?? null;
		
        this._ports = [];
        this._links = [];
	}
	
	static FromJson(json) {
		return new ModelNode(json.id, json.model_type, json.svg);
	}
}