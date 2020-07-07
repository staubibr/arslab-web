'use strict';

import Evented from '../components/evented.js';

export default class Model { 
    
    // set submodels(value) { this.submodels = value; }

	constructor(name, type, submodels, ports, links,svg) {
        this.name = name;
        this.type = type;
        this.submodels = submodels;
        this.ports = ports;
        this.links = links;
        this.svg = svg;
    }
    
    GetDestination() {

    }
}