'use strict';

import Info from './info.js';
import Link from './link.js';
import Node from './node.js';
import ModelType from './modelType.js';
import PortType from './portType.js';
import Model from '../../simulation/model.js';

export default class Structure { 
	
	get models() { return this._models; }
	
	get index() { return this._index; }
	
	get size() { return this.models.length; }
	
	get json() { return this._json; }
	set json(value) { this._json = value; }
	
	get info() { return this._json.info; }
	set info(value) { this._json.info = value; }
	
	get nodes() { return this._json.nodes; }
	set nodes(value) { this._json.nodes = value; }
	
	get links() { return this._json.links; }
	set links(value) { this._json.links = value; }
	
	get modelTypes() { return this._json.model_types; }
	set modelTypes(value) { this._json.model_types = value; }
	
	get portTypes() { return this._json.port_types; }
	set portTypes(value) { this._json.port_types = value; }
	
	constructor() {
		this._json = Structure.Default();
		this._models = [];
		this._index = {};
	}
	
	Initialize() {
		this.BuildModels();
		this.BuildPorts();
		this.BuildLinks();
		
		this._models = this._models.map(json => Model.FromJson(json));
	}
	
	BuildModels() {
		this.nodes.forEach(n => {
			if (n.id == undefined) return;
			
			var t = this.modelTypes[n.model];
			
			var model = {
				id : n.id,
				name : t.name, 
				type : t.type,
				template : t.template,
				svg : n.svg || [],
				ports : [],
				links : []
			}
			
			this.models.push(model);
			this.index[model.id] = model;
		});
	}
	
	BuildPorts() {
		this.nodes.forEach(n => {
			if (n.port == undefined) return 
			
			var t = this.portTypes[n.port];
			
			var port = {
				model : n.model,
				name : t.name, 
				type : t.type,
				template : t.template,
				svg : n.svg || []
			}
			
			// When a DEVS model is connected to a Cell-DEVS model, there will be ports linked to the main model with coords, 
			// these are not in the models list. It has to be fixed someday.
			var model = this.index[port.model];
			
			if (!!model) model.ports.push(port);
		});
	}
	
	BuildLinks() {
		if (!this.links) return;

		this.links.forEach(l => {
			var model = this.index[l.modelA];
			
			model.links.push(l);
		});
	}
	
	TemplateData(type, values) {
		if (!type.template) return values;
		
		if (type.template.length != values.length) throw new Error("length mismatch between fields and message content. This is a required temporary measure until Cadmium outputs message information.");			
		
		var out = {};
		
		for (var i = 0; i < type.template.length; i++) {
			var f = type.template[i];
			var v = values[i];
			
			if (v != "") out[f] = isNaN(v) ? v : +v;
		}
		
		return out;
	}
	
	static Default() {
		return {
			info : null,
			nodes : null,
			links : null,
			model_types : null,
			port_types : null
		}
	}
	
	static FromJson(json) {
		var structure = new Structure();
		
		structure.info = Info.FromJson(json.info);
		structure.modelTypes = json.model_types.map(t => ModelType.FromJson(t));
		structure.portTypes = json.port_types.map(t => PortType.FromJson(t));
		structure.nodes = json.nodes.map(n => Node.FromJson(n));
		structure.links = json.links.map(l => Link.FromJson(l));
		
		structure.Initialize();
		
		return structure;		
	}
}