'use strict';

export class NodeType { 

	get name() { return this._json.name; }
	set name(value) { this._json.name = value; }
	
	get template() {  return this._json.template; }
	set template(value) { this._json.template = value; }
	
	get type() {  return this._json.type; }
	set type(value) { this._json.type = value; }
	
	constructor(name, template, type) {
		this._json = {}
		this._json.name = name ?? null;
		this._json.template = template ?? null;
		this._json.type = type ?? null;
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
	
	Template0() {
		if (!this.template) return 0;
		
		var d = {};
		
		this.template.forEach(f => d[f] = 0);
		
		return d;
	}
}

export class ModelType extends NodeType { 
	
	get ports() {  return this._json.ports; }
	
	constructor(name, template, type, ports) {
		super(name, template, type);
		
		this._json.ports = [];
		this._index = {};
		
		ports.forEach(p => this.AddPort(p));
	}
	
	AddPort(port) {
		this._json.ports.push(port);
		
		this._index[port.name] = port;
	}
	
	Port(name) {
		return this._index[name] || null;
	}
}

export class ModelTypeCA extends ModelType {
	
	get dim() {  return this._json.dim; }
	set dim(value) { this._json.dim = value; }
	
	constructor(name, template, type, ports, dim) {
		super(name, template, type, ports);
		
		this._json.dim = dim ?? null;
	}
}

export class PortType extends NodeType { 
	
	constructor(name, type, template) {
		super(name, template, type);
	}
}