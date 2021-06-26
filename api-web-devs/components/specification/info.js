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
	
	constructor(name, simulator, type) {
		this._json = {
			name : name ?? null,
			simulator : simulator ?? null,
			type : type ?? null
		}
	}
}