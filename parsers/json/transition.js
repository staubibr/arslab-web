'use strict';

export default class Transition { 

	constructor(type, time, model, id, port, value, destination) {
		this.type = type;
		this.time = time;
		this.model = model && model.replace(",", "_");
		this.id = id && id.replace(",", "_");
		this.port = port && port.replace(",", "_");
		this.value = value;
		this.destination = destination && destination.replace(",", "_");
	}
	
	ToCSV() {
		return [this.type, this.time, this.model, this.id, this.port, this.value, this.destination].join(",");
	}
}