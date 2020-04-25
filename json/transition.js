'use strict';

export default class Transition { 

	constructor(type, time, model, id, port, value, destination) {
		this.type = type;
		this.time = time;
		this.model = model;
		this.id = id;
		this.port = port;
		this.value = value;
		this.destination = destination;
	}
	
	ToCSV() {
		return [this.type, this.time, this.model, this.id, this.port, this.value, this.destination].join(",");
	}
}