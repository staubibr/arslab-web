'use strict';

import Evented from '../components/evented.js';

export default class Model { 
    	
	get Name() { return this.name; }

	get Type() { return this.type; }

	get Submodels() { return this.submodels; }
	
	get Ports() { return this.ports; }
	
	get Links() { return this.links; }
	
	get SVG() { return this.svg; }

	constructor(name, type, submodels, ports, links, svg) {
        this.name = name;
        this.type = type;
        this.submodels = submodels || [];
        this.ports = ports;
        this.links = links;
        this.svg = svg;
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
	
	toJSON() {
		return {
			name: this.Name,
			type : this.Type,
			svg : this.SVG,
			submodels : this.submodels.map(s => s.name),
			ports : this.ports.map(p => {
				return {
					name : p.name,
					type : p.type,
					svg : p.svg
				}
			}),
			links : this.links.map(l => {
				return {
					portA : l.portA,
					portB : l.portB,
					modelB : l.modelB.name,
					svg : l.svg
				}
			})
		}
	}
}