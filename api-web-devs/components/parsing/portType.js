'use strict';

export default class PortType { 
	
	get json() { return this._json; }
	set json(value) { this._json = value; }

	get modelType() { return this._json.modelType; }
	set modelType(value) { this._json.modelType = value; }
	
	get name() {  return this._json.name; }
	set name(value) { this._json.name = value; }
	
	get template() {  return this._json.template; }
	set template(value) { this._json.template = value; }
	
	constructor() {
		this._json = PortType.Default();
	}
	
	static Default() {
		return {
			modelType : "",
			name : "",
			template : ["value"]
		}
	}
	
	static FromJson(json) {
		var portType = new PortType();
		
		portType.modelType = json.model_type;
		portType.name = json.name;
		portType.template = JSON.parse(json.template);
		
		return portType;
	}
}