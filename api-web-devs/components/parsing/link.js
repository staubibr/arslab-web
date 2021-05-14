'use strict';

export default class Link { 
	
	get json() { return this._json; }
	set json(value) { this._json = value; }
	
	get modelA() { return this._json.modelA; }
	set modelA(value) { this._json.modelA = value; }
	
	get portA() { return this._json.portA; }
	set portA(value) { this._json.portA = value; }
	
	get modelB() {  return this._json.modelB; }
	set modelB(value) { this._json.modelB = value; }
	
	get portB() {  return this._json.portB; }
	set portB(value) { this._json.portB = value; }
	
	get svg() {  return this._json.svg; }
	set svg(value) { this._json.svg = value; }
	
	constructor() {
		this._json = Link.Default();
	}
	
	static Default() {
		return {
			modelA : "",
			portA : "",
			modelB : "",
			portB : "",
			svg : null
		}
	}
	
	static FromJson(json) {
		var link = new Link();
		
		link.modelA = json.modelA;
		link.portA = json.portA;
		link.modelB = json.modelB;
		link.portB = json.portB;
		link.svg = json.svg;
		
		return link;
	}
}