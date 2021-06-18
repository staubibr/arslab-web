'use strict';

import Core from '../tools/core.js';
import Dom from '../tools/dom.js';

export default class Node { 

	get element() { return this._element; }

	constructor(elem) {
		this._element = elem;
	}
	
	On(type, handler) {
		this.element.addEventListener(type, handler);
	}
	
	Off(type, handler) {
		this.element.removeEventListener(type, handler);
	}
	
	Elem(selector) {
		var elem = this.element.querySelector(selector);
		
		return (!elem) ? null : elem;
	}
	
	Elems(selector) {
		var elems = this.element.querySelectorAll(selector);
		var out = [];
		
		elems.forEach(e => out.push(e));
		
		return out;
	}
	
	Node(selector) {
		var elem = this.element.querySelector(selector);
		
		return (!elem) ? null : new Node(elem);
	}
	
	Nodes(selector) {
		var elems = this.element.querySelectorAll(selector);
		var out = [];
		
		elems.forEach(e => out.push(new Node(e)));
		
		return out;
	}
}