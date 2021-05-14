'use strict';

export default class Info { 
	
	get json() { return this._json; }
	set json(value) { this._json = value; }
	
	get name() { return this._json.name; }
	set name(value) { this._json.name = value; }
	
	get simulator() { return this._json.simulator; }
	set simulator(value) { this._json.simulator = value; }
	
	get type() {  return this._json.type; }
	set type(value) { this._json.type = value; }
	
	constructor() {
		this._json = Info.Default();
	}
	
	static Default() {
		return {
			name : null,
			simulator : null,
			type : null
		}
	}
	
	static FromJson(json) {
		var info = new Info();
		
		info.name = json.name;
		info.simulator = json.simulator;
		info.type = json.type;
		
		return info;
	}
}