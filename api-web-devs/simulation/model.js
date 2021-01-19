'use strict';

import Evented from '../components/evented.js';
import Port from './port.js';
import Link from './link.js';

export default class Model { 
    	
	get Name() { return this.name; }

	get Type() { return this.type; }

	get Submodels() { return this.submodels; }
	
	get Ports() { return this.ports; }
	
	get Links() { return this.links; }
	
	get SVG() { return this.svg; }

	constructor(name, type, submodels, ports, links, svg, template) {
        this.name = name;
        this.type = type;
        this.submodels = submodels || [];
        this.ports = ports || [];
        this.links = links || [];
        this.svg = svg || [];
        this.template = template || [];
		
		this.ports.forEach(p => p.svg = p.svg || []);
		this.links.forEach(l => l.svg = l.svg || []);
    }
    
	Clone() {
		var ports = this.ports.map(p => p.Clone());
		var links = this.links.map(l => l.Clone());
		var submodels = this.submodels.map(s => s);
		var template = this.template.map(t => t);
		
		return new Model(this.name, this.type, submodels, ports, links, this.svg, template);
	}
	
	Port(name) {
		return this.ports.find(p => p.name == name) || null;
	}
	
	PortLinks(port) {
		return this.Links.filter(l => l.portA.name == port);
	}
	
	OutputPath(port) {
		var svg = [].concat(this.svg);
		
		var p = this.Port(port);
		
		if (!p) return svg;
		
		svg = svg.concat(p.svg);
		
		var links = this.PortLinks(p.name);
		
		for (var i = 0; i < links.length; i++) {
			var l = links[i];
			
			svg = svg.concat(l.svg);
			svg = svg.concat(l.portB.svg);			
			svg = svg.concat(l.modelB.svg);
			
			if (l.modelB.Type == "atomic") continue;
			
			// TODO : Not sure this works.
			links = links.concat(l.modelB.PortLinks(l.portB.name));
		}
		
		return svg;
	}

	static FromJson(json) {
		if (json.ports) var ports = json.ports.map(p => Port.FromJson(p));
		if (json.links) var links = json.links.map(l => Link.FromJson(l));
		
		return new Model(json.name, json.type, json.submodels, ports, links, json.svg, json.template);
	}
}