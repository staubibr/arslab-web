'use strict';

export default class Node { 
	
	get json() { return this._json; }
	set json(value) { this._json = value; }
	
	get id() { return this._json.id; }
	set id(value) { this._json.id = value; }
	
	get model() { return this._json.model; }
	set model(value) { this._json.model = value; }
	
	get port() {  return this._json.port; }
	set port(value) { this._json.port = value; }
	
	get svg() {  return this._json.svg; }
	set svg(value) { this._json.svg = value; }
	
	constructor() {
		this._json = Node.Default();
	}
	
	static Default() {
		return {
			id : null,
			model : null,
			port : null,
			svg : null
		}
	}
	
	static FromJson(json) {
		var node = new Node();
		
		node.id = json.id;
		node.model = json.model;
		node.port = json.port;;
		node.svg = json.svg;
		
		return node;
	}
}