'use strict';

export default class ModelType { 
	
	get json() { return this._json; }
	set json(value) { this._json = value; }

	get name() { return this._json.name; }
	set name(value) { this._json.name = value; }
	
	get template() {  return this._json.template; }
	set template(value) { this._json.template = value; }
	
	get type() {  return this._json.type; }
	set type(value) { this._json.type = value; }
	
	constructor() {
		this._json = ModelType.Default();
	}
	
	static Default() {
		return {
			name : "",
			template : ["value"],
			type : ""
		}
	}
	
	static FromJson(json) {
		var modelType = new ModelType();
		
		modelType.name = json.name;
		modelType.template = JSON.parse(json.template);
		modelType.type = json.type;
		
		return modelType;
	}
}