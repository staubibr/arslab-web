'use strict';

import Evented from '../evented.js';

export default class Playback extends Evented { 

	get json() { return this._json; }
	
	set json(value) { this._json = value; }
	
	get speed() { return this._json.speed; }
	
	get loop() { return this._json.loop; }
	
	get cache() {  return this._json.cache; }
	
	set speed(value) { this._json.speed = value; }
	
	set loop(value) { this._json.loop = value; }
	
	set cache(value) { this._json.cache = value; }
	
	constructor() {		
		super();
		
		this.json = Playback.Default();
	}
	
	Set(property, value) {
		this[property] = value;
				
		this.Emit("Change", { property:property, value:value });
	}
	
	ToJson() {
		return this.json;
	}
	
	static FromJson(json) {
		var playback = new Playback();
		
		if (json.speed != undefined) playback.json.speed = json.speed;
		if (json.loop != undefined) playback.json.loop = json.loop;
		if (json.cache != undefined) playback.json.cache = json.cache;
		
		return playback;
	}
	
	static Default() {
		return {
			speed : 10,
			loop : false,
			cache : 10
		}
	}
}
