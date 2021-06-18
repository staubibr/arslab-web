'use strict';

export class NodeType { 
	
	constructor() {
		this._json = { }
	}
	
	Template(values) {
		if (!this.template) return values;
		
		if (this.template.length != values.length) throw new Error("length mismatch between fields and message content. This is a required temporary measure until Cadmium outputs message information.");			
		
		var out = {};
		
		for (var i = 0; i < this.template.length; i++) {
			var f = this.template[i];
			var v = values[i];
			
			if (v != "") out[f] = isNaN(v) ? v : +v;
		}
		
		return out;
	}
}

export class ModelType extends NodeType { 
	
	get name() { return this._json.name; }
	set name(value) { this._json.name = value; }
	
	get template() {  return this._json.template; }
	set template(value) { this._json.template = value; }
	
	get type() {  return this._json.type; }
	set type(value) { this._json.type = value; }
	
	constructor(name, template, type) {
		super();
		
		this._json.name = name ?? null;
		this._json.template = template ?? null;
		this._json.type = type ?? null;
	}
	
	static FromJson(json) {
		var template = JSON.parse(json.template);
		
		if ("dim" in json) return new ModelTypeCA(json.name, template, json.type, json.dim);
		
		else return new ModelType(json.name, template, json.type);
	}
}

export class ModelTypeCA extends ModelType {
	
	get dim() {  return this._json.dim; }
	set dim(value) { this._json.dim = value; }
	
	constructor(name, template, type, dim) {
		super(name, template, type);
		
		this._json.dim = dim ?? null;
	}
}

export class PortType extends NodeType { 
	
	get model_type() { return this._json.model_type; }
	set model_type(value) { this._json.model_type = value; }
	
	get name() {  return this._json.name; }
	set name(value) { this._json.name = value; }
	
	get type() {  return this._json.type; }
	set type(value) { this._json.type = value; }
	
	get template() {  return this._json.template; }
	set template(value) { this._json.template = value; }
	
	constructor(name, type, model_type, template) {
		super();
		
		this._json.model_type = model_type ?? null;
		this._json.name = name ?? null;
		this._json.type = type ?? null;
		this._json.template = template ?? null;
	}
		
	static FromJson(json) {
		var template = JSON.parse(json.template);
		
		return new PortType(json.name, json.type, json.model_type, template);
	}
}